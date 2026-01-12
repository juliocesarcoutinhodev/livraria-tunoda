package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.metric.EventType;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookMetricEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookMetricJpaRepository extends JpaRepository<BookMetricEntity, String> {

    @Query("SELECT COUNT(m) FROM BookMetricEntity m WHERE m.bookId = :bookId AND m.eventType = :eventType")
    Long countByBookIdAndEventType(@Param("bookId") String bookId, @Param("eventType") EventType eventType);

    @Query("""
        SELECT m.bookId as bookId, COUNT(m) as totalMetrics
        FROM BookMetricEntity m
        WHERE m.eventType = :eventType
        GROUP BY m.bookId
        ORDER BY COUNT(m) DESC
        """)
    List<TopBookProjection> findTopBooksByEventType(@Param("eventType") EventType eventType, Pageable pageable);

    interface TopBookProjection {
        String getBookId();
        Long getTotalMetrics();
    }
}

