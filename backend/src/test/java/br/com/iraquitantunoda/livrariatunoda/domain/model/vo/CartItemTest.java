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
        var bookTitle = "Clean Code";
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var cartItem = CartItem.create(bookId, bookTitle, 2, unitPrice);

        assertNotNull(cartItem);
        assertNotNull(cartItem.getId());
        assertEquals(bookId, cartItem.getBookId());
        assertEquals(bookTitle, cartItem.getBookTitle());
        assertEquals(2, cartItem.getQuantity());
        assertEquals(unitPrice, cartItem.getUnitPrice());
    }

    @Test
    @DisplayName("Deve calcular subtotal corretamente")
    void shouldCalculateSubtotalCorrectly() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var cartItem = CartItem.create(bookId, "Clean Code", 3, unitPrice);
        var subtotal = cartItem.getSubtotal();

        assertEquals(0, new BigDecimal("149.70").compareTo(subtotal.getAmount()));
        assertEquals("BRL", subtotal.getCurrency());
    }

    @Test
    @DisplayName("Deve atualizar quantidade do item")
    void shouldUpdateItemQuantity() {
        var bookId = BookId.generate();
        var cartItem = CartItem.create(bookId, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));

        cartItem.updateQuantity(5);

        assertEquals(5, cartItem.getQuantity());
    }

    @Test
    @DisplayName("Deve incrementar quantidade do item")
    void shouldIncrementItemQuantity() {
        var bookId = BookId.generate();
        var cartItem = CartItem.create(bookId, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));

        cartItem.incrementQuantity(3);

        assertEquals(5, cartItem.getQuantity());
    }

    @Test
    @DisplayName("Deve identificar se item é para determinado livro")
    void shouldIdentifyIfItemIsForBook() {
        var bookId = BookId.generate();
        var cartItem = CartItem.create(bookId, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));

        assertTrue(cartItem.isForBook(bookId));
        assertFalse(cartItem.isForBook(BookId.generate()));
    }

    @Test
    @DisplayName("Deve lançar exceção quando BookId for nulo")
    void shouldThrowExceptionWhenBookIdIsNull() {
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.create(null, "Clean Code", 1, unitPrice);
        });

        assertEquals("O livro é obrigatório para o item do carrinho", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando título for nulo")
    void shouldThrowExceptionWhenTitleIsNull() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.create(bookId, null, 1, unitPrice);
        });

        assertEquals("O título do livro é obrigatório para o item do carrinho", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando título for vazio")
    void shouldThrowExceptionWhenTitleIsBlank() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.create(bookId, "   ", 1, unitPrice);
        });

        assertEquals("O título do livro é obrigatório para o item do carrinho", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando quantidade for zero")
    void shouldThrowExceptionWhenQuantityIsZero() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.create(bookId, "Clean Code", 0, unitPrice);
        });

        assertEquals("A quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando quantidade for negativa")
    void shouldThrowExceptionWhenQuantityIsNegative() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.create(bookId, "Clean Code", -1, unitPrice);
        });

        assertEquals("A quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando preço unitário for nulo")
    void shouldThrowExceptionWhenUnitPriceIsNull() {
        var bookId = BookId.generate();

        var exception = assertThrows(BusinessException.class, () -> {
            CartItem.create(bookId, "Clean Code", 1, null);
        });

        assertEquals("O preço unitário é obrigatório", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar para quantidade zero")
    void shouldThrowExceptionWhenUpdatingToZeroQuantity() {
        var bookId = BookId.generate();
        var cartItem = CartItem.create(bookId, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));

        var exception = assertThrows(BusinessException.class, () -> {
            cartItem.updateQuantity(0);
        });

        assertEquals("A quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao incrementar com valor zero")
    void shouldThrowExceptionWhenIncrementingWithZero() {
        var bookId = BookId.generate();
        var cartItem = CartItem.create(bookId, "Clean Code", 2, Money.brl(BigDecimal.valueOf(49.90)));

        var exception = assertThrows(BusinessException.class, () -> {
            cartItem.incrementQuantity(0);
        });

        assertEquals("O valor a incrementar deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Preço unitário não deve ser modificável após criação")
    void unitPriceShouldNotBeModifiableAfterCreation() {
        var bookId = BookId.generate();
        var originalPrice = Money.brl(BigDecimal.valueOf(49.90));
        var cartItem = CartItem.create(bookId, "Clean Code", 2, originalPrice);

        // Preço unitário é final, não há setter para modificá-lo
        assertEquals(originalPrice, cartItem.getUnitPrice());

        // Alterando quantidade não deve afetar o preço unitário
        cartItem.updateQuantity(5);
        assertEquals(originalPrice, cartItem.getUnitPrice());
    }
}

