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
@DisplayName("SelectShippingOptionUseCase - Testes")
class SelectShippingOptionUseCaseTest {

    @Mock
    private ShippingQuoteRepository shippingQuoteRepository;

    @Mock
    private ShippingQuoteDTOMapper mapper;

    @InjectMocks
    private SelectShippingOptionUseCase useCase;

    private ShippingQuoteId quoteId;
    private ShippingQuote calculatedQuote;
    private String serviceCode;

    @BeforeEach
    void setUp() {
        quoteId = ShippingQuoteId.generate();
        serviceCode = "PAC";
        calculatedQuote = createCalculatedQuote();
    }

    @Test
    @DisplayName("Deve selecionar opção de frete com sucesso")
    void shouldSelectShippingOptionSuccessfully() {
        var mockResponse = createMockResponse(ShippingQuoteStatus.SELECTED, serviceCode);

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(calculatedQuote));
        when(shippingQuoteRepository.save(any(ShippingQuote.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mapper.toResponse(any(ShippingQuote.class))).thenReturn(mockResponse);

        var result = useCase.execute(quoteId.getValue(), serviceCode);

        assertNotNull(result);
        assertEquals(ShippingQuoteStatus.SELECTED, result.status());
        assertEquals(serviceCode, result.selectedServiceCode());

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingQuoteRepository).save(any(ShippingQuote.class));
        verify(mapper).toResponse(any(ShippingQuote.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação não for encontrada")
    void shouldThrowExceptionWhenQuoteNotFound() {
        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> useCase.execute(quoteId.getValue(), serviceCode));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingQuoteRepository, never()).save(any());
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando opção não existir")
    void shouldThrowExceptionWhenOptionNotExists() {
        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(calculatedQuote));

        assertThrows(BusinessException.class,
            () -> useCase.execute(quoteId.getValue(), "INVALID"));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingQuoteRepository, never()).save(any());
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação já tiver opção selecionada")
    void shouldThrowExceptionWhenOptionAlreadySelected() {
        var selectedQuote = createSelectedQuote();

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(selectedQuote));

        assertThrows(BusinessException.class,
            () -> useCase.execute(quoteId.getValue(), "SEDEX"));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingQuoteRepository, never()).save(any());
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação estiver expirada")
    void shouldThrowExceptionWhenQuoteExpired() {
        var expiredQuote = createExpiredQuote();

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(expiredQuote));

        assertThrows(BusinessException.class,
            () -> useCase.execute(quoteId.getValue(), serviceCode));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingQuoteRepository, never()).save(any());
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação não estiver calculada")
    void shouldThrowExceptionWhenQuoteNotCalculated() {
        var createdQuote = createQuoteWithStatus(ShippingQuoteStatus.CREATED);

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(createdQuote));

        assertThrows(BusinessException.class,
            () -> useCase.execute(quoteId.getValue(), serviceCode));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingQuoteRepository, never()).save(any());
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

    private ShippingQuote createSelectedQuote() {
        var quote = createCalculatedQuote();
        quote.selectOption("PAC");
        return quote;
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

    private ShippingQuoteResponse createMockResponse(ShippingQuoteStatus status, String selectedServiceCode) {
        return new ShippingQuoteResponse(
            quoteId.getValue(),
            "cart-id",
            "01310-100",
            status,
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            List.of(),
            List.of(),
            selectedServiceCode
        );
    }
}

