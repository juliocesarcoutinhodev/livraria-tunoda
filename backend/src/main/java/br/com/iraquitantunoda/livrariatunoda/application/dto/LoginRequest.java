package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request para autenticacao de usuario admin.
 */
public record LoginRequest(
    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    String email,

    @NotBlank(message = "Senha e obrigatoria")
    String password
) {
}

