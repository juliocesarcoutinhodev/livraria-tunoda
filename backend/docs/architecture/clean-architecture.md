# Clean Architecture

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizado em camadas bem definidas.

## Estrutura de Camadas

```
br.com.iraquitantunoda.livrariatunoda/
├── domain/                      # Camada de Domínio (DDD)
│   ├── model/                  # Aggregate Roots - Catálogo
│   │   ├── Author.java        # Aggregate Root - Autor
│   │   ├── Book.java          # Aggregate Root - Livro
│   │   ├── AuthorId.java      # Identidade tipada de Autor
│   │   ├── BookId.java        # Identidade tipada de Livro
│   │   └── vo/                # Value Objects
│   │       ├── ISBN.java      # Código ISBN do livro
│   │       ├── Money.java     # Valor monetário (preço)
│   │       ├── Weight.java    # Peso do livro
│   │       ├── WeightUnit.java # Unidade de peso (g/kg)
│   │       └── Status.java    # Status (ACTIVE/INACTIVE)
│   ├── metric/                # Aggregate Roots - Métricas
│   │   ├── BookMetric.java   # Aggregate Root - Métrica
│   │   ├── BookMetricId.java # Identidade tipada
│   │   ├── EventType.java    # Enum (VIEW/CLICK)
│   │   └── BookMetricRepository.java
│   ├── repository/            # Interfaces de Repository (Ports)
│   │   ├── AuthorRepository.java
│   │   └── BookRepository.java
│   └── exception/             # Exceções de negócio
│       ├── BusinessException.java
│       └── ResourceNotFoundException.java
│
├── application/               # Casos de uso e lógica de aplicação
│   ├── dto/                   # DTOs (Request/Response)
│   │   ├── AuthorDetailDTO.java
│   │   ├── AuthorResponse.java
│   │   ├── AuthorSummaryDTO.java
│   │   ├── BookCatalogResponse.java
│   │   ├── BookDetailResponse.java
│   │   ├── BookResponse.java
│   │   ├── ChangeStatusRequest.java
│   │   ├── CreateAuthorRequest.java
│   │   ├── CreateBookRequest.java
│   │   ├── PageResponse.java
│   │   ├── UpdateAuthorRequest.java
│   │   └── UpdateBookRequest.java
│   ├── mapper/                # MapStruct Mappers (Domain → DTO)
│   │   ├── AuthorDTOMapper.java
│   │   └── BookDTOMapper.java
│   └── usecase/               # Casos de Uso
│       ├── ChangeAuthorStatusUseCase.java
│       ├── ChangeBookStatusUseCase.java
│       ├── CreateAuthorUseCase.java
│       ├── CreateBookUseCase.java
│       ├── GetBookDetailUseCase.java
│       ├── ListActiveBooksUseCase.java
│       ├── RecordBookMetricUseCase.java
│       ├── UpdateAuthorUseCase.java
│       └── UpdateBookUseCase.java
│
└── infrastructure/           # Adaptadores e frameworks
    ├── config/              # Configurações do Spring
    │   ├── SecurityProperties.java        # @ConfigurationProperties (JWT, tokens)
    │   ├── SecurityConfiguration.java     # Spring Security config
    │   └── StartupLogger.java            # Logger de inicialização
    ├── gateway/             # Integrações Externas
    │   ├── melhorenvio/    # Integração Melhor Envio
    │   │   └── config/
    │   │       └── MelhorEnvioProperties.java  # @ConfigurationProperties
    │   └── mercadopago/    # Integração Mercado Pago
    │       └── config/
    │           └── MercadoPagoProperties.java  # @ConfigurationProperties
    ├── security/            # Implementações de segurança
    │   ├── JwtServiceImpl.java
    │   ├── JwtAuthenticationFilter.java
    │   └── PasswordEncoderServiceImpl.java
    ├── exception/           # Tratamento global de erros
    │   ├── GlobalExceptionHandler.java
    │   ├── ErrorResponse.java
    │   └── ValidationError.java
    ├── persistence/         # Camada de Persistência
    │   ├── entity/         # Entidades JPA
    │   │   ├── AuthorEntity.java
    │   │   ├── BookEntity.java
    │   │   └── BookMetricEntity.java
    │   ├── repository/     # Spring Data Repositories
    │   │   ├── AuthorJpaRepository.java
    │   │   ├── BookJpaRepository.java
    │   │   └── BookMetricJpaRepository.java
    │   ├── mapper/         # MapStruct Mappers (Domain ↔ Entity)
    │   │   ├── AuthorMapper.java
    │   │   └── BookMapper.java
    │   └── adapter/        # Adapters (implementam interfaces do domínio)
    │       ├── AuthorRepositoryAdapter.java
    │       ├── BookRepositoryAdapter.java
    │       └── BookMetricRepositoryAdapter.java
    └── web/                # Controllers REST
        └── controller/
            ├── AdminAuthorController.java
            ├── AdminBookController.java
            ├── AuthController.java
            └── PublicBookController.java
```

## Princípios Aplicados

### Domain-Driven Design (DDD)

- Aggregate Roots (`Book`, `Author`, `BookMetric`)
- Value Objects (`ISBN`, `Money`, `Weight`)
- Identidades tipadas (`BookId`, `AuthorId`, `BookMetricId`)
- Associação via IDs, não entidades diretas
- **Bounded Contexts** - Contextos isolados

### Clean Architecture

- Separação de responsabilidades
- Inversão de dependências
- Domínio sem dependência de frameworks (sem JPA no domain)

### Imutabilidade

- Value Objects completamente imutáveis
- Entidades com campos `final` (apenas `status` mutável)

### Encapsulamento

- Factory methods (`create`, `reconstitute`)
- Validações centralizadas no domínio
- Coleções expostas como imutáveis

## Bounded Contexts (Contextos Delimitados)

O projeto está organizado em **contextos delimitados** independentes:

### Contexto 1: Catálogo

**Localização:** `domain.model`

**Responsabilidade:** Gerenciar livros e autores

**Agregados:** `Book`, `Author`

**Propósito:** CRUD de produtos do catálogo

### Contexto 2: Analytics

**Localização:** `domain.metric`

**Responsabilidade:** Rastrear eventos de interação

**Agregados:** `BookMetric`

**Propósito:** Observabilidade e análise de comportamento

### Contexto 3: Carrinho de Compras

**Localização:** `domain.model`

**Responsabilidade:** Gerenciar carrinhos e itens

**Agregados:** `Cart`, `CartItem` (Value Object)

**Propósito:** Gestão do carrinho de compras antes da conversão em pedido

## Vantagens da Separação em Contextos

- Baixo acoplamento entre contextos
- Evolução independente
- Facilita migração para microservices
- Testes isolados por contexto
- Equipes podem trabalhar em paralelo

## Referências

- [Modelo de Domínio](../domain/README.md)
- [DDD - Bounded Contexts](ddd-bounded-contexts.md)
- [Estrutura do Projeto](project-structure.md)
