-- Migration V22: Adiciona suporte a hash de tokens
-- Altera estrutura para armazenar hash SHA-256 ao inves de token em texto puro

-- Adiciona coluna token_hash
ALTER TABLE tb_refresh_tokens ADD COLUMN token_hash VARCHAR(64);

-- Migra dados existentes: copia token para token_hash temporariamente
-- Nota: Em producao, todos os tokens existentes devem ser revogados
UPDATE tb_refresh_tokens SET token_hash = token WHERE token_hash IS NULL;

-- Remove constraint de unicidade do token
ALTER TABLE tb_refresh_tokens DROP CONSTRAINT uk_refresh_tokens_token;

-- Adiciona constraint de unicidade no hash
ALTER TABLE tb_refresh_tokens ADD CONSTRAINT uk_refresh_tokens_token_hash UNIQUE (token_hash);

-- Adiciona indice no hash para performance
CREATE INDEX idx_refresh_tokens_token_hash ON tb_refresh_tokens(token_hash);

-- Remove indice antigo do token
DROP INDEX IF EXISTS idx_refresh_tokens_token;

-- Torna token_hash obrigatorio
ALTER TABLE tb_refresh_tokens ALTER COLUMN token_hash SET NOT NULL;

-- Comentarios
COMMENT ON COLUMN tb_refresh_tokens.token_hash IS 'Hash SHA-256 do token para armazenamento seguro';
