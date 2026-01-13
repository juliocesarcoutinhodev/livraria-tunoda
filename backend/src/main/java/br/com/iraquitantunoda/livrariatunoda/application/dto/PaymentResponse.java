package br.com.iraquitantunoda.livrariatunoda.application.dto;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentMethod;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
    String paymentId,
    String orderId,
    BigDecimal amount,
    String currency,
    PaymentMethod method,
    PaymentStatus status,
    PaymentGateway gateway,
    String externalReference,
    String rejectionReason,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

