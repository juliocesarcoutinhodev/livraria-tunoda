CREATE TABLE tb_livros
(
    id     BIGINT         NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(50)    NOT NULL,
    autor  VARCHAR(150)   NOT NULL,
    isbn   VARCHAR(20)    NOT NULL,
    preco  DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_livros_isbn UNIQUE (isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;