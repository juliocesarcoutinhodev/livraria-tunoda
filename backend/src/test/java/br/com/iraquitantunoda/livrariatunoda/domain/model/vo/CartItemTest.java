package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class CartItemTest {

    @Test
    @DisplayName("Deve criar item do carrinho válido")
    void shouldCreateValidCartItem() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var cartItem = CartItem.of(bookId, 2, unitPrice);

        assertNotNull(cartItem);
        assertEquals(bookId, cartItem.getBookId());
        assertEquals(2, cartItem.getQuantity());
        assertEquals(unitPrice, cartItem.getUnitPrice());
    }

    @Test
    @DisplayName("Deve calcular subtotal corretamente")
    void shouldCalculateSubtotalCorrectly() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var cartItem = CartItem.of(bookId, 3, unitPrice);
        var subtotal = cartItem.getSubtotal();

        assertEquals(0, new BigDecimal("149.70").compareTo(subtotal.getAmount()));
        assertEquals("BRL", subtotal.getCurrency());
    }

    @Test
    @DisplayName("Deve lançar exceção quando BookId for nulo")
    void shouldThrowExceptionWhenBookIdIsNull() {
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.of(null, 1, unitPrice);
        });

        assertEquals("O livro é obrigatório para o item do carrinho", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando quantidade for zero")
    void shouldThrowExceptionWhenQuantityIsZero() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.of(bookId, 0, unitPrice);
        });

        assertEquals("A quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando quantidade for negativa")
    void shouldThrowExceptionWhenQuantityIsNegative() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.of(bookId, -1, unitPrice);
        });

        assertEquals("A quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando preço unitário for nulo")
    void shouldThrowExceptionWhenUnitPriceIsNull() {
        var bookId = BookId.generate();

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.of(bookId, 1, null);
        });

        assertEquals("O preço unitário é obrigatório", exception.getMessage());
    }
}

