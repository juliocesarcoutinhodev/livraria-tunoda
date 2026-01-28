package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public final class OrderId {

    @EqualsAndHashCode.Include
    private final String value;

    private OrderId(String value) {
        this.value = value;
    }

    public static OrderId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("OrderId não pode ser nulo ou vazio");
        }
        try {
            UUID.fromString(value);
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("OrderId deve ser um UUID valido");
        }
        return new OrderId(value);
    }

    public static OrderId generate() {
        return new OrderId(UUID.randomUUID().toString());
    }
}
