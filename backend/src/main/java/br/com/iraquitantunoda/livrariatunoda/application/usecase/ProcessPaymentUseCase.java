package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ProcessPaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.PaymentDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.application.service.PaymentGatewayServiceFactory;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.PaymentId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case para processar pagamento criando preferência no gateway de pagamento configurado.
 * Atualiza o Payment com a referência externa retornada e retorna URL de pagamento.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessPaymentUseCase {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentGatewayServiceFactory gatewayFactory;
    private final PaymentDTOMapper paymentDTOMapper;

    @Transactional
    public ProcessPaymentResponse execute(String paymentId) {
        log.info("Processando pagamento: {}", paymentId);

        // Busca pagamento
        var payment = paymentRepository.findById(PaymentId.of(paymentId))
            .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado"));

        // Valida que pagamento ainda não foi processado
        if (payment.getExternalReference() != null) {
            throw new BusinessException("Pagamento já foi processado anteriormente");
        }

        // Busca pedido
        var order = orderRepository.findById(payment.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        // Seleciona gateway apropriado baseado no gateway configurado no payment
        var gatewayService = gatewayFactory.getService(payment.getGateway());

        // Cria preferência no gateway
        var preference = gatewayService.createPaymentPreference(order, payment);

        // Associa referência externa ao pagamento (UUID nosso, enviado ao gateway)
        // O gateway vai retornar esse mesmo UUID quando notificar sobre mudança de status
        payment.associateExternalReference(payment.getId().getValue());

        // Marca como pendente (aguardando pagamento do cliente)
        payment.markAsPending();

        // Persiste
        var savedPayment = paymentRepository.save(payment);

        log.info("Pagamento processado com sucesso. ExternalReference: {}, URL: {}",
            preference.id(), preference.paymentUrl());

        return new ProcessPaymentResponse(
            paymentDTOMapper.toResponse(savedPayment),
            preference.paymentUrl()
        );
    }
}

