package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public final class PaymentId {

    @EqualsAndHashCode.Include
    private final String value;

    private PaymentId(String value) {
        this.value = value;
    }

    public static PaymentId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("PaymentId não pode ser nulo ou vazio");
        }
        return new PaymentId(value);
    }

    public static PaymentId generate() {
        return new PaymentId(UUID.randomUUID().toString());
    }
}