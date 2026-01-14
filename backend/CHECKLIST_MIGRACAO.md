# ✅ CHECKLIST DE MIGRAÇÃO - MySQL → PostgreSQL

## 📋 INSTRUÇÕES
- Copie este arquivo para acompanhar seu progresso
- Marque [x] conforme for completando cada item
- Anote observações importantes na seção "Notas"

---

## 🔴 FASE 1: PREPARAÇÃO

### Backup e Segurança
- [ ] Fazer backup completo do MySQL
  ```bash
  docker exec mysql-livraria-tunoda mysqldump -u root -p livraria_db > backup_$(date +%Y%m%d_%H%M%S).sql
  ```
- [ ] Exportar dados importantes (se houver em produção)
- [ ] Criar branch Git: `git checkout -b feature/migrate-to-postgresql`
- [ ] Commitar estado atual: `git add . && git commit -m "Before PostgreSQL migration"`
- [ ] Ler documentação completa: `MIGRACAO_POSTGRESQL.md`

**Notas:**
```
_____________________________________________________________________
_____________________________________________________________________
```

---

## 🟡 FASE 2: ALTERAÇÕES DE DEPENDÊNCIAS

### pom.xml
- [ ] Remover dependência: `mysql-connector-j`
- [ ] Remover dependência: `flyway-mysql`
- [ ] Adicionar dependência: `postgresql`
- [ ] Adicionar dependência: `flyway-database-postgresql`

**Comando de validação:**
```bash
grep -A2 "postgresql" pom.xml  # Deve aparecer
grep -A2 "mysql" pom.xml        # Não deve aparecer
```

**Notas:**
```
_____________________________________________________________________
```

---

## 🟡 FASE 3: DOCKER COMPOSE

### docker-compose.yml
- [ ] Substituir imagem: `mysql:9` → `postgres:17-alpine`
- [ ] Substituir nome do container: `mysql-livraria-tunoda` → `postgres-livraria-tunoda`
- [ ] Substituir environment:
  - [ ] `MYSQL_ROOT_PASSWORD` → (remover)
  - [ ] `MYSQL_DATABASE` → `POSTGRES_DB`
  - [ ] `MYSQL_USER` → `POSTGRES_USER`
  - [ ] `MYSQL_PASSWORD` → `POSTGRES_PASSWORD`
- [ ] Ajustar porta: `${MYSQL_PORT}:${MYSQL_PORT}` → `${POSTGRES_PORT}:5432`
- [ ] Ajustar volume: `mysql-data_livraria` → `postgres-data_livraria`
- [ ] Ajustar path do volume: `/var/lib/mysql` → `/var/lib/postgresql/data`
- [ ] Ajustar healthcheck: `mysqladmin ping` → `pg_isready -U ${POSTGRES_USER}`

**Comando de validação:**
```bash
docker-compose config  # Validar sintaxe
grep postgres docker-compose.yml  # Verificar mudanças
```

**Notas:**
```
_____________________________________________________________________
```

---

## 🟡 FASE 4: VARIÁVEIS DE AMBIENTE

### .env.example
- [ ] Trocar seção `MYSQL` por `POSTGRES`:
  - [ ] `MYSQL_USER=livraria_user` → `POSTGRES_USER=livraria_user`
  - [ ] `MYSQL_PASSWORD=...` → `POSTGRES_PASSWORD=...`
  - [ ] `MYSQL_DATABASE=livraria_db` → `POSTGRES_DB=livraria_db`
  - [ ] `MYSQL_PORT=3306` → `POSTGRES_PORT=5432`
  - [ ] Remover: `MYSQL_ROOT_PASSWORD`
- [ ] Atualizar comentários e documentação inline

### .env (seu arquivo local)
- [ ] Criar/atualizar arquivo `.env` com variáveis PostgreSQL
  ```bash
  cp .env.example .env
  # Editar .env com valores reais
  ```

### ENV_VARIABLES.md
- [ ] Atualizar seção de Database
- [ ] Atualizar exemplos de JDBC_DATABASE_URL

**Comando de validação:**
```bash
cat .env | grep POSTGRES  # Verificar variáveis
```

**Notas:**
```
_____________________________________________________________________
```

---

## 🟡 FASE 5: CONFIGURAÇÕES SPRING

### application.yml
- [ ] Trocar: `driver-class-name: com.mysql.cj.jdbc.Driver`
  - Para: `driver-class-name: org.postgresql.Driver`
- [ ] Trocar: `dialect: org.hibernate.dialect.MySQLDialect`
  - Para: `dialect: org.hibernate.dialect.PostgreSQLDialect`

