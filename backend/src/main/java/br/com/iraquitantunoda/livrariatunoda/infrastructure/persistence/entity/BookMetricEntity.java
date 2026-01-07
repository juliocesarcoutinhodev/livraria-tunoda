package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity;

import br.com.iraquitantunoda.livrariatunoda.domain.metric.EventType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_book_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookMetricEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "book_id", nullable = false, length = 36)
    private String bookId;

    @Column(name = "event_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;
}

