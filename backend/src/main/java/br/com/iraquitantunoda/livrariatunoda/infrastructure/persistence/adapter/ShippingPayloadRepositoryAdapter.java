package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingPayload;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingPayloadRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.ShippingPayloadMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.ShippingPayloadJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ShippingPayloadRepositoryAdapter implements ShippingPayloadRepository {

    private final ShippingPayloadJpaRepository jpaRepository;
    private final ShippingPayloadMapper mapper;

    @Override
    public ShippingPayload save(ShippingPayload payload) {
        var entity = mapper.toEntity(payload);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<ShippingPayload> findByShippingQuoteId(ShippingQuoteId shippingQuoteId) {
        return jpaRepository.findByShippingQuoteId(shippingQuoteId.getValue())
            .map(mapper::toDomain);
    }
}

