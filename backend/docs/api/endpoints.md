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

### Usuário Atual
```
GET /api/user/me
Auth: Bearer token
Response: { id, name, email, role }
```

## Catálogo Público

### Listar Livros
```
GET /api/public/books?page=0&size=10&sort=title,asc
Response: { content: [...], totalElements, totalPages }
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

### Listar Autores
```
GET /api/admin/authors?page=0&size=10&status=ACTIVE
Auth: ROLE_ADMIN
Response: {
  content: [{ id, name, biography, photoUrl, status, createdAt }],
  page: 0,
  size: 10,
  totalElements: 25
}
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

## Admin - Livros

### Listar Livros
```
GET /api/admin/books?page=0&size=10&status=ACTIVE&authorId=uuid&lowStock=true
Auth: ROLE_ADMIN
Query Params:
  - page (default: 0)
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

### Ajustar Estoque
```
PATCH /api/admin/books/{id}/stock
Auth: ROLE_ADMIN
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
Response: 204 No Content
```

### Limpar Carrinho
```
DELETE /api/carts/{id}/clear
Response: 204 No Content
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
POST /api/carts/{cartId}/checkout
Body: { shippingQuoteId, customerEmail }
Response: 201 Created + { orderId, status, total }
```

### Buscar Pedido
```
GET /api/orders/{id}
Response: { id, items, status, total, shippingCost, ... }
```

### Listar Pedidos (Admin)
```
GET /api/admin/orders?page=0&size=10&status=PENDING_PAYMENT
Auth: ROLE_ADMIN
Response: { content: [...], totalElements }
```

## Pagamentos

### Criar Pagamento
```
POST /api/payments
Body: { orderId }
Response: 201 Created + { id, approvalUrl, status }
```

### Buscar Pagamento
```
GET /api/payments/{id}
Response: { id, orderId, amount, status, method }
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
