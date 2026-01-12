package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingOption;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Weight;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.ShippingItemEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.ShippingOptionEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.ShippingQuoteEntity;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface ShippingQuoteMapper {

    default ShippingQuote toDomain(ShippingQuoteEntity entity) {
        var items = entity.getItems().stream()
            .map(this::itemToDomain)
            .toList();

        var options = entity.getOptions().stream()
            .map(this::optionToDomain)
            .toList();

        return ShippingQuote.reconstitute(
            ShippingQuoteId.of(entity.getId()),
            CartId.of(entity.getCartId()),
            items,
            options,
            entity.getCreatedAt(),
            entity.getExpiresAt(),
            entity.getStatus(),
            entity.getSelectedServiceCode()
        );
    }

    default ShippingItem itemToDomain(ShippingItemEntity entity) {
        var weight = Weight.of(entity.getWeightValue(), entity.getWeightUnit());
        var unitPrice = Money.of(entity.getUnitPriceAmount(), entity.getUnitPriceCurrency());

        return ShippingItem.create(
            BookId.of(entity.getBookId()),
            entity.getBookTitle(),
            entity.getQuantity(),
            weight,
            unitPrice
        );
    }

    default ShippingOption optionToDomain(ShippingOptionEntity entity) {
        var price = Money.of(entity.getPriceAmount(), entity.getPriceCurrency());

        return ShippingOption.create(
            entity.getServiceCode(),
            entity.getServiceName(),
            price,
            entity.getDeliveryDays(),
            entity.getCompany(),
            entity.getExternalReference()
        );
    }

    default ShippingQuoteEntity toEntityWithItemsAndOptions(ShippingQuote quote) {
        var entity = new ShippingQuoteEntity();
        entity.setId(quote.getId().getValue());
        entity.setCartId(quote.getCartId().getValue());
        entity.setStatus(quote.getStatus());
        entity.setCreatedAt(quote.getCreatedAt());
        entity.setExpiresAt(quote.getExpiresAt());
        entity.setSelectedServiceCode(quote.getSelectedServiceCode());

        var itemEntities = new ArrayList<ShippingItemEntity>();
        for (var item : quote.getItems()) {
            var itemEntity = new ShippingItemEntity();
            itemEntity.setId(UUID.randomUUID().toString());
            itemEntity.setShippingQuote(entity);
            itemEntity.setBookId(item.getBookId().getValue());
            itemEntity.setBookTitle(item.getBookTitle());
            itemEntity.setQuantity(item.getQuantity());
            itemEntity.setWeightValue(item.getWeight().getValue());
            itemEntity.setWeightUnit(item.getWeight().getUnit());
            itemEntity.setUnitPriceAmount(item.getUnitPrice().getAmount());
            itemEntity.setUnitPriceCurrency(item.getUnitPrice().getCurrency());
            itemEntities.add(itemEntity);
        }
        entity.setItems(itemEntities);

        var optionEntities = new ArrayList<ShippingOptionEntity>();
        for (var option : quote.getOptions()) {
            var optionEntity = new ShippingOptionEntity();
            optionEntity.setId(UUID.randomUUID().toString());
            optionEntity.setShippingQuote(entity);
            optionEntity.setServiceCode(option.getServiceCode());
            optionEntity.setServiceName(option.getServiceName());
            optionEntity.setPriceAmount(option.getPrice().getAmount());
            optionEntity.setPriceCurrency(option.getPrice().getCurrency());
            optionEntity.setDeliveryDays(option.getDeliveryDays());
            optionEntity.setCompany(option.getCompany());
            optionEntity.setExternalReference(option.getExternalReference());
            optionEntities.add(optionEntity);
        }
        entity.setOptions(optionEntities);

        return entity;
    }
}

