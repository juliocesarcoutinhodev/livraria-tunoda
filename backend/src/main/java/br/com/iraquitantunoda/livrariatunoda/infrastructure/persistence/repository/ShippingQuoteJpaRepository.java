package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.ShippingQuoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShippingQuoteJpaRepository extends JpaRepository<ShippingQuoteEntity, String> {

    Optional<ShippingQuoteEntity> findByCartId(String cartId);
}

