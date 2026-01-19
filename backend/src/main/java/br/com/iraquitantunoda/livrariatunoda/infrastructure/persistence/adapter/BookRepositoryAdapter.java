package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.BookMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.BookJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BookRepositoryAdapter implements BookRepository {

    private final BookJpaRepository jpaRepository;
    private final BookMapper mapper;

    @Override
    public Book save(Book book) {
        var entity = mapper.toEntity(book);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Book> findById(BookId id) {
        return jpaRepository.findById(id.getValue())
            .map(mapper::toDomain);
    }

    @Override
    public List<Book> findAllActive() {
        return jpaRepository.findByStatus(Status.ACTIVE)
            .stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public PageResult<Book> findAllActiveWithPagination(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var pageResult = jpaRepository.findByStatus(Status.ACTIVE, pageable);

        var books = pageResult.getContent()
            .stream()
            .map(mapper::toDomain)
            .toList();

        return new PageResultImpl<>(
            books,
            pageResult.getNumber(),
            pageResult.getSize(),
            pageResult.getTotalElements()
        );
    }

    @Override
    public PageResult<Book> findAllActiveWithFilters(int page, int size, String title, String sortBy, String sortDirection) {
        var sort = createSort(sortBy != null ? sortBy : "createdAt", sortDirection != null ? sortDirection : "desc");
        var pageable = PageRequest.of(page, size, sort);
        var pageResult = jpaRepository.findAllActiveWithFilters(title, pageable);

        var books = pageResult.getContent()
            .stream()
            .map(mapper::toDomain)
            .toList();

        return new PageResultImpl<>(
            books,
            pageResult.getNumber(),
            pageResult.getSize(),
            pageResult.getTotalElements()
        );
    }

    @Override
    public PageResult<Book> findAllWithFilters(int page, int size, br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status status, String authorId, Boolean lowStock, String title, String sortBy, String sortDirection) {
        var sort = createSort(sortBy != null ? sortBy : "createdAt", sortDirection != null ? sortDirection : "desc");
        var pageable = PageRequest.of(page, size, sort);

        var pageResult = jpaRepository.findAllWithFilters(status, authorId, lowStock, title, pageable);

        var books = pageResult.getContent()
            .stream()
            .map(mapper::toDomain)
            .toList();

        return new PageResultImpl<>(
            books,
            pageResult.getNumber(),
            pageResult.getSize(),
            pageResult.getTotalElements()
        );
    }

    @Override
    public boolean existsById(BookId id) {
        return jpaRepository.existsById(id.getValue());
    }

    @Override
    public long countActiveBooksByAuthorId(AuthorId authorId) {
        return jpaRepository.countByAuthorIdsContainingAndStatus(
            authorId.getValue(),
            Status.ACTIVE
        );
    }

    private Sort createSort(String sortBy, String sortDirection) {
        var direction = "desc".equalsIgnoreCase(sortDirection)
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
        return Sort.by(direction, sortBy);
    }

    private record PageResultImpl<T>(
        List<T> content,
        int page,
        int size,
        long totalElements
    ) implements PageResult<T> {}
}

