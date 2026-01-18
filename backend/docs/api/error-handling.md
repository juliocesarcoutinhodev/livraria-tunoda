# Error Handling

Tratamento de erros padronizado da API.

## Formato Padrão

Todos os erros retornam este formato:

```json
{
  "timestamp": "2026-01-18T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Livro não encontrado",
  "path": "/api/admin/books/123",
  "correlationId": "abc-123-def"
}
```

## Códigos HTTP

### 2xx Success

- **200 OK** - Sucesso
- **201 Created** - Recurso criado
- **204 No Content** - Sucesso sem corpo

### 4xx Client Errors

- **400 Bad Request** - Dados inválidos
- **401 Unauthorized** - Não autenticado
- **403 Forbidden** - Sem permissão
- **404 Not Found** - Recurso não existe
- **409 Conflict** - Conflito (ex: email duplicado)
- **422 Unprocessable Entity** - Validação falhou

### 5xx Server Errors

- **500 Internal Server Error** - Erro inesperado
- **503 Service Unavailable** - Serviço indisponível

## Erros Comuns

### Validação

```json
{
  "timestamp": "2026-01-18T12:00:00",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Erro de validação",
  "errors": [
    {
      "field": "title",
      "message": "Título não pode estar vazio"
    },
    {
      "field": "price",
      "message": "Preço deve ser maior que zero"
    }
  ],
  "path": "/api/admin/books",
  "correlationId": "xyz-789"
}
```

### Não Autenticado

```json
{
  "timestamp": "2026-01-18T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Autenticação necessária. Por favor, faça login.",
  "path": "/api/admin/books"
}
```

### Sem Permissão

```json
{
  "timestamp": "2026-01-18T12:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Acesso negado. Permissões insuficientes.",
  "path": "/api/admin/books"
}
```

### Recurso Não Encontrado

```json
{
  "timestamp": "2026-01-18T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Livro não encontrado com ID: 123",
  "path": "/api/admin/books/123"
}
```

## Exceções de Negócio

### Estoque Insuficiente

```json
{
  "timestamp": "2026-01-18T12:00:00",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Estoque insuficiente. Disponível: 5, Solicitado: 10",
  "path": "/api/carts/abc/items"
}
```

### Carrinho Vazio

```json
{
  "timestamp": "2026-01-18T12:00:00",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Carrinho está vazio. Adicione itens antes do checkout.",
  "path": "/api/carts/abc/checkout"
}
```

## Correlation ID

Cada requisição recebe um correlation ID único para rastreamento de logs.

**Header:**
```
X-Correlation-ID: abc-123-def-456
```

Use este ID para reportar problemas.

## Tratamento Global

Implementado em `GlobalExceptionHandler` com `@ControllerAdvice`.

**Exceções tratadas:**
- `ResourceNotFoundException` → 404
- `BusinessException` → 422
- `AuthenticationException` → 401
- `AccessDeniedException` → 403
- `MethodArgumentNotValidException` → 422
- `Exception` → 500

## Logs

Erros são logados automaticamente:

```
ERROR [correlationId=abc-123] ResourceNotFoundException: Livro não encontrado com ID: 123
  at BookRepositoryAdapter.findById(...)
  ...
```

## Boas Práticas

### Cliente API

```javascript
try {
  const response = await fetch('/api/admin/books', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.message);
    console.log('Correlation ID:', error.correlationId);
    // Mostrar mensagem ao usuário
  }
  
  return await response.json();
} catch (error) {
  console.error('Network error:', error);
}
```

## Referências

- [API Endpoints](endpoints.md)
- [Segurança](../security/authentication.md)
