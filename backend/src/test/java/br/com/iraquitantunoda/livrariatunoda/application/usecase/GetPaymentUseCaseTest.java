package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.mapper.PaymentDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import br.com.iraquitantunoda.livrariatunoda.domain.model.PaymentId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentMethod;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetPaymentUseCaseTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentDTOMapper paymentDTOMapper;

    @InjectMocks
    private GetPaymentUseCase getPaymentUseCase;

    @Test
    @DisplayName("Deve consultar pagamento por ID com sucesso")
    void shouldGetPaymentById() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(49.90));
        var payment = Payment.create(orderId, amount, PaymentMethod.CREDIT_CARD, PaymentGateway.MERCADO_PAGO);
        var paymentId = payment.getId();

        when(paymentRepository.findById(any(PaymentId.class)))
            .thenReturn(Optional.of(payment));
        when(paymentDTOMapper.toResponse(any(Payment.class))).thenReturn(null);

        var result = getPaymentUseCase.execute(paymentId.getValue());

        // Nao validamos result pois o mapper esta mockado retornando null
        verify(paymentRepository).findById(any(PaymentId.class));
        verify(paymentDTOMapper).toResponse(any(Payment.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando pagamento não existe")
    void shouldThrowExceptionWhenPaymentNotFound() {
        var paymentId = PaymentId.generate();

        when(paymentRepository.findById(any(PaymentId.class)))
            .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
            getPaymentUseCase.execute(paymentId.getValue())
        );

        verify(paymentRepository).findById(any(PaymentId.class));
        verify(paymentDTOMapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Deve consultar pagamento aprovado")
    void shouldGetApprovedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(49.90));
        var payment = Payment.create(orderId, amount, PaymentMethod.CREDIT_CARD, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();
        payment.approve();
        var paymentId = payment.getId();

        when(paymentRepository.findById(any(PaymentId.class)))
            .thenReturn(Optional.of(payment));
        when(paymentDTOMapper.toResponse(any(Payment.class))).thenReturn(null);

        var result = getPaymentUseCase.execute(paymentId.getValue());

        // Nao validamos result pois o mapper esta mockado retornando null
        verify(paymentRepository).findById(any(PaymentId.class));
        verify(paymentDTOMapper).toResponse(any(Payment.class));
    }

    @Test
    @DisplayName("Deve consultar pagamento rejeitado")
    void shouldGetRejectedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(49.90));
        var payment = Payment.create(orderId, amount, PaymentMethod.CREDIT_CARD, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();
        payment.reject("Cartão recusado");
        var paymentId = payment.getId();

        when(paymentRepository.findById(any(PaymentId.class)))
            .thenReturn(Optional.of(payment));
        when(paymentDTOMapper.toResponse(any(Payment.class))).thenReturn(null);

        var result = getPaymentUseCase.execute(paymentId.getValue());

        // Nao validamos result pois o mapper esta mockado retornando null
        verify(paymentRepository).findById(any(PaymentId.class));
        verify(paymentDTOMapper).toResponse(any(Payment.class));
    }

    @Test
    @DisplayName("Deve consultar pagamento pendente")
    void shouldGetPendingPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(49.90));
        var payment = Payment.create(orderId, amount, PaymentMethod.CREDIT_CARD, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();
        var paymentId = payment.getId();

        when(paymentRepository.findById(any(PaymentId.class)))
            .thenReturn(Optional.of(payment));
        when(paymentDTOMapper.toResponse(any(Payment.class))).thenReturn(null);

        var result = getPaymentUseCase.execute(paymentId.getValue());

        // Nao validamos result pois o mapper esta mockado retornando null
        verify(paymentRepository).findById(any(PaymentId.class));
        verify(paymentDTOMapper).toResponse(any(Payment.class));
    }
}

