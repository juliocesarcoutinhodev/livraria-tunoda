# 🏥 Health Checks - Livraria Tunoda

## 📝 Visão Geral

A aplicação expõe health checks através do Spring Boot Actuator para permitir validação de disponibilidade e prontidão.

## 🔗 Endpoint

```
GET /api/v1/actuator/health
```

## 🎯 Indicadores Customizados

### 1. Database Health Indicator

**Classe:** `DatabaseHealthIndicator`

**Validações:**
- Conexão com PostgreSQL
- Execução de query de validação (`SELECT 1`)
- Estado da conexão com o banco

**Status:**
- `UP` - Banco acessível e funcionando
- `DOWN` - Problemas de conexão ou query falhou

**Detalhes (Ambientes Não-Produtivos):**
```json
{
  "database": {
    "status": "UP",
    "details": {
      "database": "PostgreSQL",
      "validationQuery": "SELECT 1",
      "status": "Connection successful"
    }
  }
}
```

### 2. Application Health Indicator

**Classe:** `ApplicationHealthIndicator`

**Validações:**
- Contexto Spring carregado
- Beans registrados
- Estado geral da aplicação

**Status:**
- `UP` - Aplicação pronta para receber requisições
- `DOWN` - Aplicação com problemas ou não inicializada

**Detalhes (Ambientes Não-Produtivos):**
```json
{
  "application": {
    "status": "UP",
    "details": {
      "context": "Active",
      "beansLoaded": 257,
      "status": "Application ready"
    }
  }
}
```

## 🌍 Comportamento por Ambiente

### Local / Dev

**Configuração:** `show-details: always`

**Resposta Completa:**
```json
{
  "status": "UP",
  "components": {
    "application": {
      "status": "UP",
      "details": {
        "context": "Active",
        "beansLoaded": 257,
        "status": "Application ready"
      }
    },
    "database": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "SELECT 1",
        "status": "Connection successful"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 500000000000,
        "free": 250000000000,
        "threshold": 10485760
      }
    },
    "ping": {
      "status": "UP"
    }
  }
}
```

### Produção

**Configuração:** `show-details: never`

**Resposta Simplificada:**
```json
{
  "status": "UP"
}
```

ou

```json
{
  "status": "DOWN"
}
```

## 🐳 Uso em Container Orchestration

### Kubernetes

#### Liveness Probe
Verifica se a aplicação está viva:

```yaml
livenessProbe:
  httpGet:
    path: /api/v1/actuator/health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

#### Readiness Probe
Verifica se a aplicação está pronta para receber tráfego:

```yaml
readinessProbe:
  httpGet:
    path: /api/v1/actuator/health
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Docker Swarm

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/actuator/health"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 40s
```

## 🔒 Segurança

### ✅ Implementado:

- Endpoint público (não requer autenticação)
- Detalhes ocultados em produção
- Sem exposição de informações sensíveis
- Sem credenciais ou dados críticos

### ⚠️ Observações:

- O endpoint é público para permitir monitoramento externo
- Em produção, apenas o status UP/DOWN é exposto
- Logs de erro não expõem dados sensíveis

## 📊 Exemplos de Uso

### cURL

```bash
# Status básico
curl http://localhost:8080/api/v1/actuator/health

# Com formatação
curl http://localhost:8080/api/v1/actuator/health | jq
```

### HTTPie

```bash
# Status básico
http :8080/api/v1/actuator/health

# Com cores
http :8080/api/v1/actuator/health --print=b
```

### Postman

```
GET http://localhost:8080/api/v1/actuator/health
```

## 🔍 Troubleshooting

### Status DOWN - Database

**Possíveis Causas:**
- PostgreSQL não está rodando
- Credenciais incorretas
- Porta do banco bloqueada
- Timeout de conexão

**Solução:**
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Verificar logs do banco
docker-compose logs postgres

# Reiniciar o banco
docker-compose restart postgres
```

### Status DOWN - Application

**Possíveis Causas:**
- Erro durante inicialização
- Dependências faltando
- Configuração inválida

**Solução:**
- Verificar logs da aplicação
- Validar variáveis de ambiente
- Verificar migrações Flyway

## 📚 Referências

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Health Information](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.endpoints.health)
- [Custom Health Indicators](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.endpoints.health.writing-custom-health-indicators)

