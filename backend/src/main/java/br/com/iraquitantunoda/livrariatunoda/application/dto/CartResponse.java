package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.time.LocalDateTime;

public record CartResponse(
    String cartId,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

