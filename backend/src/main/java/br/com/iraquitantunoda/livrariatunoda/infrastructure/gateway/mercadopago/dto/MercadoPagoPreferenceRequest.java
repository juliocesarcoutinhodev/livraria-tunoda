package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * DTO de request para criação de preferência de pagamento no Mercado Pago.
 * Formato esperado pela API: POST /checkout/preferences
 */
public record MercadoPagoPreferenceRequest(
    @JsonProperty("items") java.util.List<Item> items,
    @JsonProperty("back_urls") BackUrls backUrls,
    @JsonProperty("auto_return") String autoReturn,
    @JsonProperty("external_reference") String externalReference,
    @JsonProperty("notification_url") String notificationUrl,
    @JsonProperty("statement_descriptor") String statementDescriptor,
    @JsonProperty("payment_methods") PaymentMethods paymentMethods
) {

    public record Item(
        @JsonProperty("title") String title,
        @JsonProperty("description") String description,
        @JsonProperty("quantity") int quantity,
        @JsonProperty("unit_price") BigDecimal unitPrice,
        @JsonProperty("currency_id") String currencyId
    ) {}

    public record BackUrls(
        @JsonProperty("success") String success,
        @JsonProperty("failure") String failure,
        @JsonProperty("pending") String pending
    ) {}

    public record PaymentMethods(
        @JsonProperty("excluded_payment_methods") java.util.List<ExcludedPaymentMethod> excludedPaymentMethods,
        @JsonProperty("excluded_payment_types") java.util.List<ExcludedPaymentType> excludedPaymentTypes,
        @JsonProperty("installments") Integer installments
    ) {}

    public record ExcludedPaymentMethod(
        @JsonProperty("id") String id
    ) {}

    public record ExcludedPaymentType(
        @JsonProperty("id") String id
    ) {}
}

