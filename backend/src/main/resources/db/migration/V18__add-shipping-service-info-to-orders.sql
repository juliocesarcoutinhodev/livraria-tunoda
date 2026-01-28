ALTER TABLE tb_orders
    ADD COLUMN shipping_service_code VARCHAR(50) NULL,
    ADD COLUMN shipping_service_name VARCHAR(120) NULL,
    ADD COLUMN shipping_company VARCHAR(120) NULL,
    ADD COLUMN shipping_delivery_days INTEGER NULL;

COMMENT ON COLUMN tb_orders.shipping_service_code IS 'Servico de frete selecionado';
COMMENT ON COLUMN tb_orders.shipping_service_name IS 'Nome do servico de frete';
COMMENT ON COLUMN tb_orders.shipping_company IS 'Transportadora';
COMMENT ON COLUMN tb_orders.shipping_delivery_days IS 'Prazo de entrega em dias';
