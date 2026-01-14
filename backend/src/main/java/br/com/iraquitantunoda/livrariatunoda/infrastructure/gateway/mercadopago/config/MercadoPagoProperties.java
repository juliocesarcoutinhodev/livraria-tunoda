package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

/**
 * Propriedades de configuração da API do Mercado Pago.
 * Valores configurados em application.yml.
 * Validacao automatica garante propriedades obrigatorias.
 *
 * Valores default estao definidos no application.yml, não aqui.
 */
@Configuration
@ConfigurationProperties(prefix = "mercado-pago")
@Validated
@Getter
@Setter
public class MercadoPagoProperties {

    @NotBlank(message = "Base URL do Mercado Pago e obrigatoria")
    private String baseUrl;

    @NotBlank(message = "Access Token do Mercado Pago e obrigatorio")
    private String accessToken;

    @Min(value = 1, message = "Timeout minimo: 1 segundo")
    private int timeoutSeconds;

    @Min(value = 0, message = "Max retries minimo: 0")
    private int maxRetries;

    // URLs de callback - obrigatorias
    @NotBlank(message = "URL de sucesso e obrigatoria")
    private String successUrl;

    @NotBlank(message = "URL de falha e obrigatoria")
    private String failureUrl;

    @NotBlank(message = "URL de pendente e obrigatoria")
    private String pendingUrl;

    @NotBlank(message = "URL de notificacao e obrigatoria")
    private String notificationUrl;

    // Nome da empresa que aparece na fatura
    @NotBlank(message = "Statement descriptor e obrigatorio")
    private String statementDescriptor;

    // Endpoints da API - configuráveis caso a API mude
    @NotBlank(message = "Endpoint de criar preferencia e obrigatorio")
    private String createPreferenceEndpoint;

    @NotBlank(message = "Endpoint de consultar pagamento e obrigatorio")
    private String getPaymentEndpoint;
}

