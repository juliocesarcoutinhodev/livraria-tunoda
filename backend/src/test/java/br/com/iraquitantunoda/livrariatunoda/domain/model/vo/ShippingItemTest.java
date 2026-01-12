package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ShippingItem - Testes do Value Object")
class ShippingItemTest {

    @Test
    @DisplayName("Deve criar item de frete válido")
    void shouldCreateValidShippingItem() {
        var bookId = BookId.generate();
        var weight = Weight.kilograms(BigDecimal.valueOf(0.5));
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var item = ShippingItem.create(bookId, "Clean Code", 2, weight, unitPrice);

        assertEquals(bookId, item.getBookId());
        assertEquals("Clean Code", item.getBookTitle());
        assertEquals(2, item.getQuantity());
        assertEquals(weight, item.getWeight());
        assertEquals(unitPrice, item.getUnitPrice());
    }

    @Test
    @DisplayName("Deve calcular peso total do item")
    void shouldCalculateTotalWeight() {
        var bookId = BookId.generate();
        var weight = Weight.kilograms(BigDecimal.valueOf(0.5));
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));
        var item = ShippingItem.create(bookId, "Clean Code", 3, weight, unitPrice);

        var totalWeight = item.getTotalWeight();

        assertEquals(BigDecimal.valueOf(1.5), totalWeight.getValue());
        assertEquals(WeightUnit.KILOGRAMS, totalWeight.getUnit());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar item sem bookId")
    void shouldThrowExceptionWhenCreatingItemWithoutBookId() {
        var weight = Weight.kilograms(BigDecimal.valueOf(0.5));
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingItem.create(null, "Clean Code", 2, weight, unitPrice));

        assertEquals("BookId é obrigatório para item de frete", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar item sem título")
    void shouldThrowExceptionWhenCreatingItemWithoutTitle() {
        var bookId = BookId.generate();
        var weight = Weight.kilograms(BigDecimal.valueOf(0.5));
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingItem.create(bookId, "", 2, weight, unitPrice));

        assertEquals("Título do livro é obrigatório para item de frete", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar item com quantidade zero")
    void shouldThrowExceptionWhenCreatingItemWithZeroQuantity() {
        var bookId = BookId.generate();
        var weight = Weight.kilograms(BigDecimal.valueOf(0.5));
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingItem.create(bookId, "Clean Code", 0, weight, unitPrice));

        assertEquals("Quantidade deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar item sem peso")
    void shouldThrowExceptionWhenCreatingItemWithoutWeight() {
        var bookId = BookId.generate();
        var unitPrice = Money.brl(BigDecimal.valueOf(49.90));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingItem.create(bookId, "Clean Code", 2, null, unitPrice));

        assertEquals("Peso é obrigatório para item de frete", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar item sem preço unitário")
    void shouldThrowExceptionWhenCreatingItemWithoutUnitPrice() {
        var bookId = BookId.generate();
        var weight = Weight.kilograms(BigDecimal.valueOf(0.5));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingItem.create(bookId, "Clean Code", 2, weight, null));

        assertEquals("Preço unitário é obrigatório para item de frete", exception.getMessage());
    }
}

