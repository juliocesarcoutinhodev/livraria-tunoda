package br.com.iraquitantunoda.livrariatunoda.application.dto;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingQuoteStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ShippingQuoteResponse(
    String id,
    String cartId,
    String toPostalCode,
    ShippingQuoteStatus status,
    LocalDateTime createdAt,
    LocalDateTime expiresAt,
    List<ShippingItemResponse> items,
    List<ShippingOptionResponse> options,
    String selectedServiceCode
) {
}

