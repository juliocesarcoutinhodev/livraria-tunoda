package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.MercadoPagoClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case para processar notificações de webhook do Mercado Pago.
 * Atualiza o status do pagamento baseado na notificação recebida.
 * Sincroniza o status do pedido com o status do pagamento.
 * Implementa idempotência para evitar processamento duplicado.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessMercadoPagoWebhookUseCase {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final MercadoPagoClient mercadoPagoClient;
    private final DeductStockFromOrderUseCase deductStockFromOrderUseCase;
    private final SendOrderApprovedEmailUseCase sendOrderApprovedEmailUseCase;

    /**
     * Processa notificação de webhook do Mercado Pago.
     * Busca detalhes atualizados do pagamento e atualiza o Payment no sistema.
     * Sincroniza status do Order baseado no status do Payment.
     */
    @Transactional
    public void execute(String mercadoPagoPaymentId) {
        log.info("Processando webhook do Mercado Pago. Payment ID do MP: {}", mercadoPagoPaymentId);

        // Busca detalhes atualizados do pagamento no Mercado Pago
        var paymentDetails = mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId);

        log.info("Detalhes obtidos do MP. Status: {}, ExternalRef: {}",
            paymentDetails.status(), paymentDetails.externalReference());

        // Busca Payment no sistema pela externalReference (que é nosso paymentId)
        var payment = paymentRepository.findByExternalReference(paymentDetails.externalReference())
            .orElseThrow(() -> {
                log.warn("Payment não encontrado para externalReference: {}", paymentDetails.externalReference());
                return new ResourceNotFoundException("Pagamento não encontrado");
            });

        // Valida idempotência - se já está no status final, não processa novamente
        if (payment.isApproved()) {
            log.info("Payment {} já está aprovado. Ignorando webhook (idempotência)", payment.getId().getValue());
            return;
        }

        // Busca o pedido associado ao pagamento
        var order = orderRepository.findById(payment.getOrderId())
            .orElseThrow(() -> {
                log.error("Order não encontrado para Payment: {}", payment.getId().getValue());
                return new ResourceNotFoundException("Pedido não encontrado");
            });

        // Atualiza status do payment baseado no status retornado pelo Mercado Pago
        // E sincroniza status do Order conforme regras de negócio
        if (paymentDetails.isApproved()) {
            log.info("Aprovando payment: {}", payment.getId().getValue());
            payment.approve();

            // Deduz estoque dos livros ANTES de confirmar o pedido
            // Se falhar, o pedido continua PENDING e pode ser expirado
            try {
                log.info("Iniciando deducao de estoque para order: {}", order.getId().getValue());
                deductStockFromOrderUseCase.execute(order);
            } catch (Exception e) {
                log.error("Erro ao deduzir estoque para order: {}. Erro: {}",
                    order.getId().getValue(), e.getMessage(), e);
                // Expira o pedido (ainda está PENDING)
                order.expire();
                throw new BusinessException("Erro ao deduzir estoque: " + e.getMessage());
            }

            // Regra: Pagamento APPROVED + Estoque Deduzido -> Order.confirm()
            log.info("Confirmando order: {}", order.getId().getValue());
            order.confirm();
            sendOrderApprovedEmailUseCase.execute(order);

        } else if (paymentDetails.isRejected()) {
            log.info("Rejeitando payment: {}. Motivo: {}", payment.getId().getValue(), paymentDetails.statusDetail());
            payment.reject(paymentDetails.statusDetail());

            // Regra: Pagamento REJECTED -> Pedido permanece PENDING
            log.info("Order {} permanece PENDING (pagamento rejeitado)", order.getId().getValue());

        } else if (paymentDetails.isCancelled()) {
            log.info("Cancelando payment: {}", payment.getId().getValue());
            payment.cancel();

            // Regra: Pagamento CANCELLED -> Pedido permanece PENDING
            log.info("Order {} permanece PENDING (pagamento cancelado)", order.getId().getValue());

        } else if (paymentDetails.isExpired()) {
            log.info("Expirando payment: {}", payment.getId().getValue());
            payment.expire();

            // Regra: Pagamento EXPIRED -> Order.expire()
            log.info("Expirando order: {}", order.getId().getValue());
            order.expire();

        } else {
            log.info("Payment {} permanece pendente. Status do MP: {}", payment.getId().getValue(), paymentDetails.status());
        }

        // Persiste alterações do pagamento e do pedido
        paymentRepository.save(payment);
        orderRepository.save(order);

        log.info("Webhook processado com sucesso. Payment: {}, Status: {}, Order: {}, Status: {}",
            payment.getId().getValue(), payment.getStatus(), order.getId().getValue(), order.getStatus());
    }
}
