# 📚 Livraria Tunoda - Backend

API REST para gerenciamento de livraria, construída com Spring Boot seguindo princípios de Clean Architecture e boas práticas de desenvolvimento.

## 🎯 Stack Tecnológica

- **Java 25**
- **Spring Boot 3.5.9**
- **MySQL 9**
- **Flyway** (versionamento de banco)
- **Lombok** (redução de boilerplate)
- **MapStruct 1.6.3** (mapeamento Domain ↔ Entity)
- **Bean Validation** (validação de dados)
- **Spring Actuator** (monitoramento)
- **Docker & Docker Compose**

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizado em camadas bem definidas:

```
br.com.iraquitantunoda.livrariatunoda/
├── domain/                      # Camada de Domínio (DDD)
│   ├── model/                  # Aggregate Roots - Catálogo
│   │   ├── Author.java        # Aggregate Root - Autor
│   │   ├── Book.java          # Aggregate Root - Livro
│   │   ├── AuthorId.java      # Identidade tipada de Autor
│   │   ├── BookId.java        # Identidade tipada de Livro
│   │   └── vo/                # Value Objects
│   │       ├── ISBN.java      # Código ISBN do livro
│   │       ├── Money.java     # Valor monetário (preço)
│   │       ├── Weight.java    # Peso do livro
│   │       ├── WeightUnit.java # Unidade de peso (g/kg)
│   │       └── Status.java    # Status (ACTIVE/INACTIVE)
│   ├── metric/                # Aggregate Roots - Métricas
│   │   ├── BookMetric.java   # Aggregate Root - Métrica
│   │   ├── BookMetricId.java # Identidade tipada
│   │   ├── EventType.java    # Enum (VIEW/CLICK)
│   │   └── BookMetricRepository.java
│   ├── repository/            # Interfaces de Repository (Ports)
│   │   ├── AuthorRepository.java
│   │   └── BookRepository.java
│   └── exception/             # Exceções de negócio
│       ├── BusinessException.java
│       └── ResourceNotFoundException.java
│
├── application/               # Casos de uso e lógica de aplicação
│   ├── dto/                   # DTOs (Request/Response)
│   │   ├── AuthorDetailDTO.java
│   │   ├── AuthorResponse.java
│   │   ├── AuthorSummaryDTO.java
│   │   ├── BookCatalogResponse.java
│   │   ├── BookDetailResponse.java
│   │   ├── BookResponse.java
│   │   ├── ChangeStatusRequest.java
│   │   ├── CreateAuthorRequest.java
│   │   ├── CreateBookRequest.java
│   │   ├── PageResponse.java
│   │   ├── UpdateAuthorRequest.java
│   │   └── UpdateBookRequest.java
│   ├── mapper/                # MapStruct Mappers (Domain → DTO)
│   │   ├── AuthorDTOMapper.java
│   │   └── BookDTOMapper.java
│   └── usecase/               # Casos de Uso
│       ├── ChangeAuthorStatusUseCase.java
│       ├── ChangeBookStatusUseCase.java
│       ├── CreateAuthorUseCase.java
│       ├── CreateBookUseCase.java
│       ├── GetBookDetailUseCase.java
│       ├── ListActiveBooksUseCase.java
│       ├── RecordBookMetricUseCase.java
│       ├── UpdateAuthorUseCase.java
│       └── UpdateBookUseCase.java
│
└── infrastructure/           # Adaptadores e frameworks
    ├── config/              # Configurações do Spring
    │   └── StartupLogger.java
    ├── exception/           # Tratamento global de erros
    │   ├── GlobalExceptionHandler.java
    │   ├── ErrorResponse.java
    │   └── ValidationError.java
    ├── persistence/         # Camada de Persistência
    │   ├── entity/         # Entidades JPA
    │   │   ├── AuthorEntity.java
    │   │   ├── BookEntity.java
    │   │   └── BookMetricEntity.java
    │   ├── repository/     # Spring Data Repositories
    │   │   ├── AuthorJpaRepository.java
    │   │   ├── BookJpaRepository.java
    │   │   └── BookMetricJpaRepository.java
    │   ├── mapper/         # MapStruct Mappers (Domain ↔ Entity)
    │   │   ├── AuthorMapper.java
    │   │   └── BookMapper.java
    │   └── adapter/        # Adapters (implementam interfaces do domínio)
    │       ├── AuthorRepositoryAdapter.java
    │       ├── BookRepositoryAdapter.java
    │       └── BookMetricRepositoryAdapter.java
    └── web/                # Controllers REST
        └── controller/
            ├── AdminAuthorController.java
            ├── AdminBookController.java
            └── PublicBookController.java
```

### Princípios Aplicados

- ✅ **Domain-Driven Design (DDD)**
  - Aggregate Roots (`Book`, `Author`, `BookMetric`)
  - Value Objects (`ISBN`, `Money`, `Weight`)
  - Identidades tipadas (`BookId`, `AuthorId`, `BookMetricId`)
  - Associação via IDs, não entidades diretas
  - **Bounded Contexts** - Contextos isolados
- ✅ **Clean Architecture**
  - Separação de responsabilidades
  - Inversão de dependências
  - Domínio sem dependência de frameworks (sem JPA no domain)
- ✅ **Imutabilidade**
  - Value Objects completamente imutáveis
  - Entidades com campos `final` (apenas `status` mutável)
- ✅ **Encapsulamento**
  - Factory methods (`create`, `reconstitute`)
  - Validações centralizadas no domínio
  - Coleções expostas como imutáveis

### Bounded Contexts (Contextos Delimitados)

O projeto está organizado em **contextos delimitados** independentes:

#### **Contexto 1: Catálogo** (`domain.model`)
- **Responsabilidade:** Gerenciar livros e autores
- **Agregados:** `Book`, `Author`
- **Propósito:** CRUD de produtos do catálogo

#### **Contexto 2: Analytics** (`domain.metric`)
- **Responsabilidade:** Rastrear eventos de interação
- **Agregados:** `BookMetric`
- **Propósito:** Observabilidade e análise de comportamento

