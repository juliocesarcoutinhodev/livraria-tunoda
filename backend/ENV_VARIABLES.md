# Variáveis de Ambiente - Livraria Tunoda Backend

## Obrigatórias

### Database
MYSQL_USER=livraria_user
MYSQL_PASSWORD=your_secure_password_here
MYSQL_DATABASE=livraria_db
JDBC_DATABASE_URL=jdbc:mysql://localhost:3306/livraria_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC

### Segurança JWT
JWT_SECRET=your-secure-jwt-secret-key-minimum-256-bits-required-for-hs256-algorithm-change-this-value-in-production

### Melhor Envio
MELHOR_ENVIO_TOKEN=your_melhor_envio_token_here

### Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_access_token_here

## Opcionais (com valores default)

### Spring
SPRING_PROFILES_ACTIVE=local
SERVER_PORT=8080

### JWT e Refresh Token
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION_DAYS=30

### Melhor Envio
MELHOR_ENVIO_BASE_URL=https://sandbox.melhorenvio.com.br
MELHOR_ENVIO_FROM_CEP=03295-000
MELHOR_ENVIO_TIMEOUT_SECONDS=10
MELHOR_ENVIO_MAX_RETRIES=2
MELHOR_ENVIO_DEFAULT_WIDTH=15
MELHOR_ENVIO_DEFAULT_HEIGHT=2
MELHOR_ENVIO_DEFAULT_LENGTH=20
MELHOR_ENVIO_CALCULATE_ENDPOINT=/api/v2/me/shipment/calculate

### Mercado Pago
MERCADO_PAGO_BASE_URL=https://api.mercadopago.com
MERCADO_PAGO_TIMEOUT_SECONDS=15
MERCADO_PAGO_MAX_RETRIES=2
MERCADO_PAGO_SUCCESS_URL=http://localhost:3000/payment/success
MERCADO_PAGO_FAILURE_URL=http://localhost:3000/payment/failure
MERCADO_PAGO_PENDING_URL=http://localhost:3000/payment/pending
MERCADO_PAGO_NOTIFICATION_URL=http://localhost:8080/api/webhooks/mercadopago
MERCADO_PAGO_STATEMENT_DESCRIPTOR=Livraria Tunoda
MERCADO_PAGO_CREATE_PREFERENCE_ENDPOINT=/checkout/preferences
MERCADO_PAGO_GET_PAYMENT_ENDPOINT=/v1/payments/{id}

# Logging
LOG_LEVEL_MELHOR_ENVIO=INFO
LOG_LEVEL_MERCADO_PAGO=INFO

### Database (opcionais para local/dev)
MYSQL_PORT=3306

## Profiles

### local
- Desenvolvimento local com logs detalhados
- Mostra SQL queries e bindings
- Health endpoint com detalhes completos

### staging
- Ambiente de homologação
- Logs moderados
- Health endpoint com detalhes apenas para autorizados

### production
- Ambiente de produção
- Logs mínimos (WARN/ERROR)
- Health endpoint sem detalhes
- Todas as variáveis sensíveis devem estar configuradas

## Exemplo de uso

### Local (default)
```bash
export JWT_SECRET="your-secure-jwt-secret-key-minimum-256-bits"
export MELHOR_ENVIO_TOKEN="your_melhor_envio_token"
export MERCADO_PAGO_ACCESS_TOKEN="your_mercado_pago_token"
./mvnw spring-boot:run
```

### Staging
```bash
export SPRING_PROFILES_ACTIVE=staging
export JWT_SECRET="your-secure-jwt-secret-key-minimum-256-bits"
export MELHOR_ENVIO_TOKEN="your_melhor_envio_token"
export MERCADO_PAGO_ACCESS_TOKEN="your_mercado_pago_token"
export JDBC_DATABASE_URL="jdbc:mysql://staging-db:3306/livraria_db"
export MYSQL_USER="staging_user"
export MYSQL_PASSWORD="staging_password"
./mvnw spring-boot:run
```

### Production
```bash
export SPRING_PROFILES_ACTIVE=production
export JWT_SECRET="your-production-secure-jwt-secret-key-minimum-256-bits"
export MELHOR_ENVIO_TOKEN="your_production_melhor_envio_token"
export MERCADO_PAGO_ACCESS_TOKEN="your_production_mercado_pago_token"
export JDBC_DATABASE_URL="jdbc:mysql://production-db:3306/livraria_db"
export MYSQL_USER="production_user"
export MYSQL_PASSWORD="production_password"
export MELHOR_ENVIO_BASE_URL="https://melhorenvio.com.br"
export MERCADO_PAGO_NOTIFICATION_URL="https://your-domain.com/api/webhooks/mercadopago"
./mvnw spring-boot:run
```

## Validação

A aplicação valida automaticamente na inicialização:
- Propriedades obrigatórias devem estar presentes
- JWT secret não pode estar vazio
- Tokens de API não podem estar vazios
- Timeouts e retries devem ser >= 1 e >= 0 respectivamente

Se alguma propriedade obrigatória estiver ausente ou inválida, a aplicação falhará na inicialização com mensagem clara.

