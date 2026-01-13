package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.User;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.UserRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.UserMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Adapter que implementa UserRepository (dominio) usando JPA (infraestrutura).
 * Desacopla o dominio da implementacao de persistencia.
 * Converte entre User (domain) e UserEntity (JPA) via UserMapper.
 */
@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpaRepository;
    private final UserMapper mapper;

    @Override
    public User save(User user) {
        var entity = mapper.toEntity(user);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<User> findById(UserId id) {
        return jpaRepository.findById(id.getValue())
            .map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(Email email) {
        return jpaRepository.findByEmail(email.getValue())
            .map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(Email email) {
        return jpaRepository.existsByEmail(email.getValue());
    }
}

