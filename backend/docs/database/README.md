# Database

Documentação sobre o banco de dados PostgreSQL, estrutura de tabelas e migrations.

## Visão Geral

**Banco:** PostgreSQL 17  
**Gerenciamento:** Flyway  
**Migrations:** 13 versões  
**Tabelas:** 12 principais

## Documentos

### [Schema](schema.md)

Estrutura completa de tabelas, índices e relacionamentos.

**Conteúdo:**
- Diagrama ER
- Definição de cada tabela
- Índices e constraints
- Relacionamentos entre tabelas

### [Migrations](migrations.md)

Histórico de migrations do Flyway e como gerenciá-las.

**Conteúdo:**
- Lista de todas as migrations
- Convenções de nomenclatura
- Como criar nova migration
- Troubleshooting

### [Migração PostgreSQL](postgresql-migration.md)

Processo de migração de MySQL para PostgreSQL.

**Conteúdo:**
- Mudanças realizadas
- Incompatibilidades resolvidas
- SQL específico do PostgreSQL

## Tecnologias

- PostgreSQL 17
- Flyway 10.x
- HikariCP (connection pool)
- JPA / Hibernate

## Acesso Local

```bash
# Via Docker
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db

# Via psql local
psql -h localhost -U livraria_user -d livraria_db
```

## Backup e Restore

```bash
# Backup
pg_dump -h localhost -U livraria_user livraria_db > backup.sql

# Restore
psql -h localhost -U livraria_user livraria_db < backup.sql
```

## Referências

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Flyway Documentation](https://flywaydb.org/documentation/)
