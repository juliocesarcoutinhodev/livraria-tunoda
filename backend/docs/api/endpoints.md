# Endpoints da API

Lista completa dos endpoints REST disponíveis.

## Autenticação

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, tokenType, expiresIn }
```

### Refresh Token
```
POST /api/auth/refresh
Body: { refreshToken }
Response: { accessToken, refreshToken, tokenType, expiresIn }
```

### Logout (Revoke Token) ⭐ NOVO
```
POST /api/auth/revoke
Body: { refreshToken }
Response: 204 No Content

Revoga o refresh token fornecido, impedindo renovação futura.
O access token expira naturalmente (1 hora).
```

### Logout Completo (Revoke All) ⭐ NOVO
```
POST /api/auth/revoke-all
Body: { refreshToken }
Response: 204 No Content

Revoga TODOS os tokens do usuário, invalidando todas as sessões ativas.
Útil em casos de comprometimento de segurança.
```

### Usuário Atual
```
GET /api/user/me
Auth: Bearer token
Response: { id, name, email, role }
```

## Catálogo Público

### Listar Livros ⭐ ATUALIZADO
```
GET /api/public/books?page=0&size=10&title=java&sortBy=price&sortDirection=asc
Query Params:
  - page (default: 0)
  - size (default: 10)
  - title (opcional: busca parcial case-insensitive) ⭐ NOVO
  - sortBy (opcional: campo para ordenar - title, price, createdAt) ⭐ NOVO
  - sortDirection (opcional: asc ou desc, default: desc) ⭐ NOVO
Response: { content: [...], totalElements, totalPages }

Exemplos:
- Busca: ?title=java
- Mais baratos: ?sortBy=price&sortDirection=asc
- Lançamentos: ?sortBy=createdAt&sortDirection=desc
- A-Z: ?sortBy=title&sortDirection=asc
```

### Detalhes do Livro
```
GET /api/public/books/{id}
Response: { id, title, description, price, authors, ... }
```

### Top Mais Visualizados
```
GET /api/public/books/most-viewed?limit=10
Response: [{ bookId, title, views }, ...]
```

### Top Mais Clicados
```
GET /api/public/books/most-clicked?limit=10
Response: [{ bookId, title, clicks }, ...]
```

### Registrar Métrica
```
POST /api/public/books/{id}/metrics
Body: { eventType: "VIEW" | "CLICK" }
Response: 204 No Content
```

## Admin - Autores

### Listar Autores ⭐ ATUALIZADO
```
GET /api/admin/authors?page=0&size=10&status=ACTIVE&name=martin&sortBy=name&sortDirection=asc
Auth: ROLE_ADMIN
Query Params:
  - page (default: 0)
  - size (default: 10)
  - status (opcional: ACTIVE | INACTIVE)
  - name (opcional: busca parcial case-insensitive) ⭐ NOVO
  - sortBy (opcional: campo para ordenar - name, createdAt) ⭐ NOVO
  - sortDirection (opcional: asc ou desc, default: asc) ⭐ NOVO
Response: {
  content: [{ id, name, biography, photoUrl, status, createdAt }],
  page: 0,
  size: 10,
  totalElements: 25
}

Exemplos:
- Buscar: ?name=martin
- Z-A: ?sortBy=name&sortDirection=desc
- Mais recentes: ?sortBy=createdAt&sortDirection=desc
```

### Buscar Autor por ID ⭐ NOVO
```
GET /api/admin/authors/{authorId}
Auth: ROLE_ADMIN
Response: {
  id: "uuid",
  name: "Robert C. Martin",
  biography: "...",
  photoUrl: "https://...",
  status: "ACTIVE",
  createdAt: "2026-01-19T10:00:00"
}

Busca um autor específico pelo ID. Útil para preencher formulários de edição.
Retorna 404 se autor não encontrado.
```

### Criar Autor
```
POST /api/admin/authors
Auth: ROLE_ADMIN
Body: { name, biography, photoUrl? }
Response: 201 Created + { id, name, biography, status, createdAt }
```

### Atualizar Autor
```
PUT /api/admin/authors/{id}
Auth: ROLE_ADMIN
Body: { name, biography, photoUrl? }
Response: 200 OK + autor atualizado
```

### Ativar/Desativar
```
PATCH /api/admin/authors/{id}/status
Auth: ROLE_ADMIN
Body: { status: "ACTIVE" | "INACTIVE" }
Response: 200 OK
```

## Admin - Pedidos ⭐ NOVO

### Listar Pedidos
```
GET /api/admin/orders?page=0&size=10&status=PENDING&sortBy=createdAt&sortDirection=desc
Auth: ROLE_ADMIN
Query Params:
  - page (default: 0)
  - size (default: 10)
  - status (opcional: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, EXPIRED)
  - sortBy (opcional: campo para ordenar - createdAt, status, totalAmount, subtotalAmount)
  - sortDirection (opcional: asc ou desc, default: desc)
