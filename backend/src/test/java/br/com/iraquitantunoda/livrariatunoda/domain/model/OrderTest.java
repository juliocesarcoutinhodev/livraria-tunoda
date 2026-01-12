package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class OrderTest {

    @Test
    @DisplayName("Deve criar pedido a partir de carrinho válido")
    void shouldCreateOrderFromValidCart() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);

        assertNotNull(order);
        assertNotNull(order.getId());
        assertEquals(cart.getId(), order.getCartId());
        assertEquals(1, order.getItems().size());
        assertEquals(OrderStatus.PENDING, order.getStatus());
        assertNotNull(order.getCreatedAt());
        assertEquals(0, new BigDecimal("99.80").compareTo(order.getSubtotal().getAmount()));
        assertEquals(0, new BigDecimal("99.80").compareTo(order.getTotal().getAmount()));
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar pedido sem itens")
    void shouldThrowExceptionWhenCreatingOrderWithoutItems() {
        var cart = Cart.create();

        var exception = assertThrows(BusinessException.class, () -> {
            Order.createFromCart(cart);
        });

        assertEquals("Não é possível criar pedido sem itens", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar pedido com carrinho nulo")
    void shouldThrowExceptionWhenCreatingOrderWithNullCart() {
        var exception = assertThrows(BusinessException.class, () -> {
            Order.createFromCart(null);
        });

        assertEquals("Carrinho não pode ser nulo", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar pedido com carrinho inativo")
    void shouldThrowExceptionWhenCreatingOrderWithInactiveCart() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);
        cart.markAsExpired();

        var exception = assertThrows(BusinessException.class, () -> {
            Order.createFromCart(cart);
        });

        assertEquals("Carrinho não está ativo", exception.getMessage());
    }

    @Test
    @DisplayName("Deve confirmar pedido pendente")
    void shouldConfirmPendingOrder() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        order.confirm();

        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        assertTrue(order.isConfirmed());
    }

    @Test
    @DisplayName("Deve iniciar processamento de pedido confirmado")
    void shouldStartProcessingConfirmedOrder() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        order.confirm();
        order.startProcessing();

        assertEquals(OrderStatus.PROCESSING, order.getStatus());
        assertTrue(order.isProcessing());
    }

    @Test
    @DisplayName("Deve enviar pedido em processamento")
    void shouldShipProcessingOrder() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        order.confirm();
        order.startProcessing();
        order.ship();

        assertEquals(OrderStatus.SHIPPED, order.getStatus());
        assertTrue(order.isShipped());
    }

    @Test
    @DisplayName("Deve marcar pedido enviado como entregue")
    void shouldDeliverShippedOrder() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        order.confirm();
        order.startProcessing();
        order.ship();
        order.deliver();

        assertEquals(OrderStatus.DELIVERED, order.getStatus());
        assertTrue(order.isDelivered());
    }

    @Test
    @DisplayName("Deve cancelar pedido pendente")
    void shouldCancelPendingOrder() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        order.cancel();

        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        assertTrue(order.isCancelled());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar confirmar pedido não pendente")
    void shouldThrowExceptionWhenConfirmingNonPendingOrder() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        order.confirm();

        var exception = assertThrows(BusinessException.class, order::confirm);

        assertEquals("Apenas pedidos pendentes podem ser confirmados", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar cancelar pedido entregue")
    void shouldThrowExceptionWhenCancellingDeliveredOrder() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        order.confirm();
        order.startProcessing();
        order.ship();
        order.deliver();

        var exception = assertThrows(BusinessException.class, order::cancel);

        assertEquals("Pedidos já entregues não podem ser cancelados", exception.getMessage());
    }

    @Test
    @DisplayName("Pedido deve copiar itens do carrinho de forma imutável")
    void shouldCopyItemsFromCartImmutably() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);

        var orderItemsSize = order.getItems().size();
        var orderTotal = order.getTotal().getAmount();

        cart.addItem(CartItem.create(BookId.generate(), "Outro Livro", 1, Money.brl(BigDecimal.valueOf(29.90))));

        assertEquals(orderItemsSize, order.getItems().size());
        assertEquals(0, orderTotal.compareTo(order.getTotal().getAmount()));
    }

    @Test
    @DisplayName("Deve retornar lista de itens imutável")
    void shouldReturnUnmodifiableItemsList() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);

        assertThrows(UnsupportedOperationException.class, () -> {
            order.getItems().clear();
        });
    }

    @Test
    @DisplayName("Deve calcular subtotal corretamente a partir dos items")
    void shouldCalculateSubtotalFromItems() {
        var cart = Cart.create();
        var bookId1 = BookId.generate();
        var bookId2 = BookId.generate();
        var item1 = CartItem.create(bookId1, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));
        var item2 = CartItem.create(bookId2, "Clean Architecture", 1, Money.brl(BigDecimal.valueOf(59.90)));
        cart.addItem(item1);
        cart.addItem(item2);

        var order = Order.createFromCart(cart);
        var calculatedSubtotal = order.calculateSubtotal();

        assertEquals(0, new BigDecimal("159.70").compareTo(calculatedSubtotal.getAmount()));
        assertEquals("BRL", calculatedSubtotal.getCurrency());
        assertEquals(order.getSubtotal().getAmount(), calculatedSubtotal.getAmount());
    }

    @Test
    @DisplayName("Deve calcular total corretamente a partir dos items")
    void shouldCalculateTotalFromItems() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 3, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);
        var calculatedTotal = order.calculateTotal();

        assertEquals(0, new BigDecimal("149.70").compareTo(calculatedTotal.getAmount()));
        assertEquals("BRL", calculatedTotal.getCurrency());
        assertEquals(order.getTotal().getAmount(), calculatedTotal.getAmount());
    }

    @Test
    @DisplayName("Deve garantir que total seja sempre maior que zero")
    void shouldEnsureTotalIsGreaterThanZero() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        var order = Order.createFromCart(cart);

        assertTrue(order.getTotal().getAmount().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(order.calculateTotal().getAmount().compareTo(BigDecimal.ZERO) > 0);
    }
}

