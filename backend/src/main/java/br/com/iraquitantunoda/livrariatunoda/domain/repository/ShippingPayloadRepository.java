package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingPayload;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;

import java.util.Optional;

public interface ShippingPayloadRepository {

    ShippingPayload save(ShippingPayload payload);

    Optional<ShippingPayload> findByShippingQuoteId(ShippingQuoteId shippingQuoteId);
}

