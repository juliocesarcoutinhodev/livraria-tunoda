package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.MercadoPagoClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case para processar notificações de webhook do Mercado Pago.
 * Atualiza o status do pagamento baseado na notificação recebida.
 * Implementa idempotência para evitar processamento duplicado.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessMercadoPagoWebhookUseCase {

    private final PaymentRepository paymentRepository;
    private final MercadoPagoClient mercadoPagoClient;

    /**
     * Processa notificação de webhook do Mercado Pago.
     * Busca detalhes atualizados do pagamento e atualiza o Payment no sistema.
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

        // Atualiza status do payment baseado no status retornado pelo Mercado Pago
        if (paymentDetails.isApproved()) {
            log.info("Aprovando payment: {}", payment.getId().getValue());
            payment.approve();
        } else if (paymentDetails.isRejected()) {
            log.info("Rejeitando payment: {}. Motivo: {}", payment.getId().getValue(), paymentDetails.statusDetail());
            payment.reject(paymentDetails.statusDetail());
        } else if (paymentDetails.isCancelled()) {
            log.info("Cancelando payment: {}", payment.getId().getValue());
            payment.cancel();
        } else if (paymentDetails.isExpired()) {
            log.info("Expirando payment: {}", payment.getId().getValue());
            payment.expire();
        } else {
            log.info("Payment {} permanece pendente. Status do MP: {}", payment.getId().getValue(), paymentDetails.status());
            // Não faz nada se ainda está pendente
        }

        // Persiste alteração
        paymentRepository.save(payment);

        log.info("Webhook processado com sucesso. Payment: {}, Status: {}",
            payment.getId().getValue(), payment.getStatus());
    }
}

