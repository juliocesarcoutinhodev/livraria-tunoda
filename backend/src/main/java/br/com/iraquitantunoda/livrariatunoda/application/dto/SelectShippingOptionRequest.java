package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;

public record SelectShippingOptionRequest(
    @NotBlank(message = "Código do serviço é obrigatório")
    String serviceCode
) {
}

