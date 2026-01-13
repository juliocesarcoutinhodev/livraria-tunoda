package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

import java.util.UUID;

/**
 * Identidade unica e imutavel de um refresh token.
 */
@Value
public class RefreshTokenId {
    String value;

    public static RefreshTokenId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("RefreshTokenId nao pode ser nulo ou vazio");
        }
        return new RefreshTokenId(value);
    }

    public static RefreshTokenId generate() {
        return new RefreshTokenId(UUID.randomUUID().toString());
    }
}

