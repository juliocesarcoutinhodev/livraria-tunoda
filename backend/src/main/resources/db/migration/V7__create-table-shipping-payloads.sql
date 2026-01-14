CREATE TABLE tb_shipping_payloads (
    id VARCHAR(36) PRIMARY KEY,
    shipping_quote_id VARCHAR(36) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    raw_payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE
);

CREATE INDEX idx_shipping_payloads_quote_id ON tb_shipping_payloads(shipping_quote_id);
CREATE INDEX idx_shipping_payloads_provider ON tb_shipping_payloads(provider);
CREATE INDEX idx_shipping_payloads_created_at ON tb_shipping_payloads(created_at);
