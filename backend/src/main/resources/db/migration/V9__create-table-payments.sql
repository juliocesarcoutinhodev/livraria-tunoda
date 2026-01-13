CREATE TABLE tb_payments (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    gateway VARCHAR(20) NOT NULL,
    external_reference VARCHAR(100),
    rejection_reason VARCHAR(500),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES tb_orders(id) ON DELETE RESTRICT,
    CONSTRAINT ck_payments_amount CHECK (amount >= 0)
);

CREATE INDEX idx_payments_order_id ON tb_payments(order_id);
CREATE INDEX idx_payments_external_reference ON tb_payments(external_reference);

