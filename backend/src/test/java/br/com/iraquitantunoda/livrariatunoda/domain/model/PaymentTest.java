package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentMethod;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class PaymentTest {

    @Test
    @DisplayName("Deve criar pagamento com sucesso")
    void shouldCreatePaymentSuccessfully() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));

        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        assertNotNull(payment);
        assertNotNull(payment.getId());
        assertEquals(orderId, payment.getOrderId());
        assertEquals(amount, payment.getAmount());
        assertEquals(PaymentMethod.PIX, payment.getMethod());
        assertEquals(PaymentGateway.MERCADO_PAGO, payment.getGateway());
        assertEquals(PaymentStatus.CREATED, payment.getStatus());
        assertNull(payment.getExternalReference());
        assertNotNull(payment.getCreatedAt());
        assertNotNull(payment.getUpdatedAt());
    }

    @Test
    @DisplayName("Não deve criar pagamento sem OrderId")
    void shouldNotCreatePaymentWithoutOrderId() {
        var amount = Money.brl(BigDecimal.valueOf(100.00));

        assertThrows(BusinessException.class, () ->
            Payment.create(null, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO)
        );
    }

    @Test
    @DisplayName("Não deve criar pagamento sem valor")
    void shouldNotCreatePaymentWithoutAmount() {
        var orderId = OrderId.generate();

        assertThrows(BusinessException.class, () ->
            Payment.create(orderId, null, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO)
        );
    }

    @Test
    @DisplayName("Não deve criar pagamento sem método")
    void shouldNotCreatePaymentWithoutMethod() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));

        assertThrows(BusinessException.class, () ->
            Payment.create(orderId, amount, null, PaymentGateway.MERCADO_PAGO)
        );
    }

    @Test
    @DisplayName("Não deve criar pagamento sem gateway")
    void shouldNotCreatePaymentWithoutGateway() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));

        assertThrows(BusinessException.class, () ->
            Payment.create(orderId, amount, PaymentMethod.PIX, null)
        );
    }

    @Test
    @DisplayName("Deve associar referência externa ao pagamento")
    void shouldAssociateExternalReference() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        var externalRef = "MP-123456789";
        payment.associateExternalReference(externalRef);

        assertEquals(externalRef, payment.getExternalReference());
    }

    @Test
    @DisplayName("Não deve permitir alterar referência externa já associada")
    void shouldNotAllowChangeExternalReference() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        payment.associateExternalReference("MP-123456789");

        assertThrows(BusinessException.class, () ->
            payment.associateExternalReference("MP-987654321")
        );
    }

    @Test
    @DisplayName("Deve marcar pagamento como pendente")
    void shouldMarkAsPending() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        payment.markAsPending();

        assertEquals(PaymentStatus.PENDING, payment.getStatus());
        assertTrue(payment.isPending());
    }

    @Test
    @DisplayName("Deve aprovar pagamento pendente")
    void shouldApprovePendingPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();

        payment.approve();

        assertEquals(PaymentStatus.APPROVED, payment.getStatus());
        assertTrue(payment.isApproved());
    }

    @Test
    @DisplayName("Deve aprovar pagamento criado diretamente")
    void shouldApproveCreatedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        payment.approve();

        assertEquals(PaymentStatus.APPROVED, payment.getStatus());
        assertTrue(payment.isApproved());
    }

    @Test
    @DisplayName("Não deve aprovar pagamento já aprovado")
    void shouldNotApproveAlreadyApprovedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.approve();

        assertThrows(BusinessException.class, payment::approve);
    }

    @Test
    @DisplayName("Não deve aprovar pagamento cancelado")
    void shouldNotApproveCancelledPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.cancel();

        assertThrows(BusinessException.class, payment::approve);
    }

    @Test
    @DisplayName("Não deve aprovar pagamento expirado")
    void shouldNotApproveExpiredPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.expire();

        assertThrows(BusinessException.class, payment::approve);
    }

    @Test
    @DisplayName("Deve rejeitar pagamento pendente com motivo")
    void shouldRejectPendingPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();

        var reason = "Saldo insuficiente";
        payment.reject(reason);

        assertEquals(PaymentStatus.REJECTED, payment.getStatus());
        assertEquals(reason, payment.getRejectionReason());
        assertTrue(payment.isRejected());
    }

    @Test
    @DisplayName("Não deve rejeitar pagamento aprovado")
    void shouldNotRejectApprovedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.approve();

        assertThrows(BusinessException.class, () -> payment.reject("Motivo qualquer"));
    }

    @Test
    @DisplayName("Deve cancelar pagamento criado")
    void shouldCancelCreatedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        payment.cancel();

        assertEquals(PaymentStatus.CANCELLED, payment.getStatus());
        assertTrue(payment.isCancelled());
    }

    @Test
    @DisplayName("Não deve cancelar pagamento aprovado")
    void shouldNotCancelApprovedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.approve();

        assertThrows(BusinessException.class, payment::cancel);
    }

    @Test
    @DisplayName("Deve expirar pagamento pendente")
    void shouldExpirePendingPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();

        payment.expire();

        assertEquals(PaymentStatus.EXPIRED, payment.getStatus());
        assertTrue(payment.isExpired());
    }

    @Test
    @DisplayName("Não deve expirar pagamento aprovado")
    void shouldNotExpireApprovedPayment() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.approve();

        assertThrows(BusinessException.class, payment::expire);
    }

    @Test
    @DisplayName("Deve reconstituir pagamento do banco de dados")
    void shouldReconstitutePayment() {
        var paymentId = PaymentId.generate();
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        var reconstituted = Payment.reconstitute(
            paymentId,
            payment.getOrderId(),
            payment.getAmount(),
            payment.getMethod(),
            payment.getGateway(),
            payment.getCreatedAt(),
            PaymentStatus.APPROVED,
            "MP-123456789",
            null,
            payment.getUpdatedAt()
        );

        assertEquals(paymentId, reconstituted.getId());
        assertEquals(PaymentStatus.APPROVED, reconstituted.getStatus());
        assertEquals("MP-123456789", reconstituted.getExternalReference());
    }

    @Test
    @DisplayName("Deve criar pagamento a partir de Order com valor correto")
    void shouldCreatePaymentFromOrderWithCorrectAmount() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);

        var payment = Payment.create(order, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);

        assertNotNull(payment);
        assertNotNull(payment.getId());
        assertEquals(order.getId(), payment.getOrderId());
        assertEquals(order.getTotal(), payment.getAmount());
        assertEquals(PaymentMethod.PIX, payment.getMethod());
        assertEquals(PaymentGateway.MERCADO_PAGO, payment.getGateway());
        assertEquals(PaymentStatus.CREATED, payment.getStatus());
    }

    @Test
    @DisplayName("Não deve criar pagamento com Order nulo")
    void shouldNotCreatePaymentWithNullOrder() {
        assertThrows(BusinessException.class, () ->
            Payment.create(null, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO)
        );
    }

    @Test
    @DisplayName("Não deve rejeitar pagamento sem motivo")
    void shouldNotRejectPaymentWithoutReason() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();

        assertThrows(BusinessException.class, () -> payment.reject(null));
    }

    @Test
    @DisplayName("Não deve rejeitar pagamento com motivo vazio")
    void shouldNotRejectPaymentWithBlankReason() {
        var orderId = OrderId.generate();
        var amount = Money.brl(BigDecimal.valueOf(100.00));
        var payment = Payment.create(orderId, amount, PaymentMethod.PIX, PaymentGateway.MERCADO_PAGO);
        payment.markAsPending();

        assertThrows(BusinessException.class, () -> payment.reject(""));
        assertThrows(BusinessException.class, () -> payment.reject("   "));
    }
}

