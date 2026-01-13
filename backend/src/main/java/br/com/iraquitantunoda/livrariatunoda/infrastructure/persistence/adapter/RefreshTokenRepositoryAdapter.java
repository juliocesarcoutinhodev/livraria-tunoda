package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshToken;
import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshTokenId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.RefreshTokenRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.RefreshTokenMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.RefreshTokenJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Adapter que implementa RefreshTokenRepository usando JPA.
 */
@Component
@RequiredArgsConstructor
public class RefreshTokenRepositoryAdapter implements RefreshTokenRepository {

    private final RefreshTokenJpaRepository jpaRepository;
    private final RefreshTokenMapper mapper;

    @Override
    public RefreshToken save(RefreshToken token) {
        var entity = mapper.toEntity(token);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<RefreshToken> findById(RefreshTokenId id) {
        return jpaRepository.findById(id.getValue())
            .map(mapper::toDomain);
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return jpaRepository.findByToken(token)
            .map(mapper::toDomain);
    }

    @Override
    public List<RefreshToken> findValidTokensByUserId(UserId userId) {
        return jpaRepository.findValidTokensByUserId(userId.getValue(), LocalDateTime.now())
            .stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public void revokeAllUserTokens(UserId userId) {
        jpaRepository.revokeAllUserTokens(userId.getValue());
    }

    @Override
    public void deleteExpiredTokens() {
        jpaRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}

