package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentMethod;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.MercadoPagoClient;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto.MercadoPagoPaymentDetails;
import org.junit.jupiter.api.BeforeEach;
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
@DisplayName("ProcessMercadoPagoWebhookUseCase - Testes")
class ProcessMercadoPagoWebhookUseCaseTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private MercadoPagoClient mercadoPagoClient;

    @InjectMocks
    private ProcessMercadoPagoWebhookUseCase useCase;

    private Payment payment;
    private Order order;
    private String mercadoPagoPaymentId;
    private String externalReference;

    @BeforeEach
    void setUp() {
        // Cria order
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);
        order = Order.createFromCart(cart);

        // Cria payment
        var amount = Money.brl(BigDecimal.valueOf(49.90));
        payment = Payment.create(order.getId(), amount, PaymentMethod.CREDIT_CARD, PaymentGateway.MERCADO_PAGO);
        payment.associateExternalReference(payment.getId().getValue());
        payment.markAsPending();

        // Associa referencia de pagamento ao pedido (necessario para confirmar)
        order.associatePaymentReference(payment.getId().getValue());

        mercadoPagoPaymentId = "123456789";
        externalReference = payment.getId().getValue();
    }

    @Test
    @DisplayName("Deve aprovar payment e confirmar order quando pagamento é aprovado no MP")
    void shouldApprovePaymentAndConfirmOrderWhenPaymentApproved() {
        // Arrange
        var paymentDetails = new MercadoPagoPaymentDetails(
            Long.parseLong(mercadoPagoPaymentId),
            "approved",
            "accredited",
            externalReference,
            BigDecimal.valueOf(49.90),
            "BRL",
            "credit_card",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00"
        );

        when(mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId)).thenReturn(paymentDetails);
        when(paymentRepository.findByExternalReference(externalReference)).thenReturn(Optional.of(payment));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        // Act
        useCase.execute(mercadoPagoPaymentId);

        // Assert
        assertTrue(payment.isApproved());
        assertTrue(order.isConfirmed());
        verify(paymentRepository).save(payment);
        verify(orderRepository).save(order);
    }

    @Test
    @DisplayName("Deve rejeitar payment e manter order pendente quando pagamento é rejeitado no MP")
    void shouldRejectPaymentAndKeepOrderPendingWhenPaymentRejected() {
        // Arrange
        var paymentDetails = new MercadoPagoPaymentDetails(
            Long.parseLong(mercadoPagoPaymentId),
            "rejected",
            "cc_rejected_insufficient_amount",
            externalReference,
            BigDecimal.valueOf(49.90),
            "BRL",
            "credit_card",
            null,
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00"
        );

        when(mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId)).thenReturn(paymentDetails);
        when(paymentRepository.findByExternalReference(externalReference)).thenReturn(Optional.of(payment));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        // Act
        useCase.execute(mercadoPagoPaymentId);

        // Assert
        assertTrue(payment.isRejected());
        assertTrue(order.isPending());
        verify(paymentRepository).save(payment);
        verify(orderRepository).save(order);
    }

    @Test
    @DisplayName("Deve cancelar payment e manter order pendente quando pagamento é cancelado no MP")
    void shouldCancelPaymentAndKeepOrderPendingWhenPaymentCancelled() {
        // Arrange
        var paymentDetails = new MercadoPagoPaymentDetails(
            Long.parseLong(mercadoPagoPaymentId),
            "cancelled",
            "cancelled_by_user",
            externalReference,
            BigDecimal.valueOf(49.90),
            "BRL",
            "credit_card",
            null,
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00"
        );

        when(mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId)).thenReturn(paymentDetails);
        when(paymentRepository.findByExternalReference(externalReference)).thenReturn(Optional.of(payment));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        // Act
        useCase.execute(mercadoPagoPaymentId);

        // Assert
        assertTrue(payment.isCancelled());
        assertTrue(order.isPending());
        verify(paymentRepository).save(payment);
        verify(orderRepository).save(order);
    }

    @Test
    @DisplayName("Deve expirar payment e expirar order quando pagamento expira no MP")
    void shouldExpirePaymentAndOrderWhenPaymentExpired() {
        // Arrange
        var paymentDetails = new MercadoPagoPaymentDetails(
            Long.parseLong(mercadoPagoPaymentId),
            "expired",
            "expired",
            externalReference,
            BigDecimal.valueOf(49.90),
            "BRL",
            "credit_card",
            null,
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00"
        );

        when(mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId)).thenReturn(paymentDetails);
        when(paymentRepository.findByExternalReference(externalReference)).thenReturn(Optional.of(payment));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        // Act
        useCase.execute(mercadoPagoPaymentId);

        // Assert
        assertTrue(payment.isExpired());
        assertTrue(order.isExpired());
        verify(paymentRepository).save(payment);
        verify(orderRepository).save(order);
    }

    @Test
    @DisplayName("Deve ignorar webhook quando payment já está aprovado - idempotência")
    void shouldIgnoreWebhookWhenPaymentAlreadyApproved() {
        // Arrange
        payment.approve();

        var paymentDetails = new MercadoPagoPaymentDetails(
            Long.parseLong(mercadoPagoPaymentId),
            "approved",
            "accredited",
            externalReference,
            BigDecimal.valueOf(49.90),
            "BRL",
            "credit_card",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00"
        );

        when(mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId)).thenReturn(paymentDetails);
        when(paymentRepository.findByExternalReference(externalReference)).thenReturn(Optional.of(payment));

        // Act
        useCase.execute(mercadoPagoPaymentId);

        // Assert
        verify(paymentRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
        verify(orderRepository, never()).findById(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando payment não é encontrado")
    void shouldThrowExceptionWhenPaymentNotFound() {
        // Arrange
        var paymentDetails = new MercadoPagoPaymentDetails(
            Long.parseLong(mercadoPagoPaymentId),
            "approved",
            "accredited",
            "invalid-reference",
            BigDecimal.valueOf(49.90),
            "BRL",
            "credit_card",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00"
        );

        when(mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId)).thenReturn(paymentDetails);
        when(paymentRepository.findByExternalReference("invalid-reference")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> useCase.execute(mercadoPagoPaymentId));
        verify(paymentRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando order não é encontrado")
    void shouldThrowExceptionWhenOrderNotFound() {
        // Arrange
        var paymentDetails = new MercadoPagoPaymentDetails(
            Long.parseLong(mercadoPagoPaymentId),
            "approved",
            "accredited",
            externalReference,
            BigDecimal.valueOf(49.90),
            "BRL",
            "credit_card",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00",
            "2026-01-13T15:00:00.000-03:00"
        );

        when(mercadoPagoClient.getPaymentDetails(mercadoPagoPaymentId)).thenReturn(paymentDetails);
        when(paymentRepository.findByExternalReference(externalReference)).thenReturn(Optional.of(payment));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> useCase.execute(mercadoPagoPaymentId));
        verify(paymentRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }
}

