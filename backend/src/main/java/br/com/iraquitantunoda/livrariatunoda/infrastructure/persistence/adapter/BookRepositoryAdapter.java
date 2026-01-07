package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.BookMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.BookJpaRepository;
import lombok.RequiredArgsConstructor;
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
    public boolean existsById(BookId id) {
        return jpaRepository.existsById(id.getValue());
    }
}

