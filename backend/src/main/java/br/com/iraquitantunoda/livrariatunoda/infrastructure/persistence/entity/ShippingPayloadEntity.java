package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingProvider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_shipping_payloads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingPayloadEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "shipping_quote_id", nullable = false, length = 36)
    private String shippingQuoteId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ShippingProvider provider;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "raw_payload", nullable = false, columnDefinition = "JSONB")
    private String rawPayload;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}

