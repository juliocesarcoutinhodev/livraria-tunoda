-- Migration V12: Cria tabela de refresh tokens
-- Armazena tokens de refresh para renovacao de access tokens

CREATE TABLE tb_refresh_tokens (
    id VARCHAR(36) PRIMARY KEY COMMENT 'Identificador unico do token',
    user_id VARCHAR(36) NOT NULL COMMENT 'Usuario dono do token',
    token VARCHAR(36) NOT NULL COMMENT 'Token UUID aleatorio',
    created_at TIMESTAMP NOT NULL COMMENT 'Data de criacao',
    expires_at TIMESTAMP NOT NULL COMMENT 'Data de expiracao',
    revoked BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Se o token foi revogado',

    CONSTRAINT uk_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE
) COMMENT 'Tokens de refresh para renovacao de autenticacao';

-- Indices para performance
CREATE INDEX idx_refresh_tokens_user_id ON tb_refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON tb_refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON tb_refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON tb_refresh_tokens(revoked);

