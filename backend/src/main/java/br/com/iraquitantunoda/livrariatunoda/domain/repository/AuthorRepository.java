package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AuthorRepository {

    Author save(Author author);

    Optional<Author> findById(AuthorId id);

    List<Author> findByIds(Set<AuthorId> ids);

    List<Author> findAllActive();

    boolean existsById(AuthorId id);

    PageResult<Author> findAllWithPagination(int page, int size);

    PageResult<Author> findByStatusWithPagination(Status status, int page, int size);

    PageResult<Author> findWithFilters(int page, int size, Status status, String name, String sortBy, String sortDirection);

    interface PageResult<T> {
        List<T> content();
        int page();
        int size();
        long totalElements();
    }
}

