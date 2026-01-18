# Domínio de Catálogo

Contexto delimitado responsável por gerenciar livros e autores no sistema.

## Visão Geral

**Responsabilidade:** Gerenciar o catálogo de livros e autores disponíveis na livraria.

**Aggregate Roots:** `Book`, `Author`

**Propósito:** CRUD de produtos do catálogo com regras de negócio centralizadas.

## Aggregate Roots

### Book (Livro)

Aggregate Root principal que representa um livro no sistema.

#### Atributos

- `id: BookId` - Identificador único do livro
- `title: String` - Título (obrigatório, máx. 300 caracteres)
- `description: String` - Descrição (obrigatória)
- `photoUrl: String` - URL da foto do livro (opcional)
- `isbn: ISBN` - Código ISBN (opcional, validado para ISBN-10 ou ISBN-13)
- `price: Money` - Preço (obrigatório, não negativo)
- `weight: Weight` - Peso (obrigatório, maior que zero)
- `authorIds: Set<AuthorId>` - Referências aos autores (mínimo 1)
- `status: Status` - Status (ACTIVE/INACTIVE)

#### Regras de Negócio

- Deve ter pelo menos um autor
- Título não pode ser vazio ou exceder 300 caracteres
- Preço não pode ser negativo
- Peso deve ser maior que zero
- ISBN é opcional, mas se fornecido deve ser válido

#### Métodos

**Criação:**
- `Book.create(...)` - Cria novo livro (gera ID automaticamente)
- `Book.reconstitute(...)` - Reconstitui livro existente (ex: do banco)

**Comportamento:**
- `activate()` - Ativa o livro no catálogo
- `deactivate()` - Desativa o livro (soft delete)
- `isActive()` - Verifica se o livro está ativo

### Author (Autor)

Aggregate Root que representa um autor no sistema.

#### Atributos

- `id: AuthorId` - Identificador único do autor
- `name: String` - Nome (obrigatório, máx. 200 caracteres)
- `biography: String` - Biografia (obrigatória)
- `photoUrl: String` - URL da foto (opcional)
- `status: Status` - Status (ACTIVE/INACTIVE)

#### Regras de Negócio

- Nome não pode ser vazio ou exceder 200 caracteres
- Biografia é obrigatória

#### Métodos

**Criação:**
- `Author.create(...)` - Cria novo autor (gera ID automaticamente)
- `Author.reconstitute(...)` - Reconstitui autor existente

**Comportamento:**
- `activate()` - Ativa o autor
- `deactivate()` - Desativa o autor (soft delete)
- `isActive()` - Verifica se o autor está ativo

## Value Objects

### ISBN

Representa o código International Standard Book Number.

#### Características

- Imutável
- Validação para ISBN-10 (10 dígitos) ou ISBN-13 (13 dígitos)
- Remove automaticamente espaços e hifens na validação

#### Métodos

- `ISBN.of(String)` - Factory method com validação

### Money

Representa valores monetários no sistema.

#### Características

- Imutável
- Não permite valores negativos
- Suporta múltiplas moedas

#### Métodos

- `Money.brl(BigDecimal)` - Atalho para Real brasileiro
- `Money.of(BigDecimal, String)` - Factory method genérico

### Weight

Representa o peso físico do livro.

#### Características

- Imutável
- Não permite valores zero ou negativos
- Suporta gramas (GRAMS) e quilogramas (KILOGRAMS)

#### Métodos

- `Weight.grams(BigDecimal)` - Atalho para gramas
- `Weight.kilograms(BigDecimal)` - Atalho para quilogramas

### Status

Enum simples que representa o status de uma entidade.

#### Valores

- `ACTIVE` - Entidade ativa no sistema
- `INACTIVE` - Entidade inativa (soft delete)

## Identidades Tipadas

### BookId e AuthorId

Identificadores tipados que encapsulam UUIDs.

#### Características

- Imutáveis
- Type-safe (evita confusão entre IDs de diferentes entidades)

#### Métodos

- `{Type}Id.generate()` - Gera novo UUID
- `{Type}Id.of(String)` - Cria a partir de string existente

## Relacionamentos

```
Book *----> AuthorId (1..*)
      |
      |     (O relacionamento é via ID, não via entidade)
      |
      └─────────────────────────────────┐
                                        |
Author (buscar separadamente)          |
```

**Importante:** `Book` referencia `AuthorId`, não a entidade `Author` diretamente. Isso garante:

- Desacoplamento entre aggregates
- Consistência eventual
- Facilita distribuição e escalabilidade

## Casos de Uso

### Livros

- `CreateBookUseCase` - Criar novo livro
- `UpdateBookUseCase` - Atualizar livro existente
- `ChangeBookStatusUseCase` - Ativar/desativar livro
- `GetBookDetailUseCase` - Buscar detalhes do livro
- `ListActiveBooksUseCase` - Listar livros ativos

### Autores

- `CreateAuthorUseCase` - Criar novo autor
- `UpdateAuthorUseCase` - Atualizar autor existente
- `ChangeAuthorStatusUseCase` - Ativar/desativar autor

## Persistência

### Entidades JPA

- `BookEntity` - Representação JPA do Book
- `AuthorEntity` - Representação JPA do Author

### Repositories

- `BookRepository` - Interface no domínio
- `BookRepositoryAdapter` - Implementação na infraestrutura
- `AuthorRepository` - Interface no domínio
- `AuthorRepositoryAdapter` - Implementação na infraestrutura

### Mappers

- `BookMapper` - MapStruct para Book ↔ BookEntity
- `AuthorMapper` - MapStruct para Author ↔ AuthorEntity

## API Endpoints

### Públicos

- `GET /api/public/books` - Listar livros ativos
- `GET /api/public/books/{id}` - Detalhes do livro
- `GET /api/public/books/most-viewed` - Livros mais visualizados
- `GET /api/public/books/most-clicked` - Livros mais clicados

### Administrativos (ROLE_ADMIN)

#### Autores
- `POST /api/admin/authors` - Criar autor
- `PUT /api/admin/authors/{id}` - Atualizar autor
- `PATCH /api/admin/authors/{id}/status` - Ativar/desativar autor

#### Livros
- `POST /api/admin/books` - Criar livro
- `PUT /api/admin/books/{id}` - Atualizar livro
- `PATCH /api/admin/books/{id}/status` - Ativar/desativar livro
- `GET /api/admin/books/{id}/metrics` - Métricas do livro

## Referências

- [Modelo de Domínio Completo](../architecture/domain-model.md)
- [Clean Architecture](../architecture/clean-architecture.md)
- [API Endpoints](../api/endpoints.md)
