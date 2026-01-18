# Como Contribuir

Guia para contribuir com o projeto.

## Processo

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie branch** para feature/bugfix
4. **Implemente** mudanças
5. **Teste** localmente
6. **Commit** com mensagem clara
7. **Push** para seu fork
8. **Abra Pull Request**

## Branches

### Principais

- `main` - Produção
- `develop` - Desenvolvimento
- `staging` - Homologação

### Features

```
feature/nome-descritivo
bugfix/nome-do-bug
hotfix/correcao-urgente
```

## Commits

### Formato

```
tipo(escopo): descrição curta

Descrição detalhada (opcional)

Closes #123
```

### Tipos

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### Exemplos

```
feat(catalog): adicionar busca por ISBN

Implementa busca de livros por código ISBN
com validação de formato.

Closes #45
```

```
fix(payment): corrigir webhook duplicado

Adiciona idempotência no processamento de webhooks
do Mercado Pago.

Closes #78
```

## Code Review

### Checklist

- [ ] Código segue convenções
- [ ] Testes passando
- [ ] Sem warnings
- [ ] Documentação atualizada
- [ ] Sem código comentado
- [ ] Sem TODO/FIXME

## Testes

```bash
# Rodar todos os testes
./mvnw test

# Teste específico
./mvnw test -Dtest=CreateBookUseCaseTest
```

Testes devem passar antes de PR.

## Documentação

Atualizar docs quando necessário:
- README.md
- docs/**
- Javadoc em métodos públicos

## Referências

- [Convenções de Código](coding-conventions.md)
- [Testes](testing.md)
