# Migrations do Flyway

Gerenciamento de versionamento do banco de dados com Flyway.

## Visão Geral

Flyway gerencia automaticamente as migrations do banco de dados, garantindo que a estrutura esteja sempre atualizada.

## Migrations Existentes

```
V1__create-table-books.sql              # Tabela de livros
V2__create-table-book-metrics.sql       # Métricas de livros
V3__create-table-carts.sql              # Carrinhos de compras
V4__create-table-orders.sql             # Pedidos
V5__add-payment-reference-to-orders.sql # Ref. pagamento
V6__create-table-shipping-quotes.sql    # Cotações de frete
V7__create-table-shipping-payloads.sql  # Payloads de frete
V8__add-to-postal-code-to-shipping-quotes.sql # CEP destino
V9__create-table-payments.sql           # Pagamentos
V10__add-shipping-to-orders.sql         # Frete nos pedidos
V11__create-table-users.sql             # Usuários admin
V12__create-table-refresh-tokens.sql    # Tokens de renovação
V13__insert-admin-user.sql              # Usuário admin padrão
```

## Convenções

### Nomenclatura

```
V{versão}__{descrição}.sql
```

- **V** - Prefixo obrigatório
- **{versão}** - Número sequencial (1, 2, 3...)
- **__** - Dois underscores
- **{descrição}** - snake_case, descritivo
- **.sql** - Extensão

### Exemplos

```
✅ V14__add-index-books-title.sql
✅ V15__create-table-categories.sql
❌ v14_add_index.sql (errado)
❌ V14_add index.sql (espaços)
```

## Como Criar Nova Migration

### 1. Criar arquivo

```bash
cd src/main/resources/db/migration
touch V14__add-status-index-users.sql
```

### 2. Escrever SQL

```sql
-- V14__add-status-index-users.sql

CREATE INDEX idx_users_status 
ON tb_users(status);
```

### 3. Executar aplicação

Flyway executará automaticamente na próxima inicialização.

## Comandos Flyway

### Via Maven

```bash
# Informações
./mvnw flyway:info

# Validar
./mvnw flyway:validate

# Migrar
./mvnw flyway:migrate

# Limpar (CUIDADO! Apaga tudo)
./mvnw flyway:clean
```

## Tabela de Controle

Flyway cria `flyway_schema_history`:

```sql
SELECT * FROM flyway_schema_history 
ORDER BY installed_rank;
```

## Troubleshooting

### Migration falhou

**Erro:**
```
Migration V2__create-table-book-metrics.sql failed
ERROR: syntax error at or near "INDEX"
```

**Solução:**
1. Corrigir SQL no arquivo
2. Deletar entry da `flyway_schema_history`
3. Reexecutar

```sql
DELETE FROM flyway_schema_history 
WHERE version = '2';
```

### Checksum mismatch

**Erro:**
```
Migration checksum mismatch for migration version 5
```

**Causa:** Arquivo de migration foi alterado após ser executado.

**Solução:** Criar nova migration para correção.

### Baseline

Para banco existente:

```bash
./mvnw flyway:baseline
```

## Boas Práticas

### ✅ Fazer

- SQL idempotente quando possível
- Testar migration antes de commitar
- Backup antes de migration em produção
- Migrations pequenas e focadas
- Incluir rollback script (comentado)

### ❌ Evitar

- Alterar migration já executada
- Migrations muito grandes
- DDL e DML na mesma migration
- Dependências entre migrations não sequenciais

## Migration em Produção

### Checklist

1. ✅ Backup completo do banco
2. ✅ Testar migration em staging
3. ✅ Verificar `flyway:validate`
4. ✅ Janela de manutenção agendada
5. ✅ Rollback script preparado
6. ✅ Monitoramento ativo

### Exemplo

```bash
# Backup
pg_dump -h prod-db -U user livraria_db > backup_before_v14.sql

# Validar
./mvnw flyway:validate

# Aplicar
./mvnw flyway:migrate

# Verificar
psql -h prod-db -U user livraria_db -c "\dt"
```

## Referências

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [PostgreSQL Migration](postgresql-migration.md)
- [Schema](schema.md)
