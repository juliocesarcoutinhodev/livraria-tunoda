package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OrderLookupRequest(
    @NotBlank(message = "OrderId e obrigatorio")
    String orderId,

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    String email
) {
}
