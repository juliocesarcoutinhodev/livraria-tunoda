# Schema do Banco de Dados

Estrutura completa das tabelas do sistema.

## Visão Geral

**Total de tabelas:** 12  
**Banco:** PostgreSQL 17  
**Migrations:** Flyway

## Tabelas

### Catálogo

#### tb_books
Livros do catálogo.

```sql
CREATE TABLE tb_books (
    id UUID PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    photo_url VARCHAR(500),
    isbn VARCHAR(13),
    price_amount DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    stock INTEGER NOT NULL DEFAULT 0,
    weight_value DECIMAL(10,3) NOT NULL,
    weight_unit VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_books_status ON tb_books(status);
CREATE INDEX idx_books_title ON tb_books(title);
```

#### tb_book_authors
Relacionamento livros e autores (N:N).

```sql
CREATE TABLE tb_book_authors (
    book_id UUID NOT NULL REFERENCES tb_books(id),
    author_id UUID NOT NULL,
    PRIMARY KEY (book_id, author_id)
);
```

#### tb_authors
Autores.

```sql
CREATE TABLE tb_authors (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    biography TEXT NOT NULL,
    photo_url VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### Analytics

#### tb_book_metrics
Eventos de interação.

```sql
CREATE TABLE tb_book_metrics (
    id UUID PRIMARY KEY,
    book_id UUID NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

CREATE INDEX idx_book_metrics_book_id ON tb_book_metrics(book_id);
CREATE INDEX idx_book_metrics_event_type ON tb_book_metrics(event_type);
```

### Carrinho e Pedidos

#### tb_carts

```sql
CREATE TABLE tb_carts (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

#### tb_cart_items

```sql
CREATE TABLE tb_cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES tb_carts(id),
    book_id UUID NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price_amount DECIMAL(10,2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL,
    CONSTRAINT uk_cart_book UNIQUE(cart_id, book_id)
);
```

#### tb_orders

```sql
CREATE TABLE tb_orders (
    id UUID PRIMARY KEY,
    cart_id UUID,
    status VARCHAR(50) NOT NULL,
    subtotal_amount DECIMAL(10,2) NOT NULL,
    subtotal_currency VARCHAR(3) NOT NULL,
    shipping_cost_amount DECIMAL(10,2),
    shipping_cost_currency VARCHAR(3),
    total_amount DECIMAL(10,2) NOT NULL,
    total_currency VARCHAR(3) NOT NULL,
    payment_reference VARCHAR(255),
    shipping_quote_id UUID,
    customer_email VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

#### tb_order_items

```sql
CREATE TABLE tb_order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES tb_orders(id),
    book_id UUID NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price_amount DECIMAL(10,2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL
);
```

### Frete

#### tb_shipping_quotes

```sql
CREATE TABLE tb_shipping_quotes (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL,
    to_postal_code VARCHAR(9) NOT NULL,
    selected_service_code VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

#### tb_shipping_items
#### tb_shipping_options
#### tb_shipping_payloads

### Pagamentos

#### tb_payments

```sql
CREATE TABLE tb_payments (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(50) NOT NULL,
    method VARCHAR(50),
    external_id VARCHAR(255),
    preference_id VARCHAR(255),
    approval_url TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### Usuários

#### tb_users

```sql
CREATE TABLE tb_users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

#### tb_refresh_tokens

```sql
CREATE TABLE tb_refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES tb_users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);
```

## Relacionamentos

```
tb_books ──< tb_book_authors >── tb_authors
tb_books ──< tb_book_metrics
tb_books ──< tb_cart_items >── tb_carts
tb_books ──< tb_order_items >── tb_orders
tb_carts ──< tb_shipping_quotes
tb_orders ──< tb_payments
tb_users ──< tb_refresh_tokens
```

## Tipos PostgreSQL Específicos

- `UUID` - Identificadores únicos
- `JSONB` - JSON binário (tb_shipping_payloads)
- `TIMESTAMP` - Data/hora
- `DECIMAL(10,2)` - Valores monetários

## Índices

Índices criados para performance:
- Status de entidades (books, users)
- Foreign keys (book_id, cart_id, order_id, user_id)
- Campos de busca (email, title)
- Campos de query (event_type)

## Constraints

- PRIMARY KEY em todas as tabelas
- UNIQUE em emails, tokens
- FOREIGN KEY com CASCADE apropriado
- NOT NULL em campos obrigatórios
- DEFAULT values onde aplicável

## Referências

- [Migrations](migrations.md)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
