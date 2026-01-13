package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CreatePaymentRequest;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.PaymentDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.*;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
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
class CreatePaymentUseCaseTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentDTOMapper paymentDTOMapper;

    @InjectMocks
    private CreatePaymentUseCase createPaymentUseCase;

    private Order order;
    private OrderId orderId;

    @BeforeEach
    void setUp() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        order = Order.createFromCart(cart);
        orderId = order.getId();
    }

    @Test
    @DisplayName("Deve criar pagamento para pedido pendente com sucesso")
    void shouldCreatePaymentForPendingOrder() {
        var request = new CreatePaymentRequest(PaymentMethod.PIX);
        var payment = Payment.create(order, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        var response = createPaymentUseCase.execute(orderId.getValue(), request);

        assertNotNull(response);
        verify(orderRepository).findById(orderId);
        verify(paymentRepository).save(any(Payment.class));
        verify(paymentDTOMapper).toResponse(payment);
    }

    @Test
    @DisplayName("Não deve criar pagamento quando pedido não existe")
    void shouldNotCreatePaymentWhenOrderNotFound() {
        var request = new CreatePaymentRequest(PaymentMethod.PIX);

        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
            createPaymentUseCase.execute(orderId.getValue(), request)
        );

        verify(orderRepository).findById(orderId);
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Não deve criar pagamento quando pedido não está pendente")
    void shouldNotCreatePaymentWhenOrderNotPending() {
        order.confirm();
        var request = new CreatePaymentRequest(PaymentMethod.PIX);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        assertThrows(BusinessException.class, () ->
            createPaymentUseCase.execute(orderId.getValue(), request)
        );

        verify(orderRepository).findById(orderId);
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve criar pagamento com CREDIT_CARD")
    void shouldCreatePaymentWithCreditCard() {
        var request = new CreatePaymentRequest(PaymentMethod.CREDIT_CARD);
        var payment = Payment.create(order, PaymentMethod.CREDIT_CARD, PaymentGateway.MERCADO_PAGO);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        var response = createPaymentUseCase.execute(orderId.getValue(), request);

        assertNotNull(response);
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    @DisplayName("Deve criar pagamento com BOLETO")
    void shouldCreatePaymentWithBoleto() {
        var request = new CreatePaymentRequest(PaymentMethod.BOLETO);
        var payment = Payment.create(order, PaymentMethod.BOLETO, PaymentGateway.MERCADO_PAGO);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        var response = createPaymentUseCase.execute(orderId.getValue(), request);

        assertNotNull(response);
        verify(paymentRepository).save(any(Payment.class));
    }
}

