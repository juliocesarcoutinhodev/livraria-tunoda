# Configuração de Testes

## Banco de Dados para Testes

Os testes utilizam o banco de dados **H2** em memória, que é configurado automaticamente quando os testes são executados.

### Configuração

- **Banco**: H2 Database (em memória)
- **Modo**: PostgreSQL (compatibilidade)
- **Hibernate DDL**: `create-drop` (cria e remove tabelas automaticamente)
- **Flyway**: Desabilitado (usa JPA para criar as tabelas)

### Por que H2?

- Rápido e leve
- Não requer instalação ou configuração externa
- Isola os testes do ambiente de desenvolvimento
- Compatível com a sintaxe PostgreSQL (modo de compatibilidade)

### Executando os Testes

```bash
# Executar todos os testes
./mvnw test

# Executar testes com cobertura
./mvnw test jacoco:report

# Executar teste específico
./mvnw test -Dtest=CartTest
```

### Tipos de Testes

1. **Testes Unitários**: Testam o domínio isoladamente (sem Spring Context)
   - `CartTest`
   - `CartItemTest`

2. **Testes de Integração**: Testam com Spring Context carregado
   - `StartupApplicationTests` - Verifica se a aplicação inicializa corretamente

## Observações

- Os testes de domínio (unitários) não precisam do H2, pois não acessam o banco
- O `StartupApplicationTests` carrega o contexto completo, por isso usa o H2
- O banco H2 é destruído ao final de cada execução de teste

