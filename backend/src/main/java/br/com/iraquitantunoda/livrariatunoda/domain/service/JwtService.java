package br.com.iraquitantunoda.livrariatunoda.domain.service;

import br.com.iraquitantunoda.livrariatunoda.domain.model.User;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.UserRole;

/**
 * Service de dominio para geracao e validacao de JWT tokens.
 * Interface no dominio, implementacao na infraestrutura.
 */
public interface JwtService {

    /**
     * Gera um access token JWT para o usuario.
     *
     * @param user Usuario autenticado
     * @return Token JWT
     */
    String generateAccessToken(User user);

    /**
     * Extrai o userId do token JWT.
     *
     * @param token Token JWT
     * @return UserId extraido
     */
    UserId extractUserId(String token);

    /**
     * Extrai o role do token JWT.
     *
     * @param token Token JWT
     * @return UserRole extraido
     */
    UserRole extractRole(String token);

    /**
     * Valida se o token JWT e valido.
     *
     * @param token Token JWT
     * @return true se valido
     */
    boolean validateToken(String token);

    /**
     * Verifica se o token esta expirado.
     *
     * @param token Token JWT
     * @return true se expirado
     */
    boolean isTokenExpired(String token);
}

