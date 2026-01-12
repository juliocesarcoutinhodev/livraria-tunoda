-- Criação da tabela de carrinhos
CREATE TABLE tb_carts (
    id VARCHAR(36) PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Criação da tabela de itens do carrinho
CREATE TABLE tb_cart_items (
    id VARCHAR(36) PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INT NOT NULL,
    unit_price_amount DECIMAL(10, 2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL,
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES tb_carts(id) ON DELETE CASCADE
);

-- Índice para melhorar consultas por cart_id
CREATE INDEX idx_cart_items_cart_id ON tb_cart_items(cart_id);

