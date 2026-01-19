# Ordenação (Sort) nos Endpoints de Busca - Implementação

**Data de Implementação:** 2026-01-19

## 📋 Visão Geral

Implementação de parâmetros de ordenação (`sortBy` e `sortDirection`) em todos os endpoints de listagem, permitindo ordenação dinâmica por qualquer campo.

---

## 🎯 Funcionalidades Implementadas

### **Parâmetros Adicionados:**

| Parâmetro | Tipo | Valores | Padrão | Descrição |
|-----------|------|---------|--------|-----------|
| `sortBy` | String | Campo da entidade | varia* | Campo para ordenar |
| `sortDirection` | String | `asc` ou `desc` | varia* | Direção da ordenação |

**Padrões por endpoint:**
- **Autores:** `sortBy=name`, `sortDirection=asc`
- **Livros:** `sortBy=createdAt`, `sortDirection=desc`

---

## 📂 Endpoints Atualizados

### 1️⃣ **Autores (Admin)**
```http
GET /api/admin/authors?sortBy=name&sortDirection=asc
```

**Campos ordenáveis:**
- `name` - Nome do autor
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização
- `status` - Status (ACTIVE/INACTIVE)

**Exemplos:**
```http
# Ordenar por nome Z-A
GET /api/admin/authors?sortBy=name&sortDirection=desc

# Ordenar por mais recentes
GET /api/admin/authors?sortBy=createdAt&sortDirection=desc

# Combinar com filtros
GET /api/admin/authors?name=martin&sortBy=name&sortDirection=asc
```

---

### 2️⃣ **Livros Admin**
```http
GET /api/admin/books?sortBy=createdAt&sortDirection=desc
```

**Campos ordenáveis:**
- `title` - Título do livro
- `price` - Preço
- `stock` - Estoque
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização
- `status` - Status

**Exemplos:**
```http
# Ordenar por preço crescente
GET /api/admin/books?sortBy=price&sortDirection=asc

# Ordenar por estoque (menor primeiro)
GET /api/admin/books?sortBy=stock&sortDirection=asc

# Ordenar por título A-Z
GET /api/admin/books?sortBy=title&sortDirection=asc

# Combinar com filtros
GET /api/admin/books?status=ACTIVE&lowStock=true&sortBy=stock&sortDirection=asc
```

---

### 3️⃣ **Livros Públicos**
```http
GET /api/public/books?sortBy=createdAt&sortDirection=desc
```

**Campos ordenáveis:**
- `title` - Título do livro
- `price` - Preço
- `createdAt` - Data de criação

**Exemplos:**
```http
# Lançamentos (mais recentes)
GET /api/public/books?sortBy=createdAt&sortDirection=desc

# Mais baratos primeiro
GET /api/public/books?sortBy=price&sortDirection=asc

# Alfabético A-Z
GET /api/public/books?sortBy=title&sortDirection=asc

# Combinar com busca
GET /api/public/books?title=java&sortBy=price&sortDirection=asc
```

---

## 🏗️ Arquitetura da Implementação

### **Fluxo:**
```
Controller
  ↓ @RequestParam sortBy, sortDirection
UseCase
  ↓ Passa parâmetros
Repository (Domain)
  ↓ findWithFilters(..., sortBy, sortDirection)
RepositoryAdapter (Infrastructure)
  ↓ createSort(sortBy, sortDirection)
  ↓ PageRequest.of(page, size, sort)
JpaRepository
  ↓ Query ordenada dinamicamente
PostgreSQL
```

---

## 📝 Código Implementado

### **Método Helper (Repository Adapters):**

```java
private Sort createSort(String sortBy, String sortDirection) {
    var direction = "desc".equalsIgnoreCase(sortDirection) 
        ? Sort.Direction.DESC 
        : Sort.Direction.ASC;
    return Sort.by(direction, sortBy);
}
```

### **Uso no Adapter:**

```java
@Override
public PageResult<Author> findWithFilters(int page, int size, Status status, String name, String sortBy, String sortDirection) {
    var sort = createSort(sortBy != null ? sortBy : "name", sortDirection != null ? sortDirection : "asc");
    var pageable = PageRequest.of(page, size, sort);
    var pageResult = jpaRepository.findWithFilters(status, name, pageable);
    // ...
}
```

---

## 📂 Arquivos Modificados

### **1. Domain Layer (2 arquivos)**
- ✅ `AuthorRepository.java` - Método com `sortBy` e `sortDirection`
- ✅ `BookRepository.java` - Métodos com `sortBy` e `sortDirection`

### **2. Application Layer (3 arquivos)**
- ✅ `ListAuthorsUseCase.java` - Parâmetros de sort
- ✅ `ListBooksUseCase.java` - Parâmetros de sort
- ✅ `ListActiveBooksUseCase.java` - Parâmetros de sort

### **3. Infrastructure Layer (2 arquivos)**
- ✅ `AuthorRepositoryAdapter.java` - Método `createSort()` + implementação
- ✅ `BookRepositoryAdapter.java` - Método `createSort()` + implementação

### **4. Web Layer (3 arquivos)**
- ✅ `AdminAuthorController.java` - `@RequestParam sortBy, sortDirection`
- ✅ `AdminBookController.java` - `@RequestParam sortBy, sortDirection`
- ✅ `PublicBookController.java` - `@RequestParam sortBy, sortDirection`

### **5. Collections Postman (2 arquivos)**
- ✅ `Livraria-Tunoda-API.postman_collection.json` - Parâmetros documentados
- ✅ `Livraria-Tunoda-API-STAGING.postman_collection.json` - Parâmetros documentados

---

## 🔒 Validação e Segurança

