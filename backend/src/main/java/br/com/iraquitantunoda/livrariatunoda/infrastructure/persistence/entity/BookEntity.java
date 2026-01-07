package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.WeightUnit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tb_books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(length = 20)
    private String isbn;

    @Column(name = "price_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAmount;

    @Column(name = "price_currency", nullable = false, length = 3)
    private String priceCurrency;

    @Column(name = "weight_value", nullable = false, precision = 10, scale = 3)
    private BigDecimal weightValue;

    @Column(name = "weight_unit", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private WeightUnit weightUnit;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Status status;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "tb_book_authors",
        joinColumns = @JoinColumn(name = "book_id")
    )
    @Column(name = "author_id", length = 36)
    private Set<String> authorIds = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

