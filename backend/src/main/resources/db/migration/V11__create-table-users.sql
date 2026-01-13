-- Migration V11: Cria tabela de usuarios administrativos
-- Armazena usuarios do sistema com autenticacao via email/senha

CREATE TABLE tb_users (
    id VARCHAR(36) PRIMARY KEY COMMENT 'Identificador unico do usuario',
    name VARCHAR(200) NOT NULL COMMENT 'Nome completo do usuario',
    email VARCHAR(255) NOT NULL COMMENT 'Email unico para autenticacao',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Senha armazenada como hash BCrypt',
    role VARCHAR(20) NOT NULL COMMENT 'Papel do usuario (ADMIN)',
    status VARCHAR(20) NOT NULL COMMENT 'Status do usuario (ACTIVE, BLOCKED)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do usuario',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de ultima atualizacao',

    CONSTRAINT uk_users_email UNIQUE (email)
) COMMENT 'Usuarios administrativos do sistema';

-- Indices para performance
CREATE INDEX idx_users_email ON tb_users(email);
CREATE INDEX idx_users_status ON tb_users(status);
CREATE INDEX idx_users_role ON tb_users(role);

