ALTER TABLE tb_orders
    ADD COLUMN customer_name VARCHAR(120) NULL,
    ADD COLUMN customer_email VARCHAR(255) NULL,
    ADD COLUMN customer_phone VARCHAR(30) NULL;

COMMENT ON COLUMN tb_orders.customer_name IS 'Nome do cliente';
COMMENT ON COLUMN tb_orders.customer_email IS 'Email do cliente';
COMMENT ON COLUMN tb_orders.customer_phone IS 'Telefone do cliente';
