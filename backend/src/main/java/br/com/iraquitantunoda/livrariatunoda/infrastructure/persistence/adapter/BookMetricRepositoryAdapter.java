package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetric;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetricId;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetricRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookMetricEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.BookMetricJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

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

