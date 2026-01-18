# 📝 Logs Estruturados - Livraria Tunoda

## 🎯 Visão Geral

Sistema de logs estruturados e padronizados para facilitar diagnóstico, auditoria e observabilidade da aplicação.

## 📋 Características

### ✅ Implementado:

- ✅ Logs em JSON no profile `production`
- ✅ Logs legíveis nos profiles `local` e `dev`
- ✅ Nível de log configurável por ambiente
- ✅ MDC (Mapped Diagnostic Context) com `requestId`
- ✅ Logs de startup, erros globais e requisições críticas
- ✅ Stacktrace apenas em ambientes não produtivos
- ✅ Sanitização de dados sensíveis (tokens, senhas, CPF)

## 🏗️ Arquitetura

### Componentes

```
infrastructure/
  └── config/
      └── logging/
          ├── RequestIdFilter.java                # Adiciona requestId ao MDC
          ├── CriticalOperationsLoggingAspect.java # Logs de operações críticas
          └── (logback-spring.xml na resources)    # Configuração Logback
```

## 📊 Formato de Logs

### Local / Dev (Legível)

```
2026-01-17 10:30:45 [http-nio-8080-exec-1] [a1b2c3d4-e5f6-7890] INFO  c.i.l.a.u.CreatePaymentUseCase - Iniciando operação crítica: CreatePaymentUseCase.execute com argumentos: [cartId=123, token=***]
```

**Formato:**
```
timestamp [thread] [requestId] level logger - mensagem
```

### Produção (JSON)

```json
{
  "timestamp": "2026-01-17T10:30:45.123Z",
  "level": "INFO",
  "logger": "br.com.iraquitantunoda.livrariatunoda.application.usecase.CreatePaymentUseCase",
  "message": "Iniciando operação crítica: CreatePaymentUseCase.execute",
  "thread": "http-nio-8080-exec-1",
  "requestId": "a1b2c3d4-e5f6-7890",
  "application": "livraria-tunoda"
}
```

## 🔧 Configuração

### Logback (logback-spring.xml)

Arquivo localizado em: `src/main/resources/logback-spring.xml`

**Profiles:**

- `local`, `dev` → Console legível com detalhes
- `staging` → Console legível com menos detalhes
- `prod`, `production` → Console JSON sem stacktrace sensível

### Níveis de Log por Ambiente

#### Local / Dev
```yaml
root: INFO
aplicacao: DEBUG
sql: DEBUG
web: DEBUG
hibernate: TRACE
melhor-envio: DEBUG
mercado-pago: DEBUG
```

#### Staging
```yaml
root: INFO
aplicacao: INFO
sql: WARN
web: INFO
```

#### Produção
```yaml
root: WARN
aplicacao: INFO
sql: ERROR
web: WARN
melhor-envio: INFO
mercado-pago: INFO
```

## 🔍 MDC (Mapped Diagnostic Context)

### RequestId

Cada requisição recebe um `requestId` único:

1. **Geração Automática:** UUID v4 gerado pelo `RequestIdFilter`
2. **Header Customizado:** Cliente pode enviar `X-Request-ID` header
3. **Propagação:** requestId está disponível em todos os logs da requisição

**Exemplo de uso:**

```bash
# Cliente envia requestId customizado
curl -H "X-Request-ID: custom-123" http://localhost:8080/api/...
```

**Logs resultantes:**
```
2026-01-17 10:30:45 [http-nio-8080-exec-1] [custom-123] INFO ...
2026-01-17 10:30:46 [http-nio-8080-exec-1] [custom-123] DEBUG ...
2026-01-17 10:30:47 [http-nio-8080-exec-1] [custom-123] INFO ...
```

### Como Usar no Código

```java
import org.slf4j.MDC;

// Obter requestId atual
String requestId = MDC.get("requestId");

// Adicionar informação customizada ao MDC
MDC.put("userId", "user-123");
log.info("Processando pagamento"); // Logs incluirão userId

// Limpar informação customizada
MDC.remove("userId");
```

