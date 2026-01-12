package br.com.iraquitantunoda.livrariatunoda.application.dto;

public record ValidateCartResponse(
    String cartId,
    boolean valid,
    String message
) {
}

