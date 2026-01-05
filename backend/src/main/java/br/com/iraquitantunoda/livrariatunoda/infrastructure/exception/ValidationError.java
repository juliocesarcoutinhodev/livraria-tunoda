package br.com.iraquitantunoda.livrariatunoda.infrastructure.exception;

public record ValidationError(
        String field,
        String message
) {}