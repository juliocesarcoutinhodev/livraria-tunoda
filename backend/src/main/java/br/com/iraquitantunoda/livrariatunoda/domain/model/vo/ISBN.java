package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.Objects;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public final class ISBN {

    @EqualsAndHashCode.Include
    private final String value;

    private ISBN(String value) {
        this.value = value;
    }

    public static ISBN of(String value) {
        if (value != null && !isValid(value)) {
            throw new BusinessException("ISBN inválido: " + value);
        }
        return new ISBN(value);
    }

    private static boolean isValid(String isbn) {
        if (isbn == null || isbn.isBlank()) {
            return false;
        }
        String cleaned = isbn.replaceAll("[\\s-]", "");
        return cleaned.matches("\\d{10}|\\d{13}");
    }
}