package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderJpaRepository extends JpaRepository<OrderEntity, String> {

    @Query("SELECT o FROM OrderEntity o WHERE (:status IS NULL OR o.status = :status)")
    Page<OrderEntity> findWithFilters(@Param("status") OrderStatus status, Pageable pageable);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT function('date', o.createdAt) as date, COUNT(o) as total
        FROM OrderEntity o
        WHERE o.createdAt >= :startDate
        GROUP BY function('date', o.createdAt)
        ORDER BY function('date', o.createdAt)
        """)
    List<OrderCountByDayProjection> countOrdersByDay(@Param("startDate") LocalDateTime startDate);

    interface OrderCountByDayProjection {
        java.time.LocalDate getDate();
        Long getTotal();
    }
}
