package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

import java.util.UUID;

@Value // Gera constructor, getters, equals, hashCode, toString
public class AuthorId {
    String value;

    public static AuthorId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("AuthorId não pode ser nulo ou vazio");
        }
        return new AuthorId(value);
    }

    public static AuthorId generate() {
        return new AuthorId(UUID.randomUUID().toString());
    }
}