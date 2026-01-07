package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ISBN;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Weight;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Getter
@ToString(exclude = {"price", "status"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Book {

    @EqualsAndHashCode.Include
    private final BookId id;
    private final String title;
    private final String description;
    private final ISBN isbn;
    private final Money price;
    private final Weight weight;

    @Getter(AccessLevel.NONE)
    private final Set<AuthorId> authorIds;
    private Status status;

    public Set<AuthorId> getAuthorIds() {
        return java.util.Collections.unmodifiableSet(authorIds);
    }

    private Book(BookId id, String title, String description, ISBN isbn, Money price, Weight weight, Set<AuthorId> authorIds, Status status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.isbn = isbn;
        this.price = price;
        this.weight = weight;
        this.authorIds = new HashSet<>(authorIds);
        this.status = status;
    }

    public static Book create(String title, String description, ISBN isbn, Money price, Weight weight, Set<AuthorId> authorIds) {
        validate(title, description, price, weight, authorIds);
        return new Book(
            BookId.generate(),
            title,
            description,
            isbn,
            price,
            weight,
            authorIds,
            Status.ACTIVE
        );
    }

    public static Book reconstitute(BookId id, String title, String description, ISBN isbn, Money price, Weight weight, Set<AuthorId> authorIds, Status status) {
        validate(title, description, price, weight, authorIds);
        return new Book(id, title, description, isbn, price, weight, authorIds, status);
    }

    private static void validate(String title, String description, Money price, Weight weight, Set<AuthorId> authorIds) {
        if (title == null || title.isBlank()) {
            throw new BusinessException("O título do livro é obrigatório");
        }
        if (title.length() > 300) {
            throw new BusinessException("O título não pode exceder 300 caracteres");
        }
        if (description == null || description.isBlank()) {
            throw new BusinessException("A descrição do livro é obrigatória");
        }
        if (price == null) {
            throw new BusinessException("O preço do livro é obrigatório");
        }
        if (weight == null) {
            throw new BusinessException("O peso do livro é obrigatório");
        }
        if (authorIds == null || authorIds.isEmpty()) {
            throw new BusinessException("O livro deve ter pelo menos um autor");
        }
    }

    public void activate() {
        this.status = Status.ACTIVE;
    }

    public void deactivate() {
        this.status = Status.INACTIVE;
    }

    public boolean isActive() {
        return this.status == Status.ACTIVE;
    }
}