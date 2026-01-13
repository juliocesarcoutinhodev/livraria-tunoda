package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

import java.util.UUID;

/**
 * Identidade unica e imutavel de um usuario.
 * Type-safe para evitar confusao entre IDs de diferentes agregados.
 */
@Value
public class UserId {
    String value;

    public static UserId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("UserId nao pode ser nulo ou vazio");
        }
        return new UserId(value);
    }

    public static UserId generate() {
        return new UserId(UUID.randomUUID().toString());
    }
}

