package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.ShippingPayloadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShippingPayloadJpaRepository extends JpaRepository<ShippingPayloadEntity, String> {

    Optional<ShippingPayloadEntity> findByShippingQuoteId(String shippingQuoteId);
}

