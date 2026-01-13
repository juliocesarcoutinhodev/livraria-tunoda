package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

/**
 * Status do usuario no sistema.
 * Controla se o usuario pode acessar o sistema.
 */
public enum UserStatus {
    /**
     * Usuario ativo, pode acessar o sistema normalmente.
     */
    ACTIVE,

    /**
     * Usuario bloqueado, acesso negado.
     * Pode ser desbloqueado por outro administrador.
     */
    BLOCKED
}