#### **Contexto 3: Carrinho de Compras** (`domain.model`)
- **Responsabilidade:** Gerenciar carrinhos e itens
- **Agregados:** `Cart`, `CartItem` (Value Object)
- **Propósito:** Gestão do carrinho de compras antes da conversão em pedido

**Vantagens dessa separação:**
- ✅ Baixo acoplamento entre contextos
- ✅ Evolução independente
- ✅ Facilita migração para microservices
- ✅ Testes isolados por contexto
- ✅ Equipes podem trabalhar em paralelo

## 📦 Modelo de Domínio

### Aggregate Roots

#### 📖 Book (Livro)
Aggregate Root principal que representa um livro no sistema.

**Atributos:**
- `id: BookId` - Identificador único do livro
- `title: String` - Título (obrigatório, máx. 300 caracteres)
- `description: String` - Descrição (obrigatória)
- `photoUrl: String` - URL da foto do livro (opcional)
- `isbn: ISBN` - Código ISBN (opcional, validado para ISBN-10 ou ISBN-13)
- `price: Money` - Preço (obrigatório, não negativo)
- `weight: Weight` - Peso (obrigatório, maior que zero)
- `authorIds: Set<AuthorId>` - Referências aos autores (mínimo 1)
- `status: Status` - Status (ACTIVE/INACTIVE)

**Regras de Negócio:**
- Deve ter pelo menos um autor
- Título não pode ser vazio ou exceder 300 caracteres
- Preço não pode ser negativo
- Peso deve ser maior que zero
- ISBN é opcional, mas se fornecido deve ser válido

**Métodos:**
- `Book.create(...)` - Cria novo livro (gera ID automaticamente)
- `Book.reconstitute(...)` - Reconstitui livro existente (ex: do banco)
- `activate()` / `deactivate()` - Gerencia ciclo de vida
- `isActive()` - Verifica se está ativo

#### ✍️ Author (Autor)
Aggregate Root que representa um autor no sistema.

**Atributos:**
- `id: AuthorId` - Identificador único do autor
- `name: String` - Nome (obrigatório, máx. 200 caracteres)
- `biography: String` - Biografia (obrigatória)
- `photoUrl: String` - URL da foto (opcional)
- `status: Status` - Status (ACTIVE/INACTIVE)

**Regras de Negócio:**
- Nome não pode ser vazio ou exceder 200 caracteres
- Biografia é obrigatória

**Métodos:**
- `Author.create(...)` - Cria novo autor (gera ID automaticamente)
- `Author.reconstitute(...)` - Reconstitui autor existente
- `activate()` / `deactivate()` - Gerencia ciclo de vida
- `isActive()` - Verifica se está ativo

### Value Objects

#### 📘 ISBN
Representa o código International Standard Book Number.

**Características:**
- Imutável
- Validação para ISBN-10 (10 dígitos) ou ISBN-13 (13 dígitos)
- Remove automaticamente espaços e hifens na validação
- `ISBN.of(String)` - Factory method com validação

#### 💰 Money
Representa valores monetários no sistema.

**Características:**
- Imutável
- Não permite valores negativos
- Suporta múltiplas moedas
- `Money.brl(BigDecimal)` - Atalho para Real brasileiro
- `Money.of(BigDecimal, String)` - Factory method genérico

#### ⚖️ Weight
Representa o peso físico do livro.

**Características:**
- Imutável
- Não permite valores zero ou negativos
- Suporta gramas (GRAMS) e quilogramas (KILOGRAMS)
- `Weight.grams(BigDecimal)` - Atalho para gramas
- `Weight.kilograms(BigDecimal)` - Atalho para quilogramas

#### 🏷️ Status
Enum simples que representa o status de uma entidade.

**Valores:**
- `ACTIVE` - Entidade ativa no sistema
- `INACTIVE` - Entidade inativa (soft delete)

### Identidades Tipadas

#### BookId e AuthorId
Identificadores tipados que encapsulam UUIDs.

**Características:**
- Imutáveis
- Type-safe (evita confusão entre IDs de diferentes entidades)
- `{Type}Id.generate()` - Gera novo UUID
- `{Type}Id.of(String)` - Cria a partir de string existente

### Relacionamentos

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

---

## 📊 Domínio de Métricas (Analytics)

### Aggregate Root: BookMetric

Representa um evento de interação do usuário com um livro.

**Atributos:**
- `id: BookMetricId` - Identificador único da métrica
- `bookId: BookId` - Referência ao livro
- `eventType: EventType` - Tipo de evento (VIEW, CLICK)
- `occurredAt: LocalDateTime` - Timestamp do evento

**Características:**
- Domínio isolado do catálogo (`domain.metric`)
- Apenas referencia `BookId` (não a entidade `Book`)
- Persistência simples, sem agregações
- Preparado para processamento assíncrono futuro

**EventType:**
- `VIEW` - Visualização da página de detalhes
- `CLICK` - Clique em ação de interesse (comprar, adicionar ao carrinho)

**Factory Method:**
- `BookMetric.record(bookId, eventType)` - Registra novo evento

---

## 🛒 Domínio de Carrinho de Compras

### Aggregate Root: Cart

Representa um carrinho de compras no sistema.

**Atributos:**
- `id: CartId` - Identificador único do carrinho
- `items: List<CartItem>` - Lista de itens no carrinho
- `status: CartStatus` - Status do carrinho (ACTIVE, EXPIRED, CONVERTED)
- `createdAt: LocalDateTime` - Data de criação
- `updatedAt: LocalDateTime` - Data de última atualização

**CartStatus:**
- `ACTIVE` - Carrinho em uso, pode ser modificado
- `EXPIRED` - Carrinho expirado, não editável
- `CONVERTED` - Carrinho convertido em pedido

**Regras de Negócio:**
- Carrinho inicia sempre com status ACTIVE
- Carrinho não pode ser modificado se estiver EXPIRED ou CONVERTED
- Carrinho pode existir vazio
- Carrinho vazio não é válido para conversão em pedido
- Total do carrinho é sempre derivado dos itens
- Valores são sempre calculados em tempo de execução

