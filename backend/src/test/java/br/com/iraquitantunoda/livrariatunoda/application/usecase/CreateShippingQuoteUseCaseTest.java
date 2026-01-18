package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.ShippingQuoteDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.*;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import org.junit.jupiter.api.BeforeEach;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CreateShippingQuoteUseCase - Testes")
class CreateShippingQuoteUseCaseTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private ShippingQuoteRepository shippingQuoteRepository;

    @Mock
    private ShippingQuoteDTOMapper mapper;

    @InjectMocks
    private CreateShippingQuoteUseCase useCase;

    private CartId cartId;
    private Cart cart;
    private Book book;
    private String toPostalCode;

    @BeforeEach
    void setUp() {
        cartId = CartId.generate();
        toPostalCode = "01310-100";
        cart = createCart();
        book = createBook();
    }

    @Test
    @DisplayName("Deve criar cotação de frete com sucesso")
    void shouldCreateShippingQuoteSuccessfully() {
        when(cartRepository.findById(cartId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(any(BookId.class))).thenReturn(Optional.of(book));
        when(shippingQuoteRepository.save(any(ShippingQuote.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mapper.toResponse(any(ShippingQuote.class))).thenReturn(createMockResponse());

        var result = useCase.execute(cartId.getValue(), toPostalCode);

        assertNotNull(result);
        assertEquals(cartId.getValue(), result.cartId());
        assertEquals(toPostalCode, result.toPostalCode());
        verify(cartRepository).findById(cartId);
        verify(bookRepository, atLeastOnce()).findById(any(BookId.class));
        verify(shippingQuoteRepository).save(any(ShippingQuote.class));
        verify(mapper).toResponse(any(ShippingQuote.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando carrinho não for encontrado")
    void shouldThrowExceptionWhenCartNotFound() {
        when(cartRepository.findById(cartId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> useCase.execute(cartId.getValue(), toPostalCode));

        verify(cartRepository).findById(cartId);
        verify(shippingQuoteRepository, never()).save(any(ShippingQuote.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando carrinho não estiver ativo")
    void shouldThrowExceptionWhenCartIsNotActive() {
        var inactiveCart = Cart.reconstitute(cartId, List.of(), LocalDateTime.now(), LocalDateTime.now(), CartStatus.EXPIRED);

        when(cartRepository.findById(cartId)).thenReturn(Optional.of(inactiveCart));

        assertThrows(BusinessException.class, () -> useCase.execute(cartId.getValue(), toPostalCode));

        verify(cartRepository).findById(cartId);
        verify(shippingQuoteRepository, never()).save(any(ShippingQuote.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando carrinho estiver vazio")
    void shouldThrowExceptionWhenCartIsEmpty() {
        var emptyCart = Cart.create();

        when(cartRepository.findById(cartId)).thenReturn(Optional.of(emptyCart));

        assertThrows(BusinessException.class, () -> useCase.execute(cartId.getValue(), toPostalCode));

        verify(cartRepository).findById(cartId);
        verify(shippingQuoteRepository, never()).save(any(ShippingQuote.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando livro não for encontrado")
    void shouldThrowExceptionWhenBookNotFound() {
        when(cartRepository.findById(cartId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(any(BookId.class))).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> useCase.execute(cartId.getValue(), toPostalCode));

        verify(cartRepository).findById(cartId);
        verify(bookRepository).findById(any(BookId.class));
        verify(shippingQuoteRepository, never()).save(any(ShippingQuote.class));
    }

    private Cart createCart() {
        var cartItem = CartItem.create(
            BookId.generate(),
            "Clean Code",
            2,
            Money.brl(BigDecimal.valueOf(49.90))
        );

        var cart = Cart.reconstitute(
            cartId,
            List.of(cartItem),
            LocalDateTime.now(),
            LocalDateTime.now(),
            CartStatus.ACTIVE
        );

        return cart;
    }

    private Book createBook() {
        return Book.reconstitute(
            BookId.generate(),
            "Clean Code",
            "A Handbook of Agile Software Craftsmanship",
            "http://example.com/photo.jpg",
            ISBN.of("978-0132350884"),
            Money.brl(BigDecimal.valueOf(49.90)),
            Weight.kilograms(BigDecimal.valueOf(0.5)),
            Set.of(AuthorId.generate()),
            Status.ACTIVE,
            100  // stock
        );
    }

    private ShippingQuoteResponse createMockResponse() {
        return new ShippingQuoteResponse(
            ShippingQuoteId.generate().getValue(),
            cartId.getValue(),
            toPostalCode,
            ShippingQuoteStatus.CREATED,
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            List.of(),
            List.of(),
            null
        );
    }
}

