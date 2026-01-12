package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import lombok.Value;

import java.math.BigDecimal;

@Value
public class CartItem {
    BookId bookId;
    int quantity;
    Money unitPrice;

    public static CartItem of(BookId bookId, int quantity, Money unitPrice) {
        if (bookId == null) {
            throw new BusinessException("O livro é obrigatório para o item do carrinho");
        }
        if (quantity <= 0) {
            throw new BusinessException("A quantidade deve ser maior que zero");
        }
        if (unitPrice == null) {
            throw new BusinessException("O preço unitário é obrigatório");
        }
        return new CartItem(bookId, quantity, unitPrice);
    }

    public Money getSubtotal() {
        var subtotalAmount = unitPrice.getAmount().multiply(BigDecimal.valueOf(quantity));
        return Money.of(subtotalAmount, unitPrice.getCurrency());
    }
}

