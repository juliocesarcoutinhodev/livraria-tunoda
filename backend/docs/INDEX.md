# 📚 Índice Completo da Documentação - v1.1.0

**Última Atualização:** 19/01/2026

---

## 🚀 Início Rápido

- [README Principal](../README.md) - Visão geral do projeto
- [Guia Rápido v1.1.0](QUICK_GUIDE.md) ⭐ - Referência rápida das novidades
- [Release Notes v1.1.0](RELEASE_NOTES_v1.1.0.md) ⭐ - Detalhes da versão

---

## 📖 Por Categoria

### **1. Getting Started**
- [Prerequisites](getting-started/prerequisites.md) - O que você precisa
- [Local Setup](getting-started/local-setup.md) - Como configurar
- [Profiles](getting-started/profiles.md) - Ambientes (local, dev, staging, prod)
- [Environment Variables](getting-started/environment-variables.md) - Variáveis de configuração
- [Startup Flow](getting-started/startup-flow.md) - O que acontece ao iniciar

### **2. Arquitetura**
- [Visão Geral](architecture/README.md) - Introdução
- [Clean Architecture](architecture/clean-architecture.md) - Camadas e princípios
- [Domain-Driven Design](architecture/ddd-bounded-contexts.md) - Bounded contexts
- [Domain Model](architecture/domain-model.md) - Aggregates e Value Objects
- [Project Structure](architecture/project-structure.md) - Organização de pastas

### **3. Domínios**
- [Catálogo](domain/catalog.md) - Livros e Autores
- [Analytics](domain/analytics.md) - Métricas e eventos
- [Carrinho](domain/cart.md) - Carrinho de compras
- [Pedidos](domain/orders.md) - Gestão de pedidos
- [Frete](domain/shipping.md) - Cálculo de frete (Melhor Envio)
- [Pagamentos](domain/payments.md) - Processamento (Mercado Pago)
- [Usuários](domain/users.md) - Autenticação e admin

### **4. API** ⭐ ATUALIZADO
- [Visão Geral](api/README.md) - Introdução aos endpoints
- [Endpoints Completos](api/endpoints.md) - Documentação de rotas
- [Filtros de Busca](api/SEARCH_FILTERS.md) ⭐ NOVO - Busca por nome/título
- [Ordenação (Sort)](api/SORT_IMPLEMENTATION.md) ⭐ NOVO - Ordenação dinâmica
- [Error Handling](api/error-handling.md) - Tratamento de erros
- [Bugfix: Filtro NULL](api/BUGFIX_NULL_FILTER.md) - Correção PostgreSQL
- [Postman Collections](api/postman/) - Collections de teste

### **5. Segurança** ⭐ ATUALIZADO
- [Visão Geral](security/README.md) - Introdução
- [Autenticação](security/authentication.md) - JWT e tokens
- [Logout (Revoke)](security/LOGOUT_IMPLEMENTATION.md) ⭐ NOVO - Sistema de logout
- [Autorização](security/authorization.md) - Roles e permissões
- [Credenciais Admin](security/ADMIN_CREDENTIALS.md) - Usuário padrão
- [Boas Práticas](security/best-practices.md) - Segurança em produção

### **6. Banco de Dados**
- [Schema](database/schema.md) - Estrutura de tabelas
- [Migrations](database/migrations.md) - Flyway e versionamento
- [PostgreSQL Migration](database/postgresql-migration.md) - MySQL → PostgreSQL

### **7. Integrações**
- [Melhor Envio](integrations/MELHOR_ENVIO_INTEGRATION.md) - API de frete completa
- [Melhor Envio Quick Start](integrations/MELHOR_ENVIO_QUICKSTART.md) - Início rápido
- [Mercado Pago](integrations/mercado-pago.md) - API de pagamentos
- [Webhooks Mercado Pago](integrations/WEBHOOK_MERCADO_PAGO.md) - Notificações

### **8. Deployment**
- [Docker](deployment/DOCKER.md) - Containers e imagens
- [Docker Compose](deployment/docker-compose.md) - Orquestração local
- [Production](deployment/production.md) - Guia operacional
- [Monitoring](deployment/monitoring.md) - Health checks e métricas
- [Troubleshooting](deployment/troubleshooting.md) - Solução de problemas

### **9. Operations**
- [Logging](operations/LOGGING.md) - Configuração de logs
- [Health Check](operations/HEALTH_CHECK.md) - Monitoramento de saúde
- [Backup & Restore](operations/backup-restore.md) - Gestão de backups

### **10. Development**
- [Contributing](development/contributing.md) - Como contribuir
- [Coding Conventions](development/coding-conventions.md) - Clean Code
- [Testing](development/testing.md) - Estratégia de testes
- [Tools](development/tools.md) - IDEs e utilitários

### **11. Decisões & Histórico**
- [ADRs](decisions/README.md) - Architecture Decision Records
- [Sprints](history/sprints.md) - Stories implementadas
- [Changelog](history/changelog.md) ⭐ ATUALIZADO - Histórico completo
- [Roadmap](history/roadmap.md) - Próximos passos

