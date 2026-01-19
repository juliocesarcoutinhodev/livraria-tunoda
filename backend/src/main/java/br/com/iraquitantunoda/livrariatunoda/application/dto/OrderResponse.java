package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrderResponse(
    String orderId,
    String cartId,
    String shippingQuoteId,
    String status,
    List<OrderItemDTO> items,
    BigDecimal subtotal,
    BigDecimal shippingCost,
    String currency,
    BigDecimal total,
    String paymentReference,
    String createdAt
) {
}

