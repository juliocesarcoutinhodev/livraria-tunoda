package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartDTOMapper {

    @Mapping(target = "cartId", source = "id.value")
    @Mapping(target = "status", expression = "java(cart.getStatus().name())")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    CartResponse toResponse(Cart cart);
}

