package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderItemDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderDTOMapper {

    default OrderResponse toResponse(Order order) {
        var items = order.getItems().stream()
            .map(this::toItemDTO)
            .toList();

        return new OrderResponse(
            order.getId().getValue(),
            order.getCartId().getValue(),
            order.getStatus().name(),
            items,
            order.getSubtotal().getAmount(),
            order.getSubtotal().getCurrency(),
            order.getTotal().getAmount(),
            order.getCreatedAt()
        );
    }

    default OrderItemDTO toItemDTO(OrderItem item) {
        var subtotal = item.getSubtotal();
        return new OrderItemDTO(
            item.getId().getValue(),
            item.getBookId().getValue(),
            item.getBookTitle(),
            item.getQuantity(),
            item.getUnitPrice().getAmount(),
            item.getUnitPrice().getCurrency(),
            subtotal.getAmount()
        );
    }
}

