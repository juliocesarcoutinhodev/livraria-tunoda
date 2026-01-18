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

### [Error Handling](error-handling.md)

Tratamento de erros padronizado e códigos HTTP.

### [Postman Collections](postman/)

Collections para importar no Postman:
- `Livraria-Tunoda-API.postman_collection.json` - Local
- `Livraria-Tunoda-API-STAGING.postman_collection.json` - Staging

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

### Criar Livro (Admin)

```bash
POST /api/admin/books
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Dom Casmurro",
  "description": "Romance clássico",
  "price": 45.90,
  "weight": 0.350,
  "authorIds": ["uuid-autor"]
}
```

### Listar Livros (Público)

```bash
GET /api/public/books?page=0&size=10
```

## Referências

- [Domínios](../domain/README.md)
- [Segurança](../security/authentication.md)
