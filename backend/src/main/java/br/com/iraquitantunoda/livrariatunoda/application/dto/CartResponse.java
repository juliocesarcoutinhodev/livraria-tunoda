package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CartResponse(
    String cartId,
    String status,
    List<CartItemDTO> items,
    BigDecimal subtotal,
    String currency,
    BigDecimal total,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

