package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.Objects;
import java.util.UUID;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public final class BookId {

    @EqualsAndHashCode.Include
    private final String value;

    private BookId(String value) {
        this.value = value;
    }

    public static BookId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("BookId não pode ser nulo ou vazio");
        }
        return new BookId(value);
    }

    public static BookId generate() {
        return new BookId(UUID.randomUUID().toString());
    }
}