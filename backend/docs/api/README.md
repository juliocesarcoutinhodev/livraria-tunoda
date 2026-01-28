# API

Documentação dos endpoints REST da API.

## Visão Geral

**Base URL:** `http://localhost:8080`  
**Formato:** JSON  
**Autenticação:** JWT Bearer Token  
**Versão:** v1

## Documentos

### [Endpoints](endpoints.md)

Lista completa de todos os endpoints da API com exemplos.

Inclui `/api/admin/dashboard/metrics` para KPIs e series do dashboard.

### [Limpar Carrinho](CLEAR_CART.md) ⭐ NOVO

Endpoint para remover todos os itens do carrinho de compras.

### [Filtros de Busca](SEARCH_FILTERS.md) ⭐ NOVO

Guia completo sobre busca por nome/título com LIKE case-insensitive.

### [Ordenação (Sort)](SORT_IMPLEMENTATION.md) ⭐ NOVO

Guia completo sobre ordenação dinâmica com sortBy e sortDirection.

### [Buscar Autor por ID](GET_AUTHOR_BY_ID.md) ⭐ NOVO

Endpoint para buscar autor específico por ID (útil para formulários de edição).

### [Error Handling](error-handling.md)

Tratamento de erros padronizado e códigos HTTP.

### [Bugfix: Filtro NULL](BUGFIX_NULL_FILTER.md)

Correção do erro PostgreSQL `function lower(bytea) does not exist`.

### [Postman Collections](postman/)

Collections para importar no Postman:
- `Livraria-Tunoda-API.postman_collection.json` - Local (47 endpoints)
- `Livraria-Tunoda-API-STAGING.postman_collection.json` - Staging (47 endpoints)

## Categorias de Endpoints

### Públicos (sem autenticação)

- Autenticação (`/api/auth/**`)
- Catálogo público (`/api/public/**`)
- Webhooks (`/api/webhooks/**`)

### Autenticados (requer token)

- Dados do usuário (`/api/user/**`)

### Administrativos (requer ROLE_ADMIN)

- Gestão de livros e autores (`/api/admin/**`)

## Quick Examples

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@livraria.com",
  "password": "admin123"
}
```

### Logout ⭐ NOVO

```bash
POST /api/auth/revoke
Content-Type: application/json

{
  "refreshToken": "seu-refresh-token"
}
```

### Buscar Livros com Filtros ⭐ ATUALIZADO

```bash
# Busca + Ordenação
GET /api/public/books?title=java&sortBy=price&sortDirection=asc

# Estoque baixo ordenado
GET /api/admin/books?lowStock=true&sortBy=stock&sortDirection=asc
Authorization: Bearer {token}
```

### Buscar Autores ⭐ ATUALIZADO

```bash
GET /api/admin/authors?name=martin&sortBy=name&sortDirection=asc
Authorization: Bearer {token}
```

### Atualizar Estoque ⭐ NOVO

```bash
POST /api/admin/books/{id}/stock
Authorization: Bearer {token}
Content-Type: application/json

{
  "adjustmentType": "INCREASE",
  "quantity": 10,
  "reason": "Reposição de estoque"
}
```

### Criar Livro (Admin)

```bash
POST /api/admin/books
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Dom Casmurro",
  "description": "Romance clássico",
  "price": 45.90,
  "stock": 50,
  "weight": 0.350,
  "authorIds": ["uuid-autor"]
}
```


## Referências

- [Domínios](../domain/README.md)
- [Segurança](../security/authentication.md)
