CREATE TABLE tb_orders (
    id VARCHAR(36) PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    subtotal_amount DECIMAL(10,2) NOT NULL,
    subtotal_currency VARCHAR(3) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    total_currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_orders_cart_id ON tb_orders(cart_id);
CREATE INDEX idx_orders_status ON tb_orders(status);
CREATE INDEX idx_orders_created_at ON tb_orders(created_at);

CREATE TABLE tb_order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INT NOT NULL,
    unit_price_amount DECIMAL(10,2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES tb_orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_order_items_order_id ON tb_order_items(order_id);
CREATE INDEX idx_order_items_book_id ON tb_order_items(book_id);
