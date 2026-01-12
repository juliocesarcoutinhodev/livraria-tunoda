package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.Positive;

public record UpdateCartItemRequest(

    @Positive(message = "A quantidade deve ser maior que zero")
    int quantity
) {
}

