package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO de request para API do Melhor Envio.
 * Representa o formato esperado pelo endpoint /api/v2/me/shipment/calculate
 */
public record MelhorEnvioCalculateRequest(
    @JsonProperty("from") FromAddress from,
    @JsonProperty("to") ToAddress to,
    @JsonProperty("products") List<Product> products
) {

    public record FromAddress(
        @JsonProperty("postal_code") String postalCode
    ) {}

    public record ToAddress(
        @JsonProperty("postal_code") String postalCode
    ) {}

    public record Product(
        @JsonProperty("id") String id,
        @JsonProperty("width") int width,
        @JsonProperty("height") int height,
        @JsonProperty("length") int length,
        @JsonProperty("weight") BigDecimal weight,
        @JsonProperty("insurance_value") BigDecimal insuranceValue,
        @JsonProperty("quantity") int quantity
    ) {}
}

