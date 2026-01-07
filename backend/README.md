# 📚 Livraria Tunoda - Backend

API REST para gerenciamento de livraria, construída com Spring Boot seguindo princípios de Clean Architecture e boas práticas de desenvolvimento.

## 🎯 Stack Tecnológica

- **Java 25**
- **Spring Boot 3.5.9**
- **MySQL 9**
- **Flyway** (versionamento de banco)
- **Lombok** (redução de boilerplate)
- **Bean Validation** (validação de dados)
- **Spring Actuator** (monitoramento)
- **Docker & Docker Compose**

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizado em camadas bem definidas:

```
br.com.iraquitantunoda.livrariatunoda/
├── domain/                      # Camada de Domínio (DDD)
│   ├── model/                  # Aggregate Roots e Entidades
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
│   └── exception/             # Exceções de negócio
│       ├── BusinessException.java
│       └── ResourceNotFoundException.java
│
├── application/               # Casos de uso e lógica de aplicação
│   └── (a ser implementado)
│
└── infrastructure/           # Adaptadores e frameworks
    ├── config/              # Configurações do Spring
    │   └── StartupLogger.java
    └── exception/           # Tratamento global de erros
        ├── GlobalExceptionHandler.java
        ├── ErrorResponse.java
        └── ValidationError.java
```

### Princípios Aplicados

- ✅ **Domain-Driven Design (DDD)**
  - Aggregate Roots (`Book`, `Author`)
  - Value Objects (`ISBN`, `Money`, `Weight`)
  - Identidades tipadas (`BookId`, `AuthorId`)
  - Associação via IDs, não entidades diretas
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

## 📦 Modelo de Domínio

### Aggregate Roots

#### 📖 Book (Livro)
Aggregate Root principal que representa um livro no sistema.

**Atributos:**
- `id: BookId` - Identificador único do livro
- `title: String` - Título (obrigatório, máx. 300 caracteres)
- `description: String` - Descrição (obrigatória)
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



- **Java 25** ou superior
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
│   │   │           ├── persistence/          # (a implementar)
│   │   │           │   ├── entity/          # Entidades JPA
│   │   │           │   ├── repository/      # Repositories JPA
│   │   │           │   └── adapter/         # Adapters para domain
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
- ✅ Atributos completos de `Book` (título, descrição, ISBN, preço, peso, status)
- ✅ Atributos completos de `Author` (nome, biografia, foto, status)
- ✅ Value Objects: `ISBN`, `Money`, `Weight`, `WeightUnit`, `Status`
- ✅ Identidades tipadas: `BookId`, `AuthorId`
- ✅ Regras de consistência aplicadas nos construtores
- ✅ Entidades imutáveis (campos `final`)
- ✅ Domínio puro sem anotações JPA
- ✅ Associação via `AuthorId`, não entidade direta
- ✅ Regras de negócio centralizadas no domínio
- ✅ Lombok para redução de boilerplate

**Próximos Passos:**
- 🔜 Repositories (interfaces no domínio)
- 🔜 Adapters JPA (implementação na infra)
- 🔜 Migrations Flyway (tabelas físicas)
- 🔜 DTOs e Use Cases (camada application)
- 🔜 REST Controllers (camada web)

## 📚 Referências

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design - Vaughn Vernon](https://vaughnvernon.com/)

---

**Versão:** 0.0.1-SNAPSHOT  
**Última atualização:** Janeiro 2026

