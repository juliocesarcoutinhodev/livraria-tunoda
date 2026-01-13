package br.com.iraquitantunoda.livrariatunoda.application.dto;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.UserRole;

/**
 * Response com dados do usuario autenticado.
 * Dados extraidos exclusivamente do token JWT.
 * Nao expoe informacoes sensíveis (senha, timestamps, etc).
 */
public record CurrentUserResponse(
    String id,
    String email,
    UserRole role
) {
    public static CurrentUserResponse of(String id, String email, UserRole role) {
        return new CurrentUserResponse(id, email, role);
    }
}