## 📌 Operações Críticas Logadas

O `CriticalOperationsLoggingAspect` registra automaticamente:

### 1. Pagamento
- `CreatePaymentUseCase`
- `ProcessPaymentUseCase`

### 2. Frete
- `CalculateShippingUseCase`
- `SelectShippingOptionUseCase`

### Informações Logadas:

**Entrada:**
```
INFO - Iniciando operação crítica: CreatePaymentUseCase.execute
```

**Sucesso:**
```
INFO - Operação crítica concluída com sucesso: CreatePaymentUseCase.execute em 245ms
```

**Erro (Local/Dev):**
```
ERROR - Erro na operação crítica: CreatePaymentUseCase.execute após 123ms
java.lang.IllegalArgumentException: Argumento inválido
    at ...
```

**Erro (Produção):**
```
ERROR - Erro na operação crítica: CreatePaymentUseCase.execute após 123ms - Erro: Argumento inválido
```

## 🛡️ Segurança e Sanitização

### Dados Sensíveis NÃO Logados

❌ **Nunca logue:**
- Tokens de autenticação (JWT, Bearer)
- Senhas
- CPF / CNPJ
- Números de cartão de crédito
- Códigos de segurança (CVV)
- Chaves de API

### Sanitização Automática

O `CriticalOperationsLoggingAspect` sanitiza automaticamente:

```java
// Entrada original:
token=abc123, password=secret, cpf=12345678901

// Log sanitizado:
token=***, password=***, cpf=***
```

**Regex de sanitização:**
```java
argStr.replaceAll("(?i)(token|password|senha|cpf|card)=[^,\\s}]+", "$1=***")
```

## 📈 Exemplos de Logs

### Startup

```
2026-01-17 10:30:00 [main] INFO  o.s.boot.SpringApplication - Starting application
2026-01-17 10:30:02 [main] INFO  b.c.i.l.i.c.StartupLogger - ========================================
2026-01-17 10:30:02 [main] INFO  b.c.i.l.i.c.StartupLogger - Application started successfully!
2026-01-17 10:30:02 [main] INFO  b.c.i.l.i.c.StartupLogger - Active profile(s): local
2026-01-17 10:30:02 [main] INFO  b.c.i.l.i.c.StartupLogger - Port: 8080
2026-01-17 10:30:02 [main] INFO  b.c.i.l.i.c.StartupLogger - ========================================
```

### Requisição Crítica (Pagamento)

```
2026-01-17 10:30:45 [http-nio-8080-exec-1] [a1b2c3d4] INFO  CreatePaymentUseCase - Iniciando operação crítica
2026-01-17 10:30:45 [http-nio-8080-exec-1] [a1b2c3d4] DEBUG MercadoPagoClient - Criando preferência de pagamento
2026-01-17 10:30:46 [http-nio-8080-exec-1] [a1b2c3d4] INFO  MercadoPagoClient - Preferência criada: pref-123
2026-01-17 10:30:46 [http-nio-8080-exec-1] [a1b2c3d4] INFO  CreatePaymentUseCase - Operação crítica concluída em 1234ms
```

### Erro Global

**Local/Dev:**
```
2026-01-17 10:30:50 [http-nio-8080-exec-2] [b2c3d4e5] ERROR GlobalExceptionHandler - Erro interno do servidor: null pointer - Path: /api/payments/123
java.lang.NullPointerException: Cannot invoke method on null
    at br.com.iraquitantunoda.livrariatunoda.application.usecase.GetPaymentUseCase.execute(GetPaymentUseCase.java:45)
    at ...
```

**Produção:**
```json
{
  "timestamp": "2026-01-17T10:30:50.123Z",
  "level": "ERROR",
  "logger": "GlobalExceptionHandler",
  "message": "Erro interno do servidor: null pointer - Path: /api/payments/123 - Exception: NullPointerException",
  "requestId": "b2c3d4e5"
}
```

