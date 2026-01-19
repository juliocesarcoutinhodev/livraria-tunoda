# Changelog

Histórico de mudanças por versão.

## [1.1.0] - 2026-01-19

### 🔍 Busca e Filtros
- **Busca por nome/título** com LIKE case-insensitive
  - Autores: busca parcial por nome
  - Livros (admin): busca parcial por título
  - Livros (público): busca parcial por título
- Query JPQL otimizada com `CAST(:param AS string)` para evitar erro PostgreSQL bytea
- **GET /api/admin/authors/{id}** - Buscar autor por ID (para formulário de edição)
- **GET /api/admin/books/{id}** - Buscar livro por ID (para formulário de edição) ⭐ NOVO
- **GET /api/admin/orders** - Listar pedidos com filtros de status ⭐ NOVO
  - Filtros: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, EXPIRED
  - Ordenação: sortBy (createdAt, status, totalAmount) e sortDirection (asc/desc)
  - Paginação completa

### 📊 Ordenação Dinâmica
- **Parâmetros sortBy e sortDirection** em todos os endpoints de listagem
  - Autores: ordenar por name, createdAt, status (padrão: name ASC)
  - Livros: ordenar por title, price, stock, createdAt (padrão: createdAt DESC)
- Método helper `createSort()` nos repository adapters
- Valores padrão configuráveis por endpoint

### 🚪 Sistema de Logout
- **POST /api/auth/revoke** - Logout simples (revoga 1 token)
- **POST /api/auth/revoke-all** - Logout completo (revoga todos os tokens do usuário)
- Revogação real no banco de dados (campo `revoked`)
- Logs de auditoria para rastreamento
- Scripts automáticos no Postman para limpar tokens

### 📦 Gestão de Estoque
- Campo `stock` adicionado ao agregado Book
- **POST /api/admin/books/{id}/stock** - Ajustar estoque
  - Tipos: SET (absoluto), INCREASE (adicionar), DECREASE (remover)
  - Validações de negócio (não pode ficar negativo)
  - Registro de histórico de ajustes
- Filtro `lowStock` para listar livros com estoque < 10
- Migration Flyway criada (V13)

### 🔒 Segurança e CORS
- CorsFilter customizado com `@Order(HIGHEST_PRECEDENCE)`
- Headers CORS em respostas de erro (401/403)
- Preflight (OPTIONS) funcionando corretamente
- Configuração centralizada com CorsProperties

### 📚 Documentação
- Guia completo: [Filtros de Busca](../api/SEARCH_FILTERS.md)
- Guia completo: [Ordenação (Sort)](../api/SORT_IMPLEMENTATION.md)
- Guia completo: [Sistema de Logout](../security/LOGOUT_IMPLEMENTATION.md)
- Bugfix documentado: [Correção Filtro NULL PostgreSQL](../api/BUGFIX_NULL_FILTER.md)
- Collections Postman atualizadas (LOCAL e STAGING)
- README principal atualizado com novos endpoints

### 🐛 Bugfixes
- Corrigido erro `function lower(bytea) does not exist` ao buscar sem filtro
- CORS funcionando corretamente em todas as requisições
- Aplicação subindo sem erros de bean do BookRepository

### 📊 Estatísticas
- **Endpoints totais:** 42 → 49 (+7 novos)
- **Parâmetros de busca:** +9 (name, title, sortBy, sortDirection, stock, status, etc.)
- **Arquivos de documentação:** +4 guias completos
- **Migrations:** +1 (estoque)

### 📅 Formatação de Datas
- **Datas em formato brasileiro** `dd/MM/yyyy` nos endpoints de listagem
  - `GET /api/admin/authors` - createdAt e updatedAt formatados
  - `GET /api/admin/authors/{id}` - createdAt e updatedAt formatados
  - `GET /api/admin/books` - createdAt e updatedAt formatados
  - `GET /api/admin/books/{id}` - createdAt e updatedAt formatados
- Banco de dados continua armazenando UTC completo
- Formatação apenas na camada de apresentação (DTOs)

## [1.0.0] - 2026-01-18

### Infraestrutura
- Migração de MySQL 9 para PostgreSQL 17
- Docker multi-stage otimizado
- Health checks implementados
- Logs estruturados (JSON em prod)
- Métricas com Micrometer + Actuator

### Features
- Catálogo completo (livros e autores)
- Carrinho de compras
- Checkout com frete
- Integração Melhor Envio
- Integração Mercado Pago
- Autenticação JWT
- Usuários administrativos
- Métricas de interação

### Documentação
- Documentação completa reestruturada
- README minimalista
- 50+ documentos em /docs
- ADRs implementados

## [0.9.0] - 2026-01-10

### Added
- Sprint 10: Monitoramento e métricas
- Actuator com Prometheus
- Health checks customizados
- Métricas de negócio

## [0.8.0] - 2025-12-20

### Added
- Sprint 9: Autenticação e autorização
- JWT authentication
- Refresh tokens
- Usuários admin
- Spring Security configurado

## [0.7.0] - 2025-12-10

### Added
- Sprint 8: Integrações externas
- Melhor Envio API
- Mercado Pago API
- Webhooks

## [0.6.0] - 2025-11-25

### Added
- Sprint 7: Checkout e pedidos
- Criação de pedidos
- Status de pedidos
- Pagamentos

## [0.5.0] - 2025-11-10

### Added
- Sprint 6: Frete
- Cotações de frete
- Melhor Envio integration

## [0.4.0] - 2025-10-25

### Added
- Sprint 5: Carrinho de compras
- CRUD de carrinho
- Itens do carrinho

## [0.3.0] - 2025-10-10

### Added
- Sprint 4: Métricas
- Book metrics (VIEW, CLICK)
- Top mais visualizados

## [0.2.0] - 2025-09-20

### Added
- Sprint 3: Autores
- CRUD de autores
- Relacionamento livros-autores

## [0.1.0] - 2025-09-01

### Added
- Sprint 1-2: Catálogo base
- CRUD de livros
- Clean Architecture implementada
- DDD Bounded Contexts
- Flyway migrations

## Formato

```
## [Versão] - Data

### Added
- Novas features

### Changed
- Mudanças em features existentes

### Fixed
- Correções de bugs

### Removed
- Features removidas

### Security
- Melhorias de segurança
```

## Referências

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
