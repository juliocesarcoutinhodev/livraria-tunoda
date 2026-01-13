package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateShippingQuoteRequest(
    @NotBlank(message = "CartId é obrigatório")
    String cartId,

    @NotBlank(message = "CEP de destino é obrigatório")
    @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido. Use o formato: 00000-000 ou 00000000")
    String toPostalCode
) {
}

