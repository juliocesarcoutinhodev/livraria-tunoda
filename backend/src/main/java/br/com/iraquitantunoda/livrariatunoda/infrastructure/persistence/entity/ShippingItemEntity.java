package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.WeightUnit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "tb_shipping_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingItemEntity {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_quote_id", nullable = false)
    private ShippingQuoteEntity shippingQuote;

    @Column(name = "book_id", nullable = false, length = 36)
    private String bookId;

    @Column(name = "book_title", nullable = false, length = 300)
    private String bookTitle;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "weight_value", nullable = false, precision = 10, scale = 3)
    private BigDecimal weightValue;

    @Column(name = "weight_unit", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private WeightUnit weightUnit;

    @Column(name = "unit_price_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPriceAmount;

    @Column(name = "unit_price_currency", nullable = false, length = 3)
    private String unitPriceCurrency;
}

