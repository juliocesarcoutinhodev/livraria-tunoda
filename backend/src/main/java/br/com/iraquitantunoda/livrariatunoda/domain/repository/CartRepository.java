package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;

import java.util.Optional;

public interface CartRepository {

    Cart save(Cart cart);

    Optional<Cart> findById(CartId id);
}

