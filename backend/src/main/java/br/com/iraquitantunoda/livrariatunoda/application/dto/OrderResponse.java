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
    String shippingServiceCode,
    String shippingServiceName,
    String shippingCompany,
    Integer shippingDeliveryDays,
    String customerName,
    String customerEmail,
    String customerPhone,
    ShippingAddressResponse shippingAddress,
    String createdAt,
    String paidAt,
    String processingAt,
    String shippedAt,
    String deliveredAt,
    String cancelledAt,
    String expiredAt
) {
}
