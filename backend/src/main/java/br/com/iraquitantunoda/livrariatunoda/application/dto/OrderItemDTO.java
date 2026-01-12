package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;

public record OrderItemDTO(
    String itemId,
    String bookId,
    String bookTitle,
    int quantity,
    BigDecimal unitPrice,
    String currency,
    BigDecimal subtotal
) {
}

