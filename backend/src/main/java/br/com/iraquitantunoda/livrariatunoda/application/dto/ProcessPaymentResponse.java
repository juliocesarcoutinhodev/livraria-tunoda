package br.com.iraquitantunoda.livrariatunoda.application.dto;

/**
 * Response do processamento de pagamento incluindo URL para pagamento.
 */
public record ProcessPaymentResponse(
    PaymentResponse payment,
    String paymentUrl
) {
}

