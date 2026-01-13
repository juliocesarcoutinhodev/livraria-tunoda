package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CreatePaymentRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.PaymentDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreatePaymentUseCase {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentDTOMapper paymentDTOMapper;

    @Transactional
    public PaymentResponse execute(String orderId, CreatePaymentRequest request) {
        log.info("Criando pagamento para pedido: {}", orderId);

        // Valida que pedido existe
        var order = orderRepository.findById(OrderId.of(orderId))
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        // Valida que pedido está PENDING
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("Apenas pedidos pendentes podem receber pagamento. Status atual: " + order.getStatus());
        }

        // Valida que não existe payment ativo para este pedido
        var existingPayments = paymentRepository.findByOrderId(order.getId());
        var hasActivePayment = existingPayments.stream()
            .anyMatch(p -> p.getStatus().name().equals("CREATED") || p.getStatus().name().equals("PENDING"));

        if (hasActivePayment) {
            throw new BusinessException("Já existe um pagamento ativo para este pedido. Cancele ou aguarde o processamento do pagamento existente.");
        }

        // Cria pagamento com valor = total do pedido
        // Por enquanto, hardcoded MERCADO_PAGO como gateway padrão
        var payment = Payment.create(order, request.paymentMethod(), PaymentGateway.MERCADO_PAGO);

        // Persiste pagamento
        var savedPayment = paymentRepository.save(payment);

        log.info("Pagamento criado com sucesso. PaymentId: {}", savedPayment.getId().getValue());

        return paymentDTOMapper.toResponse(savedPayment);
    }
}

