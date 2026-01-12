package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class OrderItemTest {

    @Test
    @DisplayName("Deve criar item do pedido válido")
    void shouldCreateValidOrderItem() {
        var bookId = BookId.generate();
        var bookTitle = "Clean Code";
        var quantity = 2;
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var orderItem = OrderItem.create(bookId, bookTitle, quantity, unitPrice);

        assertNotNull(orderItem);
        assertNotNull(orderItem.getId());
        assertEquals(bookId, orderItem.getBookId());
        assertEquals(bookTitle, orderItem.getBookTitle());
        assertEquals(quantity, orderItem.getQuantity());
        assertEquals(unitPrice, orderItem.getUnitPrice());
    }

    @Test
    @DisplayName("Deve calcular subtotal corretamente")
    void shouldCalculateSubtotalCorrectly() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var orderItem = OrderItem.create(bookId, "Clean Code", 3, unitPrice);
        var subtotal = orderItem.getSubtotal();

        assertEquals(0, new BigDecimal("149.70").compareTo(subtotal.getAmount()));
        assertEquals("BRL", subtotal.getCurrency());
    }

    @Test
    @DisplayName("Deve lançar exceção quando BookId for nulo")
    void shouldThrowExceptionWhenBookIdIsNull() {
        var exception = assertThrows(BusinessException.class, () -> {
            OrderItem.create(null, "Clean Code", 1, Money.brl(BigDecimal.valueOf(49.90)));
        });

        assertEquals("O livro é obrigatório para o item do pedido", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando título for nulo")
    void shouldThrowExceptionWhenTitleIsNull() {
        var bookId = BookId.generate();

        var exception = assertThrows(BusinessException.class, () -> {
            OrderItem.create(bookId, null, 1, Money.brl(BigDecimal.valueOf(49.90)));
        });

        assertEquals("O título do livro é obrigatório para o item do pedido", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando título for vazio")
    void shouldThrowExceptionWhenTitleIsBlank() {
        var bookId = BookId.generate();

        var exception = assertThrows(BusinessException.class, () -> {
            OrderItem.create(bookId, "   ", 1, Money.brl(BigDecimal.valueOf(49.90)));
        });

        assertEquals("O título do livro é obrigatório para o item do pedido", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando quantidade for zero")
    void shouldThrowExceptionWhenQuantityIsZero() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            OrderItem.create(bookId, "Clean Code", 0, unitPrice);
        });

        assertEquals("A quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando quantidade for negativa")
    void shouldThrowExceptionWhenQuantityIsNegative() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            OrderItem.create(bookId, "Clean Code", -1, unitPrice);
        });

        assertEquals("A quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando preço unitário for nulo")
    void shouldThrowExceptionWhenUnitPriceIsNull() {
        var bookId = BookId.generate();

        var exception = assertThrows(BusinessException.class, () -> {
            OrderItem.create(bookId, "Clean Code", 1, null);
        });

        assertEquals("O preço unitário é obrigatório", exception.getMessage());
    }
}