Response: {
  content: [{
    orderId: "uuid",
    cartId: "uuid",
    shippingQuoteId: "uuid",
    status: "PENDING",
    items: [{itemId, bookId, bookTitle, quantity, unitPrice, currency, subtotal}],
    subtotal: 100.00,
    shippingCost: 20.00,
    currency: "BRL",
    total: 120.00,
    paymentReference: "MP-123456",
    createdAt: "19/01/2026"
  }],
  page: 0,
  size: 10,
  totalElements: 42
}

Exemplos:
- Pedidos pendentes: ?status=PENDING
- Pedidos confirmados: ?status=CONFIRMED
- Pedidos em processamento: ?status=PROCESSING
- Pedidos enviados: ?status=SHIPPED
- Pedidos entregues: ?status=DELIVERED
- Pedidos cancelados: ?status=CANCELLED
- Ordenar por data: ?sortBy=createdAt&sortDirection=desc
- Todos os pedidos: (sem filtro status)
```

### Baixar Relatorio do Pedido
```
GET /api/admin/orders/{orderId}/report
Auth: ROLE_ADMIN
Response: PDF (application/pdf)

Retorna o PDF do pedido (resumo + itens).
```

### Baixar Etiqueta de Envio
```
GET /api/admin/orders/{orderId}/shipping-label
Auth: ROLE_ADMIN
Response: PDF (application/pdf)

Retorna a etiqueta de envio no formato PDF.
```

## Admin - Dashboard

### Métricas do Dashboard
```
GET /api/admin/dashboard/metrics?days=30&topLimit=10
Auth: ROLE_ADMIN
Response: {
  kpis: { totalOrders, ordersMonthly, ordersDaily },
  ordersByDay: [{ date, count }],
  topSold: [{ bookId, title, totalSold }],
  mostViewed: [{ bookId, title, total }],
  mostClicked: [{ bookId, title, total }]
}
```

## Admin - Livros

### Listar Livros ⭐ ATUALIZADO
```
GET /api/admin/books?page=0&size=10&status=ACTIVE&authorId=uuid&lowStock=true&title=java&sortBy=price&sortDirection=asc
Auth: ROLE_ADMIN
Query Params:
  - page (default: 0)
  - size (default: 10)
  - status (opcional: ACTIVE | INACTIVE)
  - authorId (opcional: filtrar por autor)
  - lowStock (opcional: boolean - retorna livros com estoque < 10) ⭐ ATUALIZADO
  - title (opcional: busca parcial case-insensitive) ⭐ NOVO
  - sortBy (opcional: campo para ordenar - title, price, stock, createdAt) ⭐ NOVO
  - sortDirection (opcional: asc ou desc, default: desc) ⭐ NOVO
Response: {
  content: [{ id, title, description, price, stock, authors, status, ... }],
  page: 0,
  size: 10,
  totalElements: 42
}

Exemplos:
- Buscar: ?title=java
- Estoque baixo: ?lowStock=true&sortBy=stock&sortDirection=asc
- Mais caros: ?sortBy=price&sortDirection=desc
- A-Z: ?sortBy=title&sortDirection=asc
```
  - size (default: 10)
  - status (optional: ACTIVE | INACTIVE)
  - authorId (optional: filtrar por autor)
  - lowStock (optional: boolean - retorna livros com estoque < 10)
Response: {
  content: [{ id, title, description, price, stock, authors, status, ... }],
  page: 0,
  size: 10,
  totalElements: 42
}
```

### Buscar Livro por ID ⭐ NOVO
```
GET /api/admin/books/{bookId}
Auth: ROLE_ADMIN
Response: {
  id: "uuid",
  title: "Clean Code",
  description: "...",
  photoUrl: "https://...",
  isbn: "978-0132350884",
  price: 49.90,
  currency: "BRL",
  weight: 0.680,
  weightUnit: "KILOGRAMS",
  stock: 100,
  authors: [{id, name}],
  status: "ACTIVE",
  createdAt: "15/01/2026",
  updatedAt: "19/01/2026"
}

Busca um livro específico pelo ID. Útil para preencher formulários de edição.
Retorna 404 se livro não encontrado.
Retorna dados completos incluindo estoque, peso e datas formatadas.
```

### Criar Livro
```
POST /api/admin/books
Auth: ROLE_ADMIN
Body: {
  title, description, price, stock, 
  weight, isbn?, photoUrl?, authorIds: [...]
}
Response: 201 Created + livro completo
```

### Atualizar Livro
```
PUT /api/admin/books/{id}
Auth: ROLE_ADMIN
Body: { ... }
Response: 200 OK
```

### Ativar/Desativar
```
PATCH /api/admin/books/{id}/status
Auth: ROLE_ADMIN
Body: { status: "ACTIVE" | "INACTIVE" }
Response: 200 OK
```

### Métricas do Livro
```
GET /api/admin/books/{id}/metrics
Auth: ROLE_ADMIN
Response: { views, clicks, lastViewedAt }
```

