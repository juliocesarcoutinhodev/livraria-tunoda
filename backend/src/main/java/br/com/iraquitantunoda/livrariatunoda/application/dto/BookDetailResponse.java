package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.math.BigDecimal;
import java.util.List;

public record BookDetailResponse(
    String id,
    String title,
    String description,
    String photoUrl,
    String isbn,
    BigDecimal price,
    String currency,
    List<AuthorDetailDTO> authors
) {
}