**Métodos:**
- `Cart.create()` - Cria novo carrinho vazio (status ACTIVE)
- `Cart.reconstitute(...)` - Reconstitui carrinho existente
- `addItem(CartItem)` - Adiciona item (ou incrementa quantidade se já existir)
- `updateItem(BookId, quantity)` - Atualiza quantidade de um item
- `removeItem(BookId)` - Remove item completamente
- `calculateSubtotal()` - Calcula subtotal (soma dos itens)
- `calculateTotal()` - Calcula total (igual ao subtotal, preparado para descontos futuros)
- `isValid()` - Verifica se tem itens e está ACTIVE
- `validateForCheckout(Set<BookId>)` - Valida se está pronto para checkout
- `markAsExpired()` - Marca como expirado
- `markAsConverted()` - Marca como convertido em pedido

### Value Object: CartItem

Representa um item dentro do carrinho.

**Atributos:**
- `id: CartItemId` - Identificador único do item
- `bookId: BookId` - Referência ao livro
- `bookTitle: String` - Título do livro (congelado no momento da adição)
- `quantity: int` - Quantidade (mínimo 1)
- `unitPrice: Money` - Preço unitário (congelado no momento da adição)

**Regras de Negócio:**
- Quantidade mínima é 1
- Preço unitário é congelado no momento da adição
- Título é armazenado para histórico consistente
- Subtotal é sempre calculado: `unitPrice × quantity`

**Métodos:**
- `CartItem.create(...)` - Cria novo item
- `CartItem.reconstitute(...)` - Reconstitui item existente
- `updateQuantity(int)` - Atualiza quantidade
- `incrementQuantity(int)` - Incrementa quantidade
- `getSubtotal()` - Calcula subtotal do item
- `isForBook(BookId)` - Verifica se item é de um livro específico

**Decisões Importantes:**
- **Título e preço congelados:** Evita divergências se o produto for alterado posteriormente
- **Subtotal calculado:** Garante consistência matemática
- **Value Object:** Não tem ciclo de vida independente do Cart

---

## 🚀 Pré-requisitos
- **Maven 3.8+**
- **Docker & Docker Compose**
- **Git**

## ⚙️ Configuração Local

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd livraria-tunoda/backend
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

### 3. Suba o banco de dados

```bash
docker-compose up -d
```

Aguarde o MySQL ficar saudável (health check configurado).

### 4. Execute a aplicação

```bash
./mvnw spring-boot:run
```

Ou pelo IDE de sua preferência.

### 5. Verifique se está funcionando

```bash
curl http://localhost:8080/api/v1/actuator/health
```

Resposta esperada:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "MySQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": { "status": "UP" }
  }
}
```

## 🔧 Variáveis de Ambiente

### Desenvolvimento (`.env`)

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `MYSQL_ROOT_PASSWORD` | Senha do root do MySQL | `root_password` |
| `MYSQL_DATABASE` | Nome do banco de dados | `livraria_db` |
| `MYSQL_USER` | Usuário da aplicação | `livraria_user` |
| `MYSQL_PASSWORD` | Senha do usuário | `livraria_password` |
| `MYSQL_PORT` | Porta do MySQL | `3306` |
| `SPRING_PROFILES_ACTIVE` | Perfil ativo (dev/prod) | `dev` |

### Produção

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `JDBC_DATABASE_URL` | URL completa do banco | ✅ |
| `MYSQL_USER` | Usuário do banco | ✅ |
| `MYSQL_PASSWORD` | Senha do banco | ✅ |
| `SPRING_PROFILES_ACTIVE` | Deve ser `prod` | ✅ |

**⚠️ IMPORTANTE:** Nunca versione o arquivo `.env` com credenciais reais!

## 🗄️ Banco de Dados

### Migrations (Flyway)

O Flyway gerencia automaticamente as migrations do banco. Os arquivos ficam em:

```
src/main/resources/db/migration/
└── V1__create-table-books.sql
```

**Convenção de nomenclatura:** `V{versão}__{descrição}.sql`

### Estrutura de Tabelas

A aplicação possui as seguintes tabelas:

**tb_authors**
```sql
id VARCHAR(36) PRIMARY KEY
name VARCHAR(200) NOT NULL
biography TEXT NOT NULL
photo_url VARCHAR(500)
status VARCHAR(20) NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

