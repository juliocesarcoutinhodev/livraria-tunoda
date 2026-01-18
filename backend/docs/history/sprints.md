# Sprints Implementadas

Histórico completo de stories implementadas por sprint.

## Sprint 10: Monitoramento e Métricas ✅

**Data:** Janeiro 2026

### Story #42: Exposição de métricas da aplicação
- Micrometer Registry Prometheus
- Endpoint `/actuator/metrics`
- Endpoint `/actuator/prometheus`
- Métricas JVM, HTTP, sistema
- Segurança por profile
- Tags de ambiente

## Sprint 9: Autenticação e Autorização ✅

**Data:** Dezembro 2025

### Story #43: Persistência de usuários administrativos
- UserEntity com timestamps
- Migration V11 (tb_users)
- UserRepositoryAdapter
- Métodos block/unblock

### Story #44: Autenticação JWT
- Endpoint POST `/api/auth/login`
- JwtService
- PasswordEncoderService
- Access Token (1h) + Refresh Token (30 dias)

### Story #45: Renovação de tokens
- Endpoint POST `/api/auth/refresh`
- Token rotation
- RefreshToken aggregate root

### Story #46: Dados do usuário autenticado
- Endpoint GET `/api/user/me`
- JwtAuthenticationFilter
- Extração de claims

### Story #47: Restrição de acesso admin
- SecurityConfiguration
- Endpoints protegidos por role
- CustomAccessDeniedHandler

### Story #48: Usuário admin inicial
- Migration V13
- Credenciais padrão
- Documentação completa

## Sprint 8: Integrações Externas ✅

**Data:** Novembro 2025

### Melhor Envio
- API de cálculo de frete
- MelhorEnvioClient
- Configuração via properties

### Mercado Pago
- API de pagamentos
- Webhooks
- Criação de preferências

## Sprint 7: Checkout e Pedidos ✅

**Data:** Novembro 2025

### Order Domain
- Order aggregate root
- CreateOrderFromCartUseCase
- ConfirmPaymentUseCase
- OrderStatus (PENDING_PAYMENT, etc)

## Sprint 6: Frete ✅

**Data:** Outubro 2025

### Shipping Domain
- ShippingQuote aggregate root
- CreateShippingQuoteUseCase
- CalculateShippingUseCase
- SelectShippingOptionUseCase
- Integration com Melhor Envio

## Sprint 5: Carrinho de Compras ✅

**Data:** Outubro 2025

### Cart Domain
- Cart aggregate root
- CartItem value object
- CRUD completo de carrinho
- Migration V3

## Sprint 4: Analytics ✅

**Data:** Setembro 2025

### BookMetric Domain
- BookMetric aggregate root
- RecordBookMetricUseCase
- Top mais visualizados
- Top mais clicados

## Sprint 3: Autores ✅

**Data:** Setembro 2025

### Author Domain
- Author aggregate root
- CRUD de autores
- Relacionamento N:N com livros
- Status ACTIVE/INACTIVE

## Sprint 1-2: Catálogo Base ✅

**Data:** Agosto-Setembro 2025

### Book Domain
- Book aggregate root
- Value Objects (ISBN, Money, Weight)
- Clean Architecture implementada
- DDD Bounded Contexts
- CRUD completo
- Flyway migrations

## Estatísticas

**Total de Sprints:** 10  
**Total de Stories:** 48+  
**Duração:** Agosto 2025 - Janeiro 2026 (6 meses)  
**Domínios Implementados:** 7  
**Migrations:** 13  
**Endpoints:** 40+

## Referências

- [Roadmap](roadmap.md)
- [Changelog](changelog.md)
- [Domínios](../domain/README.md)
