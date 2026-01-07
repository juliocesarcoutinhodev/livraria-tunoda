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

## 🚀 Requisitos

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
│   │   │       ├── domain/
│   │   │       │   ├── model/          # Entidades JPA
│   │   │       │   └── exception/      # Exceções de negócio
│   │   │       ├── application/        # Casos de uso (futuramente)
│   │   │       └── infrastructure/
│   │   │           ├── config/         # Configurações
│   │   │           └── exception/      # Exception handlers
│   │   └── resources/
│   │       ├── application.yml         # Configuração base
│   │       ├── application-dev.yml     # Perfil desenvolvimento
│   │       ├── application-prod.yml    # Perfil produção
│   │       └── db/migration/           # Scripts Flyway
│   └── test/                           # Testes unitários e integração
├── docker-compose.yml                  # Orquestração do MySQL
├── .env                                # Variáveis de ambiente (não versionado)
├── .env.example                        # Template de variáveis
├── pom.xml                             # Dependências Maven
└── README.md                           # Este arquivo
```

## 🤝 Contribuindo

1. Nunca commite o arquivo `.env`
2. Siga a estrutura de camadas estabelecida
3. Mantenha o domínio livre de dependências de frameworks
4. Escreva testes para novas funcionalidades
5. Use migrations do Flyway para mudanças no banco
6. Mantenha logs sem informações sensíveis

## 📋 Convenções de Código

- **Entidades:** Sempre em português e no pacote `domain.model`
- **Tabelas:** Prefixo `tb_` (ex: `tb_livros`)
- **Constraints:** Prefixo `uk_` (unique), `fk_` (foreign key)
- **DTOs:** Sufixo `Request` ou `Response`
- **Exceptions:** Sufixo `Exception`

## 🔐 Segurança

- ✅ Senhas via variáveis de ambiente
- ✅ Nenhum segredo versionado no código
- ✅ Logs sem dados sensíveis
- ✅ Health check sem detalhes em produção
- ✅ SQL injection prevenido (JPA/Hibernate)

## 📚 Referências

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Versão:** 0.0.1-SNAPSHOT  
**Última atualização:** Janeiro 2026

