# Configuração Local

Guia passo a passo para configurar e executar a aplicação localmente para desenvolvimento.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Java 25
- Maven 3.8+
- Docker & Docker Compose
- Git

Consulte [Pré-requisitos](prerequisites.md) para detalhes de instalação.

## Passo 1: Clone o Repositório

```bash
git clone <url-do-repositorio>
cd livraria-tunoda/backend
```

## Passo 2: Configure as Variáveis de Ambiente

Defina as variáveis de ambiente obrigatórias:

```bash
# Mínimo necessário para rodar local
export JWT_SECRET="your-secure-jwt-secret-key-minimum-256-bits-required-for-hs256-algorithm"
export MELHOR_ENVIO_TOKEN="your_melhor_envio_token"
export MERCADO_PAGO_ACCESS_TOKEN="your_mercado_pago_access_token"
```

**Importante:** O sistema validará essas variáveis na inicialização. Se alguma estiver ausente ou inválida, a aplicação falhará com mensagem clara.

Para lista completa de variáveis, consulte [Variáveis de Ambiente](environment-variables.md).

## Passo 3: Suba o Banco de Dados

```bash
docker-compose up -d
```

Aguarde o PostgreSQL ficar saudável (health check configurado).

**Verificar status:**
```bash
docker-compose ps
```

Esperado:
```
NAME                        STATUS                   PORTS
postgres-livraria-tunoda    Up (healthy)            0.0.0.0:5432->5432/tcp
```

## Passo 4: Execute a Aplicação

### Opção A: Via Maven (linha de comando)

**Com profile local (default):**
```bash
./mvnw spring-boot:run
```

**Com profile específico:**
```bash
# Dev
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run

# Staging
SPRING_PROFILES_ACTIVE=staging ./mvnw spring-boot:run
```

### Opção B: Via IDE

#### IntelliJ IDEA

1. Abra o projeto no IntelliJ
2. Localize a classe `StartupApplication.java`
3. Clique com botão direito → Run
4. Ou use a configuração de Run já criada

#### Eclipse

1. Abra o projeto no Eclipse
2. Botão direito no projeto → Run As → Spring Boot App

### Logs Esperados na Inicialização

```
========================================
Application started successfully!
Active profile(s): local
Port: 8080
JWT Expiration: 3600s
Refresh Token Expiration: 30 days
========================================
```

Para entender o fluxo completo de startup, consulte [Fluxo de Startup](startup-flow.md).

## Passo 5: Verifique se Está Funcionando

### Health Check

```bash
curl http://localhost:8080/api/v1/actuator/health
```

Resposta esperada:
```json
{
  "status": "UP",
  "components": {
    "database": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "SELECT 1",
        "status": "Connection successful"
      }
    },
    "application": {
      "status": "UP",
      "details": {
        "contextLoaded": true,
        "beansRegistered": 450
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

### Verificar Banco de Dados

```bash
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db -c "\dt"
```

Esperado: Lista de 12 tabelas criadas pelas migrations.

## Passo 6: Acesse com Usuário Admin

O sistema cria automaticamente um usuário admin durante a inicialização (migration V13).

### Credenciais Padrão

```
Email: admin@livraria.com
Senha: admin123
```

### Fazer Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@livraria.com",
    "password": "admin123"
  }'
```

### Resposta Esperada

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

**Use o `accessToken` nos próximos requests:**

```bash
curl http://localhost:8080/api/user/me \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

## Próximos Passos

### Explorar a API

Importe a collection do Postman:
- [Livraria-Tunoda-API.postman_collection.json](../api/postman/Livraria-Tunoda-API.postman_collection.json)

### Criar Dados de Teste

1. **Criar um autor:**
```bash
curl -X POST http://localhost:8080/api/admin/authors \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Machado de Assis",
    "biography": "Escritor brasileiro"
  }'
```

2. **Criar um livro:**
```bash
curl -X POST http://localhost:8080/api/admin/books \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dom Casmurro",
    "description": "Romance clássico",
    "price": 45.90,
    "stock": 100,
    "weight": 0.350,
    "authorIds": ["AUTHOR_ID_AQUI"]
  }'
```

3. **Listar livros públicos:**
```bash
curl http://localhost:8080/api/public/books
```

## Problemas Comuns

### Erro: Binding validation errors

**Causa:** Variável de ambiente obrigatória faltando

**Solução:** Configure todas as variáveis obrigatórias (JWT_SECRET, tokens das APIs)

### Erro: Connection refused (PostgreSQL)

**Causa:** PostgreSQL não está rodando

**Solução:** 
```bash
docker-compose up -d
docker-compose ps  # Verificar se está UP
```

### Erro: Port 8080 already in use

**Causa:** Outra aplicação usando a porta

**Solução:**
```bash
# Opção 1: Mudar a porta
export SERVER_PORT=8081
./mvnw spring-boot:run

# Opção 2: Matar o processo
lsof -ti:8080 | xargs kill -9
```

### Erro: Migration failed

**Causa:** SQL incompatível ou banco em estado inconsistente

**Solução:** Veja [Database - Migrations](../database/migrations.md)

## Referências

- [Pré-requisitos](prerequisites.md)
- [Profiles](profiles.md)
- [Variáveis de Ambiente](environment-variables.md)
- [Fluxo de Startup](startup-flow.md)
- [Troubleshooting](../deployment/troubleshooting.md)
