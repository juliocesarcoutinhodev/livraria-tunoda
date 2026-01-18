package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;
import java.util.List;

public record BookResponse(
    String id,
    String title,
    String description,
    String photoUrl,
    String isbn,
    BigDecimal price,
    String currency,
    BigDecimal weight,
    String weightUnit,
    Integer stock,
    List<AuthorSummaryDTO> authors,
    String status
) {
}

