# 🚀 Release Notes - Versão 1.1.0

**Data de Lançamento:** 19 de Janeiro de 2026

---

## 📋 Resumo

Versão focada em **melhorias de UX e segurança**, adicionando busca inteligente, ordenação dinâmica, sistema de logout completo e gestão de estoque.

---

## ✨ Principais Features

### 1️⃣ Busca Inteligente por Nome/Título

Agora é possível buscar autores e livros usando busca parcial case-insensitive:

```http
# Buscar autores
GET /api/admin/authors?name=martin

# Buscar livros (admin)
GET /api/admin/books?title=java&status=ACTIVE

# Buscar livros (público)
GET /api/public/books?title=programação
```

**Características:**
- ✅ Case-insensitive (`"JAVA"` = `"java"` = `"Java"`)
- ✅ Busca parcial (encontra em qualquer parte do texto)
- ✅ Performático (query otimizada no PostgreSQL)
- ✅ Seguro (protegido contra SQL Injection)

**Documentação:** [Filtros de Busca](api/SEARCH_FILTERS.md)

---

### 2️⃣ Ordenação Dinâmica

Controle total sobre a ordenação dos resultados:

```http
# Autores A-Z
GET /api/admin/authors?sortBy=name&sortDirection=asc

# Livros mais baratos primeiro
GET /api/public/books?sortBy=price&sortDirection=asc

# Lançamentos (mais recentes)
GET /api/public/books?sortBy=createdAt&sortDirection=desc

# Estoque baixo (menor primeiro)
GET /api/admin/books?lowStock=true&sortBy=stock&sortDirection=asc
```

**Parâmetros:**
- `sortBy`: Campo para ordenar (name, title, price, stock, createdAt)
- `sortDirection`: Direção (asc ou desc)

**Valores Padrão:**
- Autores: `name ASC`
- Livros: `createdAt DESC`

**Documentação:** [Ordenação (Sort)](api/SORT_IMPLEMENTATION.md)

---

### 3️⃣ Sistema de Logout Completo

Implementação de logout seguro com revogação de tokens:

```http
# Logout simples (revoga 1 token)
POST /api/auth/revoke
Body: { "refreshToken": "..." }

# Logout completo (revoga TODOS os tokens)
POST /api/auth/revoke-all
Body: { "refreshToken": "..." }
```

**Benefícios:**
- ✅ Revogação real no banco de dados
- ✅ Tokens roubados não podem ser usados após logout
- ✅ Logout de todas as sessões em caso de comprometimento
- ✅ Logs de auditoria para rastreamento

**Documentação:** [Sistema de Logout](security/LOGOUT_IMPLEMENTATION.md)

---

### 4️⃣ Gestão de Estoque

Controle completo do estoque de livros:

```http
# Atualizar estoque
POST /api/admin/books/{id}/stock
Body: {
  "adjustmentType": "SET" | "INCREASE" | "DECREASE",
  "quantity": 10,
  "reason": "Reposição de estoque"
}

# Listar livros com estoque baixo
GET /api/admin/books?lowStock=true&sortBy=stock&sortDirection=asc
```

**Tipos de Ajuste:**
- `SET`: Define valor absoluto
- `INCREASE`: Adiciona ao estoque atual
- `DECREASE`: Remove do estoque atual

**Validações:**
- ❌ Estoque não pode ficar negativo
- ✅ Histórico de ajustes registrado
- ✅ Filtro `lowStock` para alertas

---

## 🔧 Melhorias Técnicas

### **CORS Otimizado**
- CorsFilter customizado processando ANTES do Spring Security
- Headers CORS em respostas de erro (401/403)
- Preflight (OPTIONS) funcionando corretamente

### **Query JPQL Otimizada**
- Correção do erro `function lower(bytea) does not exist`
- Uso de `CAST(:param AS string)` para forçar tipo correto
- Busca funcionando com ou sem filtros

### **Architecture**
- Clean Architecture mantida
- DDD respeitado
- Separação de camadas clara
- Código limpo e testável

---

## 📊 Números da Release

| Métrica | Antes | Depois | Diferença |
|---------|-------|--------|-----------|
| Endpoints | 42 | 46 | +4 |
| Parâmetros de busca | 5 | 14 | +9 |
| Documentação | 47 docs | 51 docs | +4 |
| Migrations | 12 | 13 | +1 |

---

