# 📬 Postman Collection - Livraria Tunoda API

Collection completa com todos os endpoints da API REST da Livraria Tunoda.

## 📥 Como Importar

### Opção 1: Importar via Arquivo
1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `Livraria-Tunoda-API.postman_collection.json`
4. Clique em **Import**

### Opção 2: Importar via URL (se estiver no GitHub)
1. Abra o Postman
2. Clique em **Import**
3. Cole a URL raw do arquivo no GitHub
4. Clique em **Import**

## 🔧 Configuração

### Variáveis da Collection

A collection já vem com 3 variáveis configuradas:

| Variável | Valor Padrão | Descrição |
|----------|--------------|-----------|
| `base_url` | `http://localhost:8080` | URL base da API |
| `author_id` | `cole-aqui-o-id-do-autor-criado` | ID do autor para testes |
| `book_id` | `cole-aqui-o-id-do-livro-criado` | ID do livro para testes |

### Como Usar as Variáveis

1. Execute o endpoint **"Criar Autor"**
2. Copie o `id` da resposta
3. Cole no valor da variável `author_id` (ícone de olho no canto superior direito)
4. Execute o endpoint **"Criar Livro"** (já usa `{{author_id}}` automaticamente)
5. Copie o `id` do livro criado
6. Cole no valor da variável `book_id`

Agora você pode testar todos os outros endpoints!

## 📚 Estrutura da Collection

### 🌐 Public - Catálogo (2 endpoints)
Endpoints públicos para consulta do catálogo.

- **GET** `/api/public/books` - Listar livros (paginado)
- **GET** `/api/public/books/{id}` - Detalhes do livro

### 📊 Public - Métricas (2 endpoints)
Endpoints públicos para registro de métricas.

- **POST** `/api/public/books/{id}/metrics/view` - Registrar visualização
- **POST** `/api/public/books/{id}/metrics/click` - Registrar clique

### 👤 Admin - Autores (3 endpoints)
Endpoints administrativos para gerenciamento de autores.

- **POST** `/api/admin/authors` - Criar autor
- **PUT** `/api/admin/authors/{id}` - Atualizar autor
- **PUT** `/api/admin/authors/{id}/status` - Ativar/Desativar

### 📖 Admin - Livros (4 endpoints)
Endpoints administrativos para gerenciamento de livros.

- **POST** `/api/admin/books` - Criar livro
- **PUT** `/api/admin/books/{id}` - Atualizar livro
- **PUT** `/api/admin/books/{id}/status` - Ativar/Desativar
- **GET** `/api/admin/books/{id}/metrics` - Consultar métricas

### 🏥 Health Check (1 endpoint)
Endpoint de monitoramento.

- **GET** `/api/v1/actuator/health` - Status da aplicação

**Total: 12 endpoints**

## 🚀 Fluxo de Teste Recomendado

### 1️⃣ Verificar Health
```
GET /api/v1/actuator/health
```
✅ Confirma que a aplicação está rodando

### 2️⃣ Criar Autor
```
POST /api/admin/authors
```
✅ Cria autor e obtém `author_id`

### 3️⃣ Criar Livro
```
POST /api/admin/books
```
✅ Cria livro vinculado ao autor e obtém `book_id`

### 4️⃣ Listar Livros
```
GET /api/public/books?page=0&size=10
```
✅ Verifica livro no catálogo público

### 5️⃣ Ver Detalhes do Livro
```
GET /api/public/books/{book_id}
```
✅ Vê informações completas incluindo autores

### 6️⃣ Registrar Métricas
```
POST /api/public/books/{book_id}/metrics/view
POST /api/public/books/{book_id}/metrics/click
```
✅ Registra interações do usuário

### 7️⃣ Consultar Métricas do Livro
```
GET /api/admin/books/{book_id}/metrics
```
✅ Retorna total de visualizações e cliques

### 8️⃣ Atualizar Livro
```
PUT /api/admin/books/{book_id}
```
✅ Atualiza informações do livro

### 9️⃣ Desativar Livro
```
PUT /api/admin/books/{book_id}/status
Body: { "status": "INACTIVE" }
```
✅ Livro não aparece mais no catálogo público

### 🔟 Tentar Desativar Autor com Livro Ativo
```
PUT /api/admin/authors/{author_id}/status
Body: { "status": "INACTIVE" }
```
❌ Deve retornar erro 422 (autor tem livro ativo)

### 1️⃣1️⃣ Ativar Livro Novamente
```
PUT /api/admin/books/{book_id}/status
Body: { "status": "ACTIVE" }
```
✅ Livro volta ao catálogo

## 📋 Exemplos de Request/Response

### Criar Autor (Sucesso)

**Request:**
```http
POST /api/admin/authors
Content-Type: application/json

{
  "name": "Robert C. Martin",
  "biography": "Conhecido como Uncle Bob...",
  "photoUrl": "https://example.com/uncle-bob.jpg"
}
```

