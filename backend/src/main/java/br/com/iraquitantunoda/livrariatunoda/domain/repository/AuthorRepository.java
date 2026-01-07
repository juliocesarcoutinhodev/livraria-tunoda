package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AuthorRepository {

    Author save(Author author);

    Optional<Author> findById(AuthorId id);

    List<Author> findByIds(Set<AuthorId> ids);

    List<Author> findAllActive();

    boolean existsById(AuthorId id);
}

