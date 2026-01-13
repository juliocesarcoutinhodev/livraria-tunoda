package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request para renovacao de tokens usando refresh token.
 */
public record RefreshTokenRequest(
    @NotBlank(message = "Refresh token e obrigatorio")
    String refreshToken
) {
}

