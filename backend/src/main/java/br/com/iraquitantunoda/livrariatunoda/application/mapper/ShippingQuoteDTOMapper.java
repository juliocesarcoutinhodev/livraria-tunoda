package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingItemResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingOptionResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingOption;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShippingQuoteDTOMapper {

    @Mapping(target = "id", source = "id.value")
    @Mapping(target = "cartId", source = "cartId.value")
    @Mapping(target = "toPostalCode", source = "toPostalCode")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "expiresAt", source = "expiresAt")
    @Mapping(target = "items", source = "items")
    @Mapping(target = "options", source = "options")
    @Mapping(target = "selectedServiceCode", source = "selectedServiceCode")
    ShippingQuoteResponse toResponse(ShippingQuote quote);

    @Mapping(target = "bookId", source = "bookId.value")
    @Mapping(target = "bookTitle", source = "bookTitle")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "weightUnit", expression = "java(item.getWeight().getUnit().name())")
    @Mapping(target = "unitPrice", source = "unitPrice.amount")
    @Mapping(target = "currency", source = "unitPrice.currency")
    ShippingItemResponse toItemResponse(ShippingItem item);

    @Mapping(target = "carrier", source = "company")
    @Mapping(target = "serviceCode", source = "serviceCode")
    @Mapping(target = "serviceName", source = "serviceName")
    @Mapping(target = "price", source = "price.amount")
    @Mapping(target = "currency", source = "price.currency")
    @Mapping(target = "deliveryDays", source = "deliveryDays")
    @Mapping(target = "externalReference", source = "externalReference")
    ShippingOptionResponse toOptionResponse(ShippingOption option);
}

