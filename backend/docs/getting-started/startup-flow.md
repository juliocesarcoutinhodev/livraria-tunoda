# Fluxo de Startup da Aplicação

Entenda a sequência de inicialização da aplicação e o que acontece em cada etapa.

## Visão Geral

A aplicação passa por 7 etapas principais durante o startup. Cada etapa valida e configura componentes essenciais para o funcionamento correto do sistema.

## Etapas de Inicialização

### 1. Validação de Configurações

**O que acontece:**
- Spring Boot carrega `application.yml` + profile específico
- `@ConfigurationProperties` valida variáveis obrigatórias
- Aplicação **FALHA IMEDIATAMENTE** se configuração inválida

**Configurações validadas:**
- JWT Secret (mínimo 256 bits)
- JWT Expiration (mínimo 60 segundos)
- Refresh Token Expiration (mínimo 1 dia)
- Melhor Envio Token (obrigatório)
- Mercado Pago Access Token (obrigatório)
- URLs de callback (formato válido)

**Logs esperados:**
```
Validando configuracoes de seguranca...
Validando configuracoes do Melhor Envio...
Validando configuracoes do Mercado Pago...
```

**Se falhar:**
```
***************************
APPLICATION FAILED TO START
***************************

Description:
Binding validation errors:
  - Field error in object 'securityProperties' on field 'jwtSecret': rejected value []
  
Action:
Configure a valid value for 'jwt.secret' in your application properties.
```

**Solução:** Configure todas as variáveis obrigatórias. Veja [Variáveis de Ambiente](environment-variables.md).

---

### 2. Conexão com Banco de Dados

**O que acontece:**
- HikariCP cria pool de conexões com PostgreSQL
- Valida conectividade (timeout padrão: 30s)
- Testa query de validação: `SELECT 1`

**Logs esperados:**
```
HikariPool-1 - Starting...
HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@...
HikariPool-1 - Start completed.
```

**Se falhar:**
```
Failed to obtain JDBC Connection
Connection to localhost:5432 refused. Check that the hostname and port are correct.
```

**Troubleshooting:**
- PostgreSQL está rodando? `docker-compose ps`
- Porta correta? Padrão: `5432`
- Credenciais corretas? Verifique variáveis de ambiente
- Firewall bloqueando? Teste: `telnet localhost 5432`

---

### 3. Migrations do Flyway

**O que acontece:**
- Flyway verifica tabela `flyway_schema_history`
- Executa migrations pendentes em ordem (V1, V2, V3...)
- Cria/atualiza estrutura do banco
- Insere dados iniciais (usuário admin)

**Migrations executadas:**
```
V1__create-table-books.sql
V2__create-table-book-metrics.sql
V3__create-table-carts.sql
V4__create-table-orders.sql
V5__add-payment-reference-to-orders.sql
V6__create-table-shipping-quotes.sql
V7__create-table-shipping-payloads.sql
V8__add-to-postal-code-to-shipping-quotes.sql
V9__create-table-payments.sql
V10__add-shipping-to-orders.sql
V11__create-table-users.sql
V12__create-table-refresh-tokens.sql
V13__insert-admin-user.sql
```

**Logs esperados:**
```
Flyway Community Edition 10.x.x
Database: jdbc:postgresql://localhost:5432/livraria_db (PostgreSQL 17.x)
Successfully validated 13 migrations (execution time 00:00.015s)
Current version of schema "public": 13
Schema "public" is up to date. No migration necessary.
```

**Se falhar:**
```
Migration V2__create-table-book-metrics.sql failed
ERROR: type "idx_book_metrics_book_id" does not exist
```

**Troubleshooting:**
- Banco vazio? Flyway criará tudo do zero automaticamente
- Migration falhou? Corrija o SQL e delete a entrada problemática da `flyway_schema_history`
- Versão incompatível? Consulte [Migrations](../database/migrations.md)

---

### 4. Inicialização do Spring Security

**O que acontece:**
- SecurityFilterChain configurado
- JwtAuthenticationFilter registrado
- Endpoints públicos/protegidos definidos
- Actuator com segurança por profile

**Logs esperados:**
```
Configurando seguranca do Actuator para ambiente de desenvolvimento (permitAll)
Will secure any request with [...]
```

**Configuração aplicada:**

| Rota | Acesso |
|------|--------|
| `/api/auth/**` | Público |
| `/api/public/**` | Público |
| `/api/webhooks/**` | Público |
| `/api/admin/**` | ROLE_ADMIN |
| `/api/user/**` | Autenticado |
| `/api/v1/actuator/health` | Público |
| `/api/v1/actuator/**` | Por profile* |

*Por profile:
- **dev/local:** Público
- **staging:** Autenticado
- **prod:** ROLE_ADMIN

---

### 5. Registro de Beans e Componentes

**O que acontece:**
- Spring carrega todos os `@Component`, `@Service`, `@Repository`
- MapStruct gera implementações de mappers
- Actuator registra health indicators customizados

**Logs esperados:**
```
Inicializando metricas do Micrometer
Registrado health indicator: database
Registrado health indicator: application
```

**Componentes carregados:**
- Use Cases (application layer)
- Repositories (adapters)
- Controllers (web layer)
- Mappers (MapStruct)
- Security filters
- Health indicators

---

### 6. Inicialização do Tomcat

**O que acontece:**
- Servidor web embarcado (Tomcat) inicia
- Porta definida (padrão: 8080)
- Aguarda requisições HTTP

**Logs esperados:**
```
Tomcat initialized with port 8080 (http)
Tomcat started on port 8080 (http) with context path '/'
```

**Configuração:**
- Porta padrão: 8080 (configurável via `SERVER_PORT`)
- Context path: `/`
- Threads: Pool configurado automaticamente

---

### 7. Aplicação Pronta

**Log final:**
```
========================================
Application started successfully!
Active profile(s): local
Port: 8080
JWT Expiration: 3600s
Refresh Token Expiration: 30 days
========================================
Started StartupApplication in 5.234 seconds (process running for 5.678)
```

**Aplicação está pronta para receber requisições!**

---

## Tempo de Startup Esperado

| Ambiente | Tempo Típico | Observações |
|----------|--------------|-------------|
| **Local (primeira vez)** | 10-15s | Inclui download de dependências |
| **Local (subsequente)** | 5-7s | Dependências em cache |
| **Docker (primeira vez)** | 15-20s | Aguarda banco ficar healthy |
| **Docker (subsequente)** | 8-10s | Banco já está rodando |
| **Produção** | 7-12s | Banco gerenciado (mais rápido) |

## Verificação Pós-Startup

Após o startup, verifique se tudo está funcionando:

### 1. Health Check

```bash
curl http://localhost:8080/api/v1/actuator/health
```

**Esperado:** 
```json
{"status":"UP"}
```

### 2. Banco de Dados

```bash
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db -c "\dt"
```

**Esperado:** Lista de 12 tabelas

### 3. Usuário Admin

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@livraria.com","password":"admin123"}'
```

**Esperado:** Tokens JWT válidos

### 4. Métricas (profile dev/local)

```bash
curl http://localhost:8080/api/v1/actuator/metrics
```

**Esperado:** Lista de métricas disponíveis

## Problemas Comuns no Startup

### Binding validation errors

**Causa:** Variável obrigatória faltando ou inválida

**Solução:** Configure todas as variáveis obrigatórias
```bash
export JWT_SECRET="your-256-bit-secret"
export MELHOR_ENVIO_TOKEN="your-token"
export MERCADO_PAGO_ACCESS_TOKEN="your-token"
```

### Connection refused (PostgreSQL)

**Causa:** PostgreSQL não está rodando

**Solução:**
```bash
# Subir o banco
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs postgres
```

### Migration failed

**Causa:** SQL incompatível ou banco em estado inconsistente

**Solução:**
1. Verificar qual migration falhou nos logs
2. Consultar [Migrations](../database/migrations.md)
3. Se necessário, limpar banco e recriar:
```bash
docker-compose down -v
docker-compose up -d
```

### Port 8080 already in use

**Causa:** Outra aplicação usando a porta 8080

**Solução 1 - Matar processo:**
```bash
# Linux/macOS
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Solução 2 - Mudar porta:**
```bash
export SERVER_PORT=8081
./mvnw spring-boot:run
```

### OutOfMemoryError

**Causa:** JVM sem memória suficiente

**Solução:**
```bash
# Aumentar heap
export JAVA_OPTS="-Xms512m -Xmx1024m"
./mvnw spring-boot:run
```

### ClassNotFoundException

**Causa:** Dependências não foram baixadas ou compiladas

**Solução:**
```bash
# Limpar e reinstalar
./mvnw clean install
```

## Ordem de Prioridade de Configurações

As configurações são carregadas nesta ordem (maior → menor prioridade):

1. **Variáveis de ambiente** (mais alta)
2. **Argumentos de linha de comando** (`--spring.profiles.active=prod`)
3. **application-{profile}.yml**
4. **application.yml** (mais baixa)

## Logs Detalhados (Debug)

Para ver mais detalhes durante o startup:

```bash
# Ativar debug do Spring Boot
./mvnw spring-boot:run -Dlogging.level.org.springframework=DEBUG

# Ou via variável
export LOGGING_LEVEL_ORG_SPRINGFRAMEWORK=DEBUG
./mvnw spring-boot:run
```

## Referências

- [Configuração Local](local-setup.md)
- [Profiles](profiles.md)
- [Variáveis de Ambiente](environment-variables.md)
- [Migrations](../database/migrations.md)
- [Troubleshooting](../deployment/troubleshooting.md)
