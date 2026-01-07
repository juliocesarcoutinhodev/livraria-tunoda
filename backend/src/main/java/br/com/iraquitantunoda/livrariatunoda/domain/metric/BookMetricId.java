package br.com.iraquitantunoda.livrariatunoda.domain.metric;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

import java.util.UUID;

@Value
public class BookMetricId {
    String value;

    public static BookMetricId of(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("BookMetricId não pode ser nulo ou vazio");
        }
        return new BookMetricId(value);
    }

    public static BookMetricId generate() {
        return new BookMetricId(UUID.randomUUID().toString());
    }
}

