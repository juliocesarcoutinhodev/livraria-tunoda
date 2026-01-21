package br.com.iraquitantunoda.livrariatunoda.application.dto;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.WeightUnit;

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
    BigDecimal weight,
    WeightUnit weightUnit,
    Integer stock,
    Status status,
    List<AuthorDetailDTO> authors
) {
}


