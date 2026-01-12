package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.CartMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.CartJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CartRepositoryAdapter implements CartRepository {

    private final CartJpaRepository jpaRepository;
    private final CartMapper mapper;

    @Override
    public Cart save(Cart cart) {
        var entity = mapper.toEntity(cart);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Cart> findById(CartId id) {
        return jpaRepository.findById(id.getValue())
            .map(mapper::toDomain);
    }
}