### application-local.yml
- [ ] Trocar URL: `jdbc:mysql://localhost:${MYSQL_PORT}/${MYSQL_DATABASE}...`
  - Para: `jdbc:postgresql://localhost:${POSTGRES_PORT}/${POSTGRES_DB}`
- [ ] Trocar: `username: ${MYSQL_USER:livraria_user}`
  - Para: `username: ${POSTGRES_USER:livraria_user}`
- [ ] Trocar: `password: ${MYSQL_PASSWORD:...}`
  - Para: `password: ${POSTGRES_PASSWORD:...}`
- [ ] Trocar driver-class-name (igual application.yml)
- [ ] Trocar dialect (igual application.yml)

### application-dev.yml
- [ ] Mesmas alterações do application-local.yml

### application-prod.yml
- [ ] Trocar: `username: ${MYSQL_USER}`
  - Para: `username: ${POSTGRES_USER}`
- [ ] Trocar: `password: ${MYSQL_PASSWORD}`
  - Para: `password: ${POSTGRES_PASSWORD}`
- [ ] Trocar driver-class-name (igual application.yml)
- [ ] Trocar dialect (igual application.yml)
- [ ] Nota: `url: ${JDBC_DATABASE_URL}` deve ser formato PostgreSQL

### src/test/resources/application.yml
- [ ] Trocar H2 MODE: `MODE=MySQL` → `MODE=PostgreSQL`

**Comando de validação:**
```bash
grep -r "mysql" src/main/resources/application*.yml  # Não deve aparecer
grep -r "postgresql" src/main/resources/application*.yml  # Deve aparecer
```

**Notas:**
```
_____________________________________________________________________
```

---

## 🟡 FASE 6: MIGRAÇÕES SQL

### V1__create-table-books.sql
- [ ] Tabela `tb_authors`:
  - [ ] Linha `created_at`: remover ` DEFAULT CURRENT_TIMESTAMP`
  - [ ] Linha `created_at`: adicionar ` DEFAULT NOW()`
  - [ ] Linha `updated_at`: remover completamente `ON UPDATE CURRENT_TIMESTAMP`
  - [ ] Linha `updated_at`: trocar para ` DEFAULT NOW()`
- [ ] Tabela `tb_books`:
  - [ ] Mesmas alterações em `created_at` e `updated_at`

### V7__create-table-shipping-payloads.sql
- [ ] Linha `raw_payload`: trocar `JSON` por `JSONB`
- [ ] Mover índices inline para fora do CREATE TABLE:
  - [ ] `INDEX idx_shipping_payloads_quote_id` → `CREATE INDEX ...`
  - [ ] `INDEX idx_shipping_payloads_provider` → `CREATE INDEX ...`
  - [ ] `INDEX idx_shipping_payloads_created_at` → `CREATE INDEX ...`

### V8__add-to-postal-code-to-shipping-quotes.sql
- [ ] ✅ Validar que funciona (sintaxe é compatível)

### V10__add-shipping-to-orders.sql
- [ ] Remover `COMMENT 'texto'` inline das colunas:
  - [ ] `shipping_quote_id`
  - [ ] `shipping_cost_amount`
  - [ ] `shipping_cost_currency`
- [ ] Adicionar após o CREATE INDEX:
  ```sql
  COMMENT ON COLUMN tb_orders.shipping_quote_id IS '...';
  COMMENT ON COLUMN tb_orders.shipping_cost_amount IS '...';
  COMMENT ON COLUMN tb_orders.shipping_cost_currency IS '...';
  COMMENT ON COLUMN tb_orders.subtotal_amount IS '...';
  COMMENT ON COLUMN tb_orders.total_amount IS '...';
  ```
- [ ] Remover bloco `MODIFY COLUMN` (PostgreSQL não usa)

### V11__create-table-users.sql
- [ ] Remover todos os `COMMENT 'texto'` inline (8 colunas + 1 tabela)
- [ ] Remover `ON UPDATE CURRENT_TIMESTAMP` da linha `updated_at`
- [ ] Trocar `DEFAULT CURRENT_TIMESTAMP` por `DEFAULT NOW()`
- [ ] Adicionar após os CREATE INDEX:
  ```sql
  COMMENT ON TABLE tb_users IS 'Usuarios administrativos do sistema';
  COMMENT ON COLUMN tb_users.id IS 'Identificador unico do usuario';
  COMMENT ON COLUMN tb_users.name IS 'Nome completo do usuario';
  -- ... etc para todas as colunas
  ```

