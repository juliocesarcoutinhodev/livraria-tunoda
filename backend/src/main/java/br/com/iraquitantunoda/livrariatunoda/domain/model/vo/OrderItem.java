package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderItemId;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class OrderItem {

    @EqualsAndHashCode.Include
    private final OrderItemId id;
    private final BookId bookId;
    private final String bookTitle;
    private final int quantity;
    private final Money unitPrice;

    private OrderItem(OrderItemId id, BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public static OrderItem create(BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        validate(bookId, bookTitle, quantity, unitPrice);
        return new OrderItem(
                OrderItemId.generate(),
                bookId,
                bookTitle,
                quantity,
                unitPrice
        );
    }

    public static OrderItem reconstitute(OrderItemId id, BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        validate(bookId, bookTitle, quantity, unitPrice);
        return new OrderItem(id, bookId, bookTitle, quantity, unitPrice);
    }

    private static void validate(BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        if (bookId == null) {
            throw new BusinessException("O livro é obrigatório para o item do pedido");
        }
        if (bookTitle == null || bookTitle.isBlank()) {
            throw new BusinessException("O título do livro é obrigatório para o item do pedido");
        }
        if (quantity <= 0) {
            throw new BusinessException("A quantidade deve ser maior que zero");
        }
        if (unitPrice == null) {
            throw new BusinessException("O preço unitário é obrigatório");
        }
    }

    public Money getSubtotal() {
        var subtotalAmount = unitPrice.getAmount().multiply(BigDecimal.valueOf(quantity));
        return Money.of(subtotalAmount, unitPrice.getCurrency());
    }
}

