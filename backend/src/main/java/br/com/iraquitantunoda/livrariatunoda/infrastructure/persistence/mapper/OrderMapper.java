package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderItem;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.OrderEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.OrderItemEntity;
import org.mapstruct.Mapper;

import java.util.ArrayList;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    default Order toDomain(OrderEntity entity) {
        var items = entity.getItems().stream()
            .map(this::itemToDomain)
            .toList();

        var subtotal = Money.of(entity.getSubtotalAmount(), entity.getSubtotalCurrency());
        var shippingCost = Money.of(entity.getShippingCostAmount(), entity.getShippingCostCurrency());
        var total = Money.of(entity.getTotalAmount(), entity.getTotalCurrency());

        ShippingQuoteId shippingQuoteId = null;
        if (entity.getShippingQuoteId() != null) {
            shippingQuoteId = ShippingQuoteId.of(entity.getShippingQuoteId());
        }

        return Order.reconstitute(
            OrderId.of(entity.getId()),
            CartId.of(entity.getCartId()),
            shippingQuoteId,
            items,
            subtotal,
            shippingCost,
            total,
            entity.getCreatedAt(),
            entity.getStatus(),
            entity.getPaymentReference()
        );
    }

    default OrderItem itemToDomain(OrderItemEntity entity) {
        var unitPrice = Money.of(entity.getUnitPriceAmount(), entity.getUnitPriceCurrency());

        return OrderItem.reconstitute(
            OrderItemId.of(entity.getId()),
            BookId.of(entity.getBookId()),
            entity.getBookTitle(),
            entity.getQuantity(),
            unitPrice
        );
    }

    default OrderEntity toEntityWithItems(Order order) {
        var entity = new OrderEntity();
        entity.setId(order.getId().getValue());
        entity.setCartId(order.getCartId().getValue());
        entity.setShippingQuoteId(order.getShippingQuoteId() != null ? order.getShippingQuoteId().getValue() : null);
        entity.setStatus(order.getStatus());
        entity.setSubtotalAmount(order.getSubtotal().getAmount());
        entity.setSubtotalCurrency(order.getSubtotal().getCurrency());
        entity.setShippingCostAmount(order.getShippingCost().getAmount());
        entity.setShippingCostCurrency(order.getShippingCost().getCurrency());
        entity.setTotalAmount(order.getTotal().getAmount());
        entity.setTotalCurrency(order.getTotal().getCurrency());
        entity.setCreatedAt(order.getCreatedAt());
        entity.setPaymentReference(order.getPaymentReference());

        var itemEntities = new ArrayList<OrderItemEntity>();
        for (var item : order.getItems()) {
            var itemEntity = new OrderItemEntity();
            itemEntity.setId(item.getId().getValue());
            itemEntity.setOrder(entity);
            itemEntity.setBookId(item.getBookId().getValue());
            itemEntity.setBookTitle(item.getBookTitle());
            itemEntity.setQuantity(item.getQuantity());
            itemEntity.setUnitPriceAmount(item.getUnitPrice().getAmount());
            itemEntity.setUnitPriceCurrency(item.getUnitPrice().getCurrency());
            itemEntities.add(itemEntity);
        }
        entity.setItems(itemEntities);

        return entity;
    }
}

