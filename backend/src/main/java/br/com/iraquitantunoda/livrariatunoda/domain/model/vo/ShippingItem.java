package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@EqualsAndHashCode
public class ShippingItem {

    private final BookId bookId;
    private final String bookTitle;
    private final int quantity;
    private final Weight weight;

    private ShippingItem(BookId bookId, String bookTitle, int quantity, Weight weight) {
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.quantity = quantity;
        this.weight = weight;
    }

    public static ShippingItem create(BookId bookId, String bookTitle, int quantity, Weight weight) {
        validate(bookId, bookTitle, quantity, weight);
        return new ShippingItem(bookId, bookTitle, quantity, weight);
    }

    private static void validate(BookId bookId, String bookTitle, int quantity, Weight weight) {
        if (bookId == null) {
            throw new BusinessException("BookId é obrigatório para item de frete");
        }
        if (bookTitle == null || bookTitle.isBlank()) {
            throw new BusinessException("Título do livro é obrigatório para item de frete");
        }
        if (quantity <= 0) {
            throw new BusinessException("Quantidade deve ser maior que zero");
        }
        if (weight == null) {
            throw new BusinessException("Peso é obrigatório para item de frete");
        }
    }

    public Weight getTotalWeight() {
        var totalValue = weight.getValue().multiply(java.math.BigDecimal.valueOf(quantity));
        return Weight.of(totalValue, weight.getUnit());
    }
}

