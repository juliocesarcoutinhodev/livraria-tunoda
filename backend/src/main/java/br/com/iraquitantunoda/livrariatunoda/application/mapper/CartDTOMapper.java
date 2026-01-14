package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CartItemDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartDTOMapper {

    @Mapping(target = "cartId", source = "id.value")
    @Mapping(target = "status", expression = "java(cart.getStatus().name())")
    @Mapping(target = "items", source = "items")
    @Mapping(target = "subtotal", expression = "java(cart.calculateSubtotal().getAmount())")
    @Mapping(target = "currency", expression = "java(cart.calculateSubtotal().getCurrency())")
    @Mapping(target = "total", expression = "java(cart.calculateTotal().getAmount())")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    CartResponse toResponse(Cart cart);

    @Mapping(target = "itemId", source = "id.value")
    @Mapping(target = "bookId", source = "bookId.value")
    @Mapping(target = "bookTitle", source = "bookTitle")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "unitPrice", source = "unitPrice.amount")
    @Mapping(target = "currency", source = "unitPrice.currency")
    @Mapping(target = "subtotal", expression = "java(item.getSubtotal().getAmount())")
    CartItemDTO toItemDTO(CartItem item);
}

