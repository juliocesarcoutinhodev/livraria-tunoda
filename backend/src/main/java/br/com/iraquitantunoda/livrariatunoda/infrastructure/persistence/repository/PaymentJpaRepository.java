package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentStatus;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentJpaRepository extends JpaRepository<PaymentEntity, String> {

    List<PaymentEntity> findAllByOrderId(String orderId);

    Optional<PaymentEntity> findByExternalReference(String externalReference);

    boolean existsByOrderIdAndStatus(String orderId, PaymentStatus status);
}