## 🔎 Busca e Análise

### Buscar por RequestId

```bash
# Local (arquivo)
grep "a1b2c3d4" application.log

# Produção (JSON + jq)
cat application.log | jq 'select(.requestId == "a1b2c3d4")'

# ELK Stack / Kibana
requestId: "a1b2c3d4"

# CloudWatch / Datadog
{"requestId": "a1b2c3d4"}
```

### Buscar Erros

```bash
# Local
grep "ERROR" application.log

# Produção (JSON)
cat application.log | jq 'select(.level == "ERROR")'

# Por operação crítica
cat application.log | jq 'select(.message | contains("operação crítica"))'
```

## 🚀 Integração com Ferramentas

### ELK Stack (Elasticsearch, Logstash, Kibana)

Logs em JSON são compatíveis nativamente:

```yaml
# logstash.conf
input {
  stdin {
    codec => json
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "livraria-tunoda-%{+YYYY.MM.dd}"
  }
}
```

### Datadog

```yaml
# datadog.yaml
logs_enabled: true
logs_config:
  container_collect_all: true
  processing_rules:
    - type: include_at_match
      name: livraria-tunoda
      pattern: "livraria-tunoda"
```

### CloudWatch Logs

```bash
# AWS CLI
aws logs tail /aws/ecs/livraria-tunoda --follow --format json
```

## 📚 Boas Práticas

### ✅ Fazer:

1. **Use níveis apropriados:**
   - `ERROR` → Erros que impedem operação
   - `WARN` → Situações anormais não críticas
   - `INFO` → Eventos importantes
   - `DEBUG` → Detalhes para debugging
   - `TRACE` → Informações extremamente detalhadas

2. **Contextualize logs:**
   ```java
   log.info("Pagamento processado - PaymentId: {}, Amount: {}", paymentId, amount);
   ```

3. **Use MDC para contexto:**
   ```java
   MDC.put("userId", userId);
   MDC.put("cartId", cartId);
   ```

4. **Log no nível correto do flow:**
   - Controller → INFO (entrada/saída)
   - UseCase → INFO (operações críticas)
   - Gateway → DEBUG (integrações)
   - Repository → DEBUG (queries)

### ❌ Evitar:

1. **Não logue dados sensíveis:**
   ```java
   // ❌ ERRADO
   log.info("Token: {}", jwtToken);
   
   // ✅ CORRETO
   log.info("Token gerado para user: {}", userId);
   ```

2. **Não use System.out / System.err:**
   ```java
   // ❌ ERRADO
   System.out.println("Debug: " + value);
   
   // ✅ CORRETO
   log.debug("Value: {}", value);
   ```

3. **Não faça logs excessivos em loops:**
   ```java
   // ❌ ERRADO
   for (Item item : items) {
       log.info("Processing item: {}", item.getId());
   }
   
   // ✅ CORRETO
   log.info("Processing {} items", items.size());
   ```

4. **Não concatene strings nos logs:**
   ```java
   // ❌ ERRADO
   log.info("User " + userId + " created order " + orderId);
   
   // ✅ CORRETO
   log.info("User {} created order {}", userId, orderId);
   ```

## 🧪 Testando Logs

### Ambiente Local

```bash
# Iniciar aplicação
./mvnw spring-boot:run

# Fazer requisição
curl http://localhost:8080/api/public/books

# Observar logs no console
```

### Validar JSON em Produção

```bash
# Executar com profile prod
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run

# Validar formato JSON
./mvnw spring-boot:run | jq '.'
```

## 📖 Referências

- [Logback Documentation](https://logback.qos.ch/documentation.html)
- [SLF4J Manual](https://www.slf4j.org/manual.html)
- [Logstash Logback Encoder](https://github.com/logfellow/logstash-logback-encoder)
- [MDC Best Practices](https://www.baeldung.com/mdc-in-log4j-2-logback)

