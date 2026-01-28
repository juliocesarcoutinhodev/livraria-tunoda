package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "cart_id", nullable = false, length = 36)
    private String cartId;

    @Column(name = "shipping_quote_id", length = 36)
    private String shippingQuoteId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(name = "subtotal_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotalAmount;

    @Column(name = "subtotal_currency", nullable = false, length = 3)
    private String subtotalCurrency;

    @Column(name = "shipping_cost_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingCostAmount;

    @Column(name = "shipping_cost_currency", nullable = false, length = 3)
    private String shippingCostCurrency;

    @Column(name = "shipping_service_code", length = 50)
    private String shippingServiceCode;

    @Column(name = "shipping_service_name", length = 120)
    private String shippingServiceName;

    @Column(name = "shipping_company", length = 120)
    private String shippingCompany;

    @Column(name = "shipping_delivery_days")
    private Integer shippingDeliveryDays;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "total_currency", nullable = false, length = 3)
    private String totalCurrency;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "processing_at")
    private LocalDateTime processingAt;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "customer_name", length = 120)
    private String customerName;

    @Column(name = "customer_email", length = 255)
    private String customerEmail;

    @Column(name = "customer_phone", length = 30)
    private String customerPhone;

    @Column(name = "shipping_street", length = 150)
    private String shippingStreet;

    @Column(name = "shipping_number", length = 30)
    private String shippingNumber;

    @Column(name = "shipping_complement", length = 100)
    private String shippingComplement;

    @Column(name = "shipping_neighborhood", length = 100)
    private String shippingNeighborhood;

    @Column(name = "shipping_city", length = 100)
    private String shippingCity;

    @Column(name = "shipping_state", length = 2)
    private String shippingState;

    @Column(name = "shipping_postal_code", length = 20)
    private String shippingPostalCode;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItemEntity> items = new ArrayList<>();
}
