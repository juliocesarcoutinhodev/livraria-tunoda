package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateShippingQuoteRequest(
    @NotBlank(message = "CartId é obrigatório")
    String cartId
) {
}

