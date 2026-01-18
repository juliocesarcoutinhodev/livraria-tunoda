# Architecture Decision Records (ADRs)

Registro de decisões arquiteturais importantes do projeto.

## O que são ADRs?

Architecture Decision Records documentam decisões importantes de design e arquitetura, incluindo contexto, opções consideradas e razões da escolha.

## ADRs Existentes

### [001 - Clean Architecture](001-clean-architecture.md)

Por que escolhemos Clean Architecture para o projeto.

### [002 - PostgreSQL over MySQL](002-postgresql-over-mysql.md)

Decisão de migrar de MySQL para PostgreSQL.

### [003 - JWT Authentication](003-jwt-authentication.md)

Por que JWT ao invés de session-based authentication.

### [004 - Bounded Contexts (DDD)](004-bounded-contexts.md)

Organização em contextos delimitados.

## Formato de ADR

```markdown
# ADR-XXX: Título da Decisão

## Status

Aceito | Proposto | Rejeitado | Substituído por ADR-YYY

## Contexto

Descrever o contexto e o problema.

## Opções Consideradas

1. Opção A - Prós e contras
2. Opção B - Prós e contras
3. Opção C - Prós e contras

## Decisão

Opção escolhida e razões.

## Consequências

### Positivas

- Benefício 1
- Benefício 2

### Negativas

- Trade-off 1
- Trade-off 2

## Referências

- Link 1
- Link 2
```

## Como Criar ADR

1. Identificar decisão importante
2. Criar arquivo `00X-titulo.md`
3. Seguir formato padrão
4. Discutir com equipe
5. Commitar após aprovação

## Referências

- [ADR GitHub](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