**tb_books**
```sql
id VARCHAR(36) PRIMARY KEY
title VARCHAR(300) NOT NULL
description TEXT NOT NULL
photo_url VARCHAR(500)
isbn VARCHAR(20) UNIQUE
price_amount DECIMAL(10,2) NOT NULL
price_currency VARCHAR(3) NOT NULL
weight_value DECIMAL(10,3) NOT NULL
weight_unit VARCHAR(20) NOT NULL
status VARCHAR(20) NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

**tb_book_authors** (relacionamento N:N)
```sql
book_id VARCHAR(36)
author_id VARCHAR(36)
PRIMARY KEY (book_id, author_id)
```

**tb_book_metrics** (métricas de interação)
```sql
id VARCHAR(36) PRIMARY KEY
book_id VARCHAR(36) NOT NULL
event_type VARCHAR(20) NOT NULL
occurred_at TIMESTAMP NOT NULL
```

**tb_carts** (carrinhos de compras)
```sql
id VARCHAR(36) PRIMARY KEY
status VARCHAR(20) NOT NULL
created_at TIMESTAMP NOT NULL
updated_at TIMESTAMP NOT NULL
```

**tb_cart_items** (itens do carrinho)
```sql
id VARCHAR(36) PRIMARY KEY
cart_id VARCHAR(36) NOT NULL
book_id VARCHAR(36) NOT NULL
book_title VARCHAR(300) NOT NULL
quantity INT NOT NULL
unit_price_amount DECIMAL(10,2) NOT NULL
unit_price_currency VARCHAR(3) NOT NULL
FOREIGN KEY (cart_id) REFERENCES tb_carts(id) ON DELETE CASCADE
```

### Conexão Manual

Para conectar diretamente ao MySQL:

```bash
docker exec -it mysql-livraria-tunoda mysql -u livraria_user -p
# Senha: livraria_password (ou conforme seu .env)
```

## 📝 Logs

### Níveis de Log por Ambiente

**Desenvolvimento:**
- Aplicação: `DEBUG`
- SQL: `DEBUG` (com binding de parâmetros)
- Web: `DEBUG`

**Produção:**
- Aplicação: `INFO`
- SQL: `ERROR`
- Web: `WARN`

### Formato

```
yyyy-MM-dd HH:mm:ss [thread] LEVEL logger - mensagem
```

**Segurança:** Logs são sanitizados e não expõem dados sensíveis.

## 🛡️ Tratamento de Erros

A API retorna erros padronizados seguindo o formato:

```json
{
  "timestamp": "2026-01-05T14:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Recurso não encontrado",
  "path": "/api/v1/livros/999"
}
```

### Para erros de validação:

```json
{
  "timestamp": "2026-01-05T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação",
  "path": "/api/v1/livros",
  "errors": [
    {
      "field": "titulo",
      "message": "não deve estar em branco"
    }
  ]
}
```

### Exceções Tratadas

- `ResourceNotFoundException` → 404 Not Found
- `BusinessException` → 422 Unprocessable Entity
- `MethodArgumentNotValidException` → 400 Bad Request
- `ConstraintViolationException` → 400 Bad Request
- `Exception` (genérica) → 500 Internal Server Error

## 📊 Monitoramento

### Health Check

Endpoint: `GET /api/v1/actuator/health`

**Desenvolvimento:** Exibe detalhes completos (DB, disk space, etc)  
**Produção:** Exibe apenas status UP/DOWN

## 🧪 Testes

```bash
./mvnw test
```

## 📦 Build

### Desenvolvimento

```bash
./mvnw clean install
```

### Produção

```bash
./mvnw clean package -DskipTests
java -jar target/livraria-tunoda-0.0.1-SNAPSHOT.jar
```

## 🐳 Docker

### Apenas o banco de dados

```bash
docker-compose up -d
```

### Parar e remover containers

```bash
docker-compose down
```

### Remover volumes (⚠️ apaga os dados)

```bash
docker-compose down -v
```

## 📁 Estrutura de Diretórios

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/com/iraquitantunoda/livrariatunoda/
│   │   │       ├── StartupApplication.java
│   │   │       │
│   │   │       ├── domain/                    # 📦 Camada de Domínio (DDD)
│   │   │       │   ├── model/
│   │   │       │   │   ├── Author.java       # Aggregate Root - Autor
│   │   │       │   │   ├── Book.java         # Aggregate Root - Livro
│   │   │       │   │   ├── AuthorId.java     # Identidade tipada
│   │   │       │   │   ├── BookId.java       # Identidade tipada
│   │   │       │   │   └── vo/               # Value Objects
│   │   │       │   │       ├── ISBN.java     # Código ISBN
│   │   │       │   │       ├── Money.java    # Valor monetário
│   │   │       │   │       ├── Weight.java   # Peso físico
│   │   │       │   │       ├── WeightUnit.java # Unidade de peso
│   │   │       │   │       └── Status.java   # Status ACTIVE/INACTIVE
│   │   │       │   ├── repository/          # Interfaces de Repository
│   │   │       │   │   ├── AuthorRepository.java
│   │   │       │   │   └── BookRepository.java
│   │   │       │   └── exception/
│   │   │       │       ├── BusinessException.java
│   │   │       │       └── ResourceNotFoundException.java
│   │   │       │
│   │   │       ├── application/              # 🎯 Casos de Uso (a implementar)
│   │   │       │   ├── dto/                  # DTOs (Request/Response)
│   │   │       │   ├── service/              # Services/Use Cases
│   │   │       │   └── port/                 # Interfaces (repositories)
│   │   │       │
│   │   │       └── infrastructure/           # 🔌 Adaptadores
│   │   │           ├── config/               # Configurações Spring
│   │   │           │   └── StartupLogger.java
│   │   │           ├── exception/            # Exception handlers
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ErrorResponse.java
│   │   │           │   └── ValidationError.java
│   │   │           ├── persistence/          # ✅ Camada de Persistência
│   │   │           │   ├── entity/          # Entidades JPA
│   │   │           │   │   ├── AuthorEntity.java
│   │   │           │   │   └── BookEntity.java
│   │   │           │   ├── repository/      # Spring Data Repositories
│   │   │           │   │   ├── AuthorJpaRepository.java
│   │   │           │   │   └── BookJpaRepository.java
│   │   │           │   ├── mapper/          # MapStruct Mappers
│   │   │           │   │   ├── AuthorMapper.java
│   │   │           │   │   └── BookMapper.java
│   │   │           │   └── adapter/         # Adapters (implementam domínio)
│   │   │           │       ├── AuthorRepositoryAdapter.java
│   │   │           │       └── BookRepositoryAdapter.java
│   │   │           └── web/                  # (a implementar)
│   │   │               ├── controller/      # REST Controllers
│   │   │               └── mapper/          # Mappers DTO <-> Domain
│   │   │
│   │   └── resources/
│   │       ├── application.yml              # Configuração base
│   │       ├── application-dev.yml          # Perfil desenvolvimento
│   │       ├── application-prod.yml         # Perfil produção
│   │       └── db/migration/                # Scripts Flyway
│   │           └── V1__create-table-books.sql
│   │
│   └── test/                                # 🧪 Testes
│       └── java/.../livrariatunoda/
│           ├── StartupApplicationTests.java
│           ├── domain/                      # (testes do domínio)
│           ├── application/                 # (testes de casos de uso)
│           └── infrastructure/              # (testes de integração)
│
├── docker-compose.yml                       # Orquestração do MySQL
├── .env                                     # Variáveis de ambiente (não versionado)
├── .env.example                             # Template de variáveis
├── pom.xml                                  # Dependências Maven
└── README.md                                # Este arquivo
```

## 🤝 Contribuindo

1. Nunca commite o arquivo `.env`
2. Siga a estrutura de camadas estabelecida
3. Mantenha o domínio livre de dependências de frameworks
4. Escreva testes para novas funcionalidades
5. Use migrations do Flyway para mudanças no banco
6. Mantenha logs sem informações sensíveis

## 📋 Convenções de Código