**Response: 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Robert C. Martin",
  "biography": "Conhecido como Uncle Bob...",
  "photoUrl": "https://example.com/uncle-bob.jpg",
  "status": "ACTIVE"
}
```

### Criar Livro (Sucesso)

**Request:**
```http
POST /api/admin/books
Content-Type: application/json

{
  "title": "Clean Code",
  "description": "A Handbook of Agile Software Craftsmanship...",
  "photoUrl": "https://example.com/clean-code.jpg",
  "isbn": "978-0132350884",
  "price": 49.90,
  "currency": "BRL",
  "weight": 0.680,
  "weightUnit": "KILOGRAMS",
  "authorIds": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

**Response: 201 Created**
```json
{
  "id": "book-uuid-here",
  "title": "Clean Code",
  "description": "A Handbook of Agile Software Craftsmanship...",
  "photoUrl": "https://example.com/clean-code.jpg",
  "isbn": "978-0132350884",
  "price": 49.90,
  "currency": "BRL",
  "weight": 0.680,
  "weightUnit": "KILOGRAMS",
  "authors": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Robert C. Martin"
    }
  ],
  "status": "ACTIVE"
}
```

### Erro de Validação

**Response: 400 Bad Request**
```json
{
  "timestamp": "2026-01-07T17:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação",
  "path": "/api/admin/authors",
  "errors": [
    {
      "field": "name",
      "message": "O nome do autor é obrigatório"
    }
  ]
}
```

### Erro de Regra de Negócio

**Response: 422 Unprocessable Entity**
```json
{
  "timestamp": "2026-01-07T17:30:00",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Não é possível desativar o autor pois existem 3 livro(s) ativo(s) associado(s) a ele",
  "path": "/api/admin/authors/550e8400-e29b-41d4-a716-446655440000/status"
}
```

### Consultar Métricas do Livro (Sucesso)

**Request:**
```http
GET /api/admin/books/{book_id}/metrics
```

**Response: 200 OK**
```json
{
  "bookId": "book-uuid-here",
  "views": 152,
  "clicks": 34
}
```

### Consultar Métricas - Livro Sem Métricas

**Request:**
```http
GET /api/admin/books/{book_id}/metrics
```

**Response: 200 OK**
```json
{
  "bookId": "book-uuid-here",
  "views": 0,
  "clicks": 0
}
```

## 🎯 Dicas

### 1. Salvando Variáveis Automaticamente
Você pode adicionar scripts em **Tests** para salvar IDs automaticamente:

```javascript
// No endpoint "Criar Autor", aba Tests:
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.collectionVariables.set("author_id", jsonData.id);
}

// No endpoint "Criar Livro", aba Tests:
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.collectionVariables.set("book_id", jsonData.id);
}
```

### 2. Alterando Ambiente
Para testar em produção, crie um **Environment** novo:
- Clique em **Environments** (canto superior direito)
- Crie novo ambiente "Production"
- Adicione variável `base_url` com URL de produção
- Selecione o ambiente antes de executar

### 3. Executando em Batch
Use **Collection Runner** para executar todos os endpoints em sequência:
1. Clique nos três pontos da collection
2. Selecione **Run collection**
3. Configure ordem e dados
4. Clique em **Run**

## ⚠️ Observações Importantes

### Status Codes
- **200 OK** - Sucesso (GET, PUT com resposta)
- **201 Created** - Criação bem-sucedida (POST)
- **204 No Content** - Sucesso sem resposta (métricas)
- **400 Bad Request** - Erro de validação
- **404 Not Found** - Recurso não encontrado
- **422 Unprocessable Entity** - Regra de negócio violada
- **500 Internal Server Error** - Erro do servidor

### Soft Delete
- Entidades **INACTIVE** não aparecem em consultas públicas
- Dados **não são deletados** fisicamente
- Use endpoints `/status` para ativar/desativar

### Métricas
- Registro sempre retorna **204 No Content**
- Erros **não bloqueiam** a navegação
- Registradas apenas para livros **ACTIVE**
- Consulta de métricas retorna **0** para livros sem métricas
- Livros **INACTIVE** podem ter métricas consultadas

## 🐛 Troubleshooting

### Erro: "Connection Refused"
✅ Verifique se a aplicação está rodando: `./mvnw spring-boot:run`

### Erro: "404 Not Found" em todos os endpoints
✅ Verifique o `base_url`: deve ser `http://localhost:8080` (sem `/api`)

### Erro: "Livro não encontrado"
✅ Verifique se o `book_id` está correto na variável

### Erro: "Um ou mais autores informados não existem"
✅ Verifique se o `author_id` está correto e se o autor foi criado

### Livro não aparece na listagem pública
✅ Verifique se o status é `ACTIVE`  
✅ Verifique se pelo menos um autor está `ACTIVE`

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique o **Health Check** primeiro
2. Consulte o **README.md** principal
3. Verifique os logs da aplicação

---

**Collection Version:** 1.0  
**API Version:** 0.0.1-SNAPSHOT  
**Last Update:** 07 Janeiro 2026  
**Stories Implementadas:** 8/8 ✅

