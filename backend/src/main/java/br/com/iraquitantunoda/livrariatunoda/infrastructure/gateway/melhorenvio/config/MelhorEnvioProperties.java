package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Propriedades de configuração da API do Melhor Envio.
 * Valores configurados em application.yml
 */
@Configuration
@ConfigurationProperties(prefix = "melhor-envio")
@Getter
@Setter
public class MelhorEnvioProperties {

    private String baseUrl = "https://sandbox.melhorenvio.com.br";
    private String token;
    private String fromPostalCode = "03295-000";
    private int timeoutSeconds = 10;
    private int maxRetries = 2;

    // Dimensões padrão para livros (em cm)
    private int defaultWidth = 15;
    private int defaultHeight = 2;
    private int defaultLength = 20;
}