### Domínio (Domain)
- **Aggregate Roots:** PascalCase, nomes em inglês (ex: `Book`, `Author`)
- **Value Objects:** PascalCase, nomes em inglês (ex: `ISBN`, `Money`, `Weight`)
- **Identidades:** Sufixo `Id` (ex: `BookId`, `AuthorId`)
- **Factory Methods:** 
  - `create(...)` - Para novas entidades
  - `reconstitute(...)` - Para reconstruir entidades existentes
  - `of(...)` - Para Value Objects
- **Validações:** No construtor privado ou método `validate()`
- **Imutabilidade:** Campos `final` sempre que possível

### Infraestrutura
- **Entidades JPA:** Sufixo `Entity` (ex: `BookEntity`, `AuthorEntity`)
- **Tabelas:** Prefixo `tb_` (ex: `tb_books`, `tb_authors`)
- **Constraints:** Prefixo `uk_` (unique), `fk_` (foreign key)
- **DTOs:** Sufixo `Request` ou `Response` (ex: `CreateBookRequest`)
- **Exceptions:** Sufixo `Exception`
- **Mappers:** Sufixo `Mapper` (ex: `BookMapper`)

### Lombok
- **Value Objects:** `@Value` (imutabilidade total)
- **Entities:** `@Getter` + `@ToString` + `@EqualsAndHashCode`
- **Coleções:** Usar `@Getter(AccessLevel.NONE)` e método manual para retornar coleção imutável

### Enums e Pragmatismo DDD
- **Enums simples:** Reutilizados do domínio na infraestrutura (ex: `Status`, `WeightUnit`)
- **Abordagem pragmática:** JPA mapeia enums do domínio diretamente com `@Enumerated(EnumType.STRING)`
- **Sem duplicação:** Evitamos criar `StatusEntity` e `Status` para enums sem comportamento
- **Quando duplicar:** Apenas se domínio e persistência tiverem representações muito diferentes

## 🔐 Segurança

- ✅ Senhas via variáveis de ambiente
- ✅ Nenhum segredo versionado no código
- ✅ Logs sem dados sensíveis
- ✅ Health check sem detalhes em produção
- ✅ SQL injection prevenido (JPA/Hibernate)

## ✨ Stories Implementadas

### 📖 Story #1: Modelo de Domínio - Livros e Autores

**Objetivo:** Representar livros e autores no domínio para permitir vendas, métricas, frete e exibição no frontend.

**Implementado:**
- ✅ Entidade `Book` criada como Aggregate Root
- ✅ Entidade `Author` criada como Aggregate Root
- ✅ `Book` possui referência a um ou mais `AuthorId`
- ✅ Atributos completos de `Book` (título, descrição, **photoUrl**, ISBN, preço, peso, status)
- ✅ Atributos completos de `Author` (nome, biografia, photoUrl, status)
- ✅ Value Objects: `ISBN`, `Money`, `Weight`, `WeightUnit`, `Status`
- ✅ Identidades tipadas: `BookId`, `AuthorId`
- ✅ Regras de consistência aplicadas nos construtores
- ✅ Entidades imutáveis (campos `final`)
- ✅ Domínio puro sem anotações JPA
- ✅ Associação via `AuthorId`, não entidade direta
- ✅ Regras de negócio centralizadas no domínio
- ✅ Lombok para redução de boilerplate

**Status:** ✅ **COMPLETA**

---

### 💾 Story #2: Persistência de Livros e Autores

**Objetivo:** Criar infraestrutura de persistência sem vazar JPA para o domínio e sem acoplamento indevido entre agregados.

**Implementado:**

#### Estrutura de Banco
- ✅ Migration `V1__create-table-books.sql` criada
- ✅ Tabela `tb_authors` (id, name, biography, photo_url, status, timestamps)
- ✅ Tabela `tb_books` (id, title, description, photo_url, isbn, price_amount, price_currency, weight_value, weight_unit, status, timestamps)
- ✅ Tabela `tb_book_authors` (relacionamento N:N)
- ✅ Chaves primárias e integridade referencial configuradas
- ✅ Índices para performance (status, relacionamentos)
- ✅ Constraint UNIQUE em ISBN

#### Persistência Implementada
- ✅ `Book` persiste com sucesso
- ✅ `Book` pode ter um ou mais autores
- ✅ `Book` pode existir sem ISBN (campo opcional)
- ✅ `Book` agora inclui **photoUrl** para imagem da capa
- ✅ `Author` persiste com sucesso
- ✅ `Author` pode existir sem livros associados
- ✅ Filtros por status (ACTIVE/INACTIVE)

#### Repositórios
- ✅ Interfaces no domínio
- ✅ Implementação JPA na infraestrutura
- ✅ Adapters implementando interfaces do domínio

#### Conversão Domain ↔ JPA
- ✅ **MapStruct** configurado para mapeamento automático
- ✅ Conversão explícita de Value Objects
- ✅ Conversão de coleções (Set<AuthorId> ↔ Set<String>)

**Status:** ✅ **COMPLETA**

---

### 🔍 Story #3: Listagem Pública de Livros

**Objetivo:** Expor listagem pública de livros ativos com paginação.

**Implementado:**
- ✅ Endpoint: `GET /api/public/books?page=0&size=10`
- ✅ Retorna apenas livros ACTIVE
- ✅ Ordenação por data de criação (mais recentes primeiro)
- ✅ Paginação funcional (page, size, totalElements)
- ✅ DTO: `BookCatalogResponse` (id, title, description, photoUrl, price, authors)
- ✅ Use Case: `ListActiveBooksUseCase`
- ✅ Consulta otimizada (sem N+1)
- ✅ MapStruct para mapeamento Domain → DTO

**Status:** ✅ **COMPLETA**

---

### 📄 Story #4: Detalhes de Livro

**Objetivo:** Endpoint público para visualizar detalhes completos de um livro.

**Implementado:**
- ✅ Endpoint: `GET /api/public/books/{bookId}`
- ✅ Retorna apenas livros ACTIVE
- ✅ Retorna 404 se livro não existir ou estiver inativo
- ✅ DTO: `BookDetailResponse` (id, title, description, photoUrl, isbn, price, authors completos)
- ✅ Use Case: `GetBookDetailUseCase`
- ✅ Autores com biografia e foto completos
- ✅ MapStruct para mapeamento Domain → DTO

**Status:** ✅ **COMPLETA**

---

### ➕ Story #5: Cadastro Administrativo

