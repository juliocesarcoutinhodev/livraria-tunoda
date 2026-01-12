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

import java.util.List;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CartMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "cartIdToString")
    @Mapping(target = "items", source = "items", qualifiedByName = "itemsToEntities")
    CartEntity toEntity(Cart cart);

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

    @Named("itemsToEntities")
    default List<CartItemEntity> itemsToEntities(List<CartItem> items) {
        return items != null
            ? items.stream().map(this::itemDomainToEntity).toList()
            : List.of();
    }

    default CartItemEntity itemDomainToEntity(CartItem item) {
        if (item == null) {
            return null;
        }
        var entity = new CartItemEntity();
        entity.setId(item.getId().getValue());
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

