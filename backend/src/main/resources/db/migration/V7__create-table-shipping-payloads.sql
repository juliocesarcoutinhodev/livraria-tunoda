CREATE TABLE tb_shipping_payloads (
    id VARCHAR(36) PRIMARY KEY,
    shipping_quote_id VARCHAR(36) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    raw_payload JSON NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE,
    INDEX idx_shipping_payloads_quote_id (shipping_quote_id),
    INDEX idx_shipping_payloads_provider (provider),
    INDEX idx_shipping_payloads_created_at (created_at)
);

