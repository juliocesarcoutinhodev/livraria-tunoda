package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Cart;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartItemId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.CartEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.CartItemEntity;
import org.mapstruct.*;


@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CartMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "cartIdToString")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    @Mapping(target = "items", ignore = true)
    CartEntity toEntity(Cart cart);

    default CartEntity toEntityWithItems(Cart cart) {
        var entity = toEntity(cart);

        var itemEntities = cart.getItems().stream()
            .map(item -> itemDomainToEntity(item, entity))
            .toList();

        entity.setItems(itemEntities);
        return entity;
    }

    default Cart toDomain(CartEntity entity) {
        var items = entity.getItems().stream()
            .map(this::itemEntityToDomain)
            .toList();

        return Cart.reconstitute(
            stringToCartId(entity.getId()),
            items,
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.getStatus()
        );
    }

    @Named("cartIdToString")
    default String cartIdToString(CartId cartId) {
        return cartId != null ? cartId.getValue() : null;
    }

    default CartId stringToCartId(String id) {
        return id != null ? CartId.of(id) : null;
    }

    default CartItemEntity itemDomainToEntity(CartItem item, CartEntity cart) {
        if (item == null) {
            return null;
        }
        var entity = new CartItemEntity();
        entity.setId(item.getId().getValue());
        entity.setCart(cart);
        entity.setBookId(item.getBookId().getValue());
        entity.setBookTitle(item.getBookTitle());
        entity.setQuantity(item.getQuantity());
        entity.setUnitPriceAmount(item.getUnitPrice().getAmount());
        entity.setUnitPriceCurrency(item.getUnitPrice().getCurrency());
        return entity;
    }

    default CartItem itemEntityToDomain(CartItemEntity entity) {
        if (entity == null) {
            return null;
        }
        return CartItem.reconstitute(
            CartItemId.of(entity.getId()),
            BookId.of(entity.getBookId()),
            entity.getBookTitle(),
            entity.getQuantity(),
            Money.of(entity.getUnitPriceAmount(), entity.getUnitPriceCurrency())
        );
    }
}

