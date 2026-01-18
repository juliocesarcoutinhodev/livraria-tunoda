# Profiles do Spring

O projeto utiliza Spring Profiles para gerenciar configurações em diferentes ambientes, seguindo boas práticas de segurança.

## Visão Geral

Profiles permitem ter diferentes configurações para cada ambiente (desenvolvimento, staging, produção) sem alterar código.

## Profiles Disponíveis

### local (default)

**Uso:** Desenvolvimento local na máquina do desenvolvedor

**Características:**
- Logs detalhados (DEBUG)
- SQL queries visíveis no console
- Health endpoint com detalhes completos
- Melhor para desenvolvimento e debug
- Banco de dados via Docker Compose

**Ativar:**
```bash
# Default - não precisa configurar
./mvnw spring-boot:run

# Ou explicitamente
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

**Arquivo:** `application-local.yml`

### dev

**Uso:** Desenvolvimento com banco Docker e configurações mais próximas de produção

**Características:**
- Logs moderados (INFO/DEBUG)
- SQL queries visíveis
- Health endpoint com detalhes
- Simula ambiente mais realista

**Ativar:**
```bash
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

**Arquivo:** `application-dev.yml`

### staging

**Uso:** Ambiente de homologação (SaveInCloud)

**Características:**
- Logs moderados (INFO)
- Health endpoint com detalhes apenas para autorizados
- Configurações próximas à produção
- APIs em modo sandbox (Melhor Envio, Mercado Pago)

**Ativar:**
```bash
SPRING_PROFILES_ACTIVE=staging ./mvnw spring-boot:run
```

**Arquivo:** `application-staging.yml`

### prod / production

**Uso:** Ambiente de produção

**Características:**
- Logs mínimos (WARN/ERROR)
- Sem SQL queries nos logs
- Health endpoint sem detalhes (apenas UP/DOWN)
- Máxima segurança
- APIs em modo produção

**Ativar:**
```bash
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

**Arquivo:** `application-prod.yml`

## Comparação de Profiles

| Aspecto | local | dev | staging | prod |
|---------|-------|-----|---------|------|
| **Log Level** | DEBUG | INFO/DEBUG | INFO | WARN/ERROR |
| **SQL Queries** | ✅ Sim | ✅ Sim | ❌ Não | ❌ Não |
| **Health Details** | ✅ Sempre | ✅ Sempre | 🔐 Autenticado | ❌ Nunca |
| **Actuator Metrics** | 🔓 Público | 🔓 Público | 🔐 Autenticado | 🔐 ADMIN |
| **APIs Externas** | Sandbox | Sandbox | Sandbox | Produção |
| **Database** | Docker local | Docker local | PostgreSQL staging | PostgreSQL prod |

## Arquivos de Configuração

### Estrutura

```
src/main/resources/
├── application.yml              # Configurações base
├── application-local.yml        # Profile local
├── application-dev.yml          # Profile dev
├── application-staging.yml      # Profile staging
└── application-prod.yml         # Profile production
```

### application.yml (Base)

Contém configurações comuns a todos os profiles e define variáveis de ambiente.

**Características:**
- Valores padrão
- Variáveis de ambiente
- Configurações que não mudam entre ambientes

### application-{profile}.yml

Sobrescreve valores do `application.yml` para cada ambiente específico.

**Características:**
- Configurações específicas do ambiente
- Níveis de log diferentes
- Exposição de endpoints do Actuator
- Detalhamento de health checks

## Configurações por Profile

### Local

```yaml
# application-local.yml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    root: INFO
    br.com.iraquitantunoda.livrariatunoda: DEBUG
    org.hibernate.SQL: DEBUG

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

### Staging

```yaml
# application-staging.yml
spring:
  jpa:
    show-sql: false

logging:
  level:
    root: INFO
    br.com.iraquitantunoda.livrariatunoda: INFO

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
```

### Produção

