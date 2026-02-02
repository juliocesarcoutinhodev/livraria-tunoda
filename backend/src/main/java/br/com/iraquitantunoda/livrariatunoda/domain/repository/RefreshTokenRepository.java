package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshToken;
import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshTokenId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;

import java.util.List;
import java.util.Optional;

/**
 * Repository para agregado RefreshToken.
 */
public interface RefreshTokenRepository {

    /**
     * Salva um refresh token.
     */
    RefreshToken save(RefreshToken token);

    /**
     * Busca refresh token por ID.
     */
    Optional<RefreshToken> findById(RefreshTokenId id);

    /**
     * Busca refresh token pelo token string.
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Busca refresh token pelo hash do token.
     */
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /**
     * Busca todos os tokens validos de um usuario.
     */
    List<RefreshToken> findValidTokensByUserId(UserId userId);

    /**
     * Revoga todos os tokens de um usuario.
     */
    void revokeAllUserTokens(UserId userId);

    /**
     * Remove tokens expirados (limpeza periodica).
     */
    void deleteExpiredTokens();
}

