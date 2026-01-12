package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Cart {

    @EqualsAndHashCode.Include
    private final CartId id;
    private final List<CartItem> items;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CartStatus status;

    private Cart(CartId id, List<CartItem> items, LocalDateTime createdAt, LocalDateTime updatedAt, CartStatus status) {
        this.id = id;
        this.items = new ArrayList<>(items);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
    }

    public static Cart create() {
        var now = LocalDateTime.now();
        return new Cart(
            CartId.generate(),
            new ArrayList<>(),
            now,
            now,
            CartStatus.ACTIVE
        );
    }

    public static Cart reconstitute(CartId id, List<CartItem> items, LocalDateTime createdAt, LocalDateTime updatedAt, CartStatus status) {
        return new Cart(id, items, createdAt, updatedAt, status);
    }

    public List<CartItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public void addItem(CartItem item) {
        ensureCanBeModified();

        if (item == null) {
            throw new BusinessException("O item não pode ser nulo");
        }

        var existingItem = findItemByBookId(item.getBookId());
        if (existingItem != null) {
            existingItem.incrementQuantity(item.getQuantity());
        } else {
            items.add(item);
        }

        this.updatedAt = LocalDateTime.now();
    }

    public void updateItem(BookId bookId, int quantity) {
        ensureCanBeModified();

        if (bookId == null) {
            throw new BusinessException("O identificador do livro é obrigatório");
        }

        var existingItem = findItemByBookId(bookId);
        if (existingItem == null) {
            throw new BusinessException("Item não encontrado no carrinho");
        }

        existingItem.updateQuantity(quantity);
        this.updatedAt = LocalDateTime.now();
    }

    public void removeItem(BookId bookId) {
        ensureCanBeModified();

        if (bookId == null) {
            throw new BusinessException("O identificador do livro é obrigatório");
        }

        var existingItem = findItemByBookId(bookId);
        if (existingItem == null) {
            throw new BusinessException("Item não encontrado no carrinho");
        }

        items.remove(existingItem);
        this.updatedAt = LocalDateTime.now();
    }

    public Money calculateSubtotal() {
        if (items.isEmpty()) {
            return Money.brl(BigDecimal.ZERO);
        }

        var currency = items.get(0).getUnitPrice().getCurrency();
        var total = items.stream()
            .map(CartItem::getSubtotal)
            .map(Money::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Money.of(total, currency);
    }

    public Money calculateTotal() {
        // Por enquanto, total é igual ao subtotal
        // No futuro, aqui podem ser aplicados descontos, cupons, etc.
        return calculateSubtotal();
    }

    public boolean isValid() {
        return !items.isEmpty() && status == CartStatus.ACTIVE;
    }

    public void validateForCheckout(java.util.Set<BookId> activeBookIds) {
        if (status != CartStatus.ACTIVE) {
            throw new BusinessException("Carrinho não está ativo");
        }

        if (items.isEmpty()) {
            throw new BusinessException("Carrinho não possui itens");
        }

        var total = calculateTotal();
        if (total.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Total do carrinho deve ser maior que zero");
        }

        var inactiveBooks = items.stream()
            .map(CartItem::getBookId)
            .filter(bookId -> !activeBookIds.contains(bookId))
            .toList();

        if (!inactiveBooks.isEmpty()) {
            throw new BusinessException("Um ou mais livros do carrinho não estão mais disponíveis");
        }
    }

    public void markAsExpired() {
        if (status == CartStatus.CONVERTED) {
            throw new BusinessException("Carrinho já foi convertido em pedido");
        }
        this.status = CartStatus.EXPIRED;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsConverted() {
        if (status == CartStatus.EXPIRED) {
            throw new BusinessException("Carrinho expirado não pode ser convertido");
        }
        if (status == CartStatus.CONVERTED) {
            throw new BusinessException("Carrinho já foi convertido em pedido");
        }
        if (items.isEmpty()) {
            throw new BusinessException("Carrinho vazio não pode ser convertido");
        }
        this.status = CartStatus.CONVERTED;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return this.status == CartStatus.ACTIVE;
    }

    public boolean isExpired() {
        return this.status == CartStatus.EXPIRED;
    }

    public boolean isConverted() {
        return this.status == CartStatus.CONVERTED;
    }

    private void ensureCanBeModified() {
        if (status != CartStatus.ACTIVE) {
            throw new BusinessException("Carrinho não pode ser modificado no status " + status);
        }
    }

    private CartItem findItemByBookId(BookId bookId) {
        return items.stream()
            .filter(item -> item.isForBook(bookId))
            .findFirst()
            .orElse(null);
    }
}