```yaml
# application-prod.yml
spring:
  jpa:
    show-sql: false

logging:
  level:
    root: WARN
    br.com.iraquitantunoda.livrariatunoda: INFO
    org.hibernate.SQL: ERROR

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: never
```

## Variáveis de Ambiente

### Obrigatórias (todos os profiles)

```bash
JWT_SECRET="your-secure-256-bit-secret"
MELHOR_ENVIO_TOKEN="your-token"
MERCADO_PAGO_ACCESS_TOKEN="your-token"
```

### Opcionais (com defaults)

```bash
SPRING_PROFILES_ACTIVE=local
SERVER_PORT=8080
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION_DAYS=30
```

Para lista completa, veja [Variáveis de Ambiente](environment-variables.md).

## Validação Automática

O sistema valida automaticamente as configurações na inicialização usando `@ConfigurationProperties`.

### SecurityProperties

- JWT secret obrigatório e não vazio
- JWT expiration mínimo: 60 segundos
- Refresh token expiration mínimo: 1 dia

### MelhorEnvioProperties

- Token obrigatório
- Base URL obrigatória
- CEP de origem obrigatório
- Timeout mínimo: 1 segundo

### MercadoPagoProperties

- Access token obrigatório
- Base URL obrigatória
- Timeout mínimo: 1 segundo

**Se validação falhar:**
```
***************************
APPLICATION FAILED TO START
***************************

Description:
Binding validation errors on securityProperties
  - Field 'jwtSecret': must not be empty

Action:
Configure a valid value for 'jwt.secret'
```

## Como Escolher o Profile

### Desenvolvimento Local
```bash
# Sem configurar (usa local por padrão)
./mvnw spring-boot:run
```

### Testar Configuração de Staging
```bash
SPRING_PROFILES_ACTIVE=staging ./mvnw spring-boot:run
```

### Docker (Staging)
```bash
docker run -e SPRING_PROFILES_ACTIVE=staging ...
```

### Docker Compose
```yaml
environment:
  - SPRING_PROFILES_ACTIVE=staging
```

### IntelliJ IDEA
1. Run → Edit Configurations
2. Environment Variables: `SPRING_PROFILES_ACTIVE=local`
3. Ou em Program Arguments: `--spring.profiles.active=local`

### Linha de Comando
```bash
java -jar app.jar --spring.profiles.active=prod
```

## Boas Práticas

### Nunca Hardcode Secrets

❌ **Errado:**
```yaml
jwt:
  secret: "minha-chave-secreta-123"
```

✅ **Correto:**
```yaml
jwt:
  secret: ${JWT_SECRET}
```

### Use @ConfigurationProperties

❌ **Evite:**
```java
@Value("${jwt.secret}")
private String jwtSecret;
```

✅ **Prefira:**
```java
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    // getters/setters
}
```

### Valide na Inicialização

```java
@ConfigurationProperties(prefix = "jwt")
@Validated
public class JwtProperties {
    @NotEmpty
    @Size(min = 32)
    private String secret;
}
```

### Diferentes Ambientes, Diferentes Tokens

- **Local/Dev:** Tokens de sandbox/teste
- **Staging:** Tokens de sandbox
- **Produção:** Tokens de produção reais

## Troubleshooting

### Profile não é carregado

**Verificar:**
```bash
# Nos logs de startup
Active profile(s): local

# Se não aparecer, profile não foi configurado
```

### Variável de ambiente não está sendo lida

**Verificar:**
```bash
echo $SPRING_PROFILES_ACTIVE
echo $JWT_SECRET

# Se vazio, variável não está configurada
```

### Configuração de um profile sobrescreve outra

**Ordem de precedência (maior → menor):**
1. Variáveis de ambiente
2. `application-{profile}.yml`
3. `application.yml`

## Referências

- [Spring Boot Profiles](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.profiles)
- [Configuration Properties](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.typesafe-configuration-properties)
- [Variáveis de Ambiente](environment-variables.md)
- [Configuração Local](local-setup.md)