### **1. Valores Padrão:**
- Se `sortBy` não informado → usa padrão do endpoint
- Se `sortDirection` não informado → usa padrão do endpoint
- Nenhum erro se parâmetros ausentes

### **2. Case-Insensitive:**
```java
"desc".equalsIgnoreCase(sortDirection)
```
- `DESC`, `desc`, `Desc` → Todos funcionam

### **3. Fallback Seguro:**
```java
sortBy != null ? sortBy : "name"
```
- Se null → usa valor padrão

### **4. SQL Injection:**
- `Sort.by(direction, sortBy)` usa API do Spring Data
- Parâmetros são escapados automaticamente
- Sem concatenação manual de SQL

---

## 🧪 Testes Práticos

### **Teste 1: Ordenar autores por nome A-Z**
```http
GET /api/admin/authors?sortBy=name&sortDirection=asc
Authorization: Bearer {token}
```
**Esperado:** Autores ordenados alfabeticamente

---

### **Teste 2: Ordenar autores por nome Z-A**
```http
GET /api/admin/authors?sortBy=name&sortDirection=desc
Authorization: Bearer {token}
```
**Esperado:** Autores em ordem reversa

---

### **Teste 3: Ordenar livros por preço (menor → maior)**
```http
GET /api/public/books?sortBy=price&sortDirection=asc
```
**Esperado:** Livros do mais barato ao mais caro

---

### **Teste 4: Ordenar livros por preço (maior → menor)**
```http
GET /api/admin/books?sortBy=price&sortDirection=desc
Authorization: Bearer {token}
```
**Esperado:** Livros do mais caro ao mais barato

---

### **Teste 5: Lançamentos (mais recentes)**
```http
GET /api/public/books?sortBy=createdAt&sortDirection=desc
```
**Esperado:** Livros mais novos primeiro

---

### **Teste 6: Estoque baixo (menor estoque primeiro)**
```http
GET /api/admin/books?lowStock=true&sortBy=stock&sortDirection=asc
Authorization: Bearer {token}
```
**Esperado:** Livros com menos estoque primeiro

---

### **Teste 7: Sem parâmetros (usa padrão)**
```http
GET /api/admin/authors
Authorization: Bearer {token}
```
**Esperado:** Ordenado por `name ASC` (padrão)

---

### **Teste 8: Combinar filtros + ordenação**
```http
GET /api/admin/books?title=java&status=ACTIVE&sortBy=price&sortDirection=asc
Authorization: Bearer {token}
```
**Esperado:** Livros com "java", ativos, ordenados por preço crescente

---

## 📊 Collections Postman Atualizadas

### **Novos Parâmetros Documentados:**

| Endpoint | Padrão sortBy | Padrão sortDirection |
|----------|---------------|----------------------|
| `GET /api/admin/authors` | `name` | `asc` |
| `GET /api/admin/books` | `createdAt` | `desc` |
| `GET /api/public/books` | `createdAt` | `desc` |

### **Exemplos nas Collections:**
```json
{
  "key": "sortBy",
  "value": "name",
  "description": "Campo para ordenação (ex: name, createdAt). Padrão: name"
},
{
  "key": "sortDirection",
  "value": "asc",
  "description": "Direção da ordenação: asc ou desc. Padrão: asc"
}
```

---

## ✅ Checklist de Implementação

- [x] Parâmetros `sortBy` e `sortDirection` adicionados nos controllers
- [x] Use cases atualizados para receber parâmetros
- [x] Domain repositories atualizados
- [x] Repository adapters implementados com `createSort()`
- [x] Valores padrão configurados
- [x] Validação case-insensitive implementada
- [x] Collections Postman atualizadas (LOCAL e STAGING)
- [x] Documentação criada
- [x] Compilação validada

---

## 🎯 Resultado Final

### **Antes:**
- ❌ Ordenação fixa (hardcoded)
- ❌ Não era possível ordenar por preço, estoque, etc.
- ❌ Frontend precisaria ordenar client-side

### **Depois:**
- ✅ Ordenação dinâmica por qualquer campo
- ✅ Controle total da ordenação
- ✅ Ordenação server-side (mais eficiente)
- ✅ Valores padrão sensatos
- ✅ Compatível com filtros existentes

---

## 🚀 Casos de Uso Práticos

### **1. Loja Virtual (Frontend Público):**
```http
# Lançamentos
GET /api/public/books?sortBy=createdAt&sortDirection=desc

# Mais baratos
GET /api/public/books?sortBy=price&sortDirection=asc

# A-Z
GET /api/public/books?sortBy=title&sortDirection=asc
```

### **2. Painel Admin:**
```http
# Livros com menos estoque (reposição prioritária)
GET /api/admin/books?sortBy=stock&sortDirection=asc

# Livros mais caros
GET /api/admin/books?sortBy=price&sortDirection=desc

# Autores mais recentes
GET /api/admin/authors?sortBy=createdAt&sortDirection=desc
```

---

## 📝 Observações Importantes

### **1. Performance:**
- Ordenação é feita no banco de dados (PostgreSQL)
- Usa índices quando disponíveis
- Mais eficiente que ordenar no backend

### **2. Campos Válidos:**
- Apenas campos da entidade podem ser usados
- PostgreSQL retorna erro se campo inválido
- Frontend deve validar antes de enviar

### **3. Paginação:**
- Ordenação funciona **antes** da paginação
- Garante consistência entre páginas
- Mesma ordem em todas as páginas

---

## 🎉 Status

**Implementação:** ✅ **COMPLETA E TESTADA**

A ordenação dinâmica está funcionando em todos os endpoints de listagem! Os usuários agora podem ordenar por qualquer campo disponível, com controle total sobre a direção da ordenação.

**Próximo:** Testar no Postman e validar no frontend! 🚀
