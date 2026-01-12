package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;

import java.util.Optional;

public interface ShippingQuoteRepository {

    ShippingQuote save(ShippingQuote quote);

    Optional<ShippingQuote> findById(ShippingQuoteId id);

    Optional<ShippingQuote> findByCartId(CartId cartId);
}

