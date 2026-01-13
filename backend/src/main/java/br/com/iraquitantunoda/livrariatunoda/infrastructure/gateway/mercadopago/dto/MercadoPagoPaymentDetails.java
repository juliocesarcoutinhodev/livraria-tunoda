package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO que representa os detalhes de um pagamento retornado pelo Mercado Pago.
 * Usado para consultar o status atual do pagamento após receber webhook.
 */
public record MercadoPagoPaymentDetails(
    @JsonProperty("id") Long id,
    @JsonProperty("status") String status,
    @JsonProperty("status_detail") String statusDetail,
    @JsonProperty("external_reference") String externalReference,
    @JsonProperty("transaction_amount") java.math.BigDecimal transactionAmount,
    @JsonProperty("currency_id") String currencyId,
    @JsonProperty("payment_method_id") String paymentMethodId,
    @JsonProperty("date_approved") String dateApproved,
    @JsonProperty("date_created") String dateCreated,
    @JsonProperty("date_last_updated") String dateLastUpdated
) {

    public boolean isApproved() {
        return "approved".equals(status);
    }

    public boolean isRejected() {
        return "rejected".equals(status);
    }

    public boolean isCancelled() {
        return "cancelled".equals(status);
    }

    public boolean isPending() {
        return "pending".equals(status) || "in_process".equals(status);
    }

    public boolean isExpired() {
        return "expired".equals(status);
    }
}

