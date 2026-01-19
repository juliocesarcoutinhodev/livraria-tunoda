# Livraria Tunoda - Backend

API REST para gerenciamento de livraria construída com Clean Architecture e Domain-Driven Design.

## Stack Tecnológica

**Java 25** | **Spring Boot 3.5.9** | **PostgreSQL 17** | **Docker**

## Quick Start

```bash
# Clone e configure
git clone <repository-url>
cd backend
export JWT_SECRET="your-256-bit-secret"
export MELHOR_ENVIO_TOKEN="your-token"
export MERCADO_PAGO_ACCESS_TOKEN="your-token"

# Suba o banco e execute
docker-compose up -d
./mvnw spring-boot:run

# Verifique
curl http://localhost:8080/api/v1/actuator/health
```

**Guia completo:** [Getting Started](docs/getting-started/README.md)

## Documentação

### 🚀 Getting Started

- [Pré-requisitos](docs/getting-started/prerequisites.md) - Ferramentas necessárias
- [Configuração Local](docs/getting-started/local-setup.md) - Setup passo a passo
- [Profiles](docs/getting-started/profiles.md) - Ambientes e configurações
- [Variáveis de Ambiente](docs/getting-started/environment-variables.md) - Configurações
- [Fluxo de Startup](docs/getting-started/startup-flow.md) - O que acontece no startup

### 🏗️ Arquitetura

- [Visão Geral](docs/architecture/README.md) - Introdução à arquitetura
- [Clean Architecture](docs/architecture/clean-architecture.md) - Camadas e princípios
- [DDD - Bounded Contexts](docs/architecture/ddd-bounded-contexts.md) - Contextos delimitados
- [Modelo de Domínio](docs/architecture/domain-model.md) - Agregados e Value Objects
- [Estrutura do Projeto](docs/architecture/project-structure.md) - Organização do código

### 📚 Domínios

- [Visão Geral](docs/domain/README.md) - Todos os contextos
- [Catálogo](docs/domain/catalog.md) - Livros e Autores
- [Analytics](docs/domain/analytics.md) - Métricas e eventos
- [Carrinho](docs/domain/cart.md) - Carrinho de compras
- [Pedidos](docs/domain/orders.md) - Gestão de pedidos
- [Frete](docs/domain/shipping.md) - Cálculo de frete
- [Pagamentos](docs/domain/payments.md) - Processamento de pagamentos
- [Usuários](docs/domain/users.md) - Autenticação e usuários admin

### 🐳 Deployment

- [Docker](docs/deployment/DOCKER.md) - Containers e imagens
- [Docker Compose](docs/deployment/docker-compose.md) - Orquestração local
- [Produção](docs/deployment/production.md) - Guia operacional
- [Monitoramento](docs/deployment/monitoring.md) - Health checks e métricas
- [Troubleshooting](docs/deployment/troubleshooting.md) - Solução de problemas

### 🗄️ Banco de Dados

- [Schema](docs/database/schema.md) - Estrutura de tabelas
- [Migrations](docs/database/migrations.md) - Flyway e versionamento
- [PostgreSQL](docs/database/postgresql-migration.md) - Migração MySQL → PostgreSQL

### 🔐 Segurança

- [Autenticação](docs/security/authentication.md) - JWT e tokens
- [Logout (Revoke)](docs/security/LOGOUT_IMPLEMENTATION.md) - Sistema de logout ⭐ NOVO
- [Autorização](docs/security/authorization.md) - Roles e permissões
- [Credenciais Admin](docs/security/ADMIN_CREDENTIALS.md) - Usuário administrativo
- [Boas Práticas](docs/security/best-practices.md) - Segurança geral

### 🔌 Integrações

- [Melhor Envio](docs/integrations/MELHOR_ENVIO_INTEGRATION.md) - API de frete
- [Melhor Envio - Quick Start](docs/integrations/MELHOR_ENVIO_QUICKSTART.md) - Início rápido
- [Mercado Pago](docs/integrations/mercado-pago.md) - API de pagamentos
- [Webhooks](docs/integrations/WEBHOOK_MERCADO_PAGO.md) - Notificações de pagamento

### 📖 API

