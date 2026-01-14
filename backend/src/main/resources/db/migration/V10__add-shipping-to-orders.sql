-- Migration V10: Adiciona suporte a frete nos pedidos
-- Adiciona shipping_quote_id e shipping_cost separado do subtotal

ALTER TABLE tb_orders
    ADD COLUMN shipping_quote_id VARCHAR(36) NULL,
    ADD COLUMN shipping_cost_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN shipping_cost_currency VARCHAR(3) NOT NULL DEFAULT 'BRL';

-- Indice para buscar pedidos por cotação de frete
CREATE INDEX idx_orders_shipping_quote_id ON tb_orders(shipping_quote_id);

-- Comentarios nas colunas (sintaxe PostgreSQL)
COMMENT ON COLUMN tb_orders.shipping_quote_id IS 'ID da cotação de frete selecionada';
COMMENT ON COLUMN tb_orders.shipping_cost_amount IS 'Valor do frete';
COMMENT ON COLUMN tb_orders.shipping_cost_currency IS 'Moeda do frete';
COMMENT ON COLUMN tb_orders.subtotal_amount IS 'Subtotal dos produtos (sem frete)';
COMMENT ON COLUMN tb_orders.total_amount IS 'Total do pedido (subtotal + frete)';
