package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public final class CartId {

    @EqualsAndHashCode.Include
    private final String value;

    private CartId(String value) {
        this.value = value;
    }

    public static CartId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("CartId não pode ser nulo ou vazio");
        }
        return new CartId(value);
    }

    public static CartId generate() {
        return new CartId(UUID.randomUUID().toString());
    }
}

