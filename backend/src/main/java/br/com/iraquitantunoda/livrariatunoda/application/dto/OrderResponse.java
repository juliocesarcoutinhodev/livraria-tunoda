package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    String orderId,
    String cartId,
    String status,
    List<OrderItemDTO> items,
    BigDecimal subtotal,
    String currency,
    BigDecimal total,
    LocalDateTime createdAt
) {
}

