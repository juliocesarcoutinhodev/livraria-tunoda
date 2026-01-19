package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;

import java.util.List;
import java.util.Optional;

public interface BookRepository {

    Book save(Book book);

    Optional<Book> findById(BookId id);

    List<Book> findAllActive();

    PageResult<Book> findAllActiveWithPagination(int page, int size);

    PageResult<Book> findAllActiveWithFilters(int page, int size, String title, String sortBy, String sortDirection);

    PageResult<Book> findAllWithFilters(int page, int size, Status status, String authorId, Boolean lowStock, String title, String sortBy, String sortDirection);

    boolean existsById(BookId id);

    long countActiveBooksByAuthorId(AuthorId authorId);

    interface PageResult<T> {
        List<T> content();
        int page();
        int size();
        long totalElements();
    }
}