---

## 🆕 Novidades da v1.1.0

### **Features Principais:**

1. **Busca Inteligente**
   - Busca de autores por nome (case-insensitive)
   - Busca de livros por título (admin e público)
   - Query JPQL otimizada
   - [Documentação completa](api/SEARCH_FILTERS.md)

2. **Ordenação Dinâmica**
   - Parâmetros `sortBy` e `sortDirection`
   - Ordenação por qualquer campo
   - Valores padrão configuráveis
   - [Documentação completa](api/SORT_IMPLEMENTATION.md)

3. **Sistema de Logout**
   - Endpoint `POST /api/auth/revoke` (logout simples)
   - Endpoint `POST /api/auth/revoke-all` (logout completo)
   - Revogação real no banco de dados
   - [Documentação completa](security/LOGOUT_IMPLEMENTATION.md)

4. **Gestão de Estoque**
   - Campo `stock` no domínio Book
   - Endpoint para ajustar estoque (SET/INCREASE/DECREASE)
   - Filtro `lowStock` para alertas
   - Migration V13 criada

### **Melhorias Técnicas:**
- CORS otimizado com `@Order(HIGHEST_PRECEDENCE)`
- Query JPQL com `CAST(:param AS string)` para PostgreSQL
- Collections Postman atualizadas (46 endpoints)

---

## 📊 Estatísticas da Documentação

| Categoria | Documentos |
|-----------|------------|
| Getting Started | 5 |
| Arquitetura | 5 |
| Domínios | 7 |
| API | 7 ⭐ |
| Segurança | 6 ⭐ |
| Banco de Dados | 3 |
| Integrações | 4 |
| Deployment | 5 |
| Operations | 3 |
| Development | 4 |
| Decisões & Histórico | 4 ⭐ |
| **TOTAL** | **53 documentos** |

---

## 🔍 Busca Rápida

### **Por Funcionalidade:**

- **Login/Logout:** [Autenticação](security/authentication.md) | [Logout](security/LOGOUT_IMPLEMENTATION.md)
- **Busca:** [Filtros de Busca](api/SEARCH_FILTERS.md)
- **Ordenação:** [Sort Implementation](api/SORT_IMPLEMENTATION.md)
- **Estoque:** [Endpoints](api/endpoints.md) (seção Admin - Livros)
- **CORS:** [Bugfix Filtro NULL](api/BUGFIX_NULL_FILTER.md)
- **Migrations:** [Migrations](database/migrations.md)
- **Collections Postman:** [Postman](api/postman/)

### **Por Tecnologia:**

- **JWT:** [Autenticação](security/authentication.md)
- **PostgreSQL:** [Schema](database/schema.md) | [Migration](database/postgresql-migration.md)
- **Docker:** [Docker](deployment/DOCKER.md) | [Docker Compose](deployment/docker-compose.md)
- **Spring Boot:** [Arquitetura](architecture/README.md)
- **Clean Architecture:** [Clean Architecture](architecture/clean-architecture.md)
- **DDD:** [DDD Bounded Contexts](architecture/ddd-bounded-contexts.md)

### **Por Ação:**

- **Configurar ambiente:** [Local Setup](getting-started/local-setup.md)
- **Criar endpoint:** [Contributing](development/contributing.md)
- **Adicionar migration:** [Migrations](database/migrations.md)
- **Deploy:** [Production](deployment/production.md)
- **Debugar:** [Troubleshooting](deployment/troubleshooting.md)
- **Testar API:** [Postman Collections](api/postman/)

---

## 📞 Links Úteis

- **GitHub:** [Repository](https://github.com/...)
- **Staging:** [http://hml-tunoda.sp1.br.saveincloud.net.br:8080](http://hml-tunoda.sp1.br.saveincloud.net.br:8080)
- **Health Check:** [/api/v1/actuator/health](http://hml-tunoda.sp1.br.saveincloud.net.br:8080/api/v1/actuator/health)
- **Postman:** [Collections](api/postman/)

---

## 🔖 Documentos Mais Acessados

1. [README Principal](../README.md)
2. [Guia Rápido v1.1.0](QUICK_GUIDE.md) ⭐
3. [Endpoints](api/endpoints.md)
4. [Local Setup](getting-started/local-setup.md)
5. [Filtros de Busca](api/SEARCH_FILTERS.md) ⭐
6. [Autenticação](security/authentication.md)
7. [Clean Architecture](architecture/clean-architecture.md)
8. [Postman Collections](api/postman/)

---

## 💡 Dicas de Navegação

- Use **Ctrl+F** para buscar palavras-chave neste índice
- Links com ⭐ são **novos** na v1.1.0
- Links com "ATUALIZADO" foram **revisados** recentemente
- Cada seção tem seu próprio README.md com mais detalhes

---

**Versão da Documentação:** 1.1.0  
**Última Atualização:** 2026-01-19  
**Total de Documentos:** 53  
**Status:** ✅ ATUALIZADO