- [Endpoints](docs/api/endpoints.md) - Documentação de rotas
- [Error Handling](docs/api/error-handling.md) - Tratamento de erros
- [Filtros de Busca](docs/api/SEARCH_FILTERS.md) - Busca por nome/título ⭐ NOVO
- [Ordenação (Sort)](docs/api/SORT_IMPLEMENTATION.md) - Ordenação dinâmica ⭐ NOVO
- [Bugfix: Filtro NULL](docs/api/BUGFIX_NULL_FILTER.md) - Correção PostgreSQL
- [Postman Collections](docs/api/postman/) - Collections para testes

### ⚙️ Operations

- [Logging](docs/operations/LOGGING.md) - Configuração de logs
- [Health Checks](docs/operations/HEALTH_CHECK.md) - Monitoramento de saúde
- [Backup & Restore](docs/operations/backup-restore.md) - Gestão de backups

### 👨‍💻 Development

- [Como Contribuir](docs/development/contributing.md) - Guidelines
- [Convenções de Código](docs/development/coding-conventions.md) - Clean Code
- [Testes](docs/development/testing.md) - Estratégia de testes
- [Ferramentas](docs/development/tools.md) - IDEs e utilitários

### 📋 Decisões & Histórico

- [ADRs](docs/decisions/README.md) - Architecture Decision Records
- [Sprints](docs/history/sprints.md) - Stories implementadas
- [Changelog](docs/history/changelog.md) - Histórico de mudanças
- [Roadmap](docs/history/roadmap.md) - Próximos passos

## Status do Projeto

**Versão:** 1.0.0  
**Ambiente de Staging:** [http://hml-tunoda.sp1.br.saveincloud.net.br:8080](http://hml-tunoda.sp1.br.saveincloud.net.br:8080)  
**Health Check:** [/api/v1/actuator/health](http://hml-tunoda.sp1.br.saveincloud.net.br:8080/api/v1/actuator/health)

## Credenciais de Desenvolvimento

**Admin padrão:**
```
Email: admin@livraria.com
Senha: admin123
```

⚠️ **Altere imediatamente em produção!** Veja [docs/security/ADMIN_CREDENTIALS.md](docs/security/ADMIN_CREDENTIALS.md)

## Principais Endpoints

| Endpoint | Método | Descrição | Auth |
|----------|--------|-----------|------|
| `/api/v1/actuator/health` | GET | Health check | Público |
| `/api/auth/login` | POST | Autenticação | Público |
| `/api/auth/revoke` | POST | Logout (revogar token) | Público |
| `/api/public/books` | GET | Listar livros (com busca e ordenação) | Público |
| `/api/admin/books` | GET | Listar livros admin (com filtros) | ADMIN |
| `/api/admin/books` | POST | Criar livro | ADMIN |
| `/api/admin/books/{id}` | GET | Buscar livro por ID | ADMIN |
| `/api/admin/books/{id}/stock` | POST | Atualizar estoque | ADMIN |
| `/api/admin/authors` | GET | Listar autores (com busca e ordenação) | ADMIN |
| `/api/admin/authors/{id}` | GET | Buscar autor por ID | ADMIN |
| `/api/carts` | POST | Criar carrinho | Público |
| `/api/shipping/quotes` | POST | Calcular frete | Público |
| `/api/payments` | POST | Criar pagamento | Público |

**✨ Novidades:** Busca por nome/título, ordenação dinâmica (sortBy/sortDirection), logout seguro, gestão de estoque

**Documentação completa:** [docs/api/endpoints.md](docs/api/endpoints.md)

## Tecnologias e Padrões

- **Clean Architecture** - Separação de camadas e inversão de dependências
- **Domain-Driven Design** - Bounded Contexts, Aggregates, Value Objects
- **SOLID Principles** - Código limpo e manutenível
- **MapStruct** - Mapeamento Domain ↔ Entity ↔ DTO
- **Flyway** - Versionamento de banco de dados
- **Spring Security** - Autenticação JWT stateless
- **Actuator** - Monitoramento e health checks
- **Docker** - Containerização multi-stage

## Suporte

- **Documentação:** [docs/](docs/)
- **Issues:** GitHub Issues
- **Postman:** [docs/api/postman/](docs/api/postman/)

## Licença

Proprietário - Livraria Tunoda © 2026
