-- Tabela de Métricas de Livros
CREATE TABLE tb_book_metrics (
    id VARCHAR(36) PRIMARY KEY,
    book_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_book_metrics_book_id (book_id),
    INDEX idx_book_metrics_event_type (event_type),
    INDEX idx_book_metrics_occurred_at (occurred_at)
);

