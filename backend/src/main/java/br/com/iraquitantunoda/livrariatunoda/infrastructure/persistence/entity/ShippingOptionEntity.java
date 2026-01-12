package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "tb_shipping_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingOptionEntity {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_quote_id", nullable = false)
    private ShippingQuoteEntity shippingQuote;

    @Column(name = "service_code", nullable = false, length = 50)
    private String serviceCode;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;

    @Column(name = "price_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAmount;

    @Column(name = "price_currency", nullable = false, length = 3)
    private String priceCurrency;

    @Column(name = "delivery_days", nullable = false)
    private Integer deliveryDays;

    @Column(nullable = false, length = 100)
    private String company;

    @Column(name = "external_reference", nullable = false, length = 100)
    private String externalReference;

    @PrePersist
    private void generateId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }
}

