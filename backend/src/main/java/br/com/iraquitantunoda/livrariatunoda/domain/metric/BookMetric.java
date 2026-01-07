package br.com.iraquitantunoda.livrariatunoda.domain.metric;

import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class BookMetric {

    @EqualsAndHashCode.Include
    private final BookMetricId id;
    private final BookId bookId;
    private final EventType eventType;
    private final LocalDateTime occurredAt;

    private BookMetric(BookMetricId id, BookId bookId, EventType eventType, LocalDateTime occurredAt) {
        this.id = id;
        this.bookId = bookId;
        this.eventType = eventType;
        this.occurredAt = occurredAt;
    }

    public static BookMetric record(BookId bookId, EventType eventType) {
        return new BookMetric(
            BookMetricId.generate(),
            bookId,
            eventType,
            LocalDateTime.now()
        );
    }

    public static BookMetric reconstitute(BookMetricId id, BookId bookId, EventType eventType, LocalDateTime occurredAt) {
        return new BookMetric(id, bookId, eventType, occurredAt);
    }
}

