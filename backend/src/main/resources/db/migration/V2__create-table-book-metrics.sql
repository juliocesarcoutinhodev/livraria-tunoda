-- Tabela de Métricas de Livros
CREATE TABLE tb_book_metrics (
    id VARCHAR(36) PRIMARY KEY,
    book_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    occurred_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_book_metrics_book_id ON tb_book_metrics(book_id);
CREATE INDEX idx_book_metrics_event_type ON tb_book_metrics(event_type);
CREATE INDEX idx_book_metrics_occurred_at ON tb_book_metrics(occurred_at);