### Ajustar Estoque ⭐ ATUALIZADO
```
POST /api/admin/books/{id}/stock
Auth: ROLE_ADMIN
Body: {
  "adjustmentType": "SET" | "INCREASE" | "DECREASE",
  "quantity": 10,
  "reason": "Reposição de estoque"
}
Response: {
  bookId: "uuid",
  previousStock: 5,
  newStock: 15,
  adjustmentType: "INCREASE",
  quantity: 10,
  reason: "Reposição de estoque",
  adjustedAt: "2026-01-19T12:00:00"
}

Tipos de ajuste:
- SET: Define estoque absoluto (quantity = novo valor)
- INCREASE: Adiciona ao estoque (quantity = valor a adicionar)
- DECREASE: Remove do estoque (quantity = valor a remover)
```
Body: {
  operation: "ADD" | "REMOVE" | "SET",
  quantity: 10,
  reason: "Motivo do ajuste (opcional)"
}
Response: 200 OK + livro atualizado
Exemplos:
  - ADD: Adiciona quantidade ao estoque atual
  - REMOVE: Remove quantidade do estoque atual
  - SET: Define o estoque com valor absoluto
```

## Carrinho

### Criar Carrinho
```
POST /api/carts
Response: 201 Created + { id, items: [], createdAt }
```

### Buscar Carrinho
```
GET /api/carts/{id}
Response: { id, items, subtotal, itemCount }
```

### Adicionar Item
```
POST /api/carts/{cartId}/items
Body: { bookId, quantity }
Response: 200 OK + carrinho atualizado
```

### Atualizar Quantidade
```
PUT /api/carts/{cartId}/items/{bookId}
Body: { quantity }
Response: 200 OK
```

### Remover Item
```
DELETE /api/carts/{cartId}/items/{bookId}
Response: 200 OK + carrinho atualizado
```

### Limpar Carrinho
```
DELETE /api/carts/{cartId}/clear
Response: 200 OK + carrinho vazio
```
**Descrição:** Remove todos os itens do carrinho, mantendo o carrinho ativo.

**Validações:**
- Carrinho deve existir
- Carrinho deve estar com status ACTIVE

**Response:**
```json
{
  "id": "cart-uuid",
  "items": [],
  "subtotal": 0.00,
  "itemCount": 0,
  "status": "ACTIVE",
  "createdAt": "2026-01-26T10:00:00",
  "updatedAt": "2026-01-26T10:30:00"
}
```

## Frete

### Criar Cotação
```
POST /api/shipping/quotes
Body: { cartId, toPostalCode }
Response: 201 Created + { id, status, expiresAt }
```

### Calcular Frete
```
POST /api/shipping/quotes/{id}/calculate
Response: 200 OK + { options: [{ serviceCode, price, deliveryDays, ... }] }
```

### Buscar Cotação
```
GET /api/shipping/quotes/{id}
Response: { id, options, selectedServiceCode, status }
```

### Selecionar Opção
```
POST /api/shipping/quotes/{id}/select
Body: { serviceCode }
Response: 200 OK
```

## Pedidos

### Checkout (Criar Pedido)
```
POST /api/carts/checkout
Body: { cartId, shippingQuoteId, customerName, customerEmail, customerPhone, street, number, complement, neighborhood, city, state, postalCode }
Response: 201 Created + { orderId, status, total }
```

### Buscar Pedido
```
GET /api/orders/{id}
Response: { id, items, status, total, shippingCost, ... }
```

### Consultar Pedido por Email
```
POST /api/orders/lookup
Body: { orderId, email }
Response 200: { valid, orderId, redirectUrl }
Response 403: { valid, message }
```

### Listar Pedidos (Admin)
```
GET /api/admin/orders?page=0&size=10&status=PENDING
Auth: ROLE_ADMIN
Response: { content: [...], totalElements }
```

## Pagamentos

### Criar Pagamento
```
POST /api/orders/{orderId}/payments
Body: { paymentMethod }
Response: 201 Created + { id, approvalUrl, status }
```

### Buscar Pagamento
```
GET /api/payments/{id}
Response: { id, orderId, amount, status, method }
```

### Processar Pagamento
```
POST /api/payments/{id}/process
Response: 200 OK + { payment, checkoutUrl }
```

### Webhook Mercado Pago
```
POST /api/webhooks/mercadopago
Body: { id, topic, type }
Response: 200 OK
```

## Health & Monitoring

### Health Check
```
GET /api/v1/actuator/health
Response: { status: "UP", components: {...} }
```

### Métricas (requer autenticação staging/prod)
```
GET /api/v1/actuator/metrics
Auth: Bearer token (staging) | ROLE_ADMIN (prod)
Response: { names: [...] }
```

### Métrica Específica
```
GET /api/v1/actuator/metrics/http.server.requests
Auth: Bearer token (staging) | ROLE_ADMIN (prod)
Response: { name, measurements, availableTags }
```

## Códigos HTTP

- **200** OK
- **201** Created
- **204** No Content
- **400** Bad Request
- **401** Unauthorized
- **403** Forbidden
- **404** Not Found
- **422** Unprocessable Entity
- **500** Internal Server Error

## Referências

- [Error Handling](error-handling.md)
- [Postman Collections](postman/)
- [Domínios](../domain/README.md)
- [Autenticação](../security/authentication.md)
