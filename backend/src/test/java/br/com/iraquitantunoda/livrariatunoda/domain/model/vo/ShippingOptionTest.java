package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ShippingOption - Testes do Value Object")
class ShippingOptionTest {

    @Test
    @DisplayName("Deve criar opção de frete válida")
    void shouldCreateValidShippingOption() {
        var price = Money.brl(BigDecimal.valueOf(25.00));

        var option = ShippingOption.create("PAC", "PAC - Encomenda Normal", price, 10, "Correios");

        assertEquals("PAC", option.getServiceCode());
        assertEquals("PAC - Encomenda Normal", option.getServiceName());
        assertEquals(price, option.getPrice());
        assertEquals(10, option.getDeliveryDays());
        assertEquals("Correios", option.getCompany());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar opção sem código de serviço")
    void shouldThrowExceptionWhenCreatingOptionWithoutServiceCode() {
        var price = Money.brl(BigDecimal.valueOf(25.00));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingOption.create("", "PAC", price, 10, "Correios"));

        assertEquals("Código do serviço é obrigatório", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar opção sem nome de serviço")
    void shouldThrowExceptionWhenCreatingOptionWithoutServiceName() {
        var price = Money.brl(BigDecimal.valueOf(25.00));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingOption.create("PAC", "", price, 10, "Correios"));

        assertEquals("Nome do serviço é obrigatório", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar opção sem preço")
    void shouldThrowExceptionWhenCreatingOptionWithoutPrice() {
        var exception = assertThrows(BusinessException.class,
            () -> ShippingOption.create("PAC", "PAC", null, 10, "Correios"));

        assertEquals("Preço do frete é obrigatório", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar opção com prazo zero")
    void shouldThrowExceptionWhenCreatingOptionWithZeroDeliveryDays() {
        var price = Money.brl(BigDecimal.valueOf(25.00));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingOption.create("PAC", "PAC", price, 0, "Correios"));

        assertEquals("Prazo de entrega deve ser maior que zero", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar opção sem transportadora")
    void shouldThrowExceptionWhenCreatingOptionWithoutCompany() {
        var price = Money.brl(BigDecimal.valueOf(25.00));

        var exception = assertThrows(BusinessException.class,
            () -> ShippingOption.create("PAC", "PAC", price, 10, ""));

        assertEquals("Transportadora é obrigatória", exception.getMessage());
    }
}

