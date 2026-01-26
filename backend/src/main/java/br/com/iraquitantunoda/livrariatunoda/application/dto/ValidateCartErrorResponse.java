package br.com.iraquitantunoda.livrariatunoda.application.dto;

public record ValidateCartErrorResponse(
    String code,
    String message,
    String bookId
) {
}
