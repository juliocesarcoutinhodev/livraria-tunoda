CREATE TABLE tb_orders (
    id VARCHAR(36) PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    subtotal_amount DECIMAL(10,2) NOT NULL,
    subtotal_currency VARCHAR(3) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    total_currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    INDEX idx_orders_cart_id (cart_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
);

CREATE TABLE tb_order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INT NOT NULL,
    unit_price_amount DECIMAL(10,2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES tb_orders(id) ON DELETE CASCADE,
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_book_id (book_id)
);

