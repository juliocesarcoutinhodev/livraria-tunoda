-- Migration V12: Cria tabela de refresh tokens
-- Armazena tokens de refresh para renovacao de access tokens

CREATE TABLE tb_refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uk_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE
);

-- Indices para performance
CREATE INDEX idx_refresh_tokens_user_id ON tb_refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON tb_refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON tb_refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON tb_refresh_tokens(revoked);

-- Comentarios nas colunas (sintaxe PostgreSQL)
COMMENT ON TABLE tb_refresh_tokens IS 'Tokens de refresh para renovacao de autenticacao';
COMMENT ON COLUMN tb_refresh_tokens.id IS 'Identificador unico do token';
COMMENT ON COLUMN tb_refresh_tokens.user_id IS 'Usuario dono do token';
COMMENT ON COLUMN tb_refresh_tokens.token IS 'Token UUID aleatorio';
COMMENT ON COLUMN tb_refresh_tokens.created_at IS 'Data de criacao';
COMMENT ON COLUMN tb_refresh_tokens.expires_at IS 'Data de expiracao';
COMMENT ON COLUMN tb_refresh_tokens.revoked IS 'Se o token foi revogado';
