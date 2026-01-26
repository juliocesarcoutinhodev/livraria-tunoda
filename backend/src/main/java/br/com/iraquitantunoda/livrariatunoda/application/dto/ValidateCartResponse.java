package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.util.List;

public record ValidateCartResponse(
    String cartId,
    boolean valid,
    String message,
    List<ValidateCartItemResponse> items,
    List<ValidateCartErrorResponse> errors
) {
}
