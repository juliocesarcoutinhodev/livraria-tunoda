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
        var toPostalCode = "01310-100";
        var items = createShippingItems();
        var options = createShippingOptions();

        var quote = ShippingQuote.create(cartId, toPostalCode, items, options);

        assertNotNull(quote.getId());
        assertEquals(cartId, quote.getCartId());
        assertEquals(toPostalCode, quote.getToPostalCode());
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
        var toPostalCode = "01310-100";
        var items = createShippingItems();
        var options = createShippingOptions();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(null, toPostalCode, items, options));

        assertEquals("CartId é obrigatório para cotação de frete", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cotação sem CEP de destino")
    void shouldThrowExceptionWhenCreatingQuoteWithoutToPostalCode() {
        var cartId = CartId.generate();
        var items = createShippingItems();
        var options = createShippingOptions();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(cartId, null, items, options));

        assertEquals("CEP de destino é obrigatório", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cotação com CEP inválido")
    void shouldThrowExceptionWhenCreatingQuoteWithInvalidPostalCode() {
        var cartId = CartId.generate();
        var items = createShippingItems();
        var options = createShippingOptions();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(cartId, "123", items, options));

        assertEquals("CEP de destino inválido. Use o formato: 00000-000 ou 00000000", exception.getMessage());
    }

    @Test
    @DisplayName("Deve aceitar CEP com ou sem hífen")
    void shouldAcceptPostalCodeWithOrWithoutHyphen() {
        var cartId = CartId.generate();
        var items = createShippingItems();
        var options = createShippingOptions();

        var quoteWithHyphen = ShippingQuote.create(cartId, "01310-100", items, options);
        var quoteWithoutHyphen = ShippingQuote.create(cartId, "01310100", items, options);

        assertNotNull(quoteWithHyphen);
        assertNotNull(quoteWithoutHyphen);
        assertEquals("01310-100", quoteWithHyphen.getToPostalCode());
        assertEquals("01310100", quoteWithoutHyphen.getToPostalCode());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cotação sem items")
    void shouldThrowExceptionWhenCreatingQuoteWithoutItems() {
        var cartId = CartId.generate();
        var toPostalCode = "01310-100";
        var options = createShippingOptions();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(cartId, toPostalCode, List.of(), options));

        assertEquals("Cotação deve ter ao menos um item", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cotação sem opções")
    void shouldThrowExceptionWhenCreatingQuoteWithoutOptions() {
        var cartId = CartId.generate();
        var toPostalCode = "01310-100";
        var items = createShippingItems();

        var exception = assertThrows(BusinessException.class,
            () -> ShippingQuote.create(cartId, toPostalCode, items, List.of()));

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
        var toPostalCode = "01310-100";
        var items = createShippingItems();
        var options = createShippingOptions();
        var createdAt = LocalDateTime.now().minusDays(2);
        var expiresAt = LocalDateTime.now().minusDays(1);

        var quote = ShippingQuote.reconstitute(
            ShippingQuoteId.generate(),
            cartId,
            toPostalCode,
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
    @DisplayName("Deve validar cotação para pedido com sucesso")
    void shouldValidateQuoteForOrderSuccessfully() {
        var quote = createValidQuote();
        quote.selectOption("PAC");

        assertDoesNotThrow(quote::validateForOrder);
        assertTrue(quote.isSelected());
        assertNotNull(quote.getSelectedOption());
    }

    @Test
    @DisplayName("Deve lançar exceção ao validar cotação não selecionada para pedido")
    void shouldThrowExceptionWhenValidatingNotSelectedQuoteForOrder() {
        var quote = createValidQuote();

        var exception = assertThrows(BusinessException.class, quote::validateForOrder);

        assertEquals("Cotação deve ter uma opção de frete selecionada para criar pedido", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao validar cotação expirada para pedido")
    void shouldThrowExceptionWhenValidatingExpiredQuoteForOrder() {
        var cartId = CartId.generate();
        var toPostalCode = "01310-100";
        var items = createShippingItems();
        var options = createShippingOptions();
        var createdAt = LocalDateTime.now().minusDays(2);
        var expiresAt = LocalDateTime.now().minusDays(1);

        var quote = ShippingQuote.reconstitute(
            ShippingQuoteId.generate(),
            cartId,
            toPostalCode,
            items,
            options,
            createdAt,
            expiresAt,
            ShippingQuoteStatus.SELECTED,
            "PAC"
        );

        var exception = assertThrows(BusinessException.class, quote::validateForOrder);

        assertEquals("Cotação expirada não pode ser usada para criar pedido", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao validar cotação sem opção selecionada válida")
    void shouldThrowExceptionWhenValidatingQuoteWithoutValidSelectedOption() {
        var cartId = CartId.generate();
        var toPostalCode = "01310-100";
        var items = createShippingItems();
        var options = createShippingOptions();

        // Força estado inconsistente para testar validação
        var quote = ShippingQuote.reconstitute(
            ShippingQuoteId.generate(),
            cartId,
            toPostalCode,
            items,
            options,
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            ShippingQuoteStatus.SELECTED,
            "INVALID_SERVICE"
        );

        var exception = assertThrows(BusinessException.class, quote::validateForOrder);

        assertEquals("Opção de frete selecionada não encontrada", exception.getMessage());
    }

    private ShippingQuote createValidQuote() {
        var cartId = CartId.generate();
        var toPostalCode = "01310-100";
        var items = createShippingItems();
        var options = createShippingOptions();
        return ShippingQuote.create(cartId, toPostalCode, items, options);
    }

    private List<ShippingItem> createShippingItems() {
        var item1 = ShippingItem.create(
            BookId.generate(),
            "Clean Code",
            2,
            Weight.kilograms(BigDecimal.valueOf(0.5)),
            Money.brl(BigDecimal.valueOf(49.90))
        );
        var item2 = ShippingItem.create(
            BookId.generate(),
            "Clean Architecture",
            1,
            Weight.kilograms(BigDecimal.valueOf(0.6)),
            Money.brl(BigDecimal.valueOf(59.90))
        );
        return List.of(item1, item2);
    }

    private List<ShippingOption> createShippingOptions() {
        var pac = ShippingOption.create(
            "PAC",
            "PAC - Encomenda Normal",
            Money.brl(BigDecimal.valueOf(20.00)),
            10,
            "Correios",
            "ME-PAC-001"
        );
        var sedex = ShippingOption.create(
            "SEDEX",
            "SEDEX - Encomenda Expressa",
            Money.brl(BigDecimal.valueOf(35.00)),
            5,
            "Correios",
            "ME-SEDEX-001"
        );
        return List.of(pac, sedex);
    }
}

