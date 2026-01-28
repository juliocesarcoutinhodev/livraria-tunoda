package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderItemDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingAddressResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingAddress;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.OrderEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.OrderItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface OrderDTOMapper {

    DateTimeFormatter BRAZILIAN_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    @Mapping(target = "orderId", source = "id.value")
    @Mapping(target = "cartId", source = "cartId.value")
    @Mapping(target = "shippingQuoteId", expression = "java(order.getShippingQuoteId() != null ? order.getShippingQuoteId().getValue() : null)")
    @Mapping(target = "status", expression = "java(order.getStatus().name())")
    @Mapping(target = "items", source = "items")
    @Mapping(target = "subtotal", source = "subtotal.amount")
    @Mapping(target = "shippingCost", source = "shippingCost.amount")
    @Mapping(target = "currency", source = "subtotal.currency")
    @Mapping(target = "total", source = "total.amount")
    @Mapping(target = "customerName", source = "customerName")
    @Mapping(target = "customerEmail", source = "customerEmail")
    @Mapping(target = "customerPhone", source = "customerPhone")
    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "shippingServiceCode", source = "shippingServiceCode")
    @Mapping(target = "shippingServiceName", source = "shippingServiceName")
    @Mapping(target = "shippingCompany", source = "shippingCompany")
    @Mapping(target = "shippingDeliveryDays", source = "shippingDeliveryDays")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "formatDate")
    @Mapping(target = "paidAt", source = "paidAt", qualifiedByName = "formatDate")
    @Mapping(target = "processingAt", source = "processingAt", qualifiedByName = "formatDate")
    @Mapping(target = "shippedAt", source = "shippedAt", qualifiedByName = "formatDate")
    @Mapping(target = "deliveredAt", source = "deliveredAt", qualifiedByName = "formatDate")
    @Mapping(target = "cancelledAt", source = "cancelledAt", qualifiedByName = "formatDate")
    @Mapping(target = "expiredAt", source = "expiredAt", qualifiedByName = "formatDate")
    OrderResponse toResponse(Order order);

    @Mapping(target = "orderId", source = "entity.id")
    @Mapping(target = "cartId", source = "entity.cartId")
    @Mapping(target = "shippingQuoteId", source = "entity.shippingQuoteId")
    @Mapping(target = "status", expression = "java(entity.getStatus().name())")
    @Mapping(target = "items", source = "entity.items")
    @Mapping(target = "subtotal", source = "entity.subtotalAmount")
    @Mapping(target = "shippingCost", source = "entity.shippingCostAmount")
    @Mapping(target = "currency", source = "entity.subtotalCurrency")
    @Mapping(target = "total", source = "entity.totalAmount")
    @Mapping(target = "paymentReference", source = "entity.paymentReference")
    @Mapping(target = "customerName", source = "entity.customerName")
    @Mapping(target = "customerEmail", source = "entity.customerEmail")
    @Mapping(target = "customerPhone", source = "entity.customerPhone")
    @Mapping(target = "shippingAddress", expression = "java(mapShippingAddress(entity))")
    @Mapping(target = "shippingServiceCode", source = "entity.shippingServiceCode")
    @Mapping(target = "shippingServiceName", source = "entity.shippingServiceName")
    @Mapping(target = "shippingCompany", source = "entity.shippingCompany")
    @Mapping(target = "shippingDeliveryDays", source = "entity.shippingDeliveryDays")
    @Mapping(target = "createdAt", source = "entity.createdAt", qualifiedByName = "formatDate")
    @Mapping(target = "paidAt", source = "entity.paidAt", qualifiedByName = "formatDate")
    @Mapping(target = "processingAt", source = "entity.processingAt", qualifiedByName = "formatDate")
    @Mapping(target = "shippedAt", source = "entity.shippedAt", qualifiedByName = "formatDate")
    @Mapping(target = "deliveredAt", source = "entity.deliveredAt", qualifiedByName = "formatDate")
    @Mapping(target = "cancelledAt", source = "entity.cancelledAt", qualifiedByName = "formatDate")
    @Mapping(target = "expiredAt", source = "entity.expiredAt", qualifiedByName = "formatDate")
    OrderResponse toResponseFromEntity(OrderEntity entity);

    @Mapping(target = "itemId", source = "id.value")
    @Mapping(target = "bookId", source = "bookId.value")
    @Mapping(target = "bookTitle", source = "bookTitle")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "unitPrice", source = "unitPrice.amount")
    @Mapping(target = "currency", source = "unitPrice.currency")
    @Mapping(target = "subtotal", expression = "java(item.getSubtotal().getAmount())")
    OrderItemDTO toItemDTO(OrderItem item);

    @Mapping(target = "itemId", source = "id")
    @Mapping(target = "bookId", source = "bookId")
    @Mapping(target = "bookTitle", source = "bookTitle")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "unitPrice", source = "unitPriceAmount")
    @Mapping(target = "currency", source = "unitPriceCurrency")
    @Mapping(target = "subtotal", expression = "java(item.getUnitPriceAmount().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))")
    OrderItemDTO toItemDTOFromEntity(OrderItemEntity item);

    @Named("formatDate")
    default String formatDate(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(BRAZILIAN_DATE_FORMAT) : null;
    }

    default ShippingAddressResponse mapShippingAddress(ShippingAddress address) {
        if (address == null) {
            return null;
        }
        return new ShippingAddressResponse(
            address.getStreet(),
            address.getNumber(),
            address.getComplement(),
            address.getNeighborhood(),
            address.getCity(),
            address.getState(),
            address.getPostalCode()
        );
    }

    default ShippingAddressResponse mapShippingAddress(OrderEntity entity) {
        if (entity.getShippingStreet() == null && entity.getShippingNumber() == null &&
            entity.getShippingNeighborhood() == null && entity.getShippingCity() == null &&
            entity.getShippingState() == null && entity.getShippingPostalCode() == null) {
            return null;
        }
        return new ShippingAddressResponse(
            entity.getShippingStreet(),
            entity.getShippingNumber(),
            entity.getShippingComplement(),
            entity.getShippingNeighborhood(),
            entity.getShippingCity(),
            entity.getShippingState(),
            entity.getShippingPostalCode()
        );
    }
}
