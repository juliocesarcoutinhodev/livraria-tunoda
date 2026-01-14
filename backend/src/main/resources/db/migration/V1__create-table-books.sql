-- Tabela de Autores
CREATE TABLE tb_authors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    biography TEXT NOT NULL,
    photo_url VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Livros
CREATE TABLE tb_books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    photo_url VARCHAR(500),
    isbn VARCHAR(20),
    price_amount DECIMAL(10, 2) NOT NULL,
    price_currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    weight_value DECIMAL(10, 3) NOT NULL,
    weight_unit VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uk_books_isbn UNIQUE (isbn)
);

-- Tabela de Relacionamento Book-Author
CREATE TABLE tb_book_authors (
    book_id VARCHAR(36) NOT NULL,
    author_id VARCHAR(36) NOT NULL,

    PRIMARY KEY (book_id, author_id),

    CONSTRAINT fk_book_authors_book
        FOREIGN KEY (book_id) REFERENCES tb_books(id) ON DELETE CASCADE,

    CONSTRAINT fk_book_authors_author
        FOREIGN KEY (author_id) REFERENCES tb_authors(id) ON DELETE CASCADE
);

-- Indices para performance
CREATE INDEX idx_books_status ON tb_books(status);
CREATE INDEX idx_authors_status ON tb_authors(status);
CREATE INDEX idx_book_authors_author ON tb_book_authors(author_id);