### V12__create-table-refresh-tokens.sql
- [ ] Remover todos os `COMMENT 'texto'` inline (6 colunas + 1 tabela)
- [ ] Adicionar após os CREATE INDEX:
  ```sql
  COMMENT ON TABLE tb_refresh_tokens IS 'Tokens de refresh para renovacao de autenticacao';
  COMMENT ON COLUMN tb_refresh_tokens.id IS 'Identificador unico do token';
  -- ... etc
  ```

### V13__insert-admin-user.sql
- [ ] ✅ Validar que funciona (NOW() é compatível)

**Comando de validação:**
```bash
grep -r "ON UPDATE CURRENT_TIMESTAMP" src/main/resources/db/migration/  # Não deve aparecer
grep -r " JSON " src/main/resources/db/migration/  # Não deve aparecer
grep "JSONB" src/main/resources/db/migration/V7__*.sql  # Deve aparecer
```

**Notas:**
```
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
```

---

## 🟡 FASE 7: ENTIDADES JPA

### ShippingPayloadEntity.java
- [ ] Localizar: `@Column(name = "raw_payload", nullable = false, columnDefinition = "JSON")`
- [ ] Trocar: `columnDefinition = "JSON"` → `columnDefinition = "JSONB"`

**Comando de validação:**
```bash
grep -r "columnDefinition.*JSON" src/main/java/  # Deve mostrar JSONB
```

**Notas:**
```
_____________________________________________________________________
```

---

## 🟢 FASE 8: COMPILAÇÃO

### Compilar projeto
- [ ] Executar: `mvn clean`
- [ ] Executar: `mvn install`
- [ ] Verificar que não há erros de compilação
- [ ] Verificar no log que dependência PostgreSQL foi baixada

**Comando completo:**
```bash
mvn clean install -DskipTests
```

**Se houver erros:**
- [ ] Verificar dependências no pom.xml
- [ ] Forçar update: `mvn clean install -U`
- [ ] Reimportar projeto na IDE

**Notas:**
```
_____________________________________________________________________
```

---

## 🟢 FASE 9: SUBIR POSTGRESQL

### Preparar ambiente
- [ ] Parar containers MySQL:
  ```bash
  docker-compose down
  ```
- [ ] Remover volumes antigos:
  ```bash
  docker volume ls  # Listar
  docker volume rm livraria-tunoda-backend_mysql-data_livraria  # Remover
  ```

### Subir PostgreSQL
- [ ] Subir container:
  ```bash
  docker-compose up -d
  ```
- [ ] Verificar status:
  ```bash
  docker-compose ps
  ```
- [ ] Verificar logs:
  ```bash
  docker-compose logs -f postgres
  ```
- [ ] Aguardar healthcheck (até aparecer "healthy")

**Se houver problemas:**
- [ ] Verificar porta 5432 está livre: `netstat -an | grep 5432`
- [ ] Verificar .env tem variáveis corretas
- [ ] Ver logs de erro: `docker-compose logs postgres`

**Notas:**
```
_____________________________________________________________________
```

---

## 🟢 FASE 10: EXECUTAR APLICAÇÃO

### Rodar Spring Boot
- [ ] Terminal 1 - Logs do banco:
  ```bash
  docker-compose logs -f postgres
  ```
- [ ] Terminal 2 - Aplicação:
  ```bash
  mvn spring-boot:run
  ```
  Ou rodar via IDE: `StartupApplication.java`

### Observar logs
- [ ] Flyway iniciou migrations
- [ ] Todas as 13 migrations executadas com sucesso
- [ ] Aplicação subiu sem erros
- [ ] Porta 8080 (ou configurada) está aberta

**Se houver erros:**
- [ ] Anotar qual migration falhou
- [ ] Consultar `MIGRACAO_POSTGRESQL.md` para correção
- [ ] Parar app, corrigir SQL, limpar banco, tentar novamente

**Notas:**
```
_____________________________________________________________________
_____________________________________________________________________
```

---

## 🟢 FASE 11: VALIDAÇÃO DO BANCO

### Conectar no PostgreSQL
```bash
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db
```

### Verificações
- [ ] Listar tabelas: `\dt`
  - Deve ter 14 tabelas
- [ ] Ver histórico Flyway:
  ```sql
  SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;
  ```
  - Deve ter 13 registros, todos com `success = true`
- [ ] Descrever tabela exemplo: `\d tb_users`
  - Verificar estrutura correta
- [ ] Verificar dados de teste:
  ```sql
  SELECT * FROM tb_users;
  ```
  - Deve ter usuário admin
