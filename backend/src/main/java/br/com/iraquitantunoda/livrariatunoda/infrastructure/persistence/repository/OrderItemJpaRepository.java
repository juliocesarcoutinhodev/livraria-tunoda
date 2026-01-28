package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.OrderItemEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemJpaRepository extends JpaRepository<OrderItemEntity, String> {

    @Query("""
        SELECT oi.bookId as bookId, oi.bookTitle as title, SUM(oi.quantity) as totalSold
        FROM OrderItemEntity oi
        JOIN oi.order o
        WHERE o.createdAt >= :startDate
        GROUP BY oi.bookId, oi.bookTitle
        ORDER BY SUM(oi.quantity) DESC
        """)
    List<TopSoldBookProjection> findTopSoldBooks(
        @Param("startDate") LocalDateTime startDate,
        Pageable pageable
    );

    interface TopSoldBookProjection {
        String getBookId();
        String getTitle();
        Long getTotalSold();
    }
}
