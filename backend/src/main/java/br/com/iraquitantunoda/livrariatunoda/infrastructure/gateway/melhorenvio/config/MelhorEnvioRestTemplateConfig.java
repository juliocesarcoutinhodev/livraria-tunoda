package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuração do RestTemplate para chamadas ao Melhor Envio.
 */
@Configuration
public class MelhorEnvioRestTemplateConfig {

    @Bean(name = "melhorEnvioRestTemplate")
    public RestTemplate melhorEnvioRestTemplate(
        RestTemplateBuilder builder,
        MelhorEnvioProperties properties
    ) {
        var timeout = Duration.ofSeconds(properties.getTimeoutSeconds());

        return builder
            .rootUri(properties.getBaseUrl())
            .connectTimeout(timeout)
            .readTimeout(timeout)
            .defaultHeader("Accept", "application/json")
            .defaultHeader("Content-Type", "application/json")
            .defaultHeader("Authorization", "Bearer " + properties.getToken())
            .build();
    }
}

