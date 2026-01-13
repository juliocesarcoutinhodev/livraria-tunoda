package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Aggregate Root que representa um refresh token no sistema.
 * Usado para renovar access tokens sem precisar de login novamente.
 *
 * Regras de negocio:
 * - Token aleatorio e seguro (UUID)
 * - Associado a um usuario especifico
 * - Tem tempo de expiracao
 * - Pode ser revogado manualmente
 * - Imutavel apos criacao
 */
@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RefreshToken {

    @EqualsAndHashCode.Include
    private final RefreshTokenId id;
    private final UserId userId;
    private final String token;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private boolean revoked;

    private RefreshToken(RefreshTokenId id, UserId userId, String token,
                        LocalDateTime createdAt, LocalDateTime expiresAt, boolean revoked) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
    }

    /**
     * Cria um novo refresh token.
     *
     * @param userId Usuario dono do token
     * @param expirationDays Dias ate expirar
     * @return RefreshToken criado
     */
    public static RefreshToken create(UserId userId, int expirationDays) {
        validate(userId, expirationDays);

        var now = LocalDateTime.now();
        var token = UUID.randomUUID().toString();

        return new RefreshToken(
            RefreshTokenId.generate(),
            userId,
            token,
            now,
            now.plusDays(expirationDays),
            false
        );
    }

    /**
     * Reconstitui um refresh token existente.
     */
    public static RefreshToken reconstitute(RefreshTokenId id, UserId userId, String token,
                                           LocalDateTime createdAt, LocalDateTime expiresAt,
                                           boolean revoked) {
        validate(userId, 1); // Valida apenas userId

        if (token == null || token.isBlank()) {
            throw new BusinessException("Token nao pode ser nulo ou vazio");
        }

        return new RefreshToken(id, userId, token, createdAt, expiresAt, revoked);
    }

    private static void validate(UserId userId, int expirationDays) {
        if (userId == null) {
            throw new BusinessException("UserId e obrigatorio");
        }
        if (expirationDays <= 0) {
            throw new BusinessException("Dias de expiracao devem ser positivos");
        }
    }

    /**
     * Revoga o token, tornando-o invalido.
     */
    public void revoke() {
        if (this.revoked) {
            throw new BusinessException("Token ja esta revogado");
        }
        this.revoked = true;
    }

    /**
     * Verifica se o token esta expirado.
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Verifica se o token esta valido (nao revogado e nao expirado).
     */
    public boolean isValid() {
        return !revoked && !isExpired();
    }
}

