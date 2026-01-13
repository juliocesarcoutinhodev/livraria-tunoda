package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO que representa o evento de webhook enviado pelo Mercado Pago.
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
public record MercadoPagoWebhookEvent(
    @JsonProperty("id") Long id,
    @JsonProperty("live_mode") Boolean liveMode,
    @JsonProperty("type") String type,
    @JsonProperty("date_created") String dateCreated,
    @JsonProperty("user_id") Long userId,
    @JsonProperty("api_version") String apiVersion,
    @JsonProperty("action") String action,
    @JsonProperty("data") Data data
) {

    public record Data(
        @JsonProperty("id") String id
    ) {}

    public boolean isPaymentEvent() {
        return "payment".equals(type);
    }

    public boolean isApproved() {
        return "payment.updated".equals(action) || "payment.created".equals(action);
    }

    public String getPaymentId() {
        return data != null ? data.id() : null;
    }
}

