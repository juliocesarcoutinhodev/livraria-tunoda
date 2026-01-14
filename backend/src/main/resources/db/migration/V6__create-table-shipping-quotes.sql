CREATE TABLE tb_shipping_quotes (
    id VARCHAR(36) PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    selected_service_code VARCHAR(50)
);

CREATE INDEX idx_shipping_quotes_cart_id ON tb_shipping_quotes(cart_id);
CREATE INDEX idx_shipping_quotes_status ON tb_shipping_quotes(status);
CREATE INDEX idx_shipping_quotes_created_at ON tb_shipping_quotes(created_at);

CREATE TABLE tb_shipping_items (
    id VARCHAR(36) PRIMARY KEY,
    shipping_quote_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INT NOT NULL,
    weight_value DECIMAL(10,3) NOT NULL,
    weight_unit VARCHAR(20) NOT NULL,
    unit_price_amount DECIMAL(10,2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL,
    FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE
);

CREATE INDEX idx_shipping_items_quote_id ON tb_shipping_items(shipping_quote_id);
CREATE INDEX idx_shipping_items_book_id ON tb_shipping_items(book_id);

CREATE TABLE tb_shipping_options (
    id VARCHAR(36) PRIMARY KEY,
    shipping_quote_id VARCHAR(36) NOT NULL,
    service_code VARCHAR(50) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    price_amount DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(3) NOT NULL,
    delivery_days INT NOT NULL,
    company VARCHAR(100) NOT NULL,
    external_reference VARCHAR(100) NOT NULL,
    FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE
);

CREATE INDEX idx_shipping_options_quote_id ON tb_shipping_options(shipping_quote_id);
CREATE INDEX idx_shipping_options_service_code ON tb_shipping_options(service_code);
