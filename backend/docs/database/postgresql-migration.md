# Migração MySQL → PostgreSQL

Documento sobre a migração realizada de MySQL 9 para PostgreSQL 17 em janeiro de 2026.

## Resumo

**Data:** Janeiro de 2026  
**De:** MySQL 9  
**Para:** PostgreSQL 17  
**Razão:** Performance, features avançadas, JSON nativo

## Mudanças Principais

### 1. Driver JDBC

```xml
<!-- Antes -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>

<!-- Depois -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

### 2. Dialect Hibernate

```yaml
# Antes
spring:
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL9Dialect

# Depois
spring:
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

### 3. Tipos de Dados

#### JSON

**MySQL:**
```sql
raw_payload JSON
```

**PostgreSQL:**
```sql
raw_payload JSONB
```

**Entidade JPA:**
```java
// Adicionado
@JdbcTypeCode(SqlTypes.JSON)
private String rawPayload;
```

### 4. Índices

**MySQL:**
```sql
CREATE TABLE tb_book_metrics (
    ...
    INDEX idx_book_metrics_book_id (book_id)
);
```

**PostgreSQL:**
```sql
CREATE TABLE tb_book_metrics (...);

CREATE INDEX idx_book_metrics_book_id 
ON tb_book_metrics(book_id);
```

Índices separados da definição da tabela.

### 5. Auto-increment

**MySQL:**
```sql
id BIGINT AUTO_INCREMENT
```

**PostgreSQL:**
```sql
id UUID PRIMARY KEY
-- Gerado pela aplicação
```

## Incompatibilidades Resolvidas

### JSONB vs JSON

PostgreSQL usa JSONB (binary JSON) que é mais eficiente.

### Índices

PostgreSQL requer `CREATE INDEX` separado.

### Case Sensitivity

PostgreSQL é case-sensitive para identificadores não-quoted.

## Vantagens do PostgreSQL

- ✅ JSONB nativo e performático
- ✅ Full-text search avançado
- ✅ Arrays nativos
- ✅ CTEs e Window Functions
- ✅ Extensões (PostGIS, etc)
- ✅ Melhor compliance com SQL padrão
- ✅ MVCC mais robusto
- ✅ Partitioning nativo

## Processo de Migração

1. Atualizar dependências Maven
2. Ajustar application.yml
3. Corrigir migrations SQL
4. Adicionar @JdbcTypeCode para JSONB
5. Testar localmente
6. Testar em staging
7. Deploy em produção

## Verificação Pós-Migração

```sql
-- Verificar versão
SELECT version();

-- Listar tabelas
\dt

-- Verificar índices
\di

-- Verificar constraints
\d+ tb_books
```

## Referências

- [PostgreSQL vs MySQL](https://www.postgresql.org/about/)
- [Migrations](migrations.md)
- [Schema](schema.md)