## 🔄 Breaking Changes

**Nenhum!** Todos os endpoints anteriores continuam funcionando normalmente. As novas features são **retrocompatíveis**.

---

## 📚 Documentação Atualizada

### Novos Documentos:
1. [Filtros de Busca](api/SEARCH_FILTERS.md) - Guia completo de busca
2. [Ordenação (Sort)](api/SORT_IMPLEMENTATION.md) - Guia completo de ordenação
3. [Sistema de Logout](security/LOGOUT_IMPLEMENTATION.md) - Implementação de logout
4. [Bugfix: Filtro NULL](api/BUGFIX_NULL_FILTER.md) - Correção PostgreSQL

### Atualizados:
- [README.md](../README.md) - Endpoints principais atualizados
- [Endpoints](api/endpoints.md) - Documentação completa de rotas
- [Changelog](history/changelog.md) - Histórico de mudanças
- [Collections Postman](api/postman/) - LOCAL e STAGING

---

## 🧪 Como Testar

### **1. Importar Collections Postman**
```bash
# LOCAL
docs/api/postman/Livraria-Tunoda-API.postman_collection.json

# STAGING
docs/api/postman/Livraria-Tunoda-API-STAGING.postman_collection.json
```

### **2. Fazer Login**
```http
POST /api/auth/login
Body: {
  "email": "admin@livraria.com",
  "password": "admin123"
}
```

### **3. Testar Novas Features**

**Busca:**
```http
GET /api/admin/authors?name=martin
GET /api/public/books?title=java
```

**Ordenação:**
```http
GET /api/public/books?sortBy=price&sortDirection=asc
GET /api/admin/books?sortBy=stock&sortDirection=asc
```

**Logout:**
```http
POST /api/auth/revoke
Body: { "refreshToken": "..." }
```

**Estoque:**
```http
POST /api/admin/books/{id}/stock
Body: {
  "adjustmentType": "INCREASE",
  "quantity": 10,
  "reason": "Reposição"
}
```

---

## 🐛 Bugs Corrigidos

1. ✅ **Erro PostgreSQL ao buscar sem filtro**
   - Problema: `function lower(bytea) does not exist`
   - Solução: `CAST(:param AS string)` na query JPQL

2. ✅ **CORS bloqueando respostas de erro**
   - Problema: Navegador bloqueava respostas 401/403
   - Solução: CorsFilter com `@Order(HIGHEST_PRECEDENCE)`

3. ✅ **Bean BookRepository não encontrado**
   - Problema: Erro ao subir aplicação
   - Solução: Correção de sintaxe no BookJpaRepository

---

## 🚀 Upgrade Path

### **Para atualizar de v1.0.0 para v1.1.0:**

1. **Atualizar código:**
   ```bash
   git pull origin main
   ```

2. **Rodar migrations:**
   ```bash
   # Flyway roda automaticamente no startup
   ./mvnw spring-boot:run
   ```

3. **Atualizar collections Postman:**
   - Importar novas collections de `docs/api/postman/`

4. **Testar endpoints:**
   - Verificar busca, ordenação e logout

**Não há downtime necessário!** A migração é transparente.

---

## 🎯 Próximos Passos (Roadmap v1.2.0)

### **Features Planejadas:**
- [ ] Full-Text Search com PostgreSQL `tsvector`
- [ ] Cache Redis para queries frequentes
- [ ] Histórico de ajustes de estoque
- [ ] Dashboard de métricas admin
- [ ] Notificações de estoque baixo
- [ ] Export de relatórios (CSV/PDF)

### **Melhorias Técnicas:**
- [ ] Testes de integração para busca
- [ ] Performance tuning de queries
- [ ] Índices otimizados no PostgreSQL
- [ ] Monitoramento de queries lentas

---

## 📞 Suporte

- **Documentação:** [docs/](.)
- **Issues:** GitHub Issues
- **Postman:** [Collections atualizadas](api/postman/)
- **Changelog:** [Histórico completo](history/changelog.md)

---

## 👏 Agradecimentos

Obrigado por usar a Livraria Tunoda API! Esta release foi focada em melhorar a experiência do desenvolvedor e a segurança da aplicação.

**Feedback?** Abra uma issue no GitHub!

---

**Versão:** 1.1.0  
**Data:** 2026-01-19  
**Status:** ✅ STABLE  
**Ambiente:** PRODUCTION READY
