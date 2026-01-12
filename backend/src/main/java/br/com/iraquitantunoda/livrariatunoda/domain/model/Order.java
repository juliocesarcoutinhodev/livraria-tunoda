package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Order {

    @EqualsAndHashCode.Include
    private final OrderId id;
    private final CartId cartId;
    private final List<OrderItem> items;
    private final Money subtotal;
    private final Money total;
    private final LocalDateTime createdAt;
    private OrderStatus status;

    private Order(OrderId id, CartId cartId, List<OrderItem> items, Money subtotal, Money total, LocalDateTime createdAt, OrderStatus status) {
        validateItems(items);
        validateAmounts(subtotal, total);

        this.id = id;
        this.cartId = cartId;
        this.items = List.copyOf(items);
        this.subtotal = subtotal;
        this.total = total;
        this.createdAt = createdAt;
        this.status = status;
    }

    public static Order createFromCart(Cart cart) {
        if (cart == null) {
            throw new BusinessException("Carrinho não pode ser nulo");
        }

        if (!cart.isActive()) {
            throw new BusinessException("Carrinho não está ativo");
        }

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Não é possível criar pedido sem itens");
        }

        var orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.create(
                        cartItem.getBookId(),
                        cartItem.getBookTitle(),
                        cartItem.getQuantity(),
                        cartItem.getUnitPrice()
                ))
                .toList();

        var subtotal = cart.calculateSubtotal();
        var total = cart.calculateTotal();

        return new Order(
                OrderId.generate(),
                cart.getId(),
                orderItems,
                subtotal,
                total,
                LocalDateTime.now(),
                OrderStatus.PENDING
        );
    }

    public static Order reconstitute(OrderId id, CartId cartId, List<OrderItem> items, Money subtotal, Money total, LocalDateTime createdAt, OrderStatus status) {
        return new Order(id, cartId, items, subtotal, total, createdAt, status);
    }

    public void confirm() {
        if (status != OrderStatus.PENDING) {
            throw new BusinessException("Apenas pedidos pendentes podem ser confirmados");
        }
        this.status = OrderStatus.CONFIRMED;
    }

    public void startProcessing() {
        if (status != OrderStatus.CONFIRMED) {
            throw new BusinessException("Apenas pedidos confirmados podem ser processados");
        }
        this.status = OrderStatus.PROCESSING;
    }

    public void ship() {
        if (status != OrderStatus.PROCESSING) {
            throw new BusinessException("Apenas pedidos em processamento podem ser enviados");
        }
        this.status = OrderStatus.SHIPPED;
    }

    public void deliver() {
        if (status != OrderStatus.SHIPPED) {
            throw new BusinessException("Apenas pedidos enviados podem ser marcados como entregues");
        }
        this.status = OrderStatus.DELIVERED;
    }

    public void cancel() {
        if (status == OrderStatus.DELIVERED) {
            throw new BusinessException("Pedidos já entregues não podem ser cancelados");
        }
        if (status == OrderStatus.CANCELLED) {
            throw new BusinessException("Pedido já está cancelado");
        }
        this.status = OrderStatus.CANCELLED;
    }

    public boolean isPending() {
        return this.status == OrderStatus.PENDING;
    }

    public boolean isConfirmed() {
        return this.status == OrderStatus.CONFIRMED;
    }

    public boolean isProcessing() {
        return this.status == OrderStatus.PROCESSING;
    }

    public boolean isShipped() {
        return this.status == OrderStatus.SHIPPED;
    }

    public boolean isDelivered() {
        return this.status == OrderStatus.DELIVERED;
    }

    public boolean isCancelled() {
        return this.status == OrderStatus.CANCELLED;
    }

    public Money calculateSubtotal() {
        if (items.isEmpty()) {
            return Money.brl(java.math.BigDecimal.ZERO);
        }

        var currency = items.get(0).getUnitPrice().getCurrency();
        var totalAmount = items.stream()
                .map(OrderItem::getSubtotal)
                .map(Money::getAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return Money.of(totalAmount, currency);
    }

    public Money calculateTotal() {
        // Por enquanto, total é igual ao subtotal
        // No futuro, aqui podem ser aplicados frete, impostos, etc.
        return calculateSubtotal();
    }

    private static void validateItems(List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            throw new BusinessException("Pedido deve ter ao menos um item");
        }
    }

    private static void validateAmounts(Money subtotal, Money total) {
        if (subtotal == null) {
            throw new BusinessException("Subtotal é obrigatório");
        }
        if (total == null) {
            throw new BusinessException("Total é obrigatório");
        }
        if (total.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Total do pedido deve ser maior que zero");
        }
    }
}