**Objetivo:** Permitir cadastro de livros e autores via endpoints administrativos.

**Implementado:**

#### Cadastro de Autor
- ✅ Endpoint: `POST /api/admin/authors`
- ✅ DTO: `CreateAuthorRequest` (name, biography, photoUrl)
- ✅ Use Case: `CreateAuthorUseCase`
- ✅ Status ACTIVE por padrão
- ✅ Validações: Bean Validation + Domínio

#### Cadastro de Livro
- ✅ Endpoint: `POST /api/admin/books`
- ✅ DTO: `CreateBookRequest` (title, description, photoUrl, isbn, price, weight, authorIds)
- ✅ Use Case: `CreateBookUseCase`
- ✅ Valida autores existentes e ativos
- ✅ Status ACTIVE por padrão
- ✅ ISBN opcional mas validado se fornecido

**Status:** ✅ **COMPLETA**

---

### ✏️ Story #6: Atualização Administrativa

**Objetivo:** Permitir atualização de livros e autores mantendo integridade do domínio.

**Implementado:**

#### Atualização de Autor
- ✅ Endpoint: `PUT /api/admin/authors/{authorId}`
- ✅ DTO: `UpdateAuthorRequest` (name, biography, photoUrl, status)
- ✅ Use Case: `UpdateAuthorUseCase`
- ✅ Usa `reconstitute()` para manter imutabilidade

#### Atualização de Livro
- ✅ Endpoint: `PUT /api/admin/books/{bookId}`
- ✅ DTO: `UpdateBookRequest` (title, description, photoUrl, isbn, price, weight, authorIds, status)
- ✅ Use Case: `UpdateBookUseCase`
- ✅ Valida autores existentes e ativos
- ✅ Usa `reconstitute()` para manter imutabilidade

**Status:** ✅ **COMPLETA**

---

### 🔄 Story #7: Ativação/Desativação

**Objetivo:** Controlar visibilidade do catálogo sem perder dados (soft delete).

**Implementado:**

#### Gestão de Status de Autor
- ✅ Endpoint: `PUT /api/admin/authors/{authorId}/status`
- ✅ DTO: `ChangeStatusRequest` (status)
- ✅ Use Case: `ChangeAuthorStatusUseCase`
- ✅ Regra: Não pode desativar se tiver livros ativos
- ✅ Usa métodos `activate()` / `deactivate()` do domínio

#### Gestão de Status de Livro
- ✅ Endpoint: `PUT /api/admin/books/{bookId}/status`
- ✅ DTO: `ChangeStatusRequest` (status)
- ✅ Use Case: `ChangeBookStatusUseCase`
- ✅ Regra: Não pode ativar sem autores ativos
- ✅ Usa métodos `activate()` / `deactivate()` do domínio

**Status:** ✅ **COMPLETA**

---

### 📊 Story #8: Métricas de Visualização

**Objetivo:** Registrar eventos de interação dos usuários com os livros.

**Implementado:**

#### Domínio de Métricas
- ✅ Pacote isolado: `domain.metric`
- ✅ Aggregate Root: `BookMetric`
- ✅ Enum: `EventType` (VIEW, CLICK)
- ✅ Repository: `BookMetricRepository`
- ✅ Identidade: `BookMetricId`

#### Persistência
- ✅ Migration: `V2__create-table-book-metrics.sql`
- ✅ Tabela: `tb_book_metrics` (id, book_id, event_type, occurred_at)
- ✅ Entity: `BookMetricEntity`
- ✅ JPA Repository: `BookMetricJpaRepository`
- ✅ Adapter: `BookMetricRepositoryAdapter`

#### Endpoints Públicos
- ✅ `POST /api/public/books/{bookId}/metrics/view` - Registrar visualização
- ✅ `POST /api/public/books/{bookId}/metrics/click` - Registrar clique
- ✅ Use Case: `RecordBookMetricUseCase`
- ✅ Fail Silently: Erros não bloqueiam navegação
- ✅ Registra apenas para livros ativos
- ✅ Sempre retorna 204 No Content

**Status:** ✅ **COMPLETA**

---

### 📈 Story #9: Consulta Administrativa de Métricas

**Objetivo:** Disponibilizar métricas agregadas de visualização e cliques via API administrativa.

**Implementado:**

#### Consulta de Métricas
- ✅ Endpoint: `GET /api/admin/books/{bookId}/metrics`
- ✅ DTO: `BookMetricsResponse` (bookId, views, clicks)
- ✅ Use Case: `GetBookMetricsUseCase`
- ✅ Métricas agregadas via COUNT
- ✅ Retorna 0 para livros sem métricas
- ✅ Retorna 404 se livro não existir

#### Regras de Negócio
- ✅ Livro inativo pode ter métricas consultadas
- ✅ Apenas livros existentes podem ser consultados
- ✅ Não retorna eventos individuais (apenas agregação)
- ✅ Implementação read-only (sem alteração de métricas)

#### Infraestrutura
- ✅ Query agregada no `BookMetricJpaRepository`
- ✅ Método `countByBookIdGroupedByEventType` no repositório de domínio
- ✅ Implementação eficiente com `COUNT` e filtro por `event_type`
- ✅ Integração com `AdminBookController`

#### Extensão: Top Livros por Métricas
- ✅ Endpoints públicos para top livros
- ✅ DTO: `TopBookMetricDTO` e `TopBooksResponse`
- ✅ Use Cases: `GetTopViewedBooksUseCase` e `GetTopClickedBooksUseCase`
- ✅ Query agregada com GROUP BY e ORDER BY
- ✅ Retorna apenas livros ativos
- ✅ Limite configurável (padrão: 10)
- ✅ Timestamp de geração do ranking

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #10: Modelo de Domínio - Carrinho de Compras

**Objetivo:** Criar modelo de domínio sólido para o carrinho de compras com regras claras de consistência.

**Implementado:**

#### Estrutura do Carrinho
- ✅ Entidade `Cart` criada como Aggregate Root
- ✅ Value Object `CartItem` criado
- ✅ Identidades tipadas: `CartId`, `CartItemId`
- ✅ Enum `CartStatus` (ACTIVE, EXPIRED, CONVERTED)
- ✅ Lista de itens no carrinho
- ✅ Data de criação e atualização

