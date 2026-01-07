package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;
import java.util.List;

public record BookCatalogResponse(
    String id,
    String title,
    String description,
    String photoUrl,
    BigDecimal price,
    String currency,
    List<AuthorSummaryDTO> authors
) {
}

