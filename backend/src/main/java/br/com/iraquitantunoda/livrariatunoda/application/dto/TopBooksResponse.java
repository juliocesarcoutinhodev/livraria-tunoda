package br.com.iraquitantunoda.livrariatunoda.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class TopBooksResponse {
    private List<TopBookMetricDTO> books;
    private LocalDateTime generatedAt;
}

