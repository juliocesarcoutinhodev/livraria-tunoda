-- V14: Adicionar coluna stock à tabela tb_books
-- Descrição: Adiciona gestão de estoque aos livros com valor padrão de 0

ALTER TABLE tb_books
ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;

-- Comentário para documentação
COMMENT ON COLUMN tb_books.stock IS 'Quantidade disponível em estoque do livro';
