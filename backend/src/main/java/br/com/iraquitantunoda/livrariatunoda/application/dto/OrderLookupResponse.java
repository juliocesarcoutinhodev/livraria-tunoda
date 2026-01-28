package br.com.iraquitantunoda.livrariatunoda.application.dto;

public record OrderLookupResponse(
    boolean valid,
    String orderId,
    String redirectUrl,
    String message
) {
}
