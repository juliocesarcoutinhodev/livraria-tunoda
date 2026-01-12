package br.com.iraquitantunoda.livrariatunoda.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookMetricsResponse {
    private String bookId;
    private Long views;
    private Long clicks;
}

