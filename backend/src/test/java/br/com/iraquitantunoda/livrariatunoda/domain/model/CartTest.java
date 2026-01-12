package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class CartTest {

    @Test
    @DisplayName("Deve criar carrinho vazio com status ACTIVE")
    void shouldCreateEmptyCartWithActiveStatus() {
        var cart = Cart.create();

        assertNotNull(cart);
        assertNotNull(cart.getId());
        assertEquals(CartStatus.ACTIVE, cart.getStatus());
        assertTrue(cart.getItems().isEmpty());
        assertNotNull(cart.getCreatedAt());
        assertNotNull(cart.getUpdatedAt());
    }

    @Test
    @DisplayName("Deve adicionar item ao carrinho")
    void shouldAddItemToCart() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 2, Money.brl(BigDecimal.valueOf(49.90)));

        cart.addItem(item);

        assertEquals(1, cart.getItems().size());
        assertEquals(bookId, cart.getItems().getFirst().getBookId());
        assertEquals(2, cart.getItems().getFirst().getQuantity());
    }

    @Test
    @DisplayName("Deve incrementar quantidade ao adicionar mesmo livro")
    void shouldIncrementQuantityWhenAddingSameBook() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item1 = CartItem.create(bookId, "Livro de Teste", 2, Money.brl(BigDecimal.valueOf(49.90)));
        var item2 = CartItem.create(bookId, "Livro de Teste", 3, Money.brl(BigDecimal.valueOf(49.90)));

        cart.addItem(item1);
        cart.addItem(item2);

        assertEquals(1, cart.getItems().size());
        assertEquals(5, cart.getItems().getFirst().getQuantity());
    }

    @Test
    @DisplayName("Deve atualizar quantidade de item existente")
    void shouldUpdateExistingItemQuantity() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 2, Money.brl(BigDecimal.valueOf(49.90)));

        cart.addItem(item);
        cart.updateItem(bookId, 5);

        assertEquals(1, cart.getItems().size());
        assertEquals(5, cart.getItems().getFirst().getQuantity());
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar item inexistente")
    void shouldThrowExceptionWhenUpdatingNonExistentItem() {
        var cart = Cart.create();
        var bookId = BookId.generate();

        var exception = assertThrows(BusinessException.class, () -> {
            cart.updateItem(bookId, 5);
        });

        assertEquals("Item não encontrado no carrinho", exception.getMessage());
    }

    @Test
    @DisplayName("Deve remover item do carrinho")
    void shouldRemoveItemFromCart() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 2, Money.brl(BigDecimal.valueOf(49.90)));

        cart.addItem(item);
        cart.removeItem(bookId);

        assertTrue(cart.getItems().isEmpty());
    }

    @Test
    @DisplayName("Deve lançar exceção ao remover item inexistente")
    void shouldThrowExceptionWhenRemovingNonExistentItem() {
        var cart = Cart.create();
        var bookId = BookId.generate();

        var exception = assertThrows(BusinessException.class, () -> {
            cart.removeItem(bookId);
        });

        assertEquals("Item não encontrado no carrinho", exception.getMessage());
    }

    @Test
    @DisplayName("Deve calcular subtotal corretamente")
    void shouldCalculateSubtotalCorrectly() {
        var cart = Cart.create();
        var bookId1 = BookId.generate();
        var bookId2 = BookId.generate();
        var item1 = CartItem.create(bookId1, "Livro 1", 2, Money.brl(BigDecimal.valueOf(49.90)));
        var item2 = CartItem.create(bookId2, "Livro 2", 1, Money.brl(BigDecimal.valueOf(29.90)));

        cart.addItem(item1);
        cart.addItem(item2);

        var subtotal = cart.calculateSubtotal();

        assertEquals(0, new BigDecimal("129.70").compareTo(subtotal.getAmount()));
        assertEquals("BRL", subtotal.getCurrency());
    }

    @Test
    @DisplayName("Deve calcular total corretamente")
    void shouldCalculateTotalCorrectly() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 3, Money.brl(BigDecimal.valueOf(19.90)));

        cart.addItem(item);

        var total = cart.calculateTotal();

        assertEquals(0, new BigDecimal("59.70").compareTo(total.getAmount()));
        assertEquals("BRL", total.getCurrency());
    }

    @Test
    @DisplayName("Carrinho vazio deve retornar subtotal zero")
    void emptyCartShouldReturnZeroSubtotal() {
        var cart = Cart.create();

        var subtotal = cart.calculateSubtotal();

        assertEquals(BigDecimal.ZERO, subtotal.getAmount());
        assertEquals("BRL", subtotal.getCurrency());
    }

    @Test
    @DisplayName("Carrinho vazio não deve ser válido")
    void emptyCartShouldNotBeValid() {
        var cart = Cart.create();

        assertFalse(cart.isValid());
    }

    @Test
    @DisplayName("Carrinho com itens deve ser válido")
    void cartWithItemsShouldBeValid() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 1, Money.brl(BigDecimal.valueOf(49.90)));

        cart.addItem(item);

        assertTrue(cart.isValid());
    }

    @Test
    @DisplayName("Deve marcar carrinho como expirado")
    void shouldMarkCartAsExpired() {
        var cart = Cart.create();

        cart.markAsExpired();

        assertEquals(CartStatus.EXPIRED, cart.getStatus());
        assertTrue(cart.isExpired());
    }

    @Test
    @DisplayName("Deve marcar carrinho como convertido")
    void shouldMarkCartAsConverted() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);

        cart.markAsConverted();

        assertEquals(CartStatus.CONVERTED, cart.getStatus());
        assertTrue(cart.isConverted());
    }

    @Test
    @DisplayName("Não deve permitir converter carrinho vazio")
    void shouldNotAllowConvertingEmptyCart() {
        var cart = Cart.create();

        var exception = assertThrows(BusinessException.class, cart::markAsConverted);

        assertEquals("Carrinho vazio não pode ser convertido", exception.getMessage());
    }

    @Test
    @DisplayName("Não deve permitir modificar carrinho expirado")
    void shouldNotAllowModifyingExpiredCart() {
        var cart = Cart.create();
        cart.markAsExpired();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 1, Money.brl(BigDecimal.valueOf(49.90)));

        var exception = assertThrows(BusinessException.class, () -> {
            cart.addItem(item);
        });

        assertEquals("Carrinho não pode ser modificado no status EXPIRED", exception.getMessage());
    }

    @Test
    @DisplayName("Não deve permitir modificar carrinho convertido")
    void shouldNotAllowModifyingConvertedCart() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);
        cart.markAsConverted();

        var exception = assertThrows(BusinessException.class, () -> {
            cart.addItem(item);
        });

        assertEquals("Carrinho não pode ser modificado no status CONVERTED", exception.getMessage());
    }

    @Test
    @DisplayName("Não deve permitir converter carrinho já convertido")
    void shouldNotAllowConvertingAlreadyConvertedCart() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);
        cart.markAsConverted();

        var exception = assertThrows(BusinessException.class, cart::markAsConverted);

        assertEquals("Carrinho já foi convertido em pedido", exception.getMessage());
    }

    @Test
    @DisplayName("Não deve permitir expirar carrinho já convertido")
    void shouldNotAllowExpiringConvertedCart() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);
        cart.markAsConverted();

        var exception = assertThrows(BusinessException.class, cart::markAsExpired);

        assertEquals("Carrinho já foi convertido em pedido", exception.getMessage());
    }

    @Test
    @DisplayName("Carrinho expirado não deve ser válido")
    void expiredCartShouldNotBeValid() {
        var cart = Cart.create();
        var bookId = BookId.generate();
        var item = CartItem.create(bookId, "Livro de Teste", 1, Money.brl(BigDecimal.valueOf(49.90)));
        cart.addItem(item);
        cart.markAsExpired();

        assertFalse(cart.isValid());
    }
}

