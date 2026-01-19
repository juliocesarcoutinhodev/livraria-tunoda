# 📋 Guia Rápido - Versão 1.1.0

**Atualizado:** 19/01/2026

---

## 🆕 O que há de novo?

### 1. Busca Inteligente
```http
GET /api/admin/authors?name=martin
GET /api/public/books?title=java
```

### 2. Ordenação Dinâmica
```http
GET /api/public/books?sortBy=price&sortDirection=asc
GET /api/admin/books?sortBy=stock&sortDirection=asc
```

### 3. Logout Seguro
```http
POST /api/auth/revoke
POST /api/auth/revoke-all
```

### 4. Gestão de Estoque
```http
POST /api/admin/books/{id}/stock
GET /api/admin/books?lowStock=true
```

---

## 🔑 Parâmetros Novos

### **Busca**
| Endpoint | Parâmetro | Exemplo |
|----------|-----------|---------|
| `/api/admin/authors` | `name` | `?name=martin` |
| `/api/admin/books` | `title` | `?title=java` |
| `/api/public/books` | `title` | `?title=programação` |

### **Ordenação**
| Parâmetro | Valores | Padrão |
|-----------|---------|--------|
| `sortBy` | name, title, price, stock, createdAt | varia |
| `sortDirection` | `asc`, `desc` | varia |

### **Estoque**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `lowStock` | boolean | Livros com estoque < 10 |

---

## 📊 Endpoints Atualizados

```
✅ GET  /api/admin/authors          (+ name, sortBy, sortDirection)
✅ GET  /api/admin/books            (+ title, sortBy, sortDirection, lowStock)
✅ GET  /api/public/books           (+ title, sortBy, sortDirection)
🆕 POST /api/auth/revoke
🆕 POST /api/auth/revoke-all
🆕 POST /api/admin/books/{id}/stock
```

---

## 🎯 Exemplos Práticos

### **Buscar autores por nome**
```bash
curl -X GET "http://localhost:8080/api/admin/authors?name=martin" \
  -H "Authorization: Bearer {token}"
```

### **Livros mais baratos**
```bash
curl -X GET "http://localhost:8080/api/public/books?sortBy=price&sortDirection=asc"
```

### **Estoque baixo**
```bash
curl -X GET "http://localhost:8080/api/admin/books?lowStock=true&sortBy=stock&sortDirection=asc" \
  -H "Authorization: Bearer {token}"
```

### **Fazer logout**
```bash
curl -X POST "http://localhost:8080/api/auth/revoke" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"seu-token"}'
```

### **Aumentar estoque**
```bash
curl -X POST "http://localhost:8080/api/admin/books/{id}/stock" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "adjustmentType": "INCREASE",
    "quantity": 10,
    "reason": "Reposição"
  }'
```

---

## 📚 Documentação Completa

### **Por Feature:**
- [Filtros de Busca](api/SEARCH_FILTERS.md) - Guia completo
- [Ordenação](api/SORT_IMPLEMENTATION.md) - Guia completo
- [Logout](security/LOGOUT_IMPLEMENTATION.md) - Guia completo
- [Release Notes](RELEASE_NOTES_v1.1.0.md) - Detalhes da versão

### **Por Categoria:**
- [API](api/README.md) - Documentação de endpoints
- [Segurança](security/README.md) - Autenticação e autorização
- [Changelog](history/changelog.md) - Histórico de mudanças

---

## 🔄 Collections Postman

**Atualizadas em:** 19/01/2026

```
📁 docs/api/postman/
  ├── Livraria-Tunoda-API.postman_collection.json          (LOCAL - 46 endpoints)
  └── Livraria-Tunoda-API-STAGING.postman_collection.json  (STAGING - 46 endpoints)
```

**Como usar:**
1. Abrir Postman
2. Import → Escolher arquivo
3. Fazer login (POST /api/auth/login)
4. Tokens salvos automaticamente
5. Testar endpoints

---

## ⚡ Quick Start

```bash
# 1. Login
POST /api/auth/login
Body: { "email": "admin@livraria.com", "password": "admin123" }

# 2. Buscar livros com Java no título, ordenados por preço
GET /api/public/books?title=java&sortBy=price&sortDirection=asc

# 3. Buscar autores com Martin no nome
GET /api/admin/authors?name=martin&sortBy=name&sortDirection=asc
Authorization: Bearer {token}

# 4. Listar livros com estoque baixo
GET /api/admin/books?lowStock=true&sortBy=stock&sortDirection=asc
Authorization: Bearer {token}

# 5. Aumentar estoque de um livro
POST /api/admin/books/{id}/stock
Authorization: Bearer {token}
Body: { "adjustmentType": "INCREASE", "quantity": 10, "reason": "Reposição" }

# 6. Logout
POST /api/auth/revoke
Body: { "refreshToken": "{seu-refresh-token}" }
```

---

## 🐛 Problemas Conhecidos

Nenhum! Versão estável. ✅

---

## 💡 Dicas

### **Performance**
- Use `sortBy` e `sortDirection` para ordenar no servidor
- Use `lowStock=true` para filtrar estoque baixo
- Busca é case-insensitive (não precisa se preocupar com maiúsculas)

### **Segurança**
- Sempre faça logout ao sair (`POST /api/auth/revoke`)
- Use `POST /api/auth/revoke-all` se suspeitar de comprometimento
- Tokens expiram em 1 hora (access token)

### **Busca**
- Busca parcial: `?title=java` encontra "Effective Java", "Java Guide", etc.
- Busca ignora acentos nas comparações
- Busca vazia retorna todos os resultados

---

## 📞 Suporte

- **Docs:** [/docs](.)
- **Issues:** GitHub Issues
- **Postman:** [Collections](api/postman/)

---

**Versão:** 1.1.0  
**Status:** ✅ PRODUCTION READY  
**Última Atualização:** 2026-01-19
