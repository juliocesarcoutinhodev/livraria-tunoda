-- Migration V11: Cria tabela de usuarios administrativos
-- Armazena usuarios do sistema com autenticacao via email/senha

CREATE TABLE tb_users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT uk_users_email UNIQUE (email)
);

-- Indices para performance
CREATE INDEX idx_users_email ON tb_users(email);
CREATE INDEX idx_users_status ON tb_users(status);
CREATE INDEX idx_users_role ON tb_users(role);

-- Comentarios nas colunas (sintaxe PostgreSQL)
COMMENT ON TABLE tb_users IS 'Usuarios administrativos do sistema';
COMMENT ON COLUMN tb_users.id IS 'Identificador unico do usuario';
COMMENT ON COLUMN tb_users.name IS 'Nome completo do usuario';
COMMENT ON COLUMN tb_users.email IS 'Email unico para autenticacao';
COMMENT ON COLUMN tb_users.password_hash IS 'Senha armazenada como hash BCrypt';
COMMENT ON COLUMN tb_users.role IS 'Papel do usuario (ADMIN)';
COMMENT ON COLUMN tb_users.status IS 'Status do usuario (ACTIVE, BLOCKED)';
COMMENT ON COLUMN tb_users.created_at IS 'Data de criacao do usuario';
COMMENT ON COLUMN tb_users.updated_at IS 'Data de ultima atualizacao';
