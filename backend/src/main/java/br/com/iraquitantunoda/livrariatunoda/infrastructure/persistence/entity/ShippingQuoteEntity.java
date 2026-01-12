package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingQuoteStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_shipping_quotes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingQuoteEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "cart_id", nullable = false, length = 36)
    private String cartId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ShippingQuoteStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "selected_service_code", length = 50)
    private String selectedServiceCode;

    @OneToMany(mappedBy = "shippingQuote", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ShippingItemEntity> items = new ArrayList<>();

    @OneToMany(mappedBy = "shippingQuote", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ShippingOptionEntity> options = new ArrayList<>();
}

