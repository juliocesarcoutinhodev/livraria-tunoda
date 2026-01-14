package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import java.util.List;

/**
 * Propriedades de configuracao CORS (Cross-Origin Resource Sharing).
 * Valores configurados em application.yml por profile.
 *
 * Valores default estao definidos no application.yml, nao aqui.
 *
 * Seguranca:
 * - Local: permissivo para desenvolvimento
 * - Staging: restrito a dominios de homologacao
 * - Production: restrito apenas a dominios autorizados
 */
@Configuration
@ConfigurationProperties(prefix = "app.cors")
@Validated
@Getter
@Setter
public class CorsProperties {

    @NotEmpty(message = "Origens permitidas sao obrigatorias")
    private List<String> allowedOrigins;

    @NotEmpty(message = "Metodos permitidos sao obrigatorios")
    private List<String> allowedMethods;

    @NotEmpty(message = "Headers permitidos sao obrigatorios")
    private List<String> allowedHeaders;

    private List<String> exposedHeaders;

    private Boolean allowCredentials;

    private Long maxAge;
}

