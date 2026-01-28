# Getting Started

Guias para começar a trabalhar com o projeto rapidamente.

## Quick Start (5 minutos)

```bash
# 1. Clone
git clone <repo>
cd backend

# 2. Configure variáveis
export JWT_SECRET="your-256-bit-secret"
export MELHOR_ENVIO_TOKEN="your-token"
export MERCADO_PAGO_ACCESS_TOKEN="your-token"
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

# 3. Suba o banco
docker-compose up -d

# 4. Execute
./mvnw spring-boot:run

# 5. Teste
curl http://localhost:8080/api/v1/actuator/health
```

## Guias Detalhados

### [Pré-requisitos](prerequisites.md)

Ferramentas necessárias para desenvolvimento.

**Conteúdo:**
- Java 25
- Maven 3.8+
- Docker & Docker Compose
- Git
- IDEs recomendadas

### [Configuração Local](local-setup.md)

Passo a passo completo para configurar o ambiente de desenvolvimento local.

**Conteúdo:**
- Clone do repositório
- Configuração de variáveis de ambiente
- Banco de dados com Docker
- Executar aplicação (Maven ou IDE)
- Verificações de saúde
- Usuário admin padrão

### [Profiles do Spring](profiles.md)

Entenda os diferentes profiles e quando usar cada um.

**Conteúdo:**
- `local` - Desenvolvimento local
- `dev` - Desenvolvimento com Docker
- `staging` - Homologação
- `prod` - Produção
- Diferenças de configuração

### [Variáveis de Ambiente](environment-variables.md)

Todas as variáveis de ambiente suportadas e suas configurações.

**Conteúdo:**
- Variáveis obrigatórias
- Variáveis opcionais
- Valores padrão
- Validação automática
- Exemplos por ambiente

### [Fluxo de Startup](startup-flow.md)

Entenda o que acontece durante a inicialização da aplicação.

**Conteúdo:**
- 7 etapas de startup
- Validação de configurações
- Migrations do Flyway
- Inicialização do Spring Security
- Logs esperados
- Troubleshooting de startup

## Ferramentas de Desenvolvimento

### Postman

Collections disponíveis em `docs/api/postman/`:

- `Livraria-Tunoda-API.postman_collection.json` - Ambiente local
- `Livraria-Tunoda-API-STAGING.postman_collection.json` - Ambiente staging

### Docker Compose

Para desenvolvimento local, use:

```bash
# Apenas banco de dados
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Maven Wrapper

Comandos úteis:

```bash
# Executar aplicação
./mvnw spring-boot:run

# Build
./mvnw clean package

# Testes
./mvnw test

# Skip tests
./mvnw clean package -DskipTests
```

## Primeiros Passos Após Setup

### 1. Fazer Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@livraria.com","password":"admin123"}'
```

Copie o `accessToken` retornado.

### 2. Criar um Autor

```bash
curl -X POST http://localhost:8080/api/admin/authors \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Machado de Assis",
    "biography": "Escritor brasileiro, considerado um dos maiores nomes da literatura."
  }'
```

Copie o `id` retornado.

### 3. Criar um Livro

```bash
curl -X POST http://localhost:8080/api/admin/books \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dom Casmurro",
    "description": "Romance clássico da literatura brasileira",
    "price": 45.90,
    "stock": 100,
    "isbn": "978-8535911663",
    "weight": 0.350,
    "authorIds": ["AUTHOR_ID_AQUI"]
  }'
```

### 4. Listar Livros Públicos

```bash
curl http://localhost:8080/api/public/books
```

## Próximos Passos

### Aprender Arquitetura

- [Clean Architecture](../architecture/clean-architecture.md)
- [DDD - Bounded Contexts](../architecture/ddd-bounded-contexts.md)
- [Modelo de Domínio](../domain/README.md)

### Desenvolver Features

- [Convenções de Código](../development/coding-conventions.md)
- [Testes](../development/testing.md)
- [Como Contribuir](../development/contributing.md)

### Deploy

- [Docker](../deployment/DOCKER.md)
- [Produção](../deployment/production.md)
- [Monitoramento](../deployment/monitoring.md)

## Suporte

### Documentação

- [API Endpoints](../api/endpoints.md)
- [Integrações](../integrations/README.md)
- [Segurança](../security/README.md)

### Problemas Comuns

- [Troubleshooting](../deployment/troubleshooting.md)
- [Health Checks](../operations/HEALTH_CHECK.md)
- [Logs](../operations/LOGGING.md)

## Referências

- [README Principal](../../README.md)
- [Stack Tecnológica](prerequisites.md)
- [Arquitetura](../architecture/README.md)
