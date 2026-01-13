package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.mapper.ShippingQuoteDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.gateway.ShippingCalculator;
import br.com.iraquitantunoda.livrariatunoda.domain.model.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.*;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingPayloadRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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
@DisplayName("CalculateShippingUseCase - Testes")
class CalculateShippingUseCaseTest {

    @Mock
    private ShippingQuoteRepository shippingQuoteRepository;

    @Mock
    private ShippingPayloadRepository shippingPayloadRepository;

    @Mock
    private ShippingCalculator shippingCalculator;

    @Mock
    private ShippingQuoteDTOMapper mapper;

    @InjectMocks
    private CalculateShippingUseCase useCase;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private ShippingQuote quote;
    private ShippingQuoteId quoteId;

    @BeforeEach
    void setUp() {
        quoteId = ShippingQuoteId.generate();
        quote = createQuote();

        // Injeta ObjectMapper manualmente
        useCase = new CalculateShippingUseCase(
            shippingQuoteRepository,
            shippingPayloadRepository,
            shippingCalculator,
            mapper,
            objectMapper
        );
    }

    @Test
    @DisplayName("Deve calcular frete com sucesso")
    void shouldCalculateShippingSuccessfully() {
        var calculatedQuote = createCalculatedQuote();

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(quote));
        when(shippingCalculator.calculate(quote)).thenReturn(calculatedQuote);
        when(shippingQuoteRepository.save(any(ShippingQuote.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(shippingPayloadRepository.save(any(ShippingPayload.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = useCase.execute(quoteId.getValue());

        assertNotNull(result);
        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingCalculator).calculate(quote);
        verify(shippingQuoteRepository).save(any(ShippingQuote.class));
        verify(shippingPayloadRepository).save(any(ShippingPayload.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação não for encontrada")
    void shouldThrowExceptionWhenQuoteNotFound() {
        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> useCase.execute(quoteId.getValue()));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingCalculator, never()).calculate(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando cotação não estiver no status CREATED")
    void shouldThrowExceptionWhenQuoteIsNotCreated() {
        var calculatedQuote = createCalculatedQuote();

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(calculatedQuote));

        assertThrows(BusinessException.class, () -> useCase.execute(quoteId.getValue()));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingCalculator, never()).calculate(any());
    }

    @Test
    @DisplayName("Deve marcar como expirada quando cotação estiver expirada")
    void shouldMarkAsExpiredWhenQuoteIsExpired() {
        var expiredQuote = ShippingQuote.reconstitute(
            quoteId,
            CartId.generate(),
            createShippingItems(),
            createTempOptions(),
            LocalDateTime.now().minusDays(2),
            LocalDateTime.now().minusDays(1),
            ShippingQuoteStatus.CREATED,
            null
        );

        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(expiredQuote));

        assertThrows(BusinessException.class, () -> useCase.execute(quoteId.getValue()));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingQuoteRepository).save(expiredQuote);
        verify(shippingCalculator, never()).calculate(any());
    }

    @Test
    @DisplayName("Deve marcar como expirada em caso de erro no cálculo")
    void shouldMarkAsExpiredOnCalculationError() {
        when(shippingQuoteRepository.findById(quoteId)).thenReturn(Optional.of(quote));
        when(shippingCalculator.calculate(quote)).thenThrow(new RuntimeException("Erro API"));

        assertThrows(BusinessException.class, () -> useCase.execute(quoteId.getValue()));

        verify(shippingQuoteRepository).findById(quoteId);
        verify(shippingCalculator).calculate(quote);
        verify(shippingQuoteRepository).save(quote);
    }

    private ShippingQuote createQuote() {
        return ShippingQuote.reconstitute(
            quoteId,
            CartId.generate(),
            createShippingItems(),
            createTempOptions(),
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            ShippingQuoteStatus.CREATED,
            null
        );
    }

    private ShippingQuote createCalculatedQuote() {
        return ShippingQuote.reconstitute(
            quoteId,
            CartId.generate(),
            createShippingItems(),
            createCalculatedOptions(),
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            ShippingQuoteStatus.CALCULATED,
            null
        );
    }

    private List<ShippingItem> createShippingItems() {
        return List.of(
            ShippingItem.create(
                BookId.generate(),
                "Clean Code",
                2,
                Weight.kilograms(BigDecimal.valueOf(0.5)),
                Money.brl(BigDecimal.valueOf(49.90))
            )
        );
    }

    private List<ShippingOption> createTempOptions() {
        return List.of(
            ShippingOption.create(
                "PENDING",
                "Aguardando cálculo",
                Money.brl(BigDecimal.ZERO),
                1,
                "PENDING",
                "PENDING"
            )
        );
    }

    private List<ShippingOption> createCalculatedOptions() {
        return List.of(
            ShippingOption.create(
                "PAC",
                "PAC",
                Money.brl(BigDecimal.valueOf(25.00)),
                10,
                "Correios",
                "ext-123"
            ),
            ShippingOption.create(
                "SEDEX",
                "SEDEX",
                Money.brl(BigDecimal.valueOf(35.00)),
                5,
                "Correios",
                "ext-456"
            )
        );
    }
}

