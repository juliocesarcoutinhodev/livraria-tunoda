package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.Objects;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Author {

    @EqualsAndHashCode.Include
    private final AuthorId id;
    private final String name;
    private final String biography;
    private final String photoUrl;
    private Status status;

    private Author(AuthorId id, String name, String biography, String photoUrl, Status status) {
        this.id = id;
        this.name = name;
        this.biography = biography;
        this.photoUrl = photoUrl;
        this.status = status;
    }

    public static Author create(String name, String biography, String photoUrl) {
        validate(name, biography);
        return new Author(
            AuthorId.generate(),
            name,
            biography,
            photoUrl,
            Status.ACTIVE
        );
    }

    public static Author reconstitute(AuthorId id, String name, String biography, String photoUrl, Status status) {
        validate(name, biography);
        return new Author(id, name, biography, photoUrl, status);
    }

    private static void validate(String name, String biography) {
        if (name == null || name.isBlank()) {
            throw new BusinessException("O nome do autor é obrigatório");
        }
        if (name.length() > 200) {
            throw new BusinessException("O nome do autor não pode exceder 200 caracteres");
        }
        if (biography == null || biography.isBlank()) {
            throw new BusinessException("A biografia do autor é obrigatória");
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