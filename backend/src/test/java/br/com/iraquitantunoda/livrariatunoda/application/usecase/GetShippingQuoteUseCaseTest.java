package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.ShippingQuoteDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingOption;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingQuoteStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Weight;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GetShippingQuoteUseCase - Testes")
class GetShippingQuoteUseCaseTest {

    @Mock
    private ShippingQuoteRepository shippingQuoteRepository;

    @Mock
    private ShippingQuoteDTOMapper mapper;

    @InjectMocks
    private GetShippingQuoteUseCase useCase;

    private ShippingQuoteId quoteId;
    private ShippingQuote calculatedQuote;

    @BeforeEach
    void setUp() {
        quoteId = ShippingQuoteId.generate();
        calculatedQuote = createCalculatedQuote();
    }

    @Test
    @DisplayName("Deve consultar cotação calculada com sucesso")
    void shouldGetCalculatedQuoteSuccessfully() {
        var mockResponse = createMockResponse();

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(calculatedQuote));
        when(mapper.toResponse(any(ShippingQuote.class))).thenReturn(mockResponse);

        var result = useCase.execute(quoteId.getValue());

        assertNotNull(result);
        assertEquals(ShippingQuoteStatus.CALCULATED, result.status());
        assertEquals(2, result.options().size());

        verify(shippingQuoteRepository).findById(quoteId);
        verify(mapper).toResponse(calculatedQuote);
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação não for encontrada")
    void shouldThrowExceptionWhenQuoteNotFound() {
        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> useCase.execute(quoteId.getValue()));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação não estiver calculada")
    void shouldThrowExceptionWhenQuoteNotCalculated() {
        var createdQuote = createQuoteWithStatus(ShippingQuoteStatus.CREATED);

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(createdQuote));

        assertThrows(BusinessException.class, () -> useCase.execute(quoteId.getValue()));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação estiver expirada")
    void shouldThrowExceptionWhenQuoteExpired() {
        var expiredQuote = createExpiredQuote();

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(expiredQuote));

        assertThrows(BusinessException.class, () -> useCase.execute(quoteId.getValue()));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(mapper, never()).toResponse(any());
    }

    private ShippingQuote createCalculatedQuote() {
        return ShippingQuote.reconstitute(
            quoteId,
            CartId.generate(),
            "01310-100",
            createShippingItems(),
            createCalculatedOptions(),
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            ShippingQuoteStatus.CALCULATED,
            null
        );
    }

    private ShippingQuote createQuoteWithStatus(ShippingQuoteStatus status) {
        return ShippingQuote.reconstitute(
            quoteId,
            CartId.generate(),
            "01310-100",
            createShippingItems(),
            createTemporaryOptions(),
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            status,
            null
        );
    }

    private ShippingQuote createExpiredQuote() {
        return ShippingQuote.reconstitute(
            quoteId,
            CartId.generate(),
            "01310-100",
            createShippingItems(),
            createCalculatedOptions(),
            LocalDateTime.now().minusHours(25),
            LocalDateTime.now().minusHours(1),
            ShippingQuoteStatus.CALCULATED,
            null
        );
    }

    private List<ShippingItem> createShippingItems() {
        return List.of(
            ShippingItem.create(
                BookId.generate(),
                "Livro Teste",
                1,
                Weight.kilograms(BigDecimal.valueOf(0.5)),
                Money.of(BigDecimal.valueOf(50.00), "BRL")
            )
        );
    }

    private List<ShippingOption> createCalculatedOptions() {
        return List.of(
            ShippingOption.create(
                "PAC",
                "PAC",
                Money.of(BigDecimal.valueOf(15.00), "BRL"),
                5,
                "Correios",
                "1"
            ),
            ShippingOption.create(
                "SEDEX",
                "SEDEX",
                Money.of(BigDecimal.valueOf(25.00), "BRL"),
                2,
                "Correios",
                "2"
            )
        );
    }

    private List<ShippingOption> createTemporaryOptions() {
        // Opção temporária criada durante a criação da cotação (antes do cálculo)
        return List.of(
            ShippingOption.create(
                "PENDING",
                "PENDING",
                Money.of(BigDecimal.ZERO, "BRL"),
                1,
                "PENDING",
                "PENDING"
            )
        );
    }

    private ShippingQuoteResponse createMockResponse() {
        var items = List.of(
            new br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingItemResponse(
                "book-id",
                "Livro Teste",
                1,
                BigDecimal.valueOf(0.5),
                "KILOGRAMS",
                BigDecimal.valueOf(50.00),
                "BRL"
            )
        );

        var options = List.of(
            new br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingOptionResponse(
                "Correios",
                "PAC",
                "PAC",
                BigDecimal.valueOf(15.00),
                "BRL",
                5,
                "1"
            ),
            new br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingOptionResponse(
                "Correios",
                "SEDEX",
                "SEDEX",
                BigDecimal.valueOf(25.00),
                "BRL",
                2,
                "2"
            )
        );

        return new ShippingQuoteResponse(
            quoteId.getValue(),
            "cart-id",
            "01310-100",
            ShippingQuoteStatus.CALCULATED,
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            items,
            options,
            null
        );
    }
}

