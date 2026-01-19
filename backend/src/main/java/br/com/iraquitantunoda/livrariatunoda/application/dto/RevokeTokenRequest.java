package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request para revogar tokens (logout).
 * Invalida o refresh token fornecido e opcionalmente todos os tokens do usuario.
 *
 * @param refreshToken Token a ser revogado
 */
public record RevokeTokenRequest(
    @NotBlank(message = "Refresh token obrigatorio")
    String refreshToken
) {
}