#### Status do Carrinho
- ✅ Carrinho inicia sempre com status ACTIVE
- ✅ Status: ACTIVE (em uso), EXPIRED (expirado), CONVERTED (pedido criado)
- ✅ Validação de status antes de modificações

#### Regras de Negócio
- ✅ Carrinho não pode ser alterado se EXPIRED ou CONVERTED
- ✅ Carrinho pode existir vazio
- ✅ Carrinho vazio não é válido para conversão
- ✅ Preço e título congelados no CartItem
- ✅ Quantidade mínima de 1 por item

#### Comportamento do Agregado
- ✅ `addItem()` - Adiciona ou incrementa quantidade
- ✅ `updateItem()` - Atualiza quantidade
- ✅ `removeItem()` - Remove item completamente
- ✅ `calculateSubtotal()` - Calcula subtotal
- ✅ `calculateTotal()` - Calcula total
- ✅ `isValid()` - Valida estado
- ✅ Métodos protegidos por validação de status

#### Características
- ✅ Domínio sem anotações JPA
- ✅ Nenhuma dependência de infraestrutura
- ✅ Regras centralizadas no domínio
- ✅ Value Objects (Money, CartItem)
- ✅ Testes unitários completos

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #11: Persistência de Carrinho

**Objetivo:** Criar infraestrutura de persistência para carrinho sem vazar JPA para o domínio.

**Implementado:**

#### Estrutura de Banco
- ✅ Migration `V3__create-table-carts.sql` criada
- ✅ Tabela `tb_carts` (id, status, created_at, updated_at)
- ✅ Tabela `tb_cart_items` (id, cart_id, book_id, book_title, quantity, unit_price_amount, unit_price_currency)
- ✅ Relacionamento com CASCADE DELETE
- ✅ Índice em `cart_id`

#### Persistência Implementada
- ✅ `Cart` persiste com sucesso
- ✅ `CartItem` persiste com relação bidirecional
- ✅ Carrinho pode ser criado vazio
- ✅ Items são salvos junto com o carrinho

#### Repositórios
- ✅ Interface `CartRepository` no domínio
- ✅ Implementação JPA na infraestrutura
- ✅ Adapter: `CartRepositoryAdapter`

#### Conversão Domain ↔ JPA
- ✅ **MapStruct** configurado para mapeamento
- ✅ `CartMapper` com métodos para conversão
- ✅ Conversão de CartItem com Money
- ✅ Método `toEntityWithItems()` para relação bidirecional

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #12: Adicionar Item ao Carrinho

**Objetivo:** Permitir adicionar livros ao carrinho com preço congelado e soma automática de quantidade.

**Implementado:**

#### Endpoint
- ✅ `POST /api/carts/{cartId}/items`
- ✅ Request: `AddItemToCartRequest` (bookId, quantity)
- ✅ Response: `CartResponse` completo com items, subtotal e total

#### Comportamento
- ✅ Livro adicionado ao carrinho
- ✅ Quantidade respeitada
- ✅ Se livro já existe: quantidade é somada
- ✅ Carrinho atualizado e persistido

#### Regras de Negócio
- ✅ Carrinho deve existir
- ✅ Carrinho deve estar ACTIVE
- ✅ Livro deve existir e estar ACTIVE
- ✅ Quantidade mínima de 1
- ✅ Preço capturado e congelado no momento da adição
- ✅ Total recalculado automaticamente

#### Use Case
- ✅ `AddItemToCartUseCase` criado
- ✅ Validações de carrinho e livro
- ✅ Criação de `CartItem` com preço congelado
- ✅ Domínio gerencia soma de quantidade

#### DTOs
- ✅ `CartResponse` atualizado (items, subtotal, currency, total)
- ✅ `CartItemDTO` criado (itemId, bookId, bookTitle, quantity, unitPrice, subtotal)
- ✅ `CartDTOMapper` usando MapStruct

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #13: Atualizar/Remover Itens do Carrinho

**Objetivo:** Permitir edição de itens do carrinho garantindo consistência de valores.

**Implementado:**

#### Atualizar Quantidade
- ✅ Endpoint: `PUT /api/carts/{cartId}/items/{bookId}`
- ✅ Request: `UpdateCartItemRequest` (quantity)
- ✅ Use Case: `UpdateCartItemUseCase`
- ✅ Quantidade validada (> 0)

#### Remover Item
- ✅ Endpoint: `DELETE /api/carts/{cartId}/items/{bookId}`
- ✅ Use Case: `RemoveCartItemUseCase`
- ✅ Remoção completa do item

#### Regras de Negócio
- ✅ Carrinho deve existir e estar ACTIVE
- ✅ Item deve existir no carrinho
- ✅ Quantidade deve ser inteira positiva
- ✅ Quantidade zero não é permitida (usar DELETE)
- ✅ Total recalculado após operação

#### Decisões Arquiteturais
- ✅ DELETE semântico para remoção
- ✅ PUT para atualização completa
- ✅ Validações no domínio
- ✅ Total sempre derivado dos items

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #14: Visualizar Carrinho

**Objetivo:** Permitir consulta do estado completo do carrinho.

**Implementado:**

#### Endpoint
- ✅ `GET /api/carts/{cartId}`
- ✅ Response: `CartResponse` completo
- ✅ Use Case: `GetCartUseCase`

#### Comportamento
- ✅ Retorna dados completos do carrinho
- ✅ Não altera estado (read-only)
- ✅ Carrinho pode ser visualizado vazio
- ✅ Pode ser visualizado em qualquer status

#### Dados Retornados
- ✅ cartId, status, createdAt, updatedAt
- ✅ Lista de items com: itemId, bookId, bookTitle, quantity, unitPrice, currency, subtotal
- ✅ Subtotal do carrinho
- ✅ Currency
- ✅ Total do carrinho

#### Regras de Negócio
- ✅ Carrinho deve existir
- ✅ Visualização não altera dados
- ✅ Valores calculados pelo domínio
- ✅ `@Transactional(readOnly = true)`

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #15: Calcular Total do Carrinho

**Objetivo:** Centralizar no domínio todas as regras de cálculo do carrinho.

