package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.ShippingQuoteMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.ShippingQuoteJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ShippingQuoteRepositoryAdapter implements ShippingQuoteRepository {

    private final ShippingQuoteJpaRepository jpaRepository;
    private final ShippingQuoteMapper mapper;

    @Override
    public ShippingQuote save(ShippingQuote quote) {
        var entity = mapper.toEntityWithItemsAndOptions(quote);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<ShippingQuote> findById(ShippingQuoteId id) {
        return jpaRepository.findById(id.getValue())
            .map(mapper::toDomain);
    }

    @Override
    public Optional<ShippingQuote> findByCartId(CartId cartId) {
        return jpaRepository.findByCartId(cartId.getValue())
            .map(mapper::toDomain);
    }
}

