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
    private final ShippingQuoteId shippingQuoteId;
    private final List<OrderItem> items;
    private final Money subtotal;
    private final Money shippingCost;
    private final Money total;
    private final LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime processingAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime expiredAt;
    private final String customerName;
    private final String customerEmail;
    private final String customerPhone;
    private final br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingAddress shippingAddress;
    private OrderStatus status;
    private String paymentReference;

    private Order(OrderId id, CartId cartId, ShippingQuoteId shippingQuoteId, List<OrderItem> items,
                  Money subtotal, Money shippingCost, Money total, LocalDateTime createdAt,
                  OrderStatus status, String paymentReference,
                  LocalDateTime paidAt, LocalDateTime processingAt, LocalDateTime shippedAt,
                  LocalDateTime deliveredAt, LocalDateTime cancelledAt, LocalDateTime expiredAt,
                  String customerName, String customerEmail, String customerPhone,
                  br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingAddress shippingAddress) {
        validateItems(items);
        validateAmounts(subtotal, shippingCost, total);

        this.id = id;
        this.cartId = cartId;
        this.shippingQuoteId = shippingQuoteId;
        this.items = List.copyOf(items);
        this.subtotal = subtotal;
        this.shippingCost = shippingCost;
        this.total = total;
        this.createdAt = createdAt;
        this.paidAt = paidAt;
        this.processingAt = processingAt;
        this.shippedAt = shippedAt;
        this.deliveredAt = deliveredAt;
        this.cancelledAt = cancelledAt;
        this.expiredAt = expiredAt;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.shippingAddress = shippingAddress;
        this.status = status;
        this.paymentReference = paymentReference;
    }

    public static Order createFromCart(Cart cart, String customerName, String customerEmail, String customerPhone,
                                       String street, String number, String complement, String neighborhood,
                                       String city, String state, String postalCode) {
        if (cart == null) {
            throw new BusinessException("Carrinho não pode ser nulo");
        }

        if (!cart.isActive()) {
            throw new BusinessException("Carrinho não está ativo");
        }

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Não é possível criar pedido sem itens");
        }

        validateCustomerData(customerName, customerEmail, customerPhone);
        var shippingAddress = buildShippingAddress(street, number, complement, neighborhood, city, state, postalCode);

        var orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.create(
                        cartItem.getBookId(),
                        cartItem.getBookTitle(),
                        cartItem.getQuantity(),
                        cartItem.getUnitPrice()
                ))
                .toList();

        var subtotal = cart.calculateSubtotal();
        var shippingCost = Money.brl(java.math.BigDecimal.ZERO);

        return new Order(
                OrderId.generate(),
                cart.getId(),
                null,
                orderItems,
                subtotal,
                shippingCost,
                subtotal,
                LocalDateTime.now(),
                OrderStatus.PENDING,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                customerName.trim(),
                normalizeEmail(customerEmail),
                customerPhone.trim(),
                shippingAddress
        );
    }

    public static Order createFromCartWithShipping(Cart cart, ShippingQuote shippingQuote,
                                                   String customerName, String customerEmail, String customerPhone,
                                                   String street, String number, String complement, String neighborhood,
                                                   String city, String state, String postalCode) {
        if (cart == null) {
            throw new BusinessException("Carrinho não pode ser nulo");
        }

        if (shippingQuote == null) {
            throw new BusinessException("Cotação de frete não pode ser nula");
        }

        if (!cart.isActive()) {
            throw new BusinessException("Carrinho não está ativo");
        }

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Não é possível criar pedido sem itens");
        }

        validateCustomerData(customerName, customerEmail, customerPhone);
        var shippingAddress = buildShippingAddress(street, number, complement, neighborhood, city, state, postalCode);

        // Valida se a cotação pertence ao carrinho
        if (!shippingQuote.getCartId().equals(cart.getId())) {
            throw new BusinessException("Cotação de frete não pertence ao carrinho informado");
        }

        // Valida se a cotação está pronta para pedido
        shippingQuote.validateForOrder();

        var orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.create(
                        cartItem.getBookId(),
                        cartItem.getBookTitle(),
                        cartItem.getQuantity(),
                        cartItem.getUnitPrice()
                ))
                .toList();

        var subtotal = cart.calculateSubtotal();
        var selectedOption = shippingQuote.getSelectedOption();
        var shippingCost = selectedOption.getPrice();

        // Total = subtotal + frete
        var totalAmount = subtotal.getAmount().add(shippingCost.getAmount());
        var total = Money.of(totalAmount, subtotal.getCurrency());

        return new Order(
                OrderId.generate(),
                cart.getId(),
                shippingQuote.getId(),
                orderItems,
                subtotal,
                shippingCost,
                total,
                LocalDateTime.now(),
                OrderStatus.PENDING,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                customerName.trim(),
                normalizeEmail(customerEmail),
                customerPhone.trim(),
                shippingAddress
        );
    }

    public static Order reconstitute(OrderId id, CartId cartId, ShippingQuoteId shippingQuoteId,
                                     List<OrderItem> items, Money subtotal, Money shippingCost,
                                     Money total, LocalDateTime createdAt, OrderStatus status,
                                     String paymentReference, LocalDateTime paidAt,
                                     LocalDateTime processingAt, LocalDateTime shippedAt,
                                     LocalDateTime deliveredAt, LocalDateTime cancelledAt,
                                     LocalDateTime expiredAt, String customerName, String customerEmail,
                                     String customerPhone,
                                     br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingAddress shippingAddress) {
        return new Order(id, cartId, shippingQuoteId, items, subtotal, shippingCost, total,
                        createdAt, status, paymentReference, paidAt, processingAt, shippedAt,
                        deliveredAt, cancelledAt, expiredAt, customerName, customerEmail, customerPhone,
                        shippingAddress);
    }

    public void associatePaymentReference(String reference) {
        if (reference == null || reference.isBlank()) {
            throw new BusinessException("Referência de pagamento não pode ser nula ou vazia");
        }
        if (this.paymentReference != null) {
            throw new BusinessException("Referência de pagamento já foi associada e não pode ser alterada");
        }
        this.paymentReference = reference;
    }

    public void confirm() {
        if (status == OrderStatus.CANCELLED) {
            throw new BusinessException("Pedido cancelado não pode ser confirmado");
        }
        if (status == OrderStatus.EXPIRED) {
            throw new BusinessException("Pedido expirado não pode ser confirmado");
        }
        if (status != OrderStatus.PENDING) {
            throw new BusinessException("Apenas pedidos pendentes podem ser confirmados");
        }
        if (paymentReference == null || paymentReference.isBlank()) {
            throw new BusinessException("Pedido não pode ser confirmado sem referência de pagamento");
        }
        this.status = OrderStatus.CONFIRMED;
        this.paidAt = LocalDateTime.now();
    }

    public void expire() {
        if (status != OrderStatus.PENDING) {
            throw new BusinessException("Apenas pedidos pendentes podem expirar");
        }
        this.status = OrderStatus.EXPIRED;
        this.expiredAt = LocalDateTime.now();
    }

    public void startProcessing() {
        if (status != OrderStatus.CONFIRMED) {
            throw new BusinessException("Apenas pedidos confirmados podem ser processados");
        }
        this.status = OrderStatus.PROCESSING;
        this.processingAt = LocalDateTime.now();
    }

    public void ship() {
        if (status != OrderStatus.PROCESSING) {
            throw new BusinessException("Apenas pedidos em processamento podem ser enviados");
        }
        this.status = OrderStatus.SHIPPED;
        this.shippedAt = LocalDateTime.now();
    }

    public void deliver() {
        if (status != OrderStatus.SHIPPED) {
            throw new BusinessException("Apenas pedidos enviados podem ser marcados como entregues");
        }
        this.status = OrderStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }

    public void cancel() {
        if (status == OrderStatus.DELIVERED) {
            throw new BusinessException("Pedidos já entregues não podem ser cancelados");
        }
        if (status == OrderStatus.CANCELLED) {
            throw new BusinessException("Pedido já está cancelado");
        }
        this.status = OrderStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
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

    public boolean isExpired() {
        return this.status == OrderStatus.EXPIRED;
    }

    public Money calculateSubtotal() {
        if (items.isEmpty()) {
            return Money.brl(java.math.BigDecimal.ZERO);
        }

        var currency = items.getFirst().getUnitPrice().getCurrency();
        var totalAmount = items.stream()
                .map(OrderItem::getSubtotal)
                .map(Money::getAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return Money.of(totalAmount, currency);
    }

    public Money calculateTotal() {
        // Total já está calculado e congelado no momento da criação
        // Inclui subtotal + frete
        return this.total;
    }

    private static void validateItems(List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            throw new BusinessException("Pedido deve ter ao menos um item");
        }
    }

    private static void validateAmounts(Money subtotal, Money shippingCost, Money total) {
        if (subtotal == null) {
            throw new BusinessException("Subtotal é obrigatório");
        }
        if (shippingCost == null) {
            throw new BusinessException("Custo de frete é obrigatório");
        }
        if (total == null) {
            throw new BusinessException("Total é obrigatório");
        }
        if (subtotal.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Subtotal do pedido deve ser maior que zero");
        }
        if (shippingCost.getAmount().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new BusinessException("Custo de frete não pode ser negativo");
        }
        if (total.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Total do pedido deve ser maior que zero");
        }
    }

    private static void validateCustomerData(String customerName, String customerEmail, String customerPhone) {
        if (customerName == null || customerName.isBlank()) {
            throw new BusinessException("Nome do cliente é obrigatório");
        }
        if (customerEmail == null || customerEmail.isBlank()) {
            throw new BusinessException("Email do cliente é obrigatório");
        }
        if (customerPhone == null || customerPhone.isBlank()) {
            throw new BusinessException("Telefone do cliente é obrigatório");
        }
        br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email.of(customerEmail);
    }

    private static String normalizeEmail(String email) {
        return br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email.of(email).getValue();
    }

    private static br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingAddress buildShippingAddress(
        String street, String number, String complement, String neighborhood, String city,
        String state, String postalCode
    ) {
        return br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingAddress.create(
            street, number, complement, neighborhood, city, state, postalCode
        );
    }
}
