package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderJpaRepository extends JpaRepository<OrderEntity, String> {

    @Query("SELECT o FROM OrderEntity o WHERE (:status IS NULL OR o.status = :status)")
    Page<OrderEntity> findWithFilters(@Param("status") OrderStatus status, Pageable pageable);
}

