package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * DTO de response da API do Melhor Envio.
 * Ignora campos não utilizados retornados pela API.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record MelhorEnvioCalculateResponse(
    @JsonProperty("id") String id,
    @JsonProperty("name") String name,
    @JsonProperty("price") BigDecimal price,
    @JsonProperty("custom_price") BigDecimal customPrice,
    @JsonProperty("discount") BigDecimal discount,
    @JsonProperty("currency") String currency,
    @JsonProperty("delivery_time") int deliveryTime,
    @JsonProperty("delivery_range") DeliveryRange deliveryRange,
    @JsonProperty("custom_delivery_time") int customDeliveryTime,
    @JsonProperty("custom_delivery_range") DeliveryRange customDeliveryRange,
    @JsonProperty("packages") Object packages,
    @JsonProperty("additional_services") Object additionalServices,
    @JsonProperty("company") Company company,
    @JsonProperty("error") String error
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DeliveryRange(
        @JsonProperty("min") int min,
        @JsonProperty("max") int max
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Company(
        @JsonProperty("id") int id,
        @JsonProperty("name") String name,
        @JsonProperty("picture") String picture
    ) {}

    public boolean hasError() {
        return error != null && !error.isBlank();
    }

    public BigDecimal getFinalPrice() {
        return customPrice != null && customPrice.compareTo(BigDecimal.ZERO) > 0
            ? customPrice
            : price;
    }

    public int getFinalDeliveryTime() {
        return customDeliveryTime > 0 ? customDeliveryTime : deliveryTime;
    }
}

