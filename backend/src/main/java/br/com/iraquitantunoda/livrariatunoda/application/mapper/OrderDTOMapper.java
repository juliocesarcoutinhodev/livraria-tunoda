package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderItemDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderDTOMapper {

    @Mapping(target = "orderId", source = "id.value")
    @Mapping(target = "cartId", source = "cartId.value")
    @Mapping(target = "shippingQuoteId", expression = "java(order.getShippingQuoteId() != null ? order.getShippingQuoteId().getValue() : null)")
    @Mapping(target = "status", expression = "java(order.getStatus().name())")
    @Mapping(target = "items", source = "items")
    @Mapping(target = "subtotal", source = "subtotal.amount")
    @Mapping(target = "shippingCost", source = "shippingCost.amount")
    @Mapping(target = "currency", source = "subtotal.currency")
    @Mapping(target = "total", source = "total.amount")
    @Mapping(target = "createdAt", source = "createdAt")
    OrderResponse toResponse(Order order);

    @Mapping(target = "itemId", source = "id.value")
    @Mapping(target = "bookId", source = "bookId.value")
    @Mapping(target = "bookTitle", source = "bookTitle")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "unitPrice", source = "unitPrice.amount")
    @Mapping(target = "currency", source = "unitPrice.currency")
    @Mapping(target = "subtotal", expression = "java(item.getSubtotal().getAmount())")
    OrderItemDTO toItemDTO(OrderItem item);
}

