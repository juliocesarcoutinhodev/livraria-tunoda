package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetric;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetricId;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetricRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.EventType;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookMetricEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.BookMetricJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookMetricRepositoryAdapter implements BookMetricRepository {

    private final BookMetricJpaRepository jpaRepository;

    @Override
    public BookMetric save(BookMetric metric) {
        var entity = toEntity(metric);
        var saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Map<EventType, Long> countByBookIdGroupedByEventType(BookId bookId) {
        var metrics = new HashMap<EventType, Long>();

        var viewCount = jpaRepository.countByBookIdAndEventType(bookId.getValue(), EventType.VIEW);
        var clickCount = jpaRepository.countByBookIdAndEventType(bookId.getValue(), EventType.CLICK);

        metrics.put(EventType.VIEW, viewCount != null ? viewCount : 0L);
        metrics.put(EventType.CLICK, clickCount != null ? clickCount : 0L);

        return metrics;
    }

    @Override
    public List<BookMetricSummary> findTopBooksByEventType(EventType eventType, int limit) {
        var pageable = PageRequest.of(0, limit);
        return jpaRepository.findTopBooksByEventType(eventType, pageable)
            .stream()
            .map(projection -> new BookMetricSummary() {
                @Override
                public String getBookId() {
                    return projection.getBookId();
                }

                @Override
                public Long getTotalMetrics() {
                    return projection.getTotalMetrics();
                }
            })
            .collect(Collectors.toList());
    }

    private BookMetricEntity toEntity(BookMetric metric) {
        return new BookMetricEntity(
            metric.getId().getValue(),
            metric.getBookId().getValue(),
            metric.getEventType(),
            metric.getOccurredAt()
        );
    }

    private BookMetric toDomain(BookMetricEntity entity) {
        return BookMetric.reconstitute(
            BookMetricId.of(entity.getId()),
            BookId.of(entity.getBookId()),
            entity.getEventType(),
            entity.getOccurredAt()
        );
    }
}