**Análise:** Esta story já estava 100% implementada nas stories anteriores.

**Implementado:**

#### Cálculo no Domínio
- ✅ `Cart.calculateSubtotal()` - Soma subtotais dos itens
- ✅ `Cart.calculateTotal()` - Total (igual ao subtotal, preparado para descontos)
- ✅ `CartItem.getSubtotal()` - Calcula unitPrice × quantity
- ✅ Nenhum cálculo em controller ou use case

#### Características
- ✅ Total derivado sempre dos items
- ✅ Valores nunca persistidos (sempre calculados)
- ✅ Money encapsula precisão e operações
- ✅ Carrinho vazio retorna zero
- ✅ Validações de quantidade garantem consistência

#### Testes
- ✅ Carrinho vazio (total = 0)
- ✅ Carrinho com um item
- ✅ Carrinho com múltiplos itens
- ✅ Cálculo de subtotal por item

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #16: Validar Carrinho para Checkout

**Objetivo:** Centralizar validações para garantir carrinho pronto para conversão em pedido.

**Implementado:**

#### Endpoint
- ✅ `POST /api/carts/{cartId}/validate`
- ✅ Response: `ValidateCartResponse` (cartId, valid, message)
- ✅ Use Case: `ValidateCartUseCase`

#### Método no Domínio
- ✅ `Cart.validateForCheckout(Set<BookId> activeBookIds)`
- ✅ Validação explícita e centralizada
- ✅ Sem alteração de estado

#### Regras Validadas
- ✅ Carrinho deve existir
- ✅ Carrinho deve estar ACTIVE
- ✅ Carrinho deve ter ao menos 1 item
- ✅ Todos os items devem ser válidos
- ✅ Todos os livros devem estar ativos
- ✅ Total do carrinho deve ser maior que zero

#### Comportamento
- ✅ Validação não altera carrinho
- ✅ Erros de negócio claros e semânticos
- ✅ Preparado para checkout, frete e pagamento
- ✅ Use case busca livros via `BookRepository`

#### Testes
- ✅ Carrinho válido (sucesso)
- ✅ Carrinho inativo (erro)
- ✅ Carrinho vazio (erro)
- ✅ Carrinho com livro inativo (erro)

**Status:** ✅ **COMPLETA**

---

## 📊 Endpoints da API

### Públicos (Catálogo)

```
GET    /api/public/books                    → Listar livros (paginado)
GET    /api/public/books/{id}               → Detalhes do livro
GET    /api/public/books/most-viewed        → Top livros mais visualizados
GET    /api/public/books/most-clicked       → Top livros mais clicados
POST   /api/public/books/{id}/metrics/view  → Registrar visualização
POST   /api/public/books/{id}/metrics/click → Registrar clique
```

### Carrinho de Compras

```
POST   /api/carts                           → Criar carrinho
GET    /api/carts/{id}                      → Visualizar carrinho
POST   /api/carts/{id}/validate             → Validar carrinho para checkout
POST   /api/carts/{id}/items                → Adicionar item
PUT    /api/carts/{id}/items/{bookId}       → Atualizar quantidade
DELETE /api/carts/{id}/items/{bookId}       → Remover item
```

### Administrativos

```
POST   /api/admin/authors              → Criar autor
PUT    /api/admin/authors/{id}         → Atualizar autor
PUT    /api/admin/authors/{id}/status  → Ativar/Desativar autor

POST   /api/admin/books                → Criar livro
PUT    /api/admin/books/{id}           → Atualizar livro
PUT    /api/admin/books/{id}/status    → Ativar/Desativar livro
GET    /api/admin/books/{id}/metrics   → Consultar métricas
```

### 📬 Postman Collection

Uma collection completa do Postman está disponível em `docs/Livraria-Tunoda-API.postman_collection.json`.

**Como usar:**
1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `docs/Livraria-Tunoda-API.postman_collection.json`
4. Configure as variáveis `author_id`, `book_id` e `cart_id` após criar os recursos
5. Teste todos os **20 endpoints** disponíveis

**Endpoints incluídos:**
- 4 endpoints de catálogo público
- 2 endpoints de métricas públicas
- 6 endpoints administrativos (autores e livros)
- 1 endpoint administrativo (métricas)
- 6 endpoints de carrinho de compras
- 1 endpoint de health check

📖 **Documentação completa:** Consulte `docs/README.md` para instruções detalhadas, exemplos e fluxo de testes.

---

**Próximos Passos:**
- 🔜 Autenticação e autorização (JWT)
- 🔜 Dashboard de métricas
- 🔜 Carrinho de compras
- 🔜 Processamento de pedidos
- 🔜 Integração com gateway de pagamento
- 🔜 Cálculo de frete
- 🔜 Documentação OpenAPI/Swagger

## 📚 Referências

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [MapStruct Documentation](https://mapstruct.org/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design - Vaughn Vernon](https://vaughnvernon.com/)

---

**Versão:** 0.0.1-SNAPSHOT  
**Última atualização:** 12 Janeiro 2026  
**Stories Implementadas:** 14/14 ✅  
**Endpoints Disponíveis:** 20

---

## 🎯 Progresso do Projeto

### Sprint 1: Catálogo (Stories #1-7) ✅
- ✅ Modelo de domínio completo
- ✅ Persistência com MapStruct
- ✅ Endpoints públicos e administrativos
- ✅ CRUD completo de livros e autores

### Sprint 2: Analytics (Stories #8-9) ✅
- ✅ Domínio de métricas isolado
- ✅ Registro de eventos (view/click)
- ✅ Consulta de métricas agregadas
- ✅ Top livros mais visualizados/clicados

### Sprint 3: Carrinho de Compras (Stories #10-14) ✅
- ✅ Modelo de domínio do carrinho
- ✅ Persistência de carrinho e itens
- ✅ CRUD de itens do carrinho
- ✅ Cálculo automático de totais
- ✅ Validação para checkout

### Próximas Sprints 🔜
- Sprint 4: Checkout e Pedidos
- Sprint 5: Cálculo de Frete
- Sprint 6: Integração com Pagamento
- Sprint 7: Autenticação e Autorização
- Sprint 8: Notificações e E-mail
