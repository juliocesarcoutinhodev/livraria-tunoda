package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.AuthorMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.AuthorJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuthorRepositoryAdapter implements AuthorRepository {

    private final AuthorJpaRepository jpaRepository;
    private final AuthorMapper mapper;

    @Override
    public Author save(Author author) {
        var entity = mapper.toEntity(author);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Author> findById(AuthorId id) {
        return jpaRepository.findById(id.getValue())
            .map(mapper::toDomain);
    }

    @Override
    public List<Author> findByIds(Set<AuthorId> ids) {
        var stringIds = ids.stream()
            .map(AuthorId::getValue)
            .collect(Collectors.toSet());

        return jpaRepository.findAllById(stringIds)
            .stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public List<Author> findAllActive() {
        return jpaRepository.findByStatus(Status.ACTIVE)
            .stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public boolean existsById(AuthorId id) {
        return jpaRepository.existsById(id.getValue());
    }
}

