# Endpoint: Buscar Autor por ID

**Data de Implementação:** 2026-01-19

## 📋 Visão Geral

Endpoint para buscar um autor específico pelo ID, retornando todos os seus dados. Útil para preencher formulários de edição no frontend.

---

## 🎯 Endpoint

```
GET /api/admin/authors/{authorId}
```

**Autenticação:** `ROLE_ADMIN` (Bearer Token)

---

## 📥 Request

### **Path Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `authorId` | String (UUID) | Sim | ID do autor |

### **Headers:**

```http
Authorization: Bearer {access_token}
```

### **Exemplo:**

```bash
curl -X GET "http://localhost:8080/api/admin/authors/8f7f3fce-bd41-482a-8c96-8c7af069762c" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

---

## 📤 Response

### **Success (200 OK):**

```json
{
  "id": "8f7f3fce-bd41-482a-8c96-8c7af069762c",
  "name": "Martin Fowler",
  "biography": "Martin Fowler é um autor e palestrante britânico conhecido por seus trabalhos sobre arquitetura de software, refatoração e design orientado a objetos.",
  "photoUrl": "https://example.com/photos/martin-fowler.jpg",
  "status": "ACTIVE",
  "createdAt": "2026-01-15T10:30:00"
}
```

### **Error (404 Not Found):**

```json
{
  "timestamp": "2026-01-19T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Autor não encontrado",
  "path": "/api/admin/authors/invalid-uuid",
  "correlationId": "abc123"
}
```

### **Error (401 Unauthorized):**

```json
{
  "timestamp": "2026-01-19T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Token inválido ou expirado",
  "path": "/api/admin/authors/8f7f3fce-bd41-482a-8c96-8c7af069762c"
}
```

---

## 🏗️ Arquitetura

### **Camadas Implementadas:**

```
┌─────────────────────────────────────────────────────┐
│  AdminAuthorController                              │
│  GET /api/admin/authors/{authorId}                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  GetAuthorDetailUseCase (Application Layer)         │
│  - execute(String authorId)                         │
│  - findAuthorOrThrow(String authorId)               │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  AuthorRepository (Domain)                          │
│  - findById(AuthorId)                               │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  AuthorRepositoryAdapter (Infrastructure)           │
│  - Busca na tb_authors via JPA                      │
└─────────────────────────────────────────────────────┘
```

---

## 📂 Arquivos

### **Use Case:**
- `GetAuthorDetailUseCase.java` (Application Layer)

### **Controller:**
- `AdminAuthorController.java` (Web Layer)

### **DTO:**
- `AuthorResponse.java` (já existente)

### **Mapper:**
- `AuthorDTOMapper.java` (já existente)

---

## 🧪 Testes no Postman

### **Cenário 1: Buscar autor existente**

```http
GET /api/admin/authors/8f7f3fce-bd41-482a-8c96-8c7af069762c
Authorization: Bearer {token}
```

**Esperado:**
- Status: `200 OK`
- Body: Dados completos do autor

---

### **Cenário 2: Buscar autor inexistente**

```http
GET /api/admin/authors/00000000-0000-0000-0000-000000000000
Authorization: Bearer {token}
```

**Esperado:**
- Status: `404 Not Found`
- Mensagem: "Autor não encontrado"

---

### **Cenário 3: Sem autenticação**

```http
GET /api/admin/authors/8f7f3fce-bd41-482a-8c96-8c7af069762c
```

**Esperado:**
- Status: `401 Unauthorized`

---

## 💡 Caso de Uso Principal

### **Frontend: Formulário de Edição**

1. **Usuário clica em "Editar" na lista de autores**
2. **Frontend busca dados completos:**
   ```javascript
   const response = await fetch(`/api/admin/authors/${authorId}`, {
     headers: { 'Authorization': `Bearer ${token}` }
   });
   const author = await response.json();
   ```
3. **Formulário é preenchido com os dados:**
   - Nome: `author.name`
   - Biografia: `author.biography`
   - Foto: `author.photoUrl`
   - Status: `author.status`
4. **Usuário edita e salva (PUT /api/admin/authors/{id})**

---

## 🔒 Segurança

### **Autenticação:**
- ✅ Requer token JWT válido
- ✅ Requer role `ROLE_ADMIN`

### **Autorização:**
- ✅ Apenas administradores podem buscar detalhes de autores
- ✅ Token expirado retorna `401`
- ✅ Usuário sem permissão retorna `403`

### **Validação:**
- ✅ UUID inválido retorna `400 Bad Request`
- ✅ Autor não encontrado retorna `404 Not Found`

---

## 📊 Diferenças de Endpoints Similares

| Endpoint | Público | Retorna | Uso |
|----------|---------|---------|-----|
| `GET /api/admin/authors` | ❌ Admin | Lista paginada | Listar todos |
| `GET /api/admin/authors/{id}` | ❌ Admin | Autor individual | Formulário de edição |

---

## ✅ Benefícios

1. **Separação de Concerns:**
   - Lista paginada (GET /authors) vs Detalhe individual (GET /authors/{id})

2. **Performance:**
   - Busca apenas 1 registro
   - Não carrega dados desnecessários

3. **UX:**
   - Formulário de edição carrega rápido
   - Dados sempre atualizados

4. **Clean Architecture:**
   - Use Case dedicado
   - Responsabilidade única
   - Fácil manutenção

---

## 🎯 Status

**Implementação:** ✅ **COMPLETA**  
**Testes:** ✅ **Validado**  
**Documentação:** ✅ **Atualizada**  
**Collections Postman:** ✅ **Atualizadas**

---

## 📝 Próximos Passos (Opcional)

- [ ] Adicionar cache Redis (5 minutos)
- [ ] Adicionar endpoint público para biografia de autores
- [ ] Incluir lista de livros do autor no response
- [ ] Analytics: quantidade de livros publicados

---

**Versão:** 1.1.0  
**Data:** 2026-01-19  
**Endpoint:** `GET /api/admin/authors/{id}`  
**Status:** ✅ PRODUCTION READY
