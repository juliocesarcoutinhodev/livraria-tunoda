package br.com.iraquitantunoda.livrariatunoda.application.dto;

public record ValidateCartItemResponse(
    String bookId,
    String title,
    int requestedQuantity,
    int availableQuantity,
    String status,
    String message
) {
}
