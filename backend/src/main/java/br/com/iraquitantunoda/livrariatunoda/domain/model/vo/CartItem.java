package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartItemId;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CartItem {

    @EqualsAndHashCode.Include
    private final CartItemId id;
    private final BookId bookId;
    private final String bookTitle;
    private final Money unitPrice;
    private int quantity;

    private CartItem(CartItemId id, BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public static CartItem create(BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        validate(bookId, bookTitle, quantity, unitPrice);
        return new CartItem(
            CartItemId.generate(),
            bookId,
            bookTitle,
            quantity,
            unitPrice
        );
    }

    public static CartItem reconstitute(CartItemId id, BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        validate(bookId, bookTitle, quantity, unitPrice);
        return new CartItem(id, bookId, bookTitle, quantity, unitPrice);
    }

    private static void validate(BookId bookId, String bookTitle, int quantity, Money unitPrice) {
        if (bookId == null) {
            throw new BusinessException("O livro é obrigatório para o item do carrinho");
        }
        if (bookTitle == null || bookTitle.isBlank()) {
            throw new BusinessException("O título do livro é obrigatório para o item do carrinho");
        }
        if (quantity <= 0) {
            throw new BusinessException("A quantidade deve ser maior que zero");
        }
        if (unitPrice == null) {
            throw new BusinessException("O preço unitário é obrigatório");
        }
    }

    public void updateQuantity(int newQuantity) {
        if (newQuantity <= 0) {
            throw new BusinessException("A quantidade deve ser maior que zero");
        }
        this.quantity = newQuantity;
    }

    public void incrementQuantity(int amount) {
        if (amount <= 0) {
            throw new BusinessException("O valor a incrementar deve ser maior que zero");
        }
        this.quantity += amount;
    }

    public Money getSubtotal() {
        var subtotalAmount = unitPrice.getAmount().multiply(BigDecimal.valueOf(quantity));
        return Money.of(subtotalAmount, unitPrice.getCurrency());
    }

    public boolean isForBook(BookId bookId) {
        return this.bookId.equals(bookId);
    }
}

