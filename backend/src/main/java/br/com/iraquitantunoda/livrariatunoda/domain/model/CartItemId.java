package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public final class CartItemId {

    @EqualsAndHashCode.Include
    private final String value;

    private CartItemId(String value) {
        this.value = value;
    }

    public static CartItemId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("CartItemId não pode ser nulo ou vazio");
        }
        return new CartItemId(value);
    }

    public static CartItemId generate() {
        return new CartItemId(UUID.randomUUID().toString());
    }
}

