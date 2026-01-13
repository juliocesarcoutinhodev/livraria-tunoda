-- Adiciona coluna to_postal_code na tabela tb_shipping_quotes
ALTER TABLE tb_shipping_quotes
ADD COLUMN to_postal_code VARCHAR(9) NOT NULL DEFAULT '00000-000';

-- Remove o default após a criação (para novas inserções serem obrigatórias)
ALTER TABLE tb_shipping_quotes
ALTER COLUMN to_postal_code DROP DEFAULT;

