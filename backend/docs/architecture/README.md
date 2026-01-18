# Arquitetura

Documentação sobre a arquitetura do sistema, princípios de design e estrutura do código.

## Visão Geral

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizado em camadas bem definidas com separação clara de responsabilidades.

## Documentos

### [Clean Architecture](clean-architecture.md)

Estrutura de camadas, princípios aplicados e organização do código seguindo Clean Architecture.

**Conteúdo:**
- Estrutura de camadas (Domain, Application, Infrastructure)
- Princípios DDD aplicados
- Bounded Contexts
- Separation of Concerns

### [DDD - Bounded Contexts](ddd-bounded-contexts.md)

Detalhamento dos contextos delimitados (Bounded Contexts) e como os agregados se relacionam.

**Conteúdo:**
- Definição de Bounded Contexts
- Contextos implementados (Catálogo, Analytics, Carrinho, Pedidos, etc)
- Comunicação entre contextos
- Vantagens da abordagem

### [Modelo de Domínio](domain-model.md)

Documentação completa dos Aggregate Roots, Value Objects e regras de negócio.

**Conteúdo:**
- Aggregate Roots detalhados
- Value Objects
- Identidades tipadas
- Regras de negócio

### [Estrutura do Projeto](project-structure.md)

Organização física dos diretórios e pacotes do código-fonte.

**Conteúdo:**
- Árvore de diretórios completa
- Responsabilidade de cada pacote
- Convenções de nomenclatura
- Localização de componentes

## Princípios Fundamentais

### Inversão de Dependências

O domínio não depende de frameworks. As interfaces (ports) são definidas no domínio e implementadas (adapters) na infraestrutura.

### Imutabilidade

Value Objects são completamente imutáveis. Aggregate Roots têm campos `final` sempre que possível.

### Encapsulamento

Regras de negócio protegidas dentro dos agregados. Factory methods para criação e reconstituição.

### Testabilidade

Domínio puro e independente facilita testes unitários sem necessidade de frameworks ou banco de dados.

## Decisões Arquiteturais

Para decisões de design importantes e suas justificativas, consulte:

- [ADR 001: Clean Architecture](../decisions/001-clean-architecture.md)
- [ADR 004: Bounded Contexts](../decisions/004-bounded-contexts.md)

## Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
