ALTER TABLE tb_orders
    ADD COLUMN shipping_street VARCHAR(150) NULL,
    ADD COLUMN shipping_number VARCHAR(30) NULL,
    ADD COLUMN shipping_complement VARCHAR(100) NULL,
    ADD COLUMN shipping_neighborhood VARCHAR(100) NULL,
    ADD COLUMN shipping_city VARCHAR(100) NULL,
    ADD COLUMN shipping_state VARCHAR(2) NULL,
    ADD COLUMN shipping_postal_code VARCHAR(20) NULL;

COMMENT ON COLUMN tb_orders.shipping_street IS 'Endereco - rua';
COMMENT ON COLUMN tb_orders.shipping_number IS 'Endereco - numero';
COMMENT ON COLUMN tb_orders.shipping_complement IS 'Endereco - complemento';
COMMENT ON COLUMN tb_orders.shipping_neighborhood IS 'Endereco - bairro';
COMMENT ON COLUMN tb_orders.shipping_city IS 'Endereco - cidade';
COMMENT ON COLUMN tb_orders.shipping_state IS 'Endereco - estado';
COMMENT ON COLUMN tb_orders.shipping_postal_code IS 'Endereco - cep';
