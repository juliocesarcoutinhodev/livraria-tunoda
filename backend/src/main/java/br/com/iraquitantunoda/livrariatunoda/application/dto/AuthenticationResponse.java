package br.com.iraquitantunoda.livrariatunoda.application.dto;

/**
 * Response padronizada de autenticacao.
 * Contem access token JWT e refresh token.
 */
public record AuthenticationResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn
) {
    public static AuthenticationResponse of(String accessToken, String refreshToken, long expiresIn) {
        return new AuthenticationResponse(
            accessToken,
            refreshToken,
            "Bearer",
            expiresIn
        );
    }
}