- [ ] Verificar comentários:
  ```sql
  SELECT obj_description('tb_users'::regclass);
  ```
- [ ] Sair: `\q`

**Notas:**
```
_____________________________________________________________________
```

---

## 🟢 FASE 12: TESTES UNITÁRIOS

### Executar testes
- [ ] Rodar testes:
  ```bash
  mvn test
  ```
- [ ] Verificar resultado: todos passaram
- [ ] Verificar cobertura (se configurado)

**Se testes falharem:**
- [ ] Identificar qual teste falhou
- [ ] Verificar se é relacionado a SQL ou dialeto
- [ ] Ajustar conforme necessário

**Notas:**
```
_____________________________________________________________________
```

---

## 🟢 FASE 13: TESTES DE INTEGRAÇÃO

### Teste manual de endpoints (Postman/cURL/Navegador)

#### Catálogo Público
- [ ] GET `/api/v1/books/public` (deve retornar lista vazia ou livros)
- [ ] GET `/api/v1/books/public/{id}` (se houver livros)

#### Autenticação
- [ ] POST `/api/v1/auth/login`
  ```json
  {
    "email": "admin@livraria.com",
    "password": "admin123"
  }
  ```
  - [ ] Retorna access_token e refresh_token
  - [ ] Copiar access_token para próximos testes

#### Admin (com Bearer Token)
- [ ] GET `/api/v1/admin/books`
- [ ] POST `/api/v1/admin/books` (criar livro)
- [ ] GET `/api/v1/admin/authors`

#### Carrinho
- [ ] POST `/api/v1/cart/{randomUUID}/items`
- [ ] GET `/api/v1/cart/{cartId}`

#### Frete (se houver livros no carrinho)
- [ ] POST `/api/v1/shipping/calculate`

#### Pagamento
- [ ] POST `/api/v1/orders` (criar pedido)
- [ ] POST `/api/v1/payments` (criar pagamento)

**Anotar problemas encontrados:**
```
_____________________________________________________________________
_____________________________________________________________________
```

---

## 🟢 FASE 14: TESTES DE PERFORMANCE (Opcional)

### Queries básicas
- [ ] Tempo de listagem de livros
- [ ] Tempo de busca por ID
- [ ] Tempo de queries com JSONB

### Comparar com MySQL (se possível)
- [ ] Anotar diferenças significativas

**Notas:**
```
_____________________________________________________________________
```

---

## 🔵 FASE 15: DOCUMENTAÇÃO

### Atualizar docs
- [ ] README.md: Substituir referências a MySQL por PostgreSQL
- [ ] Documentos em `/docs`: Verificar menções ao banco
- [ ] Comentários em código (se houver)

### Commitar mudanças
- [ ] Verificar mudanças: `git status`
- [ ] Adicionar arquivos: `git add .`
- [ ] Commit:
  ```bash
  git commit -m "feat: Migrate from MySQL to PostgreSQL

  - Updated dependencies (pom.xml)
  - Changed docker-compose to use PostgreSQL 17
  - Updated all application.yml files
  - Fixed 7 SQL migrations for PostgreSQL compatibility
  - Updated environment variables
  - Tested all endpoints successfully"
  ```
- [ ] Push: `git push origin feature/migrate-to-postgresql`

**Notas:**
```
_____________________________________________________________________
```

---

## 🔵 FASE 16: DEPLOY (se aplicável)

### Preparar para produção
- [ ] Atualizar CI/CD pipelines
- [ ] Atualizar variáveis de ambiente no servidor
- [ ] Testar em ambiente de staging primeiro
- [ ] Planejar janela de manutenção
- [ ] Preparar plano de rollback

**Notas:**
```
_____________________________________________________________________
```

---

## ✅ CONCLUSÃO

### Checklist Final
- [ ] Todas as fases acima completadas
- [ ] Aplicação rodando sem erros
- [ ] Testes passando
- [ ] Endpoints funcionando
- [ ] Documentação atualizada
- [ ] Código commitado

### Status da Migração
```
Data de início: ___/___/______
Data de conclusão: ___/___/______
Tempo total: _______ horas

Problemas encontrados:
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

Soluções aplicadas:
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
```

---

## 📞 SUPORTE

Se encontrar problemas:
1. Consultar `MIGRACAO_POSTGRESQL.md` (detalhes completos)
2. Consultar seção Troubleshooting
3. Verificar logs do PostgreSQL: `docker-compose logs postgres`
4. Verificar logs da aplicação

---

**🎉 PARABÉNS PELA MIGRAÇÃO CONCLUÍDA! 🎉**

