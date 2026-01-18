package br.com.iraquitantunoda.livrariatunoda.infrastructure.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        String correlationId,
        List<ValidationError> errors
) {

    public ErrorResponse(int status, String error, String message, String path, String correlationId) {
        this(LocalDateTime.now(), status, error, message, path, correlationId, null);
    }

    public ErrorResponse(int status, String error, String message, String path, String correlationId, List<ValidationError> errors) {
        this(LocalDateTime.now(), status, error, message, path, correlationId, errors);
    }
}

