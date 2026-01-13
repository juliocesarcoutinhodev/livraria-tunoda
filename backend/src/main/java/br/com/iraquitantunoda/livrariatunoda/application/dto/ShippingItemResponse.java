package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;

public record ShippingItemResponse(
    String bookId,
    String bookTitle,
    int quantity,
    BigDecimal weightValue,
    String weightUnit,
    BigDecimal unitPrice,
    String currency
) {
}

