package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;

import java.util.List;
import java.util.Optional;

public interface BookRepository {

    Book save(Book book);

    Optional<Book> findById(BookId id);

    List<Book> findAllActive();

    PageResult<Book> findAllActiveWithPagination(int page, int size);

    boolean existsById(BookId id);

    long countActiveBooksByAuthorId(AuthorId authorId);

    interface PageResult<T> {
        List<T> content();
        int page();
        int size();
        long totalElements();
    }
}

