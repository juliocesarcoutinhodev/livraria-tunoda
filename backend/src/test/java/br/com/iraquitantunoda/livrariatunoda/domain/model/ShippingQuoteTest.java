package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ShippingQuote - Testes do Aggregate Root")
class ShippingQuoteTest {

    @Test
    @DisplayName("Deve criar cotação com status CREATED")
    void shouldCreateQuoteWithCreatedStatus() {
        var cartId = CartId.generate();
        var items = createShippingItems();
        var options = createShippingOptions();

        var quote = ShippingQuote.create(cartId, items, options);

        assertNotNull(quote.getId());
        assertEquals(cartId, quote.getCartId());
        assertEquals(ShippingQuoteStatus.CREATED, quote.getStatus());
        assertNotNull(quote.getCreatedAt());
        assertNotNull(quote.getExpiresAt());
        assertTrue(quote.getExpiresAt().isAfter(quote.getCreatedAt()));
        assertNull(quote.getSelectedServiceCode());
        assertEquals(2, quote.getItems().size());
        assertEquals(2, quote.getOptions().size());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cotação sem cartId")
    void shouldThrowExceptionWhenCreatingQuoteWithoutCartId() {
        var items = createShippingItems();
        var options = createShippingOptions();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(null, items, options));

        assertEquals("CartId é obrigatório para cotação de frete", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cotação sem items")
    void shouldThrowExceptionWhenCreatingQuoteWithoutItems() {
        var cartId = CartId.generate();
        var options = createShippingOptions();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(cartId, List.of(), options));

        assertEquals("Cotação deve ter ao menos um item", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cotação sem opções")
    void shouldThrowExceptionWhenCreatingQuoteWithoutOptions() {
        var cartId = CartId.generate();
        var items = createShippingItems();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(cartId, items, List.of()));

        assertEquals("Cotação deve ter ao menos uma opção de frete", exception.getMessage());
    }

    @Test
    @DisplayName("Deve selecionar opção de frete")
    void shouldSelectShippingOption() {
        var quote = createValidQuote();

        quote.selectOption("PAC");

        assertEquals(ShippingQuoteStatus.SELECTED, quote.getStatus());
        assertEquals("PAC", quote.getSelectedServiceCode());
        assertTrue(quote.isSelected());
        assertNotNull(quote.getSelectedOption());
        assertEquals("PAC", quote.getSelectedOption().getServiceCode());
    }

    @Test
    @DisplayName("Deve lançar exceção ao selecionar opção inexistente")
    void shouldThrowExceptionWhenSelectingNonExistentOption() {
        var quote = createValidQuote();

        var exception = assertThrows(BusinessException.class,
            () -> quote.selectOption("INVALID"));

        assertEquals("Serviço não encontrado nas opções disponíveis", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar alterar opção já selecionada")
    void shouldThrowExceptionWhenChangingSelectedOption() {
        var quote = createValidQuote();
        quote.selectOption("PAC");

        var exception = assertThrows(BusinessException.class,
            () -> quote.selectOption("SEDEX"));

        assertEquals("Cotação já possui opção selecionada e não pode ser alterada", exception.getMessage());
    }

    @Test
    @DisplayName("Deve expirar cotação")
    void shouldExpireQuote() {
        var quote = createValidQuote();

        quote.expire();

        assertEquals(ShippingQuoteStatus.EXPIRED, quote.getStatus());
        assertTrue(quote.isExpired());
    }

    @Test
    @DisplayName("Deve lançar exceção ao expirar cotação selecionada")
    void shouldThrowExceptionWhenExpiringSelectedQuote() {
        var quote = createValidQuote();
        quote.selectOption("PAC");

        var exception = assertThrows(BusinessException.class, quote::expire);

        assertEquals("Cotação selecionada não pode ser expirada", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao selecionar opção em cotação expirada")
    void shouldThrowExceptionWhenSelectingOptionInExpiredQuote() {
        var quote = createValidQuote();
        quote.expire();

        var exception = assertThrows(BusinessException.class,
            () -> quote.selectOption("PAC"));

        assertEquals("Cotação expirada não pode ter opção selecionada", exception.getMessage());
    }

    @Test
    @DisplayName("Deve verificar se cotação está expirada por tempo")
    void shouldCheckIfQuoteIsExpiredByTime() {
        var cartId = CartId.generate();
        var items = createShippingItems();
        var options = createShippingOptions();
        var createdAt = LocalDateTime.now().minusDays(2);
        var expiresAt = LocalDateTime.now().minusDays(1);

        var quote = ShippingQuote.reconstitute(
            ShippingQuoteId.generate(),
            cartId,
            items,
            options,
            createdAt,
            expiresAt,
            ShippingQuoteStatus.CREATED,
            null
        );

        assertTrue(quote.isExpired());
    }

    @Test
    @DisplayName("Deve retornar lista de items imutável")
    void shouldReturnUnmodifiableItemsList() {
        var quote = createValidQuote();

        assertThrows(UnsupportedOperationException.class,
            () -> quote.getItems().clear());
    }

    @Test
    @DisplayName("Deve retornar lista de opções imutável")
    void shouldReturnUnmodifiableOptionsList() {
        var quote = createValidQuote();

        assertThrows(UnsupportedOperationException.class,
            () -> quote.getOptions().clear());
    }

    @Test
    @DisplayName("Deve retornar null quando nenhuma opção foi selecionada")
    void shouldReturnNullWhenNoOptionSelected() {
        var quote = createValidQuote();

        assertNull(quote.getSelectedOption());
    }

    private ShippingQuote createValidQuote() {
        var cartId = CartId.generate();
        var items = createShippingItems();
        var options = createShippingOptions();
        return ShippingQuote.create(cartId, items, options);
    }

    private List<ShippingItem> createShippingItems() {
        var item1 = ShippingItem.create(
            BookId.generate(),
            "Clean Code",
            2,
            Weight.kilograms(BigDecimal.valueOf(0.5))
        );
        var item2 = ShippingItem.create(
            BookId.generate(),
            "Clean Architecture",
            1,
            Weight.kilograms(BigDecimal.valueOf(0.6))
        );
        return List.of(item1, item2);
    }

    private List<ShippingOption> createShippingOptions() {
        var pac = ShippingOption.create(
            "PAC",
            "PAC - Encomenda Normal",
            Money.brl(BigDecimal.valueOf(20.00)),
            10,
            "Correios"
        );
        var sedex = ShippingOption.create(
            "SEDEX",
            "SEDEX - Encomenda Expressa",
            Money.brl(BigDecimal.valueOf(35.00)),
            5,
            "Correios"
        );
        return List.of(pac, sedex);
    }
}

