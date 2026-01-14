# 📝 RESUMO RÁPIDO - Alterações MySQL → PostgreSQL

## 🎯 Visão Geral
- **Arquivos a alterar:** 15 arquivos
- **Tempo estimado:** 5-8 horas
- **Complexidade:** Média-Baixa
- **Risco:** Baixo

---

## 📂 LISTA DE ARQUIVOS PARA ALTERAR

### 1. Dependências (1 arquivo)
```
✏️  pom.xml
```

### 2. Docker e Variáveis (3 arquivos)
```
✏️  docker-compose.yml
✏️  .env.example
✏️  ENV_VARIABLES.md
```

### 3. Configurações Spring (5 arquivos)
```
✏️  src/main/resources/application.yml
✏️  src/main/resources/application-local.yml
✏️  src/main/resources/application-dev.yml
✏️  src/main/resources/application-prod.yml
✏️  src/test/resources/application.yml
```

### 4. Migrações SQL (5 arquivos)
```
✏️  src/main/resources/db/migration/V1__create-table-books.sql
✏️  src/main/resources/db/migration/V7__create-table-shipping-payloads.sql
✏️  src/main/resources/db/migration/V10__add-shipping-to-orders.sql
✏️  src/main/resources/db/migration/V11__create-table-users.sql
✏️  src/main/resources/db/migration/V12__create-table-refresh-tokens.sql
```

### 5. Entidades JPA (1 arquivo)
```
✏️  src/main/java/.../infrastructure/persistence/entity/ShippingPayloadEntity.java
```

---

## 🔧 PRINCIPAIS MUDANÇAS

### pom.xml
```diff
- mysql-connector-j
- flyway-mysql
+ postgresql
+ flyway-database-postgresql
```

### docker-compose.yml
```diff
- mysql:9
- MYSQL_*
+ postgres:17-alpine
+ POSTGRES_*
```

### application*.yml
```diff
- driver-class-name: com.mysql.cj.jdbc.Driver
- dialect: MySQLDialect
- url: jdbc:mysql://...
+ driver-class-name: org.postgresql.Driver
+ dialect: PostgreSQLDialect
+ url: jdbc:postgresql://...
```

### Migrations SQL
```diff
- ON UPDATE CURRENT_TIMESTAMP
- COMMENT 'texto' inline
- raw_payload JSON
+ (remover, usar @PreUpdate JPA)
+ COMMENT ON COLUMN ... IS 'texto'
+ raw_payload JSONB
```

---

## ⚡ MUDANÇAS RÁPIDAS POR CATEGORIA

### Tipo 1: Buscar e Substituir Global
Você pode fazer essas substituições em todos os arquivos:

```
MYSQL_USER              → POSTGRES_USER
MYSQL_PASSWORD          → POSTGRES_PASSWORD
MYSQL_DATABASE          → POSTGRES_DB
MYSQL_PORT              → POSTGRES_PORT

com.mysql.cj.jdbc.Driver        → org.postgresql.Driver
MySQLDialect                    → PostgreSQLDialect
jdbc:mysql://                   → jdbc:postgresql://
```

### Tipo 2: Alterações Específicas em Migrations

**V1:** Remover `ON UPDATE CURRENT_TIMESTAMP` (2x)
**V7:** Trocar `JSON` por `JSONB`, separar índices
**V10:** Remover `COMMENT` inline, adicionar `COMMENT ON COLUMN`
**V11:** Remover `COMMENT` inline, remover `ON UPDATE`, adicionar `COMMENT ON`
**V12:** Remover `COMMENT` inline, adicionar `COMMENT ON`

### Tipo 3: Alteração Manual
- **docker-compose.yml:** Reescrever serviço completo
- **ShippingPayloadEntity.java:** Trocar `JSON` por `JSONB`

---

## 🚀 PROCEDIMENTO RÁPIDO

### 1. Backup
```bash
docker exec mysql-livraria-tunoda mysqldump -u root -p livraria_db > backup.sql
```

### 2. Parar tudo
```bash
docker-compose down
docker volume rm livraria-tunoda-backend_mysql-data_livraria
```

### 3. Fazer alterações
- Seguir lista de arquivos acima
- Usar documentação detalhada: `MIGRACAO_POSTGRESQL.md`

### 4. Compilar
```bash
mvn clean install
```

### 5. Subir PostgreSQL
```bash
# Ajustar .env com variáveis POSTGRES_*
docker-compose up -d
```

### 6. Executar app
```bash
mvn spring-boot:run
```

### 7. Validar
```bash
# Ver migrations executadas
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db -c "SELECT * FROM flyway_schema_history;"

# Ver tabelas
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db -c "\dt"

# Testes
mvn test
```

---

## 📊 ESTATÍSTICAS DO PROJETO

- **Total arquivos Java:** 215 (main) + 16 (test)
- **Migrations Flyway:** 13 arquivos
- **Tabelas no banco:** 14 tabelas
- **Arquitetura:** Clean Architecture
- **Integrações:** Melhor Envio (frete) + Mercado Pago (pagamento)

---

## ⚠️ PONTOS DE ATENÇÃO

1. **JSON → JSONB:** Mais performático, mas validar se código funciona igual
2. **COMMENT:** Sintaxe completamente diferente, requer reescrita
3. **ON UPDATE TIMESTAMP:** PostgreSQL não tem, mas JPA já gerencia via `@PreUpdate`
4. **Variáveis de ambiente:** Renomear TODAS as referências
5. **Porta padrão:** 3306 → 5432

---

## ✅ VANTAGENS DO POSTGRESQL

1. **Performance:** Melhor em queries complexas e JSONB
2. **ACID:** Conformidade mais rigorosa
3. **Extensões:** PostGIS, Full Text Search nativo, etc.
4. **Open Source:** Licença mais permissiva
5. **Features:** Window functions, CTEs, array types

---

## 📚 DOCUMENTOS RELACIONADOS

1. **MIGRACAO_POSTGRESQL.md** - Guia detalhado com todos os códigos
2. **analise-completa-projeto.md** - Análise completa da arquitetura

---

## 🆘 AJUDA RÁPIDA

### Erro comum 1: Driver not found
```bash
mvn clean install -U
# Reimportar projeto na IDE
```

### Erro comum 2: Connection refused
```bash
docker-compose logs postgres
netstat -an | grep 5432
```

### Erro comum 3: Migration failed
```bash
# Ver qual migration falhou nos logs
# Consultar MIGRACAO_POSTGRESQL.md para sintaxe correta
# Limpar banco e tentar novamente
docker-compose down -v
docker-compose up -d
```

---

## ✨ BOA MIGRAÇÃO!

Consulte `MIGRACAO_POSTGRESQL.md` para detalhes completos de cada alteração.

