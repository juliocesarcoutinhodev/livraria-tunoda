package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Propriedades de configuração da API do Mercado Pago.
 * Valores configurados em application.yml
 */
@Configuration
@ConfigurationProperties(prefix = "mercado-pago")
@Getter
@Setter
public class MercadoPagoProperties {

    private String baseUrl = "https://api.mercadopago.com";
    private String accessToken;
    private int timeoutSeconds = 15;
    private int maxRetries = 2;

    // URLs de callback
    private String successUrl;
    private String failureUrl;
    private String pendingUrl;
    private String notificationUrl;
}

