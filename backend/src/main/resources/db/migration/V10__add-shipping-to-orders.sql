-- Migration V10: Adiciona suporte a frete nos pedidos
-- Adiciona shipping_quote_id e shipping_cost separado do subtotal

ALTER TABLE tb_orders
    ADD COLUMN shipping_quote_id VARCHAR(36) NULL COMMENT 'ID da cotação de frete selecionada',
    ADD COLUMN shipping_cost_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Valor do frete',
    ADD COLUMN shipping_cost_currency VARCHAR(3) NOT NULL DEFAULT 'BRL' COMMENT 'Moeda do frete';

-- Indice para buscar pedidos por cotação de frete
CREATE INDEX idx_orders_shipping_quote_id ON tb_orders(shipping_quote_id);

-- Comentario nas colunas existentes para clareza
ALTER TABLE tb_orders
    MODIFY COLUMN subtotal_amount DECIMAL(10, 2) NOT NULL COMMENT 'Subtotal dos produtos (sem frete)',
    MODIFY COLUMN total_amount DECIMAL(10, 2) NOT NULL COMMENT 'Total do pedido (subtotal + frete)';

