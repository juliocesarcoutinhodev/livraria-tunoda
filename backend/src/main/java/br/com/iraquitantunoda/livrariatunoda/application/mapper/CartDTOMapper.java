package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CartItemDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartDTOMapper {

    default CartResponse toResponse(Cart cart) {
        var items = cart.getItems().stream()
            .map(this::toItemDTO)
            .toList();

        var subtotal = cart.calculateSubtotal();
        var total = cart.calculateTotal();

        return new CartResponse(
            cart.getId().getValue(),
            cart.getStatus().name(),
            items,
            subtotal.getAmount(),
            subtotal.getCurrency(),
            total.getAmount(),
            cart.getCreatedAt(),
            cart.getUpdatedAt()
        );
    }

    default CartItemDTO toItemDTO(CartItem item) {
        var subtotal = item.getSubtotal();
        return new CartItemDTO(
            item.getBookId().getValue(),
            item.getBookTitle(),
            item.getQuantity(),
            item.getUnitPrice().getAmount(),
            item.getUnitPrice().getCurrency(),
            subtotal.getAmount()
        );
    }
}

