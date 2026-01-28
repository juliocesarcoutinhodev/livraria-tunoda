ALTER TABLE tb_orders
    ADD COLUMN paid_at TIMESTAMP NULL,
    ADD COLUMN processing_at TIMESTAMP NULL,
    ADD COLUMN shipped_at TIMESTAMP NULL,
    ADD COLUMN delivered_at TIMESTAMP NULL,
    ADD COLUMN cancelled_at TIMESTAMP NULL,
    ADD COLUMN expired_at TIMESTAMP NULL;

COMMENT ON COLUMN tb_orders.paid_at IS 'Data/hora de confirmacao do pagamento';
COMMENT ON COLUMN tb_orders.processing_at IS 'Data/hora de inicio do processamento';
COMMENT ON COLUMN tb_orders.shipped_at IS 'Data/hora de envio';
COMMENT ON COLUMN tb_orders.delivered_at IS 'Data/hora de entrega';
COMMENT ON COLUMN tb_orders.cancelled_at IS 'Data/hora de cancelamento';
COMMENT ON COLUMN tb_orders.expired_at IS 'Data/hora de expiracao';
