package br.com.iraquitantunoda.livrariatunoda.domain.metric;

import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;

import java.util.List;
import java.util.Map;

public interface BookMetricRepository {

    BookMetric save(BookMetric metric);

    Map<EventType, Long> countByBookIdGroupedByEventType(BookId bookId);

    List<BookMetricSummary> findTopBooksByEventType(EventType eventType, int limit);

    interface BookMetricSummary {
        String getBookId();
        Long getTotalMetrics();
    }
}

