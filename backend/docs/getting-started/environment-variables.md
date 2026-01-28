# Variáveis de Ambiente

Documentação completa de todas as variáveis de ambiente suportadas pelo sistema.

## Visão Geral

O sistema usa `@ConfigurationProperties` para gestão centralizada e validação automática de configurações. A aplicação **falha na inicialização** se propriedades obrigatórias estiverem ausentes ou inválidas.

## Variáveis Obrigatórias

Estas variáveis **DEVEM** ser configuradas em todos os ambientes:

### Database

```bash
# PostgreSQL
POSTGRES_USER=livraria_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=livraria_db

# URL completa (produção)
JDBC_DATABASE_URL=jdbc:postgresql://host:5432/livraria_db
```

### JWT e Autenticação

```bash
# Chave secreta para assinar tokens JWT (mínimo 256 bits)
JWT_SECRET=your-secure-256-bit-secret-key-change-this
```

**Gerar chave segura:**
```bash
openssl rand -base64 32
```

### Melhor Envio

```bash
# Token de autenticação da API
MELHOR_ENVIO_TOKEN=your_melhor_envio_token
```

### Mercado Pago

```bash
# Access Token da API
MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_access_token
```

### Email (SMTP)

```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
MAIL_SMTP_STARTTLS_REQUIRED=true
MAIL_SMTP_CONNECTION_TIMEOUT=5000
MAIL_SMTP_TIMEOUT=5000
MAIL_SMTP_WRITE_TIMEOUT=5000
```

### Frontend

```bash
APP_FRONTEND_BASE_URL=http://localhost:3000
```

## Variáveis Opcionais

Estas variáveis têm valores padrão e podem ser omitidas:

### Spring

```bash
# Profile ativo
SPRING_PROFILES_ACTIVE=local  # Opções: local, dev, staging, prod

# Porta do servidor
SERVER_PORT=8080
```

### Database (Local)

```bash
# Host do PostgreSQL
POSTGRES_HOST=localhost

# Porta do PostgreSQL
POSTGRES_PORT=5432
```

### JWT

```bash
# Tempo de expiração do access token (segundos)
JWT_EXPIRATION=3600  # 1 hora

# Tempo de expiração do refresh token (dias)
REFRESH_TOKEN_EXPIRATION_DAYS=30
```

### Melhor Envio

```bash
# URL base da API
MELHOR_ENVIO_BASE_URL=https://sandbox.melhorenvio.com.br

# CEP de origem para cálculo de frete
MELHOR_ENVIO_FROM_CEP=03295-000

# Timeout de requisições (segundos)
MELHOR_ENVIO_TIMEOUT_SECONDS=10

# Máximo de tentativas em caso de falha
MELHOR_ENVIO_MAX_RETRIES=2

# Dimensões padrão dos pacotes (cm)
MELHOR_ENVIO_DEFAULT_WIDTH=15
MELHOR_ENVIO_DEFAULT_HEIGHT=2
MELHOR_ENVIO_DEFAULT_LENGTH=20

# Endpoint de cálculo
MELHOR_ENVIO_CALCULATE_ENDPOINT=/api/v2/me/shipment/calculate
```

### Mercado Pago

```bash
# URL base da API
MERCADO_PAGO_BASE_URL=https://api.mercadopago.com

# Timeout de requisições (segundos)
MERCADO_PAGO_TIMEOUT_SECONDS=15

# Máximo de tentativas em caso de falha
MERCADO_PAGO_MAX_RETRIES=2

# URLs de callback do frontend
MERCADO_PAGO_SUCCESS_URL=http://localhost:3000/payment/success
MERCADO_PAGO_FAILURE_URL=http://localhost:3000/payment/failure
MERCADO_PAGO_PENDING_URL=http://localhost:3000/payment/pending

# URL de notificação (webhook)
MERCADO_PAGO_NOTIFICATION_URL=http://localhost:8080/api/webhooks/mercadopago

# Descrição que aparece na fatura do cartão
MERCADO_PAGO_STATEMENT_DESCRIPTOR=Livraria Tunoda

# Endpoints da API
MERCADO_PAGO_CREATE_PREFERENCE_ENDPOINT=/checkout/preferences
MERCADO_PAGO_GET_PAYMENT_ENDPOINT=/v1/payments/{id}
```

### CORS

