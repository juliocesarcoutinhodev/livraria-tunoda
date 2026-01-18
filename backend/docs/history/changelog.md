# Changelog

Histórico de mudanças por versão.

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
