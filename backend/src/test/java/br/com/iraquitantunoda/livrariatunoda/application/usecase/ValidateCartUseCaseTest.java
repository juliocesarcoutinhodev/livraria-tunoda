package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartItemId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ISBN;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Weight;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ValidateCartUseCase - Testes")
class ValidateCartUseCaseTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private ValidateCartUseCase useCase;

    @Test
    @DisplayName("Deve validar carrinho quando estoque está disponível")
    void shouldValidateCartWhenStockIsAvailable() {
        var bookId = BookId.generate();
        var cartItem = createCartItem(bookId, 2);
        var cart = createCart(CartStatus.ACTIVE, List.of(cartItem));
        var book = createBook(bookId, Status.ACTIVE, 5);

        when(cartRepository.findById(cart.getId())).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        var result = useCase.execute(cart.getId().getValue());

        assertTrue(result.valid());
        assertEquals("Carrinho válido para checkout", result.message());
        assertNotNull(result.items());
        assertEquals(1, result.items().size());
        assertEquals("OK", result.items().get(0).status());
        assertEquals(5, result.items().get(0).availableQuantity());
        assertTrue(result.errors().isEmpty());
    }

    @Test
    @DisplayName("Deve retornar erro quando estoque for insuficiente")
    void shouldReturnInsufficientStockError() {
        var bookId = BookId.generate();
        var cartItem = createCartItem(bookId, 3);
        var cart = createCart(CartStatus.ACTIVE, List.of(cartItem));
        var book = createBook(bookId, Status.ACTIVE, 1);

        when(cartRepository.findById(cart.getId())).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        var result = useCase.execute(cart.getId().getValue());

        assertFalse(result.valid());
        assertEquals("Estoque insuficiente para a quantidade solicitada.", result.message());
        assertEquals("INSUFFICIENT_STOCK", result.items().get(0).status());
        assertEquals("INSUFFICIENT_STOCK", result.errors().get(0).code());
    }

    @Test
    @DisplayName("Deve retornar erro quando estoque for zero")
    void shouldReturnOutOfStockError() {
        var bookId = BookId.generate();
        var cartItem = createCartItem(bookId, 1);
        var cart = createCart(CartStatus.ACTIVE, List.of(cartItem));
        var book = createBook(bookId, Status.ACTIVE, 0);

        when(cartRepository.findById(cart.getId())).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        var result = useCase.execute(cart.getId().getValue());

        assertFalse(result.valid());
        assertEquals("Sem estoque para este livro.", result.message());
        assertEquals("OUT_OF_STOCK", result.items().get(0).status());
        assertEquals("OUT_OF_STOCK", result.errors().get(0).code());
    }

    @Test
    @DisplayName("Deve retornar erro quando livro estiver inativo")
    void shouldReturnBookInactiveError() {
        var bookId = BookId.generate();
        var cartItem = createCartItem(bookId, 1);
        var cart = createCart(CartStatus.ACTIVE, List.of(cartItem));
        var book = createBook(bookId, Status.INACTIVE, 10);

        when(cartRepository.findById(cart.getId())).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        var result = useCase.execute(cart.getId().getValue());

        assertFalse(result.valid());
        assertEquals("Este livro não está disponível no momento.", result.message());
        assertEquals("BOOK_INACTIVE", result.items().get(0).status());
        assertEquals("BOOK_INACTIVE", result.errors().get(0).code());
    }

    @Test
    @DisplayName("Deve retornar erro quando livro não for encontrado")
    void shouldReturnBookNotFoundError() {
        var bookId = BookId.generate();
        var cartItem = createCartItem(bookId, 1);
        var cart = createCart(CartStatus.ACTIVE, List.of(cartItem));

        when(cartRepository.findById(cart.getId())).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        var result = useCase.execute(cart.getId().getValue());

        assertFalse(result.valid());
        assertEquals("Este livro não está disponível.", result.message());
        assertEquals("BOOK_NOT_FOUND", result.items().get(0).status());
        assertEquals("BOOK_NOT_FOUND", result.errors().get(0).code());
    }

    @Test
    @DisplayName("Deve retornar erro quando carrinho estiver vazio")
    void shouldReturnCartEmptyError() {
        var cart = createCart(CartStatus.ACTIVE, List.of());

        when(cartRepository.findById(cart.getId())).thenReturn(Optional.of(cart));

        var result = useCase.execute(cart.getId().getValue());

        assertFalse(result.valid());
        assertEquals("Seu carrinho está vazio.", result.message());
        assertEquals("CART_EMPTY", result.errors().get(0).code());
    }

    @Test
    @DisplayName("Deve retornar erro quando carrinho estiver inválido")
    void shouldReturnCartInvalidError() {
        var bookId = BookId.generate();
        var cartItem = createCartItem(bookId, 1);
        var cart = createCart(CartStatus.EXPIRED, List.of(cartItem));
        var book = createBook(bookId, Status.ACTIVE, 10);

        when(cartRepository.findById(cart.getId())).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        var result = useCase.execute(cart.getId().getValue());

        assertFalse(result.valid());
        assertEquals("Carrinho inválido ou expirado.", result.message());
        assertEquals("CART_INVALID", result.errors().get(0).code());
    }

    private Cart createCart(CartStatus status, List<CartItem> items) {
        var now = LocalDateTime.now();
        return Cart.reconstitute(CartId.generate(), items, now, now, status);
    }

    private CartItem createCartItem(BookId bookId, int quantity) {
        return CartItem.reconstitute(
            CartItemId.generate(),
            bookId,
            "Livro de Teste",
            quantity,
            Money.brl(BigDecimal.TEN)
        );
    }

    private Book createBook(BookId bookId, Status status, int stock) {
        return Book.reconstitute(
            bookId,
            "Livro de Teste",
            "Descricao",
            null,
            ISBN.of("1234567890"),
            Money.brl(BigDecimal.TEN),
            Weight.kilograms(BigDecimal.ONE),
            Set.of(AuthorId.generate()),
            status,
            stock
        );
    }
}