```bash
# Origens permitidas (separadas por vírgula)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Métodos HTTP permitidos
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS

# Headers permitidos
CORS_ALLOWED_HEADERS=Authorization,Content-Type,Accept,Origin,X-Requested-With

# Headers expostos
CORS_EXPOSED_HEADERS=Authorization

# Permitir credenciais
CORS_ALLOW_CREDENTIALS=true

# Tempo de cache do preflight (segundos)
CORS_MAX_AGE=3600
```

### Logging

```bash
# Nível de log para integrações
LOG_LEVEL_MELHOR_ENVIO=INFO  # DEBUG, INFO, WARN, ERROR
LOG_LEVEL_MERCADO_PAGO=INFO
```

### JVM (Docker)

```bash
# Opções da JVM
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0
```

## Configuração por Ambiente

### Local (Desenvolvimento)

```bash
# .env ou export
export SPRING_PROFILES_ACTIVE=local
export JWT_SECRET="dev-secret-key-minimum-256-bits-required"
export MELHOR_ENVIO_TOKEN="sandbox-token-here"
export MERCADO_PAGO_ACCESS_TOKEN="test-token-here"
export MAIL_HOST="smtp.gmail.com"
export MAIL_PORT="587"
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"
export MAIL_SMTP_AUTH="true"
export MAIL_SMTP_STARTTLS_ENABLE="true"
export MAIL_SMTP_STARTTLS_REQUIRED="true"
export MAIL_SMTP_CONNECTION_TIMEOUT="5000"
export MAIL_SMTP_TIMEOUT="5000"
export MAIL_SMTP_WRITE_TIMEOUT="5000"
export APP_FRONTEND_BASE_URL="http://localhost:3000"

# Banco via Docker Compose (não precisa configurar JDBC_DATABASE_URL)
```

### Staging (SaveInCloud)

```bash
export SPRING_PROFILES_ACTIVE=staging
export POSTGRES_HOST=postgres
export POSTGRES_USER=livraria_user
export POSTGRES_PASSWORD=strong-password-staging
export POSTGRES_DB=livraria_db
export JWT_SECRET="staging-secret-key-256-bits"
export MELHOR_ENVIO_TOKEN="sandbox-token"
export MERCADO_PAGO_ACCESS_TOKEN="test-token"
export MERCADO_PAGO_NOTIFICATION_URL=http://hml-tunoda.sp1.br.saveincloud.net.br:8080/api/webhooks/mercadopago
export MAIL_HOST="smtp.gmail.com"
export MAIL_PORT="587"
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"
export MAIL_SMTP_AUTH="true"
export MAIL_SMTP_STARTTLS_ENABLE="true"
export MAIL_SMTP_STARTTLS_REQUIRED="true"
export MAIL_SMTP_CONNECTION_TIMEOUT="5000"
export MAIL_SMTP_TIMEOUT="5000"
export MAIL_SMTP_WRITE_TIMEOUT="5000"
export APP_FRONTEND_BASE_URL="https://www.iraquitantunoda.com.br"
```

### Produção

```bash
export SPRING_PROFILES_ACTIVE=prod
export JDBC_DATABASE_URL=jdbc:postgresql://prod-db-host:5432/livraria_db
export POSTGRES_USER=livraria_user
export POSTGRES_PASSWORD=very-strong-production-password
export JWT_SECRET="production-secret-key-256-bits-never-share"
export MELHOR_ENVIO_BASE_URL=https://melhorenvio.com.br
export MELHOR_ENVIO_TOKEN="production-token"
export MERCADO_PAGO_ACCESS_TOKEN="production-access-token"
export MERCADO_PAGO_SUCCESS_URL=https://livrariatunoda.com.br/payment/success
export MERCADO_PAGO_FAILURE_URL=https://livrariatunoda.com.br/payment/failure
export MERCADO_PAGO_NOTIFICATION_URL=https://api.livrariatunoda.com.br/api/webhooks/mercadopago
export MAIL_HOST="smtp.gmail.com"
export MAIL_PORT="587"
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"
export MAIL_SMTP_AUTH="true"
export MAIL_SMTP_STARTTLS_ENABLE="true"
export MAIL_SMTP_STARTTLS_REQUIRED="true"
export MAIL_SMTP_CONNECTION_TIMEOUT="5000"
export MAIL_SMTP_TIMEOUT="5000"
export MAIL_SMTP_WRITE_TIMEOUT="5000"
export APP_FRONTEND_BASE_URL="https://www.iraquitantunoda.com.br"
```

