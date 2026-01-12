package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingProvider;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ShippingPayload {

    @EqualsAndHashCode.Include
    private final String id;
    private final ShippingQuoteId shippingQuoteId;
    private final ShippingProvider provider;
    private final String rawPayload;
    private final LocalDateTime createdAt;

    private ShippingPayload(String id, ShippingQuoteId shippingQuoteId, ShippingProvider provider, String rawPayload, LocalDateTime createdAt) {
        this.id = id;
        this.shippingQuoteId = shippingQuoteId;
        this.provider = provider;
        this.rawPayload = rawPayload;
        this.createdAt = createdAt;
    }

    public static ShippingPayload create(ShippingQuoteId shippingQuoteId, ShippingProvider provider, String rawPayload) {
        validate(shippingQuoteId, provider, rawPayload);
        return new ShippingPayload(
            UUID.randomUUID().toString(),
            shippingQuoteId,
            provider,
            rawPayload,
            LocalDateTime.now()
        );
    }

    public static ShippingPayload reconstitute(String id, ShippingQuoteId shippingQuoteId, ShippingProvider provider, String rawPayload, LocalDateTime createdAt) {
        return new ShippingPayload(id, shippingQuoteId, provider, rawPayload, createdAt);
    }

    private static void validate(ShippingQuoteId shippingQuoteId, ShippingProvider provider, String rawPayload) {
        if (shippingQuoteId == null) {
            throw new BusinessException("ShippingQuoteId é obrigatório para payload");
        }
        if (provider == null) {
            throw new BusinessException("Provider é obrigatório para payload");
        }
        if (rawPayload == null || rawPayload.isBlank()) {
            throw new BusinessException("Payload bruto não pode ser vazio");
        }
    }
}

