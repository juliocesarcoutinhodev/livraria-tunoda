package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public final class ShippingQuoteId {

    @EqualsAndHashCode.Include
    private final String value;

    private ShippingQuoteId(String value) {
        this.value = value;
    }

    public static ShippingQuoteId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("ShippingQuoteId não pode ser nulo ou vazio");
        }
        return new ShippingQuoteId(value);
    }

    public static ShippingQuoteId generate() {
        return new ShippingQuoteId(UUID.randomUUID().toString());
    }
}

