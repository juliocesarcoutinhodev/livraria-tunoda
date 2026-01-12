package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingPayload;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.ShippingPayloadEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShippingPayloadMapper {

    default ShippingPayload toDomain(ShippingPayloadEntity entity) {
        return ShippingPayload.reconstitute(
            entity.getId(),
            ShippingQuoteId.of(entity.getShippingQuoteId()),
            entity.getProvider(),
            entity.getRawPayload(),
            entity.getCreatedAt()
        );
    }

    default ShippingPayloadEntity toEntity(ShippingPayload payload) {
        return new ShippingPayloadEntity(
            payload.getId(),
            payload.getShippingQuoteId().getValue(),
            payload.getProvider(),
            payload.getRawPayload(),
            payload.getCreatedAt()
        );
    }
}

