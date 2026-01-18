# ADR-002: PostgreSQL over MySQL

## Status

✅ **Aceito** - Migração concluída em Janeiro 2026

## Contexto

O projeto inicialmente usava MySQL 9. Precisávamos avaliar se continuar com MySQL ou migrar para outro banco de dados.

## Opções Consideradas

### 1. Manter MySQL 9

**Prós:**
- Já estava funcionando
- Conhecimento da equipe
- Zero esforço de migração

**Contras:**
- JSON menos eficiente
- Compliance SQL limitado
- Features avançadas ausentes

### 2. Migrar para PostgreSQL 17

**Prós:**
- JSONB nativo e performático
- Full-text search avançado
- Arrays nativos
- CTEs e Window Functions
- Extensões (PostGIS, etc)
- Melhor compliance com SQL padrão
- MVCC mais robusto
- Partitioning nativo
- Gratuito e open-source

**Contras:**
- Esforço de migração
- Ajustes em migrations
- Mudança de driver

### 3. MongoDB (NoSQL)

**Prós:**
- Flexibilidade de schema
- JSON nativo

**Contras:**
- Mudança radical de paradigma
- Perda de transactions ACID
- Não adequado para dados estruturados

## Decisão

**Escolhemos PostgreSQL** por:

1. **Performance:** JSONB é mais eficiente que JSON do MySQL
2. **Features:** Recursos avançados que já precisávamos
3. **Padrão:** Amplamente usado em produção
4. **Futuro:** Preparado para analytics, full-text, geolocation
5. **Custo:** Zero (open-source)

## Consequências

### Positivas

- ✅ JSONB para `raw_payload` em shipping
- ✅ Queries mais eficientes
- ✅ Melhor suporte a JSON
- ✅ Features avançadas disponíveis
- ✅ Melhor compliance SQL

### Negativas

- ❌ Esforço de migração (2 dias)
- ❌ Ajustes em 13 migrations
- ❌ Mudança de driver JDBC
- ❌ Equipe precisa aprender diferenças

## Implementação

Migração incluiu:

1. Driver: `mysql-connector-j` → `postgresql`
2. Dialect: `MySQL9Dialect` → `PostgreSQLDialect`
3. Índices separados da definição de tabela
4. JSON → JSONB com `@JdbcTypeCode(SqlTypes.JSON)`
5. Ajustes em sintaxe SQL específica

**Data:** Janeiro 2026  
**Tempo:** 2 dias  
**Status:** ✅ Concluída com sucesso

## Referências

- [PostgreSQL vs MySQL](https://www.postgresql.org/about/)
- [Documento de Migração](../database/postgresql-migration.md)
- [PostgreSQL JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
