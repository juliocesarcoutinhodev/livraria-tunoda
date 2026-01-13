package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;

public record ShippingOptionResponse(
    String carrier,
    String serviceCode,
    String serviceName,
    BigDecimal price,
    String currency,
    int deliveryDays,
    String externalReference
) {
}

