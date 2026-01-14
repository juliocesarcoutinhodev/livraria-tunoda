package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

/**
 * Propriedades de configuracao de seguranca e autenticacao.
 * Validacao automatica garante que aplicacao falha na inicializacao
 * se propriedades obrigatorias estiverem ausentes.
 *
 * Valores default estao definidos no application.yml, não aqui.
 */
@Configuration
@ConfigurationProperties(prefix = "app.security")
@Validated
@Getter
@Setter
public class SecurityProperties {

    private Jwt jwt = new Jwt();
    private RefreshToken refreshToken = new RefreshToken();

    @Getter
    @Setter
    public static class Jwt {
        @NotBlank(message = "JWT secret e obrigatorio")
        private String secret;

        @Min(value = 60, message = "Expiracao minima do JWT: 60 segundos")
        private long expiration;
    }

    @Getter
    @Setter
    public static class RefreshToken {
        @Min(value = 1, message = "Expiracao minima do Refresh Token: 1 dia")
        private int expirationDays;
    }
}

