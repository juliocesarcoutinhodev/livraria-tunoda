package br.com.iraquitantunoda.livrariatunoda.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TopBookMetricDTO {
    private String id;
    private String title;
    private String photoUrl;
    private Long totalMetrics;
}

