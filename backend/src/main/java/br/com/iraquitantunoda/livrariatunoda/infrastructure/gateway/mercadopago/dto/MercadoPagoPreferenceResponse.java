package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO de response da criação de preferência de pagamento no Mercado Pago.
 */
public record MercadoPagoPreferenceResponse(
    @JsonProperty("id") String id,
    @JsonProperty("init_point") String initPoint,
    @JsonProperty("sandbox_init_point") String sandboxInitPoint,
    @JsonProperty("external_reference") String externalReference,
    @JsonProperty("date_created") String dateCreated
) {

    /**
     * Retorna a URL de pagamento apropriada (sandbox ou produção).
     */
    public String getPaymentUrl() {
        return sandboxInitPoint != null ? sandboxInitPoint : initPoint;
    }
}