## Validação Automática

O sistema valida as configurações na inicialização. Se algo estiver inválido, a aplicação **NÃO INICIA** e mostra erro claro.

### SecurityProperties

**Validações:**
- `jwtSecret` não pode estar vazio
- `jwtSecret` deve ter pelo menos 32 caracteres (256 bits)
- `jwtExpiration` mínimo: 60 segundos
- `refreshTokenExpirationDays` mínimo: 1 dia

### MelhorEnvioProperties

**Validações:**
- `token` obrigatório
- `baseUrl` obrigatória
- `fromPostalCode` obrigatório
- `timeoutSeconds` mínimo: 1

### MercadoPagoProperties

**Validações:**
- `accessToken` obrigatório
- `baseUrl` obrigatória
- `timeoutSeconds` mínimo: 1

## Exemplo de Erro de Validação

```
***************************
APPLICATION FAILED TO START
***************************

Description:
Binding validation errors:
  - Field error in object 'securityProperties' on field 'jwtSecret': 
    rejected value []; must not be empty
  - Field error in object 'melhorEnvioProperties' on field 'token': 
    rejected value [null]; must not be null

Action:
Configure valid values for the following properties:
  - jwt.secret
  - melhor-envio.token
```

## Como Configurar

### Opção 1: Variáveis de Ambiente (Recomendado)

```bash
export JWT_SECRET="my-secret-key"
export MELHOR_ENVIO_TOKEN="my-token"
./mvnw spring-boot:run
```

### Opção 2: Arquivo .env (Local)

```bash
# .env
JWT_SECRET=my-secret-key
MELHOR_ENVIO_TOKEN=my-token
MERCADO_PAGO_ACCESS_TOKEN=my-token
```

```bash
# Carregar e executar
set -a; source .env; set +a
./mvnw spring-boot:run
```

### Opção 3: IDE (IntelliJ/Eclipse)

**IntelliJ IDEA:**
1. Run → Edit Configurations
2. Environment Variables: `JWT_SECRET=...;MELHOR_ENVIO_TOKEN=...`

**Eclipse:**
1. Run → Run Configurations
2. Environment tab → New
3. Adicionar cada variável

### Opção 4: Docker

```bash
docker run -e JWT_SECRET="..." -e MELHOR_ENVIO_TOKEN="..." ...
```

### Opção 5: Docker Compose

```yaml
environment:
  - JWT_SECRET=${JWT_SECRET}
  - MELHOR_ENVIO_TOKEN=${MELHOR_ENVIO_TOKEN}
  - MERCADO_PAGO_ACCESS_TOKEN=${MERCADO_PAGO_ACCESS_TOKEN}
```

## Boas Práticas

### ✅ Fazer

- Usar variáveis de ambiente para secrets
- Usar valores diferentes por ambiente
- Gerar JWT_SECRET com `openssl rand -base64 32`
- Manter arquivo `.env` fora do Git (`.gitignore`)
- Documentar variáveis obrigatórias

### ❌ Não Fazer

- Commitar secrets no repositório
- Hardcoded credentials no código
- Usar mesma senha em dev e prod
- Compartilhar tokens de produção
- Usar valores padrão em produção

## Secrets em Produção

### AWS Secrets Manager

```java
// Configurar para buscar do AWS
```

### Kubernetes Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: livraria-secrets
stringData:
  JWT_SECRET: "..."
  MELHOR_ENVIO_TOKEN: "..."
```

### Docker Swarm Secrets

```bash
echo "my-secret" | docker secret create jwt_secret -
```

## Troubleshooting

### Aplicação não inicia

**Verificar logs:**
```
APPLICATION FAILED TO START
```

**Causa comum:** Variável obrigatória faltando

**Solução:** Configure todas as variáveis obrigatórias

### Valor não está sendo lido

**Verificar:**
```bash
echo $JWT_SECRET
# Se vazio, variável não está configurada
```

**Verificar no Spring:**
```
# Logs de startup mostram valores (exceto secrets)
```

### Conflito de valores

**Ordem de precedência:**
1. Variáveis de ambiente (maior prioridade)
2. `application-{profile}.yml`
3. `application.yml` (menor prioridade)

## Referências

- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Configuration Properties](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.typesafe-configuration-properties)
- [Profiles](profiles.md)
- [Configuração Local](local-setup.md)
