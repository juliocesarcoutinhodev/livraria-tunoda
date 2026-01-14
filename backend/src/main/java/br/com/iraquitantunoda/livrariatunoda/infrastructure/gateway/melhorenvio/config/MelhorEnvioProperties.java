package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

/**
 * Propriedades de configuração da API do Melhor Envio.
 * Valores configurados em application.yml.
 * Validacao automatica garante propriedades obrigatorias.
 *
 * Valores default estao definidos no application.yml, não aqui.
 */
@Configuration
@ConfigurationProperties(prefix = "melhor-envio")
@Validated
@Getter
@Setter
public class MelhorEnvioProperties {

    @NotBlank(message = "Base URL do Melhor Envio e obrigatoria")
    private String baseUrl;

    @NotBlank(message = "Token do Melhor Envio e obrigatorio")
    private String token;

    @NotBlank(message = "CEP de origem e obrigatorio")
    private String fromPostalCode;

    @Min(value = 1, message = "Timeout minimo: 1 segundo")
    private int timeoutSeconds;

    @Min(value = 0, message = "Max retries minimo: 0")
    private int maxRetries;

    // Dimensões padrão para livros (em cm)
    @Min(value = 1, message = "Largura minima: 1 cm")
    private int defaultWidth;

    @Min(value = 1, message = "Altura minima: 1 cm")
    private int defaultHeight;

    @Min(value = 1, message = "Comprimento minimo: 1 cm")
    private int defaultLength;

    // Endpoint da API - configurável caso a API mude
    @NotBlank(message = "Endpoint de calculo de frete e obrigatorio")
    private String calculateEndpoint;
}

