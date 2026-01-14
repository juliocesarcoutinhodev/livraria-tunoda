# 🔄 GUIA DE MIGRAÇÃO: MySQL → PostgreSQL

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Alterações Necessárias](#alterações-necessárias)
3. [Scripts SQL Corrigidos](#scripts-sql-corrigidos)
4. [Checklist Detalhado](#checklist-detalhado)
5. [Procedimento de Migração](#procedimento-de-migração)

---

## 🎯 VISÃO GERAL

### Escopo da Migração
- **De:** MySQL 9
- **Para:** PostgreSQL 17 (ou 16)
- **Complexidade:** Média-Baixa
- **Tempo Estimado:** 5-8 horas
- **Risco:** Baixo (arquitetura bem desacoplada)

### Arquivos Impactados
```
✏️  pom.xml                                    (dependências)
✏️  docker-compose.yml                         (serviço de banco)
✏️  .env.example                               (variáveis)
✏️  ENV_VARIABLES.md                           (documentação)
✏️  src/main/resources/application.yml         (config principal)
✏️  src/main/resources/application-local.yml   (config local)
✏️  src/main/resources/application-dev.yml     (config dev)
✏️  src/main/resources/application-prod.yml    (config prod)
✏️  src/test/resources/application.yml         (config testes)
✏️  src/main/resources/db/migration/V1__*.sql  (migration)
✏️  src/main/resources/db/migration/V7__*.sql  (migration)
✏️  src/main/resources/db/migration/V8__*.sql  (migration)
✏️  src/main/resources/db/migration/V10__*.sql (migration)
✏️  src/main/resources/db/migration/V11__*.sql (migration)
✏️  src/main/resources/db/migration/V12__*.sql (migration)
✏️  src/main/java/.../ShippingPayloadEntity.java (entity)
```

---

## ⚙️ ALTERAÇÕES NECESSÁRIAS

### 1. pom.xml

#### ❌ REMOVER:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

#### ✅ ADICIONAR:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

---

### 2. docker-compose.yml

#### ❌ VERSÃO MYSQL (atual):
```yaml
services:
  mysql:
    image: mysql:9
    container_name: mysql-livraria-tunoda
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - ${MYSQL_PORT}:${MYSQL_PORT}
    volumes:
      - mysql-data_livraria:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  mysql-data_livraria:
```

#### ✅ VERSÃO POSTGRESQL (nova):
```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: postgres-livraria-tunoda
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - postgres-data_livraria:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  postgres-data_livraria:
```

---

### 3. Variáveis de Ambiente

#### .env.example e ENV_VARIABLES.md

**TROCAR:**
```bash
# ❌ MySQL
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=livraria_db
MYSQL_USER=livraria_user
MYSQL_PASSWORD=livraria_password
MYSQL_PORT=3306
```

**PARA:**
```bash
# ✅ PostgreSQL
POSTGRES_USER=livraria_user
POSTGRES_PASSWORD=livraria_password
POSTGRES_DB=livraria_db
POSTGRES_PORT=5432
```

**JDBC_DATABASE_URL (produção):**
```bash
# ❌ MySQL
JDBC_DATABASE_URL=jdbc:mysql://localhost:3306/livraria_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC

# ✅ PostgreSQL
JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/livraria_db
```

---

### 4. application.yml (principal)

```yaml
spring:
  application:
    name: Livraria Tunoda
  datasource:
    driver-class-name: org.postgresql.Driver  # ✅ TROCAR
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect  # ✅ TROCAR
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:local}
```

---

### 5. application-local.yml

```yaml
spring:
  application:
    name: Livraria Tunoda
  datasource:
    url: jdbc:postgresql://localhost:${POSTGRES_PORT:5432}/${POSTGRES_DB:livraria_db}  # ✅ TROCAR
    username: ${POSTGRES_USER:livraria_user}  # ✅ TROCAR
    password: ${POSTGRES_PASSWORD:livraria_password}  # ✅ TROCAR
    driver-class-name: org.postgresql.Driver  # ✅ TROCAR
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect  # ✅ TROCAR
  flyway:
    baseline-on-migrate: true
    locations: classpath:db/migration
    enabled: true
```

---

### 6. application-dev.yml

```yaml
spring:
  application:
    name: Livraria Tunoda
  datasource:
    url: jdbc:postgresql://localhost:${POSTGRES_PORT:5432}/${POSTGRES_DB:livraria_db}  # ✅ TROCAR
    username: ${POSTGRES_USER:livraria_user}  # ✅ TROCAR
    password: ${POSTGRES_PASSWORD:livraria_password}  # ✅ TROCAR
    driver-class-name: org.postgresql.Driver  # ✅ TROCAR
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect  # ✅ TROCAR
  flyway:
    baseline-on-migrate: true
    locations: classpath:db/migration
    enabled: true
```

---

### 7. application-prod.yml

```yaml
spring:
  application:
    name: Livraria Tunoda
  datasource:
    url: ${JDBC_DATABASE_URL}  # Deve ser jdbc:postgresql://...
    username: ${POSTGRES_USER}  # ✅ TROCAR
    password: ${POSTGRES_PASSWORD}  # ✅ TROCAR
    driver-class-name: org.postgresql.Driver  # ✅ TROCAR
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: false
        dialect: org.hibernate.dialect.PostgreSQLDialect  # ✅ TROCAR
  flyway:
    baseline-on-migrate: true
    locations: classpath:db/migration
    enabled: true
```

---

### 8. src/test/resources/application.yml

```yaml
spring:
  datasource:
    driver-class-name: org.h2.Driver
    url: jdbc:h2:mem:testdb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE  # ✅ TROCAR MODE
    username: sa
    password:

  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: false
```

---

## 📄 SCRIPTS SQL CORRIGIDOS

### V1__create-table-books.sql

#### ❌ ANTES (MySQL):
```sql
CREATE TABLE tb_authors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    biography TEXT NOT NULL,
    photo_url VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tb_books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    -- ... outros campos ...
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_books_isbn UNIQUE (isbn)
);
```

#### ✅ DEPOIS (PostgreSQL):
```sql
CREATE TABLE tb_authors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    biography TEXT NOT NULL,
    photo_url VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tb_books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    -- ... outros campos ...
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uk_books_isbn UNIQUE (isbn)
);
```

**⚠️ IMPORTANTE:** O `updated_at` será gerenciado pelo JPA via `@PreUpdate` nas entidades.

---

### V7__create-table-shipping-payloads.sql

#### ❌ ANTES (MySQL):
```sql
CREATE TABLE tb_shipping_payloads (
    id VARCHAR(36) PRIMARY KEY,
    shipping_quote_id VARCHAR(36) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    raw_payload JSON NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE,
    INDEX idx_shipping_payloads_quote_id (shipping_quote_id),
    INDEX idx_shipping_payloads_provider (provider),
    INDEX idx_shipping_payloads_created_at (created_at)
);
```

#### ✅ DEPOIS (PostgreSQL):
```sql
CREATE TABLE tb_shipping_payloads (
    id VARCHAR(36) PRIMARY KEY,
    shipping_quote_id VARCHAR(36) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    raw_payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE
);

CREATE INDEX idx_shipping_payloads_quote_id ON tb_shipping_payloads(shipping_quote_id);
CREATE INDEX idx_shipping_payloads_provider ON tb_shipping_payloads(provider);
CREATE INDEX idx_shipping_payloads_created_at ON tb_shipping_payloads(created_at);
```

**Mudanças:**
- `JSON` → `JSONB` (mais performático no PostgreSQL)
- Índices separados (melhor prática PostgreSQL)

---

### V8__add-to-postal-code-to-shipping-quotes.sql

#### ❌ ANTES (MySQL):
```sql
ALTER TABLE tb_shipping_quotes
ADD COLUMN to_postal_code VARCHAR(9) NOT NULL DEFAULT '00000-000';

ALTER TABLE tb_shipping_quotes
ALTER COLUMN to_postal_code DROP DEFAULT;
```

#### ✅ DEPOIS (PostgreSQL):
```sql
ALTER TABLE tb_shipping_quotes
ADD COLUMN to_postal_code VARCHAR(9) NOT NULL DEFAULT '00000-000';

ALTER TABLE tb_shipping_quotes
ALTER COLUMN to_postal_code DROP DEFAULT;
```

**✅ FUNCIONA IGUAL** - Sintaxe compatível!

---

### V10__add-shipping-to-orders.sql

#### ❌ ANTES (MySQL):
```sql
ALTER TABLE tb_orders
    ADD COLUMN shipping_quote_id VARCHAR(36) NULL COMMENT 'ID da cotação de frete selecionada',
    ADD COLUMN shipping_cost_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Valor do frete',
    ADD COLUMN shipping_cost_currency VARCHAR(3) NOT NULL DEFAULT 'BRL' COMMENT 'Moeda do frete';

CREATE INDEX idx_orders_shipping_quote_id ON tb_orders(shipping_quote_id);

ALTER TABLE tb_orders
    MODIFY COLUMN subtotal_amount DECIMAL(10, 2) NOT NULL COMMENT 'Subtotal dos produtos (sem frete)',
    MODIFY COLUMN total_amount DECIMAL(10, 2) NOT NULL COMMENT 'Total do pedido (subtotal + frete)';
```

#### ✅ DEPOIS (PostgreSQL):
```sql
-- Adicionar colunas (sem COMMENT inline)
ALTER TABLE tb_orders
    ADD COLUMN shipping_quote_id VARCHAR(36) NULL,
    ADD COLUMN shipping_cost_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN shipping_cost_currency VARCHAR(3) NOT NULL DEFAULT 'BRL';

-- Adicionar índice
CREATE INDEX idx_orders_shipping_quote_id ON tb_orders(shipping_quote_id);

-- Adicionar comentários (sintaxe PostgreSQL)
COMMENT ON COLUMN tb_orders.shipping_quote_id IS 'ID da cotação de frete selecionada';
COMMENT ON COLUMN tb_orders.shipping_cost_amount IS 'Valor do frete';
COMMENT ON COLUMN tb_orders.shipping_cost_currency IS 'Moeda do frete';
COMMENT ON COLUMN tb_orders.subtotal_amount IS 'Subtotal dos produtos (sem frete)';
COMMENT ON COLUMN tb_orders.total_amount IS 'Total do pedido (subtotal + frete)';
```

---

### V11__create-table-users.sql

#### ❌ ANTES (MySQL):
```sql
CREATE TABLE tb_users (
    id VARCHAR(36) PRIMARY KEY COMMENT 'Identificador unico do usuario',
    name VARCHAR(200) NOT NULL COMMENT 'Nome completo do usuario',
    email VARCHAR(255) NOT NULL COMMENT 'Email unico para autenticacao',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Senha armazenada como hash BCrypt',
    role VARCHAR(20) NOT NULL COMMENT 'Papel do usuario (ADMIN)',
    status VARCHAR(20) NOT NULL COMMENT 'Status do usuario (ACTIVE, BLOCKED)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do usuario',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de ultima atualizacao',

    CONSTRAINT uk_users_email UNIQUE (email)
) COMMENT 'Usuarios administrativos do sistema';

CREATE INDEX idx_users_email ON tb_users(email);
CREATE INDEX idx_users_status ON tb_users(status);
CREATE INDEX idx_users_role ON tb_users(role);
```

#### ✅ DEPOIS (PostgreSQL):
```sql
-- Criar tabela (sem COMMENT inline)
CREATE TABLE tb_users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT uk_users_email UNIQUE (email)
);

-- Adicionar índices
CREATE INDEX idx_users_email ON tb_users(email);
CREATE INDEX idx_users_status ON tb_users(status);
CREATE INDEX idx_users_role ON tb_users(role);

-- Adicionar comentários
COMMENT ON TABLE tb_users IS 'Usuarios administrativos do sistema';
COMMENT ON COLUMN tb_users.id IS 'Identificador unico do usuario';
COMMENT ON COLUMN tb_users.name IS 'Nome completo do usuario';
COMMENT ON COLUMN tb_users.email IS 'Email unico para autenticacao';
COMMENT ON COLUMN tb_users.password_hash IS 'Senha armazenada como hash BCrypt';
COMMENT ON COLUMN tb_users.role IS 'Papel do usuario (ADMIN)';
COMMENT ON COLUMN tb_users.status IS 'Status do usuario (ACTIVE, BLOCKED)';
COMMENT ON COLUMN tb_users.created_at IS 'Data de criacao do usuario';
COMMENT ON COLUMN tb_users.updated_at IS 'Data de ultima atualizacao';
```

---

### V12__create-table-refresh-tokens.sql

#### ❌ ANTES (MySQL):
```sql
CREATE TABLE tb_refresh_tokens (
    id VARCHAR(36) PRIMARY KEY COMMENT 'Identificador unico do token',
    user_id VARCHAR(36) NOT NULL COMMENT 'Usuario dono do token',
    token VARCHAR(36) NOT NULL COMMENT 'Token UUID aleatorio',
    created_at TIMESTAMP NOT NULL COMMENT 'Data de criacao',
    expires_at TIMESTAMP NOT NULL COMMENT 'Data de expiracao',
    revoked BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Se o token foi revogado',

    CONSTRAINT uk_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE
) COMMENT 'Tokens de refresh para renovacao de autenticacao';

CREATE INDEX idx_refresh_tokens_user_id ON tb_refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON tb_refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON tb_refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON tb_refresh_tokens(revoked);
```

#### ✅ DEPOIS (PostgreSQL):
```sql
-- Criar tabela (sem COMMENT inline)
CREATE TABLE tb_refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uk_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE
);

-- Adicionar índices
CREATE INDEX idx_refresh_tokens_user_id ON tb_refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON tb_refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON tb_refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON tb_refresh_tokens(revoked);

-- Adicionar comentários
COMMENT ON TABLE tb_refresh_tokens IS 'Tokens de refresh para renovacao de autenticacao';
COMMENT ON COLUMN tb_refresh_tokens.id IS 'Identificador unico do token';
COMMENT ON COLUMN tb_refresh_tokens.user_id IS 'Usuario dono do token';
COMMENT ON COLUMN tb_refresh_tokens.token IS 'Token UUID aleatorio';
COMMENT ON COLUMN tb_refresh_tokens.created_at IS 'Data de criacao';
COMMENT ON COLUMN tb_refresh_tokens.expires_at IS 'Data de expiracao';
COMMENT ON COLUMN tb_refresh_tokens.revoked IS 'Se o token foi revogado';
```

---

### V13__insert-admin-user.sql

#### ✅ FUNCIONA IGUAL - Nenhuma mudança necessária!
```sql
INSERT INTO tb_users (
    id,
    name,
    email,
    password_hash,
    role,
    status,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Administrador',
    'admin@livraria.com',
    '$2a$12$P0yvBoH9ucTiDfcUjG5T2uWsfyPLfRsJbpvsSOJ9Aqh1vWvdUOMtK',
    'ADMIN',
    'ACTIVE',
    NOW(),
    NOW()
);
```

---

### ShippingPayloadEntity.java

#### ❌ ANTES:
```java
@Column(name = "raw_payload", nullable = false, columnDefinition = "JSON")
private String rawPayload;
```

#### ✅ DEPOIS:
```java
@Column(name = "raw_payload", nullable = false, columnDefinition = "JSONB")
private String rawPayload;
```

---

## ✅ CHECKLIST DETALHADO

### Fase 1: Preparação (antes de parar a aplicação)

- [ ] Fazer backup completo do banco MySQL
- [ ] Exportar dados importantes (se houver em produção)
- [ ] Criar branch Git para a migração
- [ ] Ler toda esta documentação

### Fase 2: Alterações de Código

#### Dependências
- [ ] Editar `pom.xml`: remover MySQL, adicionar PostgreSQL
- [ ] Editar `pom.xml`: remover flyway-mysql, adicionar flyway-database-postgresql

#### Configurações
- [ ] Editar `docker-compose.yml`: trocar serviço mysql por postgres
- [ ] Editar `.env.example`: renomear variáveis MySQL → PostgreSQL
- [ ] Editar `ENV_VARIABLES.md`: atualizar documentação
- [ ] Editar `application.yml`: driver e dialect
- [ ] Editar `application-local.yml`: URL, driver, dialect, variáveis
- [ ] Editar `application-dev.yml`: URL, driver, dialect, variáveis
- [ ] Editar `application-prod.yml`: driver, dialect, variáveis
- [ ] Editar `src/test/resources/application.yml`: H2 MODE

#### Entidades
- [ ] Editar `ShippingPayloadEntity.java`: JSON → JSONB

### Fase 3: Migrações SQL

- [ ] Editar `V1__create-table-books.sql`: remover ON UPDATE CURRENT_TIMESTAMP
- [ ] Editar `V7__create-table-shipping-payloads.sql`: JSON → JSONB, índices separados
- [ ] Verificar `V8__add-to-postal-code-to-shipping-quotes.sql`: OK!
- [ ] Editar `V10__add-shipping-to-orders.sql`: remover COMMENT, usar COMMENT ON
- [ ] Editar `V11__create-table-users.sql`: remover COMMENT, ON UPDATE, usar COMMENT ON
- [ ] Editar `V12__create-table-refresh-tokens.sql`: remover COMMENT, usar COMMENT ON
- [ ] Verificar `V13__insert-admin-user.sql`: OK!

### Fase 4: Ambiente Local

- [ ] Criar arquivo `.env` local com variáveis PostgreSQL
- [ ] Parar containers MySQL: `docker-compose down`
- [ ] Remover volumes antigos: `docker volume rm livraria-tunoda-backend_mysql-data_livraria`
- [ ] Compilar projeto: `mvn clean install`
- [ ] Subir PostgreSQL: `docker-compose up -d`
- [ ] Verificar logs: `docker-compose logs -f postgres`

### Fase 5: Testes

- [ ] Executar aplicação localmente
- [ ] Verificar logs do Flyway (migrations executadas)
- [ ] Verificar tabelas criadas: `docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db -c "\dt"`
- [ ] Executar testes unitários: `mvn test`
- [ ] Testar endpoints principais:
  - [ ] GET /api/v1/books/public
  - [ ] POST /api/v1/auth/login
  - [ ] POST /api/v1/cart/{cartId}/items
  - [ ] POST /api/v1/shipping/calculate
  - [ ] POST /api/v1/orders

### Fase 6: Validação

- [ ] Verificar logs da aplicação (sem erros)
- [ ] Verificar performance das queries
- [ ] Testar funcionalidades de JSONB
- [ ] Validar comportamento de timestamps
- [ ] Executar suite completa de testes

### Fase 7: Documentação

- [ ] Atualizar README.md (se mencionar MySQL)
- [ ] Atualizar documentação de deploy
- [ ] Commitar mudanças com mensagem descritiva
- [ ] Criar tag de versão (opcional)

---

## 🚀 PROCEDIMENTO DE MIGRAÇÃO

### 1. Backup (CRÍTICO!)
```bash
# MySQL Dump (se houver dados)
docker exec mysql-livraria-tunoda mysqldump -u root -p livraria_db > backup_mysql_$(date +%Y%m%d).sql
```

### 2. Parar Aplicação e MySQL
```bash
# Parar containers
docker-compose down

# Remover volumes (ATENÇÃO: apaga dados!)
docker volume rm livraria-tunoda-backend_mysql-data_livraria
```

### 3. Fazer Todas as Alterações de Código
- Seguir checklist acima

### 4. Compilar Projeto
```bash
mvn clean install
```

### 5. Subir PostgreSQL
```bash
# Criar arquivo .env com variáveis PostgreSQL
cp .env.example .env
# Editar .env com valores corretos

# Subir PostgreSQL
docker-compose up -d

# Ver logs
docker-compose logs -f postgres
```

### 6. Executar Aplicação
```bash
# Terminal 1: Logs do banco
docker-compose logs -f postgres

# Terminal 2: Aplicação Spring Boot
mvn spring-boot:run

# Ou via IDE (Run StartupApplication)
```

### 7. Validar Migrations
```bash
# Conectar no PostgreSQL
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db

# Comandos úteis:
\dt                           # Listar tabelas
\d tb_users                   # Descrever tabela
SELECT * FROM flyway_schema_history;  # Histórico de migrations
\q                            # Sair
```

### 8. Testes
```bash
# Testes unitários
mvn test

# Testes de integração (se houver)
mvn verify

# Teste manual de endpoints (Postman, cURL, etc.)
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Driver class not found"
```
Causa: Dependência do PostgreSQL não foi adicionada ou não compilou
Solução: 
1. Verificar pom.xml (dependência postgresql presente)
2. mvn clean install -U (forçar update)
3. Reimportar projeto na IDE
```

### Erro: "Dialect not found"
```
Causa: Dialect não foi configurado corretamente
Solução: Verificar application.yml:
  hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
```

### Erro: "Connection refused"
```
Causa: PostgreSQL não está rodando ou porta errada
Solução:
1. docker-compose ps (verificar status)
2. docker-compose logs postgres (ver logs)
3. Verificar porta 5432 livre: netstat -an | grep 5432
```

### Erro: Flyway migration failed
```
Causa: Sintaxe SQL incompatível
Solução:
1. Ver logs detalhados do erro
2. Verificar migration que falhou
3. Corrigir sintaxe conforme este guia
4. Limpar banco e rodar novamente
```

### Erro: "column does not exist" em queries
```
Causa: Case sensitivity (PostgreSQL é case-sensitive)
Solução: 
1. Verificar se nomes de colunas estão em lowercase
2. Usar aspas duplas se precisar case específico: "columnName"
```

---

## 📚 REFERÊNCIAS

### Documentação PostgreSQL
- [PostgreSQL 17 Documentation](https://www.postgresql.org/docs/17/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/17/datatype.html)
- [JSONB Type](https://www.postgresql.org/docs/17/datatype-json.html)

### Documentação Spring Boot
- [Spring Boot with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)
- [Flyway Database Migrations](https://flywaydb.org/documentation/)

### Diferenças MySQL vs PostgreSQL
- [PostgreSQL vs MySQL](https://www.postgresql.org/docs/17/features.html)

---

## ✅ CONCLUSÃO

Seguindo este guia passo a passo, a migração será tranquila e sem surpresas. A arquitetura limpa do projeto facilita muito o processo!

**Dúvidas ou problemas?** Consulte a seção de Troubleshooting acima.

**Boa migração! 🚀**

