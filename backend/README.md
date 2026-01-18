# 📚 Livraria Tunoda - Backend

API REST para gerenciamento de livraria, construída com Spring Boot seguindo princípios de Clean Architecture e boas práticas de desenvolvimento.

## 🎯 Stack Tecnológica

- **Java 25**
- **Spring Boot 3.5.9**
- **PostgreSQL 17**
- **Flyway** (versionamento de banco)
- **Lombok** (redução de boilerplate)
- **MapStruct 1.6.3** (mapeamento Domain ↔ Entity)
- **Bean Validation** (validação de dados)
- **Spring Actuator** (monitoramento)
- **Docker & Docker Compose**

> **📝 Nota:** O projeto foi migrado de MySQL 9 para PostgreSQL 17 em janeiro de 2026. A migração incluiu:
> - Atualização de dependências (driver, Flyway)
> - Correção de migrations SQL (índices separados, tipos JSONB)
> - Atualização de entidades JPA (`@JdbcTypeCode` para JSONB)
> 
> Para mais detalhes sobre a migração, consulte: `MIGRACAO_POSTGRESQL.md`

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizado em camadas bem definidas:

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

### Princípios Aplicados

- ✅ **Domain-Driven Design (DDD)**
  - Aggregate Roots (`Book`, `Author`, `BookMetric`)
  - Value Objects (`ISBN`, `Money`, `Weight`)
  - Identidades tipadas (`BookId`, `AuthorId`, `BookMetricId`)
  - Associação via IDs, não entidades diretas
  - **Bounded Contexts** - Contextos isolados
- ✅ **Clean Architecture**
  - Separação de responsabilidades
  - Inversão de dependências
  - Domínio sem dependência de frameworks (sem JPA no domain)
- ✅ **Imutabilidade**
  - Value Objects completamente imutáveis
  - Entidades com campos `final` (apenas `status` mutável)
- ✅ **Encapsulamento**
  - Factory methods (`create`, `reconstitute`)
  - Validações centralizadas no domínio
  - Coleções expostas como imutáveis

### Bounded Contexts (Contextos Delimitados)

O projeto está organizado em **contextos delimitados** independentes:

#### **Contexto 1: Catálogo** (`domain.model`)
- **Responsabilidade:** Gerenciar livros e autores
- **Agregados:** `Book`, `Author`
- **Propósito:** CRUD de produtos do catálogo

#### **Contexto 2: Analytics** (`domain.metric`)
- **Responsabilidade:** Rastrear eventos de interação
- **Agregados:** `BookMetric`
- **Propósito:** Observabilidade e análise de comportamento

#### **Contexto 3: Carrinho de Compras** (`domain.model`)
- **Responsabilidade:** Gerenciar carrinhos e itens
- **Agregados:** `Cart`, `CartItem` (Value Object)
- **Propósito:** Gestão do carrinho de compras antes da conversão em pedido

**Vantagens dessa separação:**
- ✅ Baixo acoplamento entre contextos
- ✅ Evolução independente
- ✅ Facilita migração para microservices
- ✅ Testes isolados por contexto
- ✅ Equipes podem trabalhar em paralelo

## 📦 Modelo de Domínio

### Aggregate Roots

#### 📖 Book (Livro)
Aggregate Root principal que representa um livro no sistema.

**Atributos:**
- `id: BookId` - Identificador único do livro
- `title: String` - Título (obrigatório, máx. 300 caracteres)
- `description: String` - Descrição (obrigatória)
- `photoUrl: String` - URL da foto do livro (opcional)
- `isbn: ISBN` - Código ISBN (opcional, validado para ISBN-10 ou ISBN-13)
- `price: Money` - Preço (obrigatório, não negativo)
- `weight: Weight` - Peso (obrigatório, maior que zero)
- `authorIds: Set<AuthorId>` - Referências aos autores (mínimo 1)
- `status: Status` - Status (ACTIVE/INACTIVE)

**Regras de Negócio:**
- Deve ter pelo menos um autor
- Título não pode ser vazio ou exceder 300 caracteres
- Preço não pode ser negativo
- Peso deve ser maior que zero
- ISBN é opcional, mas se fornecido deve ser válido

**Métodos:**
- `Book.create(...)` - Cria novo livro (gera ID automaticamente)
- `Book.reconstitute(...)` - Reconstitui livro existente (ex: do banco)
- `activate()` / `deactivate()` - Gerencia ciclo de vida
- `isActive()` - Verifica se está ativo

#### ✍️ Author (Autor)
Aggregate Root que representa um autor no sistema.

**Atributos:**
- `id: AuthorId` - Identificador único do autor
- `name: String` - Nome (obrigatório, máx. 200 caracteres)
- `biography: String` - Biografia (obrigatória)
- `photoUrl: String` - URL da foto (opcional)
- `status: Status` - Status (ACTIVE/INACTIVE)

**Regras de Negócio:**
- Nome não pode ser vazio ou exceder 200 caracteres
- Biografia é obrigatória

**Métodos:**
- `Author.create(...)` - Cria novo autor (gera ID automaticamente)
- `Author.reconstitute(...)` - Reconstitui autor existente
- `activate()` / `deactivate()` - Gerencia ciclo de vida
- `isActive()` - Verifica se está ativo

### Value Objects

#### 📘 ISBN
Representa o código International Standard Book Number.

**Características:**
- Imutável
- Validação para ISBN-10 (10 dígitos) ou ISBN-13 (13 dígitos)
- Remove automaticamente espaços e hifens na validação
- `ISBN.of(String)` - Factory method com validação

#### 💰 Money
Representa valores monetários no sistema.

**Características:**
- Imutável
- Não permite valores negativos
- Suporta múltiplas moedas
- `Money.brl(BigDecimal)` - Atalho para Real brasileiro
- `Money.of(BigDecimal, String)` - Factory method genérico

#### ⚖️ Weight
Representa o peso físico do livro.

**Características:**
- Imutável
- Não permite valores zero ou negativos
- Suporta gramas (GRAMS) e quilogramas (KILOGRAMS)
- `Weight.grams(BigDecimal)` - Atalho para gramas
- `Weight.kilograms(BigDecimal)` - Atalho para quilogramas

#### 🏷️ Status
Enum simples que representa o status de uma entidade.

**Valores:**
- `ACTIVE` - Entidade ativa no sistema
- `INACTIVE` - Entidade inativa (soft delete)

### Identidades Tipadas

#### BookId e AuthorId
Identificadores tipados que encapsulam UUIDs.

**Características:**
- Imutáveis
- Type-safe (evita confusão entre IDs de diferentes entidades)
- `{Type}Id.generate()` - Gera novo UUID
- `{Type}Id.of(String)` - Cria a partir de string existente

### Relacionamentos

```
Book *----> AuthorId (1..*)
      |
      |     (O relacionamento é via ID, não via entidade)
      |
      └─────────────────────────────────┐
                                        |
Author (buscar separadamente)          |
```

**Importante:** `Book` referencia `AuthorId`, não a entidade `Author` diretamente. Isso garante:
- Desacoplamento entre aggregates
- Consistência eventual
- Facilita distribuição e escalabilidade

---

## 📊 Domínio de Métricas (Analytics)

### Aggregate Root: BookMetric

Representa um evento de interação do usuário com um livro.

**Atributos:**
- `id: BookMetricId` - Identificador único da métrica
- `bookId: BookId` - Referência ao livro
- `eventType: EventType` - Tipo de evento (VIEW, CLICK)
- `occurredAt: LocalDateTime` - Timestamp do evento

**Características:**
- Domínio isolado do catálogo (`domain.metric`)
- Apenas referencia `BookId` (não a entidade `Book`)
- Persistência simples, sem agregações
- Preparado para processamento assíncrono futuro

**EventType:**
- `VIEW` - Visualização da página de detalhes
- `CLICK` - Clique em ação de interesse (comprar, adicionar ao carrinho)

**Factory Method:**
- `BookMetric.record(bookId, eventType)` - Registra novo evento

---

## 🛒 Domínio de Carrinho de Compras

### Aggregate Root: Cart

Representa um carrinho de compras no sistema.

**Atributos:**
- `id: CartId` - Identificador único do carrinho
- `items: List<CartItem>` - Lista de itens no carrinho
- `status: CartStatus` - Status do carrinho (ACTIVE, EXPIRED, CONVERTED)
- `createdAt: LocalDateTime` - Data de criação
- `updatedAt: LocalDateTime` - Data de última atualização

**CartStatus:**
- `ACTIVE` - Carrinho em uso, pode ser modificado
- `EXPIRED` - Carrinho expirado, não editável
- `CONVERTED` - Carrinho convertido em pedido

**Regras de Negócio:**
- Carrinho inicia sempre com status ACTIVE
- Carrinho não pode ser modificado se estiver EXPIRED ou CONVERTED
- Carrinho pode existir vazio
- Carrinho vazio não é válido para conversão em pedido
- Total do carrinho é sempre derivado dos itens
- Valores são sempre calculados em tempo de execução

**Métodos:**
- `Cart.create()` - Cria novo carrinho vazio (status ACTIVE)
- `Cart.reconstitute(...)` - Reconstitui carrinho existente
- `addItem(CartItem)` - Adiciona item (ou incrementa quantidade se já existir)
- `updateItem(BookId, quantity)` - Atualiza quantidade de um item
- `removeItem(BookId)` - Remove item completamente
- `calculateSubtotal()` - Calcula subtotal (soma dos itens)
- `calculateTotal()` - Calcula total (igual ao subtotal, preparado para descontos futuros)
- `isValid()` - Verifica se tem itens e está ACTIVE
- `validateForCheckout(Set<BookId>)` - Valida se está pronto para checkout
- `markAsExpired()` - Marca como expirado
- `markAsConverted()` - Marca como convertido em pedido

### Value Object: CartItem

Representa um item dentro do carrinho.

**Atributos:**
- `id: CartItemId` - Identificador único do item
- `bookId: BookId` - Referência ao livro
- `bookTitle: String` - Título do livro (congelado no momento da adição)
- `quantity: int` - Quantidade (mínimo 1)
- `unitPrice: Money` - Preço unitário (congelado no momento da adição)

**Regras de Negócio:**
- Quantidade mínima é 1
- Preço unitário é congelado no momento da adição
- Título é armazenado para histórico consistente
- Subtotal é sempre calculado: `unitPrice × quantity`

**Métodos:**
- `CartItem.create(...)` - Cria novo item
- `CartItem.reconstitute(...)` - Reconstitui item existente
- `updateQuantity(int)` - Atualiza quantidade
- `incrementQuantity(int)` - Incrementa quantidade
- `getSubtotal()` - Calcula subtotal do item
- `isForBook(BookId)` - Verifica se item é de um livro específico

**Decisões Importantes:**
- **Título e preço congelados:** Evita divergências se o produto for alterado posteriormente
- **Subtotal calculado:** Garante consistência matemática
- **Value Object:** Não tem ciclo de vida independente do Cart

---

## 📦 Domínio de Pedidos

### Aggregate Root: Order

Representa um pedido no sistema (compra confirmada).

**Atributos:**
- `id: OrderId` - Identificador único do pedido
- `cartId: CartId` - Rastreabilidade (qual carrinho originou)
- `items: List<OrderItem>` - Lista de itens (imutável)
- `subtotal: Money` - Subtotal congelado (snapshot)
- `total: Money` - Total congelado (snapshot)
- `createdAt: LocalDateTime` - Data de criação
- `status: OrderStatus` - Status do pedido
- `paymentReference: String` - Referência externa do pagamento (nullable)

**OrderStatus:**
- `PENDING` - Pedido criado, aguardando confirmação/pagamento
- `CONFIRMED` - Pedido confirmado (pagamento aprovado)
- `PROCESSING` - Pedido em preparação
- `SHIPPED` - Pedido enviado para entrega
- `DELIVERED` - Pedido entregue ao cliente
- `CANCELLED` - Pedido cancelado
- `EXPIRED` - Pedido expirado (não pago a tempo)

**Regras de Negócio:**
- Pedido nasce apenas de carrinho válido
- Pedido é completamente imutável após criação (apenas status muda)
- Sem métodos addItem/removeItem/updateItem
- Status inicial sempre PENDING
- Valores são snapshot (não recalculados)
- Alterações no catálogo não afetam pedidos existentes

**Métodos:**
- `Order.createFromCart(Cart)` - Cria pedido a partir do carrinho
- `Order.reconstitute(...)` - Reconstitui pedido existente
- `confirm()` - PENDING → CONFIRMED (exige paymentReference)
- `expire()` - PENDING → EXPIRED (expiração antes do pagamento)
- `startProcessing()` - CONFIRMED → PROCESSING
- `ship()` - PROCESSING → SHIPPED
- `deliver()` - SHIPPED → DELIVERED
- `cancel()` - Qualquer (exceto DELIVERED) → CANCELLED
- `associatePaymentReference(String)` - Associa referência de pagamento (uma única vez)
- `calculateSubtotal()` - Recalcula a partir dos items (verificação)
- `calculateTotal()` - Recalcula total (verificação)
- `isPending()`, `isConfirmed()`, `isShipped()`, `isExpired()`, etc. - Verificações de status

### Value Object: OrderItem

Representa um item dentro do pedido (completamente imutável).

**Atributos:**
- `id: OrderItemId` - Identificador único do item
- `bookId: BookId` - Referência ao livro
- `bookTitle: String` - Título do livro (congelado)
- `quantity: int` - Quantidade (final)
- `unitPrice: Money` - Preço unitário (congelado)

**Regras de Negócio:**
- Completamente imutável (todos os campos final)
- Sem métodos de alteração
- Preço congelado no momento da criação do pedido
- Título armazenado para histórico consistente
- Subtotal sempre calculado: `unitPrice × quantity`

**Métodos:**
- `OrderItem.create(...)` - Cria novo item
- `OrderItem.reconstitute(...)` - Reconstitui item existente
- `getSubtotal()` - Calcula subtotal do item

**Diferenças Chave: CartItem vs OrderItem**

| Aspecto | CartItem | OrderItem |
|---------|----------|-----------|
| **Mutabilidade** | Mutável (updateQuantity) | **Imutável** (campos final) |
| **Propósito** | Seleção temporária | Registro permanente |
| **Alterações** | Pode ser modificado | **Não pode ser modificado** |
| **Contexto** | Carrinho (temporário) | Pedido (histórico) |

---

## 📦 Domínio de Frete

### Aggregate Root: ShippingQuote

Representa uma cotação de frete no sistema.

**Atributos:**
- `id: ShippingQuoteId` - Identificador único da cotação
- `cartId: CartId` - Associação obrigatória com carrinho
- `items: List<ShippingItem>` - Itens com peso e preço congelados
- `options: List<ShippingOption>` - Opções de frete disponíveis
- `createdAt: LocalDateTime` - Data de criação
- `expiresAt: LocalDateTime` - Data de expiração (24h após criação)
- `status: ShippingQuoteStatus` - Status da cotação
- `selectedServiceCode: String` - Código do serviço selecionado (nullable)

**ShippingQuoteStatus:**
- `CREATED` - Cotação criada, aguardando seleção
- `SELECTED` - Opção de frete selecionada
- `EXPIRED` - Cotação expirada, não pode ser reutilizada

**Regras de Negócio:**
- Uma cotação pertence a um único carrinho
- Cotação inicia com status CREATED
- Expira automaticamente após 24 horas
- Cotação expirada não pode ter opção selecionada
- Cotação selecionada não pode ser alterada
- Cotação selecionada não pode ser expirada
- Deve ter ao menos um item e uma opção

**Métodos:**
- `ShippingQuote.create(cartId, items, options)` - Cria nova cotação
- `ShippingQuote.reconstitute(...)` - Reconstitui cotação existente
- `selectOption(serviceCode)` - Seleciona opção de frete (CREATED → SELECTED)
- `expire()` - Marca como expirada (CREATED → EXPIRED)
- `getSelectedOption()` - Retorna opção selecionada
- `isExpired()` - Verifica se expirada (status ou tempo)
- `isSelected()` - Verifica se selecionada
- `isCreated()` - Verifica se criada

### Value Object: ShippingItem

Representa um item de frete com dados congelados (snapshot).

**Atributos:**
- `bookId: BookId` - Referência ao livro
- `bookTitle: String` - Título do livro (congelado)
- `quantity: int` - Quantidade
- `weight: Weight` - Peso unitário (congelado)
- `unitPrice: Money` - Preço unitário (congelado)

**Regras de Negócio:**
- Quantidade mínima: 1
- Peso e preço obrigatórios
- Completamente imutável (snapshot)
- Não consulta catálogo após criação
- Item não possui identidade própria

**Métodos:**
- `ShippingItem.create(...)` - Cria item
- `getTotalWeight()` - Calcula peso total (weight × quantity)

### Value Object: ShippingOption

Representa uma opção de frete retornada pelo provedor.

**Atributos:**
- `serviceCode: String` - Código do serviço (PAC, SEDEX, etc)
- `serviceName: String` - Nome do serviço
- `price: Money` - Valor do frete
- `deliveryDays: int` - Prazo de entrega em dias
- `company: String` - Transportadora (Correios, Jadlog, etc)
- `externalReference: String` - ID do provedor (Melhor Envio)

**Regras de Negócio:**
- Todos os campos obrigatórios
- Prazo de entrega maior que zero
- Opções são somente leitura após cálculo
- Apenas opções existentes podem ser selecionadas

**Métodos:**
- `ShippingOption.create(...)` - Cria opção

### Model: ShippingPayload

Armazena payload bruto da API (auditoria).

**Atributos:**
- `id: String` - Identificador único
- `shippingQuoteId: ShippingQuoteId` - Associação com cotação
- `provider: ShippingProvider` - Provedor (MELHOR_ENVIO)
- `rawPayload: String` - JSON bruto da resposta
- `createdAt: LocalDateTime` - Data de criação

**Regras de Negócio:**
- Payload não é usado no domínio
- Uso exclusivo para auditoria e debug
- Persistência independente das opções normalizadas
- Um payload por cotação

**Métodos:**
- `ShippingPayload.create(...)` - Cria payload
- `ShippingPayload.reconstitute(...)` - Reconstitui payload

---

## 💳 Domínio de Pagamentos

### Aggregate Root: Payment

Representa um pagamento no sistema.

**Atributos:**
- `id: PaymentId` - Identificador único do pagamento
- `orderId: OrderId` - Associação obrigatória com pedido
- `amount: Money` - Valor do pagamento (congelado no pedido)
- `method: PaymentMethod` - Método de pagamento escolhido
- `gateway: PaymentGateway` - Gateway que processará o pagamento
- `status: PaymentStatus` - Status atual do pagamento
- `externalReference: String` - Referência externa do gateway (nullable)
- `rejectionReason: String` - Motivo da rejeição (nullable)
- `createdAt: LocalDateTime` - Data de criação
- `updatedAt: LocalDateTime` - Data de última atualização

**PaymentStatus:**
- `CREATED` - Pagamento criado, não processado ainda
- `PENDING` - Aguardando confirmação do gateway/cliente
- `APPROVED` - Pagamento aprovado pelo gateway
- `REJECTED` - Pagamento rejeitado pelo gateway
- `CANCELLED` - Pagamento cancelado pelo cliente
- `EXPIRED` - Pagamento expirado (não pago a tempo)

**PaymentMethod:**
- `PIX` - Pagamento via PIX
- `CREDIT_CARD` - Cartão de crédito
- `DEBIT_CARD` - Cartão de débito
- `BOLETO` - Boleto bancário
- `BANK_TRANSFER` - Transferência bancária

**PaymentGateway:**
- `MERCADO_PAGO` - Mercado Pago (implementado)
- `PAGSEGURO` - PagSeguro (planejado)
- `PAYPAL` - PayPal (planejado)
- `STRIPE` - Stripe (planejado)
- `OTHER` - Outro gateway

**Regras de Negócio:**
- Um pagamento pertence a um único pedido
- Valor do pagamento deve ser igual ao total do pedido
- Status inicial sempre CREATED
- ExternalReference preenchido após processamento
- RejectionReason preenchido apenas quando REJECTED
- Pagamento não pode ser alterado após APPROVED
- Apenas um pagamento ativo por pedido

**Métodos:**
- `Payment.create(Order, method, gateway)` - Cria pagamento
- `Payment.reconstitute(...)` - Reconstitui pagamento existente
- `associateExternalReference(String)` - Associa referência do gateway
- `markAsPending()` - CREATED → PENDING
- `approve()` - PENDING → APPROVED
- `reject(String reason)` - PENDING → REJECTED
- `cancel()` - PENDING → CANCELLED
- `expire()` - PENDING → EXPIRED
- `isPending()`, `isApproved()`, `isRejected()`, etc. - Verificações de status

### Abstração de Gateway

**Interface: PaymentGatewayService** (domain/service)
```java
public interface PaymentGatewayService {
    PaymentPreference createPaymentPreference(Order order, Payment payment);
    PaymentGateway getGateway();
    
    record PaymentPreference(
        String id,
        String paymentUrl,
        String externalReference
    ) {}
}
```

**Características:**
- ✅ Interface no domínio (sem dependência de framework)
- ✅ Implementações na camada de infraestrutura
- ✅ Seleção dinâmica via Factory
- ✅ Strategy Pattern para extensibilidade

**Implementações:**

**MercadoPagoPaymentService** (infrastructure)
- Implementa `PaymentGatewayService`
- Converte domínio → formato Mercado Pago
- Retorna `PaymentPreference` normalizada
- Zero dependência de MP no domínio

**PaymentGatewayServiceFactory** (application)
- Seleção automática por `PaymentGateway` enum
- Registro via Spring (List<PaymentGatewayService>)
- Map interno: `PaymentGateway → Service`
- Exception clara se gateway não configurado

**Arquitetura:**
```
ProcessPaymentUseCase
    ↓
PaymentGatewayServiceFactory
    ↓
PaymentGatewayService (interface)
    ↓
MercadoPagoPaymentService (impl)
    ↓
MercadoPagoClient → API Mercado Pago
```

**Benefícios:**
- ✅ Desacoplamento total do domínio
- ✅ Substituição de gateway sem refatoração
- ✅ Testabilidade (mocks da interface)
- ✅ Open/Closed Principle

### Sincronização Order ↔ Payment

**Regras:**
- `APPROVED` → Order.confirm()
- `REJECTED` → Order permanece PENDING
- `EXPIRED` → Order.expire()
- `CANCELLED` → Order permanece PENDING

**Fluxo:**
```
1. Cliente paga no gateway
2. Gateway envia webhook
3. Sistema busca Payment por externalReference
4. Atualiza Payment.status
5. Busca Order relacionado
6. Sincroniza Order.status
7. Persiste ambos (transação atômica)
```

**Características:**
- ✅ Pedido NUNCA muda status via frontend
- ✅ Apenas eventos de pagamento alteram pedido
- ✅ Transações atômicas
- ✅ Logs completos de sincronização

---

## 👤 Domínio de Usuários (Admin)

### Aggregate Root: User

Representa um usuário administrativo do sistema, responsável por autenticação e autorização de operações sensíveis.

**Atributos:**
- `id: UserId` - Identificador único e imutável
- `name: String` - Nome do usuário administrativo
- `email: Email` - Email único (Value Object com validação)
- `passwordHash: String` - Senha armazenada apenas como hash (BCrypt)
- `role: UserRole` - Papel do usuário no sistema
- `createdAt: LocalDateTime` - Data de criação
- `status: UserStatus` - Status do usuário (único campo mutável)

**UserStatus:**
- `ACTIVE` - Usuário ativo, pode acessar o sistema
- `BLOCKED` - Usuário bloqueado, acesso negado

**UserRole:**
- `ADMIN` - Usuário administrativo com acesso total

**Email (Value Object):**
- Validação de formato via regex
- Normalização automática (lowercase, trim)
- Máximo 255 caracteres
- Imutável após criação

**Regras de Negócio:**
- Email é único no sistema
- Senha armazenada apenas como hash (nunca texto plano)
- Senha nunca é exposta fora do domínio (sem getter público)
- Status inicial sempre ACTIVE
- Campos imutáveis exceto status
- Usuario bloqueado não pode acessar o sistema
- Apenas ADMIN pode gerenciar outros usuários

**Métodos:**
- `User.create(name, email, passwordHash)` - Cria novo usuário admin
- `User.reconstitute(...)` - Reconstitui usuário existente
- `block()` - Bloqueia usuário (ACTIVE → BLOCKED)
- `unblock()` - Desbloqueia usuário (BLOCKED → ACTIVE)
- `isActive()` - Verifica se usuário está ativo
- `isBlocked()` - Verifica se usuário está bloqueado
- `isAdmin()` - Verifica se usuário é administrador
- `matchesPassword(hashedPassword)` - Compara hash de senha (autenticação)

**Segurança:**
- ✅ Senha armazenada apenas como hash
- ✅ Getter de passwordHash é package-private
- ✅ ToString exclui passwordHash
- ✅ Email com validação rigorosa
- ✅ Sem exposição de dados sensíveis

**Características:**
- ✅ Aggregate Root do domínio
- ✅ Zero anotações de persistência
- ✅ Imutabilidade exceto status
- ✅ Validações no construtor
- ✅ Clean Architecture e SOLID

### Persistência de Usuários

**Tabela no Banco:** `tb_users`

**Estrutura:**
```sql
id VARCHAR(36) PRIMARY KEY
name VARCHAR(200) NOT NULL
email VARCHAR(255) NOT NULL UNIQUE
password_hash VARCHAR(255) NOT NULL
role VARCHAR(20) NOT NULL
status VARCHAR(20) NOT NULL
created_at TIMESTAMP NOT NULL
updated_at TIMESTAMP NOT NULL

CONSTRAINT uk_users_email UNIQUE (email)
INDEX idx_users_email (email)
INDEX idx_users_status (status)
INDEX idx_users_role (role)
```

**Camadas de Persistência:**

**UserEntity (infrastructure/persistence/entity)**
- Entidade JPA com anotações de persistência
- Campos mapeados para colunas do banco
- `@PrePersist` e `@PreUpdate` para timestamps
- Conversão de enums (UserRole, UserStatus)

**UserJpaRepository (infrastructure/persistence/repository)**
- Interface Spring Data JPA
- Métodos customizados: `findByEmail()`, `existsByEmail()`
- Queries derivadas do nome do método

**UserMapper (infrastructure/persistence/mapper)**
- MapStruct para conversão Domain ↔ Entity
- Conversão de Value Objects (UserId, Email)
- Extração segura de passwordHash via reflexão
- Zero vazamento de domínio para infraestrutura

**UserRepositoryAdapter (infrastructure/persistence/adapter)**
- Implementa `UserRepository` (interface do domínio)
- Delega para `UserJpaRepository`
- Converte Entity → Domain via `UserMapper`
- Desacopla domínio da infraestrutura

**Arquitetura de Persistência:**
```
Domain Layer:
    UserRepository (interface)
         ↑
         | implementa
         |
Infrastructure Layer:
    UserRepositoryAdapter
         ↓ delega
    UserJpaRepository (Spring Data)
         ↓ usa
    UserMapper (MapStruct)
         ↓ converte
    UserEntity (JPA)
```

**Características:**
- ✅ Email com constraint UNIQUE no banco
- ✅ Senha armazenada como hash BCrypt (255 chars)
- ✅ Timestamps automáticos (created_at, updated_at)
- ✅ Índices para performance (email, status, role)
- ✅ Migration versionada (V11)
- ✅ Desacoplamento total (Adapter Pattern)
- ✅ Zero dependência de Spring no domínio

### Autenticação JWT

**Aggregate Root:** `RefreshToken`

Representa um token de refresh para renovar access tokens sem re-login.

**Atributos:**
- `id: RefreshTokenId` - Identificador único
- `userId: UserId` - Usuário dono do token
- `token: String` - Token UUID aleatório e seguro
- `createdAt: LocalDateTime` - Data de criação
- `expiresAt: LocalDateTime` - Data de expiração
- `revoked: boolean` - Se foi revogado manualmente

**Métodos:**
- `RefreshToken.create(userId, expirationDays)` - Cria novo token
- `revoke()` - Revoga o token
- `isExpired()` - Verifica expiração
- `isValid()` - Verifica se válido (não revogado e não expirado)

**Domain Services:**

**JwtService** (interface no domínio)
- `generateAccessToken(User)` - Gera JWT access token
- `extractUserId(token)` - Extrai userId do JWT
- `extractRole(token)` - Extrai role do JWT
- `validateToken(token)` - Valida JWT
- `isTokenExpired(token)` - Verifica expiração

**PasswordEncoderService** (interface no domínio)
- `encode(rawPassword)` - Gera hash BCrypt
- `matches(rawPassword, hash)` - Valida senha

**Implementações** (infrastructure):
- `JwtServiceImpl` - Usa io.jsonwebtoken (jjwt 0.12.3)
- `PasswordEncoderServiceImpl` - Usa Spring Security BCrypt

**Use Case: LoginUseCase**

Fluxo de autenticação:
1. Busca usuário por email
2. Valida senha com BCrypt
3. Verifica se usuário está ativo
4. Revoga tokens antigos (segurança)
5. Gera access token JWT (1 hora)
6. Gera refresh token persistido (30 dias)
7. Retorna tokens no formato padronizado

**Endpoint de Autenticação:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@livraria.com",
  "password": "senha123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

**Endpoint de Renovação:**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "660f9511-f30c-52e5-b827-557766551111",
  "tokenType": "Bearer",
  "expiresIn": 3600
}

IMPORTANTE: Token Rotation aplicado
- Refresh token antigo é INVALIDADO
- Novo refresh token é gerado
- Tentativas com token antigo serão rejeitadas
```

**Endpoint de Dados do Usuário:**
```http
GET /api/user/me
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@livraria.com",
  "role": "ADMIN"
}

IMPORTANTE: Endpoint Protegido
- Requer header Authorization com token válido
- Token expirado retorna 401 Unauthorized
- Dados extraídos exclusivamente do token JWT
- Nenhuma consulta ao banco de dados
```

**Configuração JWT:**
```yaml
app:
  security:
    jwt:
      secret: ${JWT_SECRET}              # Mínimo 256 bits
      expiration: 3600                   # 1 hora
    refresh-token:
      expiration-days: 30                # 30 dias
```

**Tabela:** `tb_refresh_tokens`
```sql
id VARCHAR(36) PRIMARY KEY
user_id VARCHAR(36) NOT NULL (FK)
token VARCHAR(36) NOT NULL UNIQUE
created_at TIMESTAMP NOT NULL
expires_at TIMESTAMP NOT NULL
revoked BOOLEAN NOT NULL DEFAULT FALSE

INDEX idx_refresh_tokens_user_id
INDEX idx_refresh_tokens_token
INDEX idx_refresh_tokens_expires_at
```

**Validações de Segurança:**
- ✅ Credenciais inválidas retornam mensagem genérica
- ✅ Usuário bloqueado não pode fazer login
- ✅ Tokens antigos são revogados no novo login
- ✅ Refresh token com UUID seguro
- ✅ Access token com claims criptografados
- ✅ Senha nunca exposta (BCrypt)
- ✅ Logs de auditoria (tentativas de login)
- ✅ Token rotation obrigatório na renovação
- ✅ Refresh token expirado é rejeitado
- ✅ Refresh token revogado é rejeitado
- ✅ Usuário bloqueado não pode renovar tokens

**Características:**
- ✅ JWT stateless (sem sessão no servidor)
- ✅ Refresh token persistido (renovação)
- ✅ BCrypt para hash de senhas
- ✅ HMAC-SHA256 para assinatura JWT
- ✅ Claims: userId, role, email
- ✅ Tempo de vida configurável
- ✅ Revogação manual de tokens
- ✅ Limpeza de tokens expirados
- ✅ Zero dependência de Spring no domínio

### Autorização e Controle de Acesso

**Configuração Centralizada de Segurança**

Todas as regras de autorização estão centralizadas em `SecurityConfiguration`:

```java
// Endpoints publicos (sem autenticacao)
/api/auth/**           → Login, refresh token
/api/public/**         → Catalogo publico de livros
/api/webhooks/**       → Webhooks Mercado Pago
/api/v1/actuator/**    → Health check
/api/carts/**          → Carrinho de compras
/api/orders/**         → Pedidos
/api/payments/**       → Pagamentos
/api/shipping/**       → Calculo de frete

// Endpoints autenticados (requer token valido)
/api/user/**           → Dados do usuario autenticado

// Endpoints administrativos (requer ROLE_ADMIN)
/api/admin/**          → CRUD de autores e livros

// Qualquer outro endpoint
anyRequest()           → Negado por padrao (seguranca)
```

**Respostas de Erro Padronizadas:**

**401 Unauthorized** (não autenticado):
```json
{
  "timestamp": "2026-01-13T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Autenticacao necessaria. Por favor, faca login",
  "path": "/api/user/me"
}
```

**403 Forbidden** (não autorizado):
```json
{
  "timestamp": "2026-01-13T10:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Acesso negado. Voce nao tem permissao para acessar este recurso",
  "path": "/api/admin/books"
}
```

**Handlers Customizados:**
- `CustomAuthenticationEntryPoint` - Trata 401 (não autenticado)
- `CustomAccessDeniedHandler` - Trata 403 (acesso negado)
- Respostas JSON padronizadas
- Logs de tentativas não autorizadas

**Fluxo de Autorização:**
```
1. Request chega ao servidor
   ↓
2. JwtAuthenticationFilter intercepta
   - Extrai token do header
   - Valida assinatura e expiração
   - Extrai userId e role
   - Define no SecurityContext
   ↓
3. Spring Security verifica regras
   - Endpoint é público? → Permite
   - Endpoint requer autenticação? → Verifica token
   - Endpoint requer ADMIN? → Verifica role
   ↓
4. Decisão:
   - Permitido → Controller processa
   - Não autenticado → 401 Unauthorized
   - Não autorizado → 403 Forbidden
```

**Características de Segurança:**
- ✅ Configuração centralizada (um único ponto)
- ✅ Separação clara de rotas (pública, autenticada, admin)
- ✅ Nenhuma regra de autorização nos controllers
- ✅ Segurança por padrão (anyRequest().denyAll())
- ✅ Preparado para expansão de roles (CUSTOMER, MANAGER, etc)
- ✅ Logs de tentativas não autorizadas
- ✅ Respostas padronizadas e informativas
- ✅ Stateless (sem sessão no servidor)

---

## 🚀 Pré-requisitos
- **Maven 3.8+**
- **Docker & Docker Compose**
- **Git**

## ⚙️ Configuração e Profiles

O projeto utiliza **Spring Profiles** para gerenciar configurações em diferentes ambientes, seguindo boas práticas de segurança:

### Profiles Disponíveis

#### `local` (default)
- Desenvolvimento local
- Logs detalhados (DEBUG)
- SQL queries visíveis
- Health endpoint com detalhes completos
- Melhor para desenvolvimento

#### `dev`
- Desenvolvimento com banco Docker
- Logs moderados
- SQL queries visíveis
- Health endpoint com detalhes

#### `staging`
- Ambiente de homologação
- Logs moderados (INFO)
- Health endpoint com detalhes apenas para autorizados
- Configurações próximas à produção

#### `production`
- Ambiente de produção
- Logs mínimos (WARN/ERROR)
- Sem SQL queries nos logs
- Health endpoint sem detalhes (apenas UP/DOWN)
- Máxima segurança

### Variáveis de Ambiente

O sistema usa `@ConfigurationProperties` para gestão centralizada e **validação automática** de configurações. A aplicação **falha na inicialização** se propriedades obrigatórias estiverem ausentes.

#### Obrigatórias

```bash
# Database
POSTGRES_USER=livraria_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=livraria_db
JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/livraria_db

# JWT e Autenticação
JWT_SECRET=your-secure-256-bit-secret-key-change-this

# Melhor Envio
MELHOR_ENVIO_TOKEN=your_melhor_envio_token

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_token
```

#### Opcionais (com defaults)

```bash
# Spring
SPRING_PROFILES_ACTIVE=local
SERVER_PORT=8080

# JWT
JWT_EXPIRATION=3600                    # segundos
REFRESH_TOKEN_EXPIRATION_DAYS=30       # dias

# Melhor Envio
MELHOR_ENVIO_BASE_URL=https://sandbox.melhorenvio.com.br
MELHOR_ENVIO_FROM_CEP=03295-000
MELHOR_ENVIO_TIMEOUT_SECONDS=10
MELHOR_ENVIO_MAX_RETRIES=2

# Mercado Pago
MERCADO_PAGO_BASE_URL=https://api.mercadopago.com
MERCADO_PAGO_TIMEOUT_SECONDS=15
MERCADO_PAGO_MAX_RETRIES=2
MERCADO_PAGO_SUCCESS_URL=http://localhost:3000/payment/success
MERCADO_PAGO_FAILURE_URL=http://localhost:3000/payment/failure
MERCADO_PAGO_PENDING_URL=http://localhost:3000/payment/pending
MERCADO_PAGO_NOTIFICATION_URL=http://localhost:8080/api/webhooks/mercadopago
MERCADO_PAGO_STATEMENT_DESCRIPTOR=Livraria Tunoda

# Logging
LOG_LEVEL_MELHOR_ENVIO=INFO
LOG_LEVEL_MERCADO_PAGO=INFO
```

Veja detalhes completos em [ENV_VARIABLES.md](./ENV_VARIABLES.md).

### Validação Automática

**SecurityProperties** (`@ConfigurationProperties`):
- JWT secret é obrigatório e não pode estar vazio
- JWT expiration mínimo: 60 segundos
- Refresh token expiration mínimo: 1 dia

**MelhorEnvioProperties**:
- Token obrigatório
- Base URL obrigatória
- CEP de origem obrigatório
- Timeout mínimo: 1 segundo

**MercadoPagoProperties**:
- Access token obrigatório
- Base URL obrigatória
- Timeout mínimo: 1 segundo

### Arquivos de Configuração

```
resources/
├── application.yml          # Base (valores default e variáveis de ambiente)
├── application-local.yml    # Profile local
├── application-dev.yml      # Profile dev
├── application-staging.yml  # Profile staging
└── application-prod.yml     # Profile production
```

**Princípios:**
- ✅ Nenhum valor sensível hardcoded
- ✅ Todos os segredos via variáveis de ambiente
- ✅ Validação automática na inicialização
- ✅ Falha rápida se configuração inválida
- ✅ Uso de `@ConfigurationProperties` ao invés de `@Value` espalhado

## ⚙️ Configuração Local

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd livraria-tunoda/backend
```

### 2. Configure as variáveis de ambiente obrigatórias

Defina as variáveis de ambiente necessárias:

```bash
# Mínimo necessário para rodar local
export JWT_SECRET="your-secure-jwt-secret-key-minimum-256-bits-required-for-hs256-algorithm"
export MELHOR_ENVIO_TOKEN="your_melhor_envio_token"
export MERCADO_PAGO_ACCESS_TOKEN="your_mercado_pago_access_token"
```

**Importante:** O sistema **validará** essas variáveis na inicialização. Se alguma estiver ausente ou inválida, a aplicação falhará com mensagem clara.

Para lista completa de variáveis, consulte [ENV_VARIABLES.md](./ENV_VARIABLES.md).

### 3. Suba o banco de dados

```bash
docker-compose up -d
```

Aguarde o PostgreSQL ficar saudável (health check configurado).

### 4. Execute a aplicação

**Com profile local (default):**
```bash
./mvnw spring-boot:run
```

**Com profile específico:**
```bash
# Dev
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run

# Staging
SPRING_PROFILES_ACTIVE=staging ./mvnw spring-boot:run

# Production
SPRING_PROFILES_ACTIVE=production ./mvnw spring-boot:run
```

Ou pelo IDE de sua preferência.

**Logs esperados na inicialização:**
```
========================================
Application started successfully!
Active profile(s): local
Port: 8080
JWT Expiration: 3600s
Refresh Token Expiration: 30 days
========================================
```

### 5. Verifique se está funcionando

```bash
curl http://localhost:8080/api/v1/actuator/health
```

Resposta esperada:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": { "status": "UP" }
  }
}
```

### 6. Acesse com usuário administrativo inicial

O sistema cria automaticamente um usuário admin durante a inicialização (migration V13):

```
Email: admin@livraria.com
Senha: admin123
```

**Fazer login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@livraria.com",
    "password": "admin123"
  }'
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

> ⚠️ **IMPORTANTE - PRODUÇÃO:**  
> Altere a senha padrão IMEDIATAMENTE após o primeiro acesso em ambiente de produção.  
> Veja documentação completa em: [`docs/ADMIN_CREDENTIALS.md`](docs/ADMIN_CREDENTIALS.md)

## 🚀 Fluxo de Startup da Aplicação

Entenda a sequência de inicialização da aplicação e o que acontece em cada etapa:

### 1️⃣ Validação de Configurações

**O que acontece:**
- Spring Boot carrega `application.yml` + profile específico
- `@ConfigurationProperties` valida variáveis obrigatórias
- Aplicação **FALHA IMEDIATAMENTE** se configuração inválida

**Configurações validadas:**
- ✅ JWT Secret (mínimo 256 bits)
- ✅ JWT Expiration (mínimo 60 segundos)
- ✅ Refresh Token Expiration (mínimo 1 dia)
- ✅ Melhor Envio Token (obrigatório)
- ✅ Mercado Pago Access Token (obrigatório)
- ✅ URLs de callback (formato válido)

**Logs esperados:**
```
Validando configuracoes de seguranca...
Validando configuracoes do Melhor Envio...
Validando configuracoes do Mercado Pago...
```

**Se falhar:**
```
***************************
APPLICATION FAILED TO START
***************************

Description:
Binding validation errors:
  - Field error in object 'securityProperties' on field 'jwtSecret': rejected value []
  
Action:
Configure a valid value for 'jwt.secret' in your application properties.
```

---

### 2️⃣ Conexão com Banco de Dados

**O que acontece:**
- HikariCP cria pool de conexões com PostgreSQL
- Valida conectividade (timeout padrão: 30s)
- Testa query de validação: `SELECT 1`

**Logs esperados:**
```
HikariPool-1 - Starting...
HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@...
HikariPool-1 - Start completed.
```

**Se falhar:**
```
Failed to obtain JDBC Connection
Connection to localhost:5432 refused. Check that the hostname and port are correct.
```

**Troubleshooting:**
- ✅ PostgreSQL está rodando? `docker-compose ps`
- ✅ Porta correta? Padrão: `5432`
- ✅ Credenciais corretas? Verifique `.env`
- ✅ Firewall bloqueando? Teste: `telnet localhost 5432`

---

### 3️⃣ Migrations do Flyway

**O que acontece:**
- Flyway verifica tabela `flyway_schema_history`
- Executa migrations pendentes em ordem (V1, V2, V3...)
- Cria/atualiza estrutura do banco
- Insere dados iniciais (usuário admin)

**Migrations executadas:**
```
V1__create-table-books.sql
V2__create-table-book-metrics.sql
V3__create-table-carts.sql
V4__create-table-orders.sql
V5__add-payment-reference-to-orders.sql
V6__create-table-shipping-quotes.sql
V7__create-table-shipping-payloads.sql
V8__add-to-postal-code-to-shipping-quotes.sql
V9__create-table-payments.sql
V10__add-shipping-to-orders.sql
V11__create-table-users.sql
V12__create-table-refresh-tokens.sql
V13__insert-admin-user.sql
```

**Logs esperados:**
```
Flyway Community Edition 10.x.x
Database: jdbc:postgresql://localhost:5432/livraria_db (PostgreSQL 17.x)
Successfully validated 13 migrations (execution time 00:00.015s)
Current version of schema "public": 13
Schema "public" is up to date. No migration necessary.
```

**Se falhar:**
```
Migration V2__create-table-book-metrics.sql failed
ERROR: type "idx_book_metrics_book_id" does not exist
```

**Troubleshooting:**
- ✅ Banco vazio? Flyway criará tudo do zero
- ✅ Migration falhou? Corrija o SQL e delete da `flyway_schema_history`
- ✅ Versão incompatível? Veja `MIGRACAO_POSTGRESQL.md`

---

### 4️⃣ Inicialização do Spring Security

**O que acontece:**
- SecurityFilterChain configurado
- JwtAuthenticationFilter registrado
- Endpoints públicos/protegidos definidos
- Actuator com segurança por profile

**Logs esperados:**
```
Configurando seguranca do Actuator para ambiente de desenvolvimento (permitAll)
Will secure any request with [...]
```

**Configuração aplicada:**
- ✅ `/api/auth/**` → Público
- ✅ `/api/public/**` → Público
- ✅ `/api/webhooks/**` → Público
- ✅ `/api/admin/**` → ROLE_ADMIN
- ✅ `/api/user/**` → Autenticado
- ✅ `/api/v1/actuator/health` → Público
- ✅ `/api/v1/actuator/**` → Por profile (dev: público, staging: autenticado, prod: ADMIN)

---

### 5️⃣ Registro de Beans e Componentes

**O que acontece:**
- Spring carrega todos os `@Component`, `@Service`, `@Repository`
- MapStruct gera implementações de mappers
- Actuator registra health indicators customizados

**Logs esperados:**
```
Inicializando metricas do Micrometer
Registrado health indicator: database
Registrado health indicator: application
```

---

### 6️⃣ Inicialização do Tomcat

**O que acontece:**
- Servidor web embarcado (Tomcat) inicia
- Porta definida (padrão: 8080)
- Aguarda requisições HTTP

**Logs esperados:**
```
Tomcat initialized with port 8080 (http)
Tomcat started on port 8080 (http) with context path '/'
```

---

### 7️⃣ Aplicação Pronta

**Log final:**
```
========================================
Application started successfully!
Active profile(s): local
Port: 8080
JWT Expiration: 3600s
Refresh Token Expiration: 30 days
========================================
Started StartupApplication in 5.234 seconds (process running for 5.678)
```

**Aplicação está pronta para receber requisições! 🚀**

---

### ⏱️ Tempo de Startup Esperado

| Ambiente | Tempo Típico | Observações |
|----------|--------------|-------------|
| **Local (primeira vez)** | ~10-15s | Inclui download de dependências |
| **Local (subsequente)** | ~5-7s | Dependências em cache |
| **Docker (primeira vez)** | ~15-20s | Aguarda banco ficar healthy |
| **Docker (subsequente)** | ~8-10s | Banco já está rodando |
| **Produção** | ~7-12s | Banco gerenciado (mais rápido) |

---

### 🔍 Verificação Pós-Startup

Após o startup, verifique se tudo está funcionando:

#### 1. Health Check
```bash
curl http://localhost:8080/api/v1/actuator/health
```
Esperado: `{"status":"UP"}`

#### 2. Banco de Dados
```bash
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db -c "\dt"
```
Esperado: Lista de 12 tabelas

#### 3. Usuário Admin
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@livraria.com","password":"admin123"}'
```
Esperado: Tokens JWT válidos

#### 4. Métricas (se profile dev/local)
```bash
curl http://localhost:8080/api/v1/actuator/metrics
```
Esperado: Lista de métricas disponíveis

---

### 🚨 Problemas Comuns no Startup

| Erro | Causa | Solução |
|------|-------|---------|
| `Binding validation errors` | Variável obrigatória faltando | Configure a variável de ambiente |
| `Connection refused` | PostgreSQL não está rodando | Execute `docker-compose up -d` |
| `Migration failed` | SQL incompatível | Veja `MIGRACAO_POSTGRESQL.md` |
| `Port 8080 already in use` | Outra aplicação usando a porta | Mude `SERVER_PORT` ou mate o processo |
| `OutOfMemoryError` | JVM sem memória | Aumente heap: `JAVA_OPTS="-Xmx512m"` |
| `ClassNotFoundException` | Dependência faltando | Execute `./mvnw clean install` |

---

## 🔧 Variáveis de Ambiente

### Desenvolvimento (`.env`)

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `POSTGRES_USER` | Usuário do PostgreSQL | `livraria_user` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `livraria_password` |
| `POSTGRES_DB` | Nome do banco de dados | `livraria_db` |
| `POSTGRES_PORT` | Porta do PostgreSQL | `5432` |
| `SPRING_PROFILES_ACTIVE` | Perfil ativo (dev/prod) | `dev` |

### Produção

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `JDBC_DATABASE_URL` | URL completa do banco (jdbc:postgresql://...) | ✅ |
| `POSTGRES_USER` | Usuário do banco | ✅ |
| `POSTGRES_PASSWORD` | Senha do banco | ✅ |
| `SPRING_PROFILES_ACTIVE` | Deve ser `prod` | ✅ |

**⚠️ IMPORTANTE:** Nunca versione o arquivo `.env` com credenciais reais!

## 🗄️ Banco de Dados

### Migrations (Flyway)

O Flyway gerencia automaticamente as migrations do banco. Os arquivos ficam em:

```
src/main/resources/db/migration/
├── V1__create-table-books.sql
├── V2__create-table-book-metrics.sql
├── V3__create-table-carts.sql
├── V4__create-table-orders.sql
├── V5__add-payment-reference-to-orders.sql
├── V6__create-table-shipping-quotes.sql
├── V7__create-table-shipping-payloads.sql
├── V8__add-to-postal-code-to-shipping-quotes.sql
├── V9__create-table-payments.sql
├── V10__add-shipping-to-orders.sql
├── V11__create-table-users.sql
├── V12__create-table-refresh-tokens.sql
└── V13__insert-admin-user.sql
```

**Convenção de nomenclatura:** `V{versão}__{descrição}.sql`

### Estrutura de Tabelas

A aplicação possui as seguintes tabelas:

**tb_authors**
```sql
id VARCHAR(36) PRIMARY KEY
name VARCHAR(200) NOT NULL
biography TEXT NOT NULL
photo_url VARCHAR(500)
status VARCHAR(20) NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

**tb_books**
```sql
id VARCHAR(36) PRIMARY KEY
title VARCHAR(300) NOT NULL
description TEXT NOT NULL
photo_url VARCHAR(500)
isbn VARCHAR(20) UNIQUE
price_amount DECIMAL(10,2) NOT NULL
price_currency VARCHAR(3) NOT NULL
weight_value DECIMAL(10,3) NOT NULL
weight_unit VARCHAR(20) NOT NULL
status VARCHAR(20) NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

**tb_book_authors** (relacionamento N:N)
```sql
book_id VARCHAR(36)
author_id VARCHAR(36)
PRIMARY KEY (book_id, author_id)
```

**tb_book_metrics** (métricas de interação)
```sql
id VARCHAR(36) PRIMARY KEY
book_id VARCHAR(36) NOT NULL
event_type VARCHAR(20) NOT NULL
occurred_at TIMESTAMP NOT NULL
```

**tb_carts** (carrinhos de compras)
```sql
id VARCHAR(36) PRIMARY KEY
status VARCHAR(20) NOT NULL
created_at TIMESTAMP NOT NULL
updated_at TIMESTAMP NOT NULL
```

**tb_cart_items** (itens do carrinho)
```sql
id VARCHAR(36) PRIMARY KEY
cart_id VARCHAR(36) NOT NULL
book_id VARCHAR(36) NOT NULL
book_title VARCHAR(300) NOT NULL
quantity INT NOT NULL
unit_price_amount DECIMAL(10,2) NOT NULL
unit_price_currency VARCHAR(3) NOT NULL
FOREIGN KEY (cart_id) REFERENCES tb_carts(id) ON DELETE CASCADE
```

**tb_orders** (pedidos)
```sql
id VARCHAR(36) PRIMARY KEY
cart_id VARCHAR(36) NOT NULL
shipping_quote_id VARCHAR(36) NULL
status VARCHAR(20) NOT NULL
subtotal_amount DECIMAL(10,2) NOT NULL
subtotal_currency VARCHAR(3) NOT NULL
shipping_cost_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00
shipping_cost_currency VARCHAR(3) NOT NULL DEFAULT 'BRL'
total_amount DECIMAL(10,2) NOT NULL
total_currency VARCHAR(3) NOT NULL
created_at TIMESTAMP NOT NULL
payment_reference VARCHAR(100) NULL
INDEX idx_orders_cart_id (cart_id)
INDEX idx_orders_shipping_quote_id (shipping_quote_id)
INDEX idx_orders_status (status)
INDEX idx_orders_created_at (created_at)
```

**tb_order_items** (itens do pedido)
```sql
id VARCHAR(36) PRIMARY KEY
order_id VARCHAR(36) NOT NULL
book_id VARCHAR(36) NOT NULL
book_title VARCHAR(300) NOT NULL
quantity INT NOT NULL
unit_price_amount DECIMAL(10,2) NOT NULL
unit_price_currency VARCHAR(3) NOT NULL
FOREIGN KEY (order_id) REFERENCES tb_orders(id) ON DELETE CASCADE
INDEX idx_order_items_order_id (order_id)
INDEX idx_order_items_book_id (book_id)
```

**tb_shipping_quotes** (cotações de frete)
```sql
id VARCHAR(36) PRIMARY KEY
cart_id VARCHAR(36) NOT NULL
status VARCHAR(20) NOT NULL
created_at TIMESTAMP NOT NULL
expires_at TIMESTAMP NOT NULL
selected_service_code VARCHAR(50)
INDEX idx_shipping_quotes_cart_id (cart_id)
INDEX idx_shipping_quotes_status (status)
INDEX idx_shipping_quotes_created_at (created_at)
```

**tb_shipping_items** (itens da cotação de frete)
```sql
id VARCHAR(36) PRIMARY KEY
shipping_quote_id VARCHAR(36) NOT NULL
book_id VARCHAR(36) NOT NULL
book_title VARCHAR(300) NOT NULL
quantity INT NOT NULL
weight_value DECIMAL(10,3) NOT NULL
weight_unit VARCHAR(20) NOT NULL
unit_price_amount DECIMAL(10,2) NOT NULL
unit_price_currency VARCHAR(3) NOT NULL
FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE
INDEX idx_shipping_items_quote_id (shipping_quote_id)
INDEX idx_shipping_items_book_id (book_id)
```

**tb_shipping_options** (opções de frete)
```sql
id VARCHAR(36) PRIMARY KEY
shipping_quote_id VARCHAR(36) NOT NULL
service_code VARCHAR(50) NOT NULL
service_name VARCHAR(100) NOT NULL
price_amount DECIMAL(10,2) NOT NULL
price_currency VARCHAR(3) NOT NULL
delivery_days INT NOT NULL
company VARCHAR(100) NOT NULL
external_reference VARCHAR(100) NOT NULL
FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE
INDEX idx_shipping_options_quote_id (shipping_quote_id)
INDEX idx_shipping_options_service_code (service_code)
```

**tb_shipping_payloads** (auditoria de payloads)
```sql
id VARCHAR(36) PRIMARY KEY
shipping_quote_id VARCHAR(36) NOT NULL
provider VARCHAR(50) NOT NULL
raw_payload JSONB NOT NULL
created_at TIMESTAMP NOT NULL
FOREIGN KEY (shipping_quote_id) REFERENCES tb_shipping_quotes(id) ON DELETE CASCADE
```

Índices:
```sql
CREATE INDEX idx_shipping_payloads_quote_id ON tb_shipping_payloads(shipping_quote_id);
CREATE INDEX idx_shipping_payloads_provider ON tb_shipping_payloads(provider);
CREATE INDEX idx_shipping_payloads_created_at ON tb_shipping_payloads(created_at);
```

### Conexão Manual

Para conectar diretamente ao PostgreSQL:

```bash
docker exec -it postgres-livraria-tunoda psql -U livraria_user -d livraria_db
# Senha: livraria_password (ou conforme seu .env)

# Comandos úteis dentro do psql:
\dt                    # Listar tabelas
\d tb_books           # Descrever estrutura da tabela
\q                    # Sair
```

## 📝 Logs

### Logs Estruturados e Padronizados

Sistema de logs com suporte a observabilidade, auditoria e diagnóstico.

**Características:**
- ✅ Logs em JSON no profile `production`
- ✅ Logs legíveis nos profiles `local` e `dev`
- ✅ MDC com `requestId` para rastreamento
- ✅ Logs de operações críticas (pagamento, frete)
- ✅ Sanitização automática de dados sensíveis
- ✅ Stacktrace apenas em ambientes não produtivos

### Formato por Ambiente

**Local / Dev (Legível):**
```
2026-01-17 10:30:45 [http-nio-8080-exec-1] [a1b2c3d4] INFO CreatePaymentUseCase - Iniciando operação crítica
```

**Produção (JSON):**
```json
{
  "timestamp": "2026-01-17T10:30:45.123Z",
  "level": "INFO",
  "logger": "CreatePaymentUseCase",
  "message": "Iniciando operação crítica",
  "requestId": "a1b2c3d4",
  "application": "livraria-tunoda"
}
```

### Níveis de Log por Ambiente

**Desenvolvimento:**
- Aplicação: `DEBUG`
- SQL: `DEBUG` (com binding de parâmetros)
- Web: `DEBUG`
- Integrações: `DEBUG`

**Produção:**
- Aplicação: `INFO`
- SQL: `ERROR`
- Web: `WARN`
- Integrações: `INFO`

### RequestId

Cada requisição recebe um `requestId` único para rastreamento:

```bash
# Cliente pode enviar header customizado
curl -H "X-Request-ID: custom-123" http://localhost:8080/api/...

# Ou deixar gerar automaticamente (UUID)
curl http://localhost:8080/api/...
```

### Operações Críticas Logadas

Automaticamente via `CriticalOperationsLoggingAspect`:
- Criação e processamento de pagamentos
- Cálculo e seleção de frete
- Entrada, sucesso e erro com duração

**Documentação Completa:** [docs/LOGGING.md](./docs/LOGGING.md)

**Segurança:** Logs sanitizados - sem tokens, senhas, CPF ou dados sensíveis.

## 🛡️ Tratamento de Erros

A API retorna erros padronizados seguindo o formato:

```json
{
  "timestamp": "2026-01-05T14:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Recurso não encontrado",
  "path": "/api/v1/livros/999"
}
```

### Para erros de validação:

```json
{
  "timestamp": "2026-01-05T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação",
  "path": "/api/v1/livros",
  "errors": [
    {
      "field": "titulo",
      "message": "não deve estar em branco"
    }
  ]
}
```

### Exceções Tratadas

- `ResourceNotFoundException` → 404 Not Found
- `BusinessException` → 422 Unprocessable Entity
- `MethodArgumentNotValidException` → 400 Bad Request
- `ConstraintViolationException` → 400 Bad Request
- `Exception` (genérica) → 500 Internal Server Error

## 📊 Monitoramento

### Health Check

Endpoint: `GET /api/v1/actuator/health`

**Status:**
- `UP` - Aplicação funcionando normalmente
- `DOWN` - Aplicação com problemas

**Indicadores Customizados:**

1. **Database** - Valida conexão com PostgreSQL
   - Executa query de validação
   - Verifica se o banco está acessível

2. **Application** - Valida estado geral da aplicação
   - Verifica se o contexto Spring está carregado
   - Conta beans registrados

**Ambientes:**
- **Local/Dev:** Exibe detalhes completos (database, application, diskSpace, etc)  
- **Produção:** Exibe apenas status UP/DOWN (sem informações sensíveis)

**Exemplo de Resposta (Local/Dev):**
```json
{
  "status": "UP",
  "components": {
    "application": {
      "status": "UP",
      "details": {
        "context": "Active",
        "beansLoaded": 257,
        "status": "Application ready"
      }
    },
    "database": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "SELECT 1",
        "status": "Connection successful"
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

**Exemplo de Resposta (Produção):**
```json
{
  "status": "UP"
}
```

**Preparado para:**
- Container orchestration (Kubernetes, Docker Swarm)
- Liveness probes
- Readiness probes

## 🧪 Testes

```bash
./mvnw test
```

## 📦 Build

### Desenvolvimento

```bash
./mvnw clean install
```

### Produção

```bash
./mvnw clean package -DskipTests
java -jar target/livraria-tunoda-0.0.1-SNAPSHOT.jar
```

## 🐳 Docker

### Desenvolvimento Local

**Para desenvolvimento local, rode APENAS o banco de dados no Docker:**

```bash
# Subir PostgreSQL
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f
```

**Aplicação:** Rode na sua IDE (IntelliJ/Eclipse) para facilitar debug.

**Configuração:** Use o `.env` com `POSTGRES_HOST=localhost`

---

### Staging (SaveInCloud) - App + Banco Juntos

**Build e Push para Docker Hub:**

```bash
# 1. Login no Docker Hub
docker login

# 2. Build da imagem (substitua SEU_USUARIO)
docker build -t SEU_USUARIO/livraria-tunoda:staging .

# 3. Push para Docker Hub
docker push SEU_USUARIO/livraria-tunoda:staging
```

**No SaveInCloud:**

1. **Criar Aplicação** → Selecione **"Docker Compose"**
2. **Cole o conteúdo** de `docker-compose.staging.yml`
3. **Configure as variáveis de ambiente:**
   - `DOCKER_USERNAME` (seu usuário Docker Hub)
   - `POSTGRES_PASSWORD`
   - `JWT_SECRET`
   - `MELHOR_ENVIO_TOKEN`
   - `MERCADO_PAGO_ACCESS_TOKEN`
   - URLs do frontend
4. **Deploy!**

**Vantagens:**
- ✅ Mais barato (tudo numa instância)
- ✅ Configuração simples
- ✅ Ideal para staging/homologação

---

### Produção (Futuro) - App e Banco Separados

Para produção, recomendamos:
- ✅ Banco PostgreSQL gerenciado (separado)
- ✅ Aplicação em container separado
- ✅ Backups automáticos
- ✅ Alta disponibilidade

**Documentação Completa:** 
- [Docker](./docs/DOCKER.md)
- [Guia de Deploy Staging](./docs/GUIA_SIMPLES.md)

---

## 🚀 Deploy

### Deploy no SaveInCloud (Staging/Production)

**Quick Start:**

```bash
# 1. Configurar credenciais
cp .env.staging.example .env.staging
nano .env.staging

# 2. Configurar registry
export SAVEINCLOUD_REGISTRY_URL="registry.saveincloud.com.br/seu-usuario"
export SAVEINCLOUD_REGISTRY_USER="seu-usuario"
export SAVEINCLOUD_REGISTRY_PASSWORD="seu-token"

# 3. Deploy!
./deploy-saveincloud.sh staging
```

**CI/CD Automático:**

Push para branch `develop` → GitHub Actions → Deploy Staging automático

**Características:**
- ✅ Multi-stage build otimizado
- ✅ PostgreSQL gerenciado
- ✅ SSL automático (Let's Encrypt)
- ✅ Health checks configurados
- ✅ Auto-scaling
- ✅ Logs centralizados
- ✅ Métricas e monitoramento

**Documentação Completa:**
- [Guia Simples de Deploy](./docs/GUIA_SIMPLES.md) - Passo a passo completo
- [Docker](./docs/DOCKER.md) - Detalhes sobre imagens e containers

**URL Staging:** https://livraria-tunoda-staging.saveincloud.app

---

## 🏭 Execução em Produção

Guia operacional para executar e manter a aplicação em ambiente de produção.

### 📋 Checklist Pré-Produção

Antes de fazer deploy em produção, verifique:

#### Segurança
- [ ] **JWT_SECRET** alterado do padrão (mínimo 256 bits)
- [ ] **POSTGRES_PASSWORD** forte e única
- [ ] **Senha do admin** alterada após primeiro acesso
- [ ] HTTPS configurado (certificado SSL válido)
- [ ] Firewall configurado (apenas portas necessárias abertas)
- [ ] CORS configurado apenas para domínios autorizados
- [ ] Tokens de API (Melhor Envio, Mercado Pago) em produção

#### Banco de Dados
- [ ] Backup automático configurado (diário mínimo)
- [ ] Teste de restauração realizado
- [ ] Monitoramento de espaço em disco ativo
- [ ] Conexões pooling configurado (HikariCP)
- [ ] Índices criados (via Flyway)

#### Aplicação
- [ ] Profile `prod` ou `production` ativo
- [ ] Logs em nível WARN ou ERROR
- [ ] Health check respondendo
- [ ] Métricas sendo coletadas
- [ ] Variáveis de ambiente validadas

#### Infraestrutura
- [ ] CPU: mínimo 1 core (recomendado 2+)
- [ ] RAM: mínimo 512MB (recomendado 1GB+)
- [ ] Disco: mínimo 2GB livres
- [ ] Rede: baixa latência com banco (<5ms ideal)

---

### 🚀 Iniciando a Aplicação

#### Método 1: JAR Standalone

```bash
# Build
./mvnw clean package -DskipTests

# Executar
java -jar target/livraria-tunoda-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  -Xms256m -Xmx512m \
  -XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=75.0
```

#### Método 2: Docker (Recomendado)

```bash
# Pull da imagem
docker pull SEU_USUARIO/livraria-tunoda:latest

# Executar
docker run -d \
  --name livraria-tunoda-app \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e JDBC_DATABASE_URL="jdbc:postgresql://seu-banco:5432/livraria_db" \
  -e POSTGRES_USER="livraria_user" \
  -e POSTGRES_PASSWORD="SENHA_SEGURA" \
  -e JWT_SECRET="SUA_CHAVE_256_BITS_AQUI" \
  -e MELHOR_ENVIO_TOKEN="seu_token_producao" \
  -e MERCADO_PAGO_ACCESS_TOKEN="seu_token_producao" \
  --restart unless-stopped \
  SEU_USUARIO/livraria-tunoda:latest
```

#### Método 3: Docker Compose (Staging/Production)

```bash
# Staging (app + banco juntos)
docker-compose -f docker-compose.staging.yml up -d

# Ver logs
docker-compose -f docker-compose.staging.yml logs -f app

# Parar
docker-compose -f docker-compose.staging.yml down
```

---

### 📊 Monitoramento em Produção

#### 1. Health Check (Obrigatório)

Configure seu load balancer ou orquestrador para verificar:

```bash
# Endpoint
GET /api/v1/actuator/health

# Esperado
HTTP 200 OK
{"status":"UP"}

# Frequência recomendada
- Liveness Probe: 30s
- Readiness Probe: 10s
- Start Period: 60s (primeiro startup)
- Timeout: 5s
```

**Ação se DOWN:**
- Aguarde 3 falhas consecutivas
- Reinicie o container/aplicação
- Notifique equipe de operações
- Verifique logs antes de reiniciar

#### 2. Logs

**Localização:**
```bash
# Aplicação standalone
tail -f logs/spring.log

# Docker
docker logs -f livraria-tunoda-app --tail=100

# Docker Compose
docker-compose logs -f app
```

**O que monitorar:**
```bash
# Erros críticos
grep "ERROR" logs/spring.log

# Warnings importantes
grep "WARN" logs/spring.log | grep -E "(JWT|Database|Connection)"

# Falhas de autenticação
grep "Unauthorized" logs/spring.log

# Falhas de integração
grep -E "(Melhor Envio|Mercado Pago)" logs/spring.log | grep "ERROR"
```

**Rotação de logs (logback):**
- Arquivo máximo: 10MB
- Histórico: 30 dias
- Total máximo: 1GB

#### 3. Métricas (Actuator)

**Endpoints (requerem ROLE_ADMIN em produção):**

```bash
# Uso de memória
curl -H "Authorization: Bearer TOKEN_ADMIN" \
  http://localhost:8080/api/v1/actuator/metrics/jvm.memory.used

# Requisições HTTP
curl -H "Authorization: Bearer TOKEN_ADMIN" \
  http://localhost:8080/api/v1/actuator/metrics/http.server.requests

# Formato Prometheus (se integrado)
curl -H "Authorization: Bearer TOKEN_ADMIN" \
  http://localhost:8080/api/v1/actuator/prometheus
```

**Métricas importantes:**
- `jvm.memory.used` → Uso de memória (< 80% ideal)
- `http.server.requests` → Latência (< 500ms P95 ideal)
- `hikaricp.connections.active` → Conexões ativas com DB
- `process.uptime` → Tempo desde último restart

---

### 🔧 Operações Comuns

#### Reiniciar Aplicação

```bash
# Docker
docker restart livraria-tunoda-app

# Docker Compose
docker-compose restart app

# Standalone (systemd)
sudo systemctl restart livraria-tunoda
```

#### Ver Logs em Tempo Real

```bash
# Docker
docker logs -f livraria-tunoda-app --tail=50

# Filtrar apenas erros
docker logs livraria-tunoda-app 2>&1 | grep ERROR
```

#### Verificar Uso de Recursos

```bash
# CPU e Memória
docker stats livraria-tunoda-app

# Espaço em disco
docker exec livraria-tunoda-app df -h
```

#### Acessar Console da Aplicação

```bash
# Entrar no container
docker exec -it livraria-tunoda-app /bin/sh

# Ver variáveis de ambiente (cuidado com secrets!)
docker exec livraria-tunoda-app env | grep -v PASSWORD | grep -v SECRET
```

#### Atualizar Aplicação (Zero Downtime)

```bash
# 1. Pull nova versão
docker pull SEU_USUARIO/livraria-tunoda:latest

# 2. Parar e remover container antigo
docker stop livraria-tunoda-app
docker rm livraria-tunoda-app

# 3. Iniciar novo container
docker run -d --name livraria-tunoda-app ...

# 4. Verificar health check
curl http://localhost:8080/api/v1/actuator/health
```

---

### 🚨 Troubleshooting em Produção

#### Aplicação Não Inicia

**Sintomas:**
- Container reiniciando constantemente
- Logs mostram `APPLICATION FAILED TO START`

**Diagnóstico:**
```bash
# Ver logs completos
docker logs livraria-tunoda-app --tail=200

# Verificar variáveis de ambiente
docker inspect livraria-tunoda-app | grep -A 20 "Env"
```

**Causas comuns:**
1. Variável obrigatória faltando → Configure a variável
2. Banco de dados inacessível → Verifique conectividade
3. Migration falhou → Veja logs do Flyway
4. Porta já em uso → Mude `SERVER_PORT` ou libere a porta

---

#### Alta Latência nas Requisições

**Sintomas:**
- Requests lentas (> 1s)
- Timeouts frequentes

**Diagnóstico:**
```bash
# Ver métricas de latência
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/v1/actuator/metrics/http.server.requests

# Ver conexões com banco
docker exec -it postgres-db psql -U livraria_user -d livraria_db \
  -c "SELECT count(*) FROM pg_stat_activity WHERE datname='livraria_db';"
```

**Soluções:**
1. Aumentar pool de conexões → Configure `spring.datasource.hikari.maximum-pool-size`
2. Adicionar índices no banco → Analise queries lentas
3. Aumentar recursos (CPU/RAM)
4. Habilitar cache (se aplicável)

---

#### Out of Memory (OOM)

**Sintomas:**
- Container mata do nada
- Logs mostram `OutOfMemoryError`

**Diagnóstico:**
```bash
# Ver uso de memória
docker stats livraria-tunoda-app

# Ver heap dump (se configurado)
docker exec livraria-tunoda-app ls -lh /tmp/*.hprof
```

**Soluções:**
1. Aumentar limite de memória do container
2. Ajustar heap JVM: `-Xmx512m` → `-Xmx768m`
3. Analisar heap dump para vazamento de memória
4. Verificar queries carregando muitos dados

---

#### Integrações Falhando

**Sintomas:**
- Melhor Envio ou Mercado Pago retornando erros
- Logs mostram timeouts

**Diagnóstico:**
```bash
# Ver logs de integração
docker logs livraria-tunoda-app 2>&1 | grep -E "(Melhor Envio|Mercado Pago)"

# Testar conectividade
docker exec livraria-tunoda-app wget -O- https://api.melhorenvio.com.br
docker exec livraria-tunoda-app wget -O- https://api.mercadopago.com
```

**Soluções:**
1. Verificar token válido → Renovar se expirado
2. Verificar firewall → Liberar IPs das APIs
3. Aumentar timeout → Configure `*.timeout-seconds`
4. Verificar rate limiting → Aguardar ou solicitar aumento

---

### 📈 Otimizações de Performance

#### JVM Tuning

```bash
# Para 1GB RAM disponível
-Xms512m -Xmx768m
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:+UseStringDeduplication

# Para 2GB+ RAM
-Xms1g -Xmx1536m
-XX:+UseG1GC
-XX:G1HeapRegionSize=16m
```

#### Database Connection Pool

```yaml
spring:
  datasource:
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

#### Compressão HTTP

```yaml
server:
  compression:
    enabled: true
    min-response-size: 1024
    mime-types: application/json,application/xml,text/html,text/plain
```

---

### 📁 Estrutura de Logs Recomendada

```
/var/log/livraria-tunoda/
├── application.log          # Log geral
├── application.log.1        # Rotacionado
├── error.log               # Apenas erros
└── audit.log               # Logs de auditoria (futuro)
```

---

### 🔐 Segurança em Produção

#### Alterar Senha Admin

```bash
# 1. Fazer login com credenciais padrão
curl -X POST http://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@livraria.com","password":"admin123"}'

# 2. Usar endpoint de alteração de senha (implementar futuramente)
# Por enquanto, altere diretamente no banco:

docker exec -it postgres-db psql -U livraria_user -d livraria_db

UPDATE tb_users 
SET password_hash = '$2a$12$NOVO_HASH_BCrypt_AQUI'
WHERE email = 'admin@livraria.com';
```

**Gerar hash BCrypt:**
```bash
# Via código Java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String hash = encoder.encode("SenhaNova@123");
```

---

### 📞 Suporte e Manutenção

**Documentação Adicional:**
- [DOCKER.md](./docs/DOCKER.md) - Detalhes sobre containers
- [HEALTH_CHECK.md](./docs/HEALTH_CHECK.md) - Health checks
- [LOGGING.md](./docs/LOGGING.md) - Configuração de logs
- [ADMIN_CREDENTIALS.md](./docs/ADMIN_CREDENTIALS.md) - Credenciais admin

**Checklist de Manutenção Mensal:**
- [ ] Verificar espaço em disco
- [ ] Revisar logs de erro
- [ ] Atualizar dependências (segurança)
- [ ] Testar backup/restore
- [ ] Verificar certificados SSL (expiração)
- [ ] Revisar métricas de performance
- [ ] Atualizar documentação

---

## 📁 Estrutura de Diretórios

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/com/iraquitantunoda/livrariatunoda/
│   │   │       ├── StartupApplication.java
│   │   │       │
│   │   │       ├── domain/                    # 📦 Camada de Domínio (DDD)
│   │   │       │   ├── model/
│   │   │       │   │   ├── Author.java       # Aggregate Root - Autor
│   │   │       │   │   ├── Book.java         # Aggregate Root - Livro
│   │   │       │   │   ├── AuthorId.java     # Identidade tipada
│   │   │       │   │   ├── BookId.java       # Identidade tipada
│   │   │       │   │   └── vo/               # Value Objects
│   │   │       │   │       ├── ISBN.java     # Código ISBN
│   │   │       │   │       ├── Money.java    # Valor monetário
│   │   │       │   │       ├── Weight.java   # Peso físico
│   │   │       │   │       ├── WeightUnit.java # Unidade de peso
│   │   │       │   │       └── Status.java   # Status ACTIVE/INACTIVE
│   │   │       │   ├── repository/          # Interfaces de Repository
│   │   │       │   │   ├── AuthorRepository.java
│   │   │       │   │   └── BookRepository.java
│   │   │       │   └── exception/
│   │   │       │       ├── BusinessException.java
│   │   │       │       └── ResourceNotFoundException.java
│   │   │       │
│   │   │       ├── application/              # 🎯 Casos de Uso (a implementar)
│   │   │       │   ├── dto/                  # DTOs (Request/Response)
│   │   │       │   ├── service/              # Services/Use Cases
│   │   │       │   └── port/                 # Interfaces (repositories)
│   │   │       │
│   │   │       └── infrastructure/           # 🔌 Adaptadores
│   │   │           ├── config/               # Configurações Spring
│   │   │           │   └── StartupLogger.java
│   │   │           ├── exception/            # Exception handlers
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ErrorResponse.java
│   │   │           │   └── ValidationError.java
│   │   │           ├── persistence/          # ✅ Camada de Persistência
│   │   │           │   ├── entity/          # Entidades JPA
│   │   │           │   │   ├── AuthorEntity.java
│   │   │           │   │   └── BookEntity.java
│   │   │           │   ├── repository/      # Spring Data Repositories
│   │   │           │   │   ├── AuthorJpaRepository.java
│   │   │           │   │   └── BookJpaRepository.java
│   │   │           │   ├── mapper/          # MapStruct Mappers
│   │   │           │   │   ├── AuthorMapper.java
│   │   │           │   │   └── BookMapper.java
│   │   │           │   └── adapter/         # Adapters (implementam domínio)
│   │   │           │       ├── AuthorRepositoryAdapter.java
│   │   │           │       └── BookRepositoryAdapter.java
│   │   │           └── web/                  # (a implementar)
│   │   │               ├── controller/      # REST Controllers
│   │   │               └── mapper/          # Mappers DTO <-> Domain
│   │   │
│   │   └── resources/
│   │       ├── application.yml              # Configuração base
│   │       ├── application-dev.yml          # Perfil desenvolvimento
│   │       ├── application-prod.yml         # Perfil produção
│   │       └── db/migration/                # Scripts Flyway
│   │           └── V1__create-table-books.sql
│   │
│   └── test/                                # 🧪 Testes
│       └── java/.../livrariatunoda/
│           ├── StartupApplicationTests.java
│           ├── domain/                      # (testes do domínio)
│           ├── application/                 # (testes de casos de uso)
│           └── infrastructure/              # (testes de integração)
│
├── docker-compose.yml                       # Orquestração do PostgreSQL
├── .env                                     # Variáveis de ambiente (não versionado)
├── .env.example                             # Template de variáveis
├── pom.xml                                  # Dependências Maven
└── README.md                                # Este arquivo
```

## 🤝 Contribuindo

1. Nunca commite o arquivo `.env`
2. Siga a estrutura de camadas estabelecida
3. Mantenha o domínio livre de dependências de frameworks
4. Escreva testes para novas funcionalidades
5. Use migrations do Flyway para mudanças no banco
6. Mantenha logs sem informações sensíveis

## 📋 Convenções de Código

### Domínio (Domain)
- **Aggregate Roots:** PascalCase, nomes em inglês (ex: `Book`, `Author`)
- **Value Objects:** PascalCase, nomes em inglês (ex: `ISBN`, `Money`, `Weight`)
- **Identidades:** Sufixo `Id` (ex: `BookId`, `AuthorId`)
- **Factory Methods:** 
  - `create(...)` - Para novas entidades
  - `reconstitute(...)` - Para reconstruir entidades existentes
  - `of(...)` - Para Value Objects
- **Validações:** No construtor privado ou método `validate()`
- **Imutabilidade:** Campos `final` sempre que possível

### Infraestrutura
- **Entidades JPA:** Sufixo `Entity` (ex: `BookEntity`, `AuthorEntity`)
- **Tabelas:** Prefixo `tb_` (ex: `tb_books`, `tb_authors`)
- **Constraints:** Prefixo `uk_` (unique), `fk_` (foreign key)
- **DTOs:** Sufixo `Request` ou `Response` (ex: `CreateBookRequest`)
- **Exceptions:** Sufixo `Exception`
- **Mappers:** Sufixo `Mapper` (ex: `BookMapper`)

### Lombok
- **Value Objects:** `@Value` (imutabilidade total)
- **Entities:** `@Getter` + `@ToString` + `@EqualsAndHashCode`
- **Coleções:** Usar `@Getter(AccessLevel.NONE)` e método manual para retornar coleção imutável

### Enums e Pragmatismo DDD
- **Enums simples:** Reutilizados do domínio na infraestrutura (ex: `Status`, `WeightUnit`)
- **Abordagem pragmática:** JPA mapeia enums do domínio diretamente com `@Enumerated(EnumType.STRING)`
- **Sem duplicação:** Evitamos criar `StatusEntity` e `Status` para enums sem comportamento
- **Quando duplicar:** Apenas se domínio e persistência tiverem representações muito diferentes

## 🔐 Segurança

### Autenticação e Autorização

- ✅ JWT (JSON Web Token) para autenticação stateless
- ✅ Refresh Token com rotation para renovação segura
- ✅ BCrypt para hash de senhas (força 12)
- ✅ Spring Security com regras centralizadas
- ✅ Endpoints públicos, autenticados e administrativos separados
- ✅ Validação automática de tokens em todas as requisições protegidas

### CORS (Cross-Origin Resource Sharing)

#### Story #37: Controle de Acesso Cross-Origin ✅

**Implementação Completa:**

Configuração CORS centralizada e segura seguindo princípios de **deny by default** - apenas origens explicitamente autorizadas podem acessar a API.

**Arquitetura:**

```
CorsProperties.java (ConfigurationProperties)
    ↓ injeta valores do application.yml
CorsConfiguration.java (WebMvcConfigurer)
    ↓ aplica em runtime
Spring MVC → Valida CORS em cada requisição
```

**Características:**
- ✅ **Configuração única e centralizada** - `CorsConfiguration` implementa `WebMvcConfigurer`
- ✅ **Sem @CrossOrigin em controllers** - Toda configuração em um único lugar
- ✅ **Configurável por ambiente** - Valores diferentes para local, staging e production
- ✅ **Deny by default** - Apenas origens explicitamente configuradas são permitidas
- ✅ **Type-safe** - `@ConfigurationProperties` com validação automática
- ✅ **Fail-fast** - Aplicação não sobe se configuração obrigatória estiver ausente

**Configuração por Profile:**

| Profile | Origens Permitidas | Características |
|---------|-------------------|-----------------|
| **local** | `localhost:3000`, `3001`, `4200`, `127.0.0.1:3000` | Permissivo - múltiplas portas para desenvolvimento |
| **staging** | `https://staging.livraria-tunoda.com.br` | Restrito - apenas domínio de homologação |
| **production** | `${CORS_ALLOWED_ORIGINS}` **(obrigatório)** | Super restrito - via variável de ambiente |

**Variáveis de Ambiente:**

```bash
# OBRIGATÓRIA em produção
CORS_ALLOWED_ORIGINS=https://www.livraria-tunoda.com.br

# Opcionais (com defaults seguros)
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
CORS_ALLOWED_HEADERS=Authorization,Content-Type,Accept,Origin,X-Requested-With
CORS_EXPOSED_HEADERS=Authorization
CORS_ALLOW_CREDENTIALS=true
CORS_MAX_AGE=3600
```

**Exemplo de Configuração (application.yml):**

```yaml
app:
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
    allowed-methods: ${CORS_ALLOWED_METHODS:GET,POST,PUT,DELETE,PATCH,OPTIONS}
    allowed-headers: ${CORS_ALLOWED_HEADERS:Authorization,Content-Type,Accept}
    exposed-headers: ${CORS_EXPOSED_HEADERS:Authorization}
    allow-credentials: ${CORS_ALLOW_CREDENTIALS:true}
    max-age: ${CORS_MAX_AGE:3600}
```

**Classes Implementadas:**

1. **CorsProperties.java** - `@ConfigurationProperties("app.cors")`
   - Validação: `@NotEmpty` em propriedades obrigatórias
   - Type-safe: Tipos corretos (List<String>, Boolean, Long)
   - Sem valores default hardcoded

2. **CorsConfiguration.java** - Configuração global
   ```java
   @Configuration
   public class CorsConfiguration implements WebMvcConfigurer {
       private final CorsProperties corsProperties;
       
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/api/**")
                   .allowedOrigins(corsProperties.getAllowedOrigins())
                   .allowedMethods(corsProperties.getAllowedMethods())
                   .allowedHeaders(corsProperties.getAllowedHeaders())
                   .exposedHeaders(corsProperties.getExposedHeaders())
                   .allowCredentials(corsProperties.getAllowCredentials())
                   .maxAge(corsProperties.getMaxAge());
       }
   }
   ```

**Logs na Inicialização:**

```
INFO - Configurando CORS para origens: [http://localhost:3000, http://localhost:3001]
INFO - CORS configurado com sucesso - Metodos: [GET, POST, PUT, DELETE, PATCH, OPTIONS], Credentials: true
```

**Testes Disponíveis (Postman Collection):**

Pasta **🔒 Testes CORS** com 4 requests:
1. ✅ OPTIONS com origem permitida → Deve ter headers CORS
2. ❌ OPTIONS com origem bloqueada → NÃO deve ter headers CORS
3. ✅ GET com origem permitida → Funciona normalmente
4. ❌ GET com origem bloqueada → Navegador bloquearia

**Como Testar:**
```bash
# 1. Origem permitida (localhost:3000)
curl -X OPTIONS http://localhost:8080/api/public/books \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
# Deve retornar: Access-Control-Allow-Origin: http://localhost:3000

# 2. Origem NÃO permitida (example.com)
curl -X OPTIONS http://localhost:8080/api/public/books \
  -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
# NÃO deve retornar Access-Control-Allow-Origin
```

**Headers CORS Retornados (origem permitida):**
```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

**Segurança:**
- ✅ Política restritiva por padrão (deny by default)
- ✅ Origens explicitamente configuradas
- ✅ Métodos HTTP controlados
- ✅ Headers permitidos limitados
- ✅ Credentials apenas quando necessário
- ✅ Cache de preflight configurável (maxAge)

**Produção - Checklist:**
```bash
# 1. Definir origem de produção
export CORS_ALLOWED_ORIGINS=https://www.livraria-tunoda.com.br

# 2. Validar configuração nos logs
# Deve aparecer: "Configurando CORS para origens: [https://www.livraria-tunoda.com.br]"

# 3. Testar de origem não autorizada
curl -X OPTIONS https://api.livraria-tunoda.com.br/api/public/books \
  -H "Origin: http://malicious-site.com" \
  -v
# NÃO deve retornar Access-Control-Allow-Origin
```

### Proteção Geral

- ✅ Senhas via variáveis de ambiente
- ✅ JWT Secret gerado com OpenSSL (512 bits)
- ✅ Nenhum segredo versionado no código
- ✅ Logs sem dados sensíveis
- ✅ Health check sem detalhes em produção
- ✅ SQL injection prevenido (JPA/Hibernate)
- ✅ CORS configurado de forma restritiva por padrão
- ✅ DataIntegrityViolation tratado (409 Conflict para ISBN duplicado)

## ✨ Stories Implementadas

### 📖 Story #1: Modelo de Domínio - Livros e Autores

**Objetivo:** Representar livros e autores no domínio para permitir vendas, métricas, frete e exibição no frontend.

**Implementado:**
- ✅ Entidade `Book` criada como Aggregate Root
- ✅ Entidade `Author` criada como Aggregate Root
- ✅ `Book` possui referência a um ou mais `AuthorId`
- ✅ Atributos completos de `Book` (título, descrição, **photoUrl**, ISBN, preço, peso, status)
- ✅ Atributos completos de `Author` (nome, biografia, photoUrl, status)
- ✅ Value Objects: `ISBN`, `Money`, `Weight`, `WeightUnit`, `Status`
- ✅ Identidades tipadas: `BookId`, `AuthorId`
- ✅ Regras de consistência aplicadas nos construtores
- ✅ Entidades imutáveis (campos `final`)
- ✅ Domínio puro sem anotações JPA
- ✅ Associação via `AuthorId`, não entidade direta
- ✅ Regras de negócio centralizadas no domínio
- ✅ Lombok para redução de boilerplate

**Status:** ✅ **COMPLETA**

---

### 💾 Story #2: Persistência de Livros e Autores

**Objetivo:** Criar infraestrutura de persistência sem vazar JPA para o domínio e sem acoplamento indevido entre agregados.

**Implementado:**

#### Estrutura de Banco
- ✅ Migration `V1__create-table-books.sql` criada
- ✅ Tabela `tb_authors` (id, name, biography, photo_url, status, timestamps)
- ✅ Tabela `tb_books` (id, title, description, photo_url, isbn, price_amount, price_currency, weight_value, weight_unit, status, timestamps)
- ✅ Tabela `tb_book_authors` (relacionamento N:N)
- ✅ Chaves primárias e integridade referencial configuradas
- ✅ Índices para performance (status, relacionamentos)
- ✅ Constraint UNIQUE em ISBN

#### Persistência Implementada
- ✅ `Book` persiste com sucesso
- ✅ `Book` pode ter um ou mais autores
- ✅ `Book` pode existir sem ISBN (campo opcional)
- ✅ `Book` agora inclui **photoUrl** para imagem da capa
- ✅ `Author` persiste com sucesso
- ✅ `Author` pode existir sem livros associados
- ✅ Filtros por status (ACTIVE/INACTIVE)

#### Repositórios
- ✅ Interfaces no domínio
- ✅ Implementação JPA na infraestrutura
- ✅ Adapters implementando interfaces do domínio

#### Conversão Domain ↔ JPA
- ✅ **MapStruct** configurado para mapeamento automático
- ✅ Conversão explícita de Value Objects
- ✅ Conversão de coleções (Set<AuthorId> ↔ Set<String>)

**Status:** ✅ **COMPLETA**

---

### 🔍 Story #3: Listagem Pública de Livros

**Objetivo:** Expor listagem pública de livros ativos com paginação.

**Implementado:**
- ✅ Endpoint: `GET /api/public/books?page=0&size=10`
- ✅ Retorna apenas livros ACTIVE
- ✅ Ordenação por data de criação (mais recentes primeiro)
- ✅ Paginação funcional (page, size, totalElements)
- ✅ DTO: `BookCatalogResponse` (id, title, description, photoUrl, price, authors)
- ✅ Use Case: `ListActiveBooksUseCase`
- ✅ Consulta otimizada (sem N+1)
- ✅ MapStruct para mapeamento Domain → DTO

**Status:** ✅ **COMPLETA**

---

### 📄 Story #4: Detalhes de Livro

**Objetivo:** Endpoint público para visualizar detalhes completos de um livro.

**Implementado:**
- ✅ Endpoint: `GET /api/public/books/{bookId}`
- ✅ Retorna apenas livros ACTIVE
- ✅ Retorna 404 se livro não existir ou estiver inativo
- ✅ DTO: `BookDetailResponse` (id, title, description, photoUrl, isbn, price, authors completos)
- ✅ Use Case: `GetBookDetailUseCase`
- ✅ Autores com biografia e foto completos
- ✅ MapStruct para mapeamento Domain → DTO

**Status:** ✅ **COMPLETA**

---

### ➕ Story #5: Cadastro Administrativo

**Objetivo:** Permitir cadastro de livros e autores via endpoints administrativos.

**Implementado:**

#### Cadastro de Autor
- ✅ Endpoint: `POST /api/admin/authors`
- ✅ DTO: `CreateAuthorRequest` (name, biography, photoUrl)
- ✅ Use Case: `CreateAuthorUseCase`
- ✅ Status ACTIVE por padrão
- ✅ Validações: Bean Validation + Domínio

#### Cadastro de Livro
- ✅ Endpoint: `POST /api/admin/books`
- ✅ DTO: `CreateBookRequest` (title, description, photoUrl, isbn, price, weight, authorIds)
- ✅ Use Case: `CreateBookUseCase`
- ✅ Valida autores existentes e ativos
- ✅ Status ACTIVE por padrão
- ✅ ISBN opcional mas validado se fornecido

**Status:** ✅ **COMPLETA**

---

### ✏️ Story #6: Atualização Administrativa

**Objetivo:** Permitir atualização de livros e autores mantendo integridade do domínio.

**Implementado:**

#### Atualização de Autor
- ✅ Endpoint: `PUT /api/admin/authors/{authorId}`
- ✅ DTO: `UpdateAuthorRequest` (name, biography, photoUrl, status)
- ✅ Use Case: `UpdateAuthorUseCase`
- ✅ Usa `reconstitute()` para manter imutabilidade

#### Atualização de Livro
- ✅ Endpoint: `PUT /api/admin/books/{bookId}`
- ✅ DTO: `UpdateBookRequest` (title, description, photoUrl, isbn, price, weight, authorIds, status)
- ✅ Use Case: `UpdateBookUseCase`
- ✅ Valida autores existentes e ativos
- ✅ Usa `reconstitute()` para manter imutabilidade

**Status:** ✅ **COMPLETA**

---

### 🔄 Story #7: Ativação/Desativação

**Objetivo:** Controlar visibilidade do catálogo sem perder dados (soft delete).

**Implementado:**

#### Gestão de Status de Autor
- ✅ Endpoint: `PUT /api/admin/authors/{authorId}/status`
- ✅ DTO: `ChangeStatusRequest` (status)
- ✅ Use Case: `ChangeAuthorStatusUseCase`
- ✅ Regra: Não pode desativar se tiver livros ativos
- ✅ Usa métodos `activate()` / `deactivate()` do domínio

#### Gestão de Status de Livro
- ✅ Endpoint: `PUT /api/admin/books/{bookId}/status`
- ✅ DTO: `ChangeStatusRequest` (status)
- ✅ Use Case: `ChangeBookStatusUseCase`
- ✅ Regra: Não pode ativar sem autores ativos
- ✅ Usa métodos `activate()` / `deactivate()` do domínio

**Status:** ✅ **COMPLETA**

---

### 📊 Story #8: Métricas de Visualização

**Objetivo:** Registrar eventos de interação dos usuários com os livros.

**Implementado:**

#### Domínio de Métricas
- ✅ Pacote isolado: `domain.metric`
- ✅ Aggregate Root: `BookMetric`
- ✅ Enum: `EventType` (VIEW, CLICK)
- ✅ Repository: `BookMetricRepository`
- ✅ Identidade: `BookMetricId`

#### Persistência
- ✅ Migration: `V2__create-table-book-metrics.sql`
- ✅ Tabela: `tb_book_metrics` (id, book_id, event_type, occurred_at)
- ✅ Entity: `BookMetricEntity`
- ✅ JPA Repository: `BookMetricJpaRepository`
- ✅ Adapter: `BookMetricRepositoryAdapter`

#### Endpoints Públicos
- ✅ `POST /api/public/books/{bookId}/metrics/view` - Registrar visualização
- ✅ `POST /api/public/books/{bookId}/metrics/click` - Registrar clique
- ✅ Use Case: `RecordBookMetricUseCase`
- ✅ Fail Silently: Erros não bloqueiam navegação
- ✅ Registra apenas para livros ativos
- ✅ Sempre retorna 204 No Content

**Status:** ✅ **COMPLETA**

---

### 📈 Story #9: Consulta Administrativa de Métricas

**Objetivo:** Disponibilizar métricas agregadas de visualização e cliques via API administrativa.

**Implementado:**

#### Consulta de Métricas
- ✅ Endpoint: `GET /api/admin/books/{bookId}/metrics`
- ✅ DTO: `BookMetricsResponse` (bookId, views, clicks)
- ✅ Use Case: `GetBookMetricsUseCase`
- ✅ Métricas agregadas via COUNT
- ✅ Retorna 0 para livros sem métricas
- ✅ Retorna 404 se livro não existir

#### Regras de Negócio
- ✅ Livro inativo pode ter métricas consultadas
- ✅ Apenas livros existentes podem ser consultados
- ✅ Não retorna eventos individuais (apenas agregação)
- ✅ Implementação read-only (sem alteração de métricas)

#### Infraestrutura
- ✅ Query agregada no `BookMetricJpaRepository`
- ✅ Método `countByBookIdGroupedByEventType` no repositório de domínio
- ✅ Implementação eficiente com `COUNT` e filtro por `event_type`
- ✅ Integração com `AdminBookController`

#### Extensão: Top Livros por Métricas
- ✅ Endpoints públicos para top livros
- ✅ DTO: `TopBookMetricDTO` e `TopBooksResponse`
- ✅ Use Cases: `GetTopViewedBooksUseCase` e `GetTopClickedBooksUseCase`
- ✅ Query agregada com GROUP BY e ORDER BY
- ✅ Retorna apenas livros ativos
- ✅ Limite configurável (padrão: 10)
- ✅ Timestamp de geração do ranking

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #10: Modelo de Domínio - Carrinho de Compras

**Objetivo:** Criar modelo de domínio sólido para o carrinho de compras com regras claras de consistência.

**Implementado:**

#### Estrutura do Carrinho
- ✅ Entidade `Cart` criada como Aggregate Root
- ✅ Value Object `CartItem` criado
- ✅ Identidades tipadas: `CartId`, `CartItemId`
- ✅ Enum `CartStatus` (ACTIVE, EXPIRED, CONVERTED)
- ✅ Lista de itens no carrinho
- ✅ Data de criação e atualização

#### Status do Carrinho
- ✅ Carrinho inicia sempre com status ACTIVE
- ✅ Status: ACTIVE (em uso), EXPIRED (expirado), CONVERTED (pedido criado)
- ✅ Validação de status antes de modificações

#### Regras de Negócio
- ✅ Carrinho não pode ser alterado se EXPIRED ou CONVERTED
- ✅ Carrinho pode existir vazio
- ✅ Carrinho vazio não é válido para conversão
- ✅ Preço e título congelados no CartItem
- ✅ Quantidade mínima de 1 por item

#### Comportamento do Agregado
- ✅ `addItem()` - Adiciona ou incrementa quantidade
- ✅ `updateItem()` - Atualiza quantidade
- ✅ `removeItem()` - Remove item completamente
- ✅ `calculateSubtotal()` - Calcula subtotal
- ✅ `calculateTotal()` - Calcula total
- ✅ `isValid()` - Valida estado
- ✅ Métodos protegidos por validação de status

#### Características
- ✅ Domínio sem anotações JPA
- ✅ Nenhuma dependência de infraestrutura
- ✅ Regras centralizadas no domínio
- ✅ Value Objects (Money, CartItem)
- ✅ Testes unitários completos

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #11: Persistência de Carrinho

**Objetivo:** Criar infraestrutura de persistência para carrinho sem vazar JPA para o domínio.

**Implementado:**

#### Estrutura de Banco
- ✅ Migration `V3__create-table-carts.sql` criada
- ✅ Tabela `tb_carts` (id, status, created_at, updated_at)
- ✅ Tabela `tb_cart_items` (id, cart_id, book_id, book_title, quantity, unit_price_amount, unit_price_currency)
- ✅ Relacionamento com CASCADE DELETE
- ✅ Índice em `cart_id`

#### Persistência Implementada
- ✅ `Cart` persiste com sucesso
- ✅ `CartItem` persiste com relação bidirecional
- ✅ Carrinho pode ser criado vazio
- ✅ Items são salvos junto com o carrinho

#### Repositórios
- ✅ Interface `CartRepository` no domínio
- ✅ Implementação JPA na infraestrutura
- ✅ Adapter: `CartRepositoryAdapter`

#### Conversão Domain ↔ JPA
- ✅ **MapStruct** configurado para mapeamento
- ✅ `CartMapper` com métodos para conversão
- ✅ Conversão de CartItem com Money
- ✅ Método `toEntityWithItems()` para relação bidirecional

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #12: Adicionar Item ao Carrinho

**Objetivo:** Permitir adicionar livros ao carrinho com preço congelado e soma automática de quantidade.

**Implementado:**

#### Endpoint
- ✅ `POST /api/carts/{cartId}/items`
- ✅ Request: `AddItemToCartRequest` (bookId, quantity)
- ✅ Response: `CartResponse` completo com items, subtotal e total

#### Comportamento
- ✅ Livro adicionado ao carrinho
- ✅ Quantidade respeitada
- ✅ Se livro já existe: quantidade é somada
- ✅ Carrinho atualizado e persistido

#### Regras de Negócio
- ✅ Carrinho deve existir
- ✅ Carrinho deve estar ACTIVE
- ✅ Livro deve existir e estar ACTIVE
- ✅ Quantidade mínima de 1
- ✅ Preço capturado e congelado no momento da adição
- ✅ Total recalculado automaticamente

#### Use Case
- ✅ `AddItemToCartUseCase` criado
- ✅ Validações de carrinho e livro
- ✅ Criação de `CartItem` com preço congelado
- ✅ Domínio gerencia soma de quantidade

#### DTOs
- ✅ `CartResponse` atualizado (items, subtotal, currency, total)
- ✅ `CartItemDTO` criado (itemId, bookId, bookTitle, quantity, unitPrice, subtotal)
- ✅ `CartDTOMapper` usando MapStruct

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #13: Atualizar/Remover Itens do Carrinho

**Objetivo:** Permitir edição de itens do carrinho garantindo consistência de valores.

**Implementado:**

#### Atualizar Quantidade
- ✅ Endpoint: `PUT /api/carts/{cartId}/items/{bookId}`
- ✅ Request: `UpdateCartItemRequest` (quantity)
- ✅ Use Case: `UpdateCartItemUseCase`
- ✅ Quantidade validada (> 0)

#### Remover Item
- ✅ Endpoint: `DELETE /api/carts/{cartId}/items/{bookId}`
- ✅ Use Case: `RemoveCartItemUseCase`
- ✅ Remoção completa do item

#### Regras de Negócio
- ✅ Carrinho deve existir e estar ACTIVE
- ✅ Item deve existir no carrinho
- ✅ Quantidade deve ser inteira positiva
- ✅ Quantidade zero não é permitida (usar DELETE)
- ✅ Total recalculado após operação

#### Decisões Arquiteturais
- ✅ DELETE semântico para remoção
- ✅ PUT para atualização completa
- ✅ Validações no domínio
- ✅ Total sempre derivado dos items

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #14: Visualizar Carrinho

**Objetivo:** Permitir consulta do estado completo do carrinho.

**Implementado:**

#### Endpoint
- ✅ `GET /api/carts/{cartId}`
- ✅ Response: `CartResponse` completo
- ✅ Use Case: `GetCartUseCase`

#### Comportamento
- ✅ Retorna dados completos do carrinho
- ✅ Não altera estado (read-only)
- ✅ Carrinho pode ser visualizado vazio
- ✅ Pode ser visualizado em qualquer status

#### Dados Retornados
- ✅ cartId, status, createdAt, updatedAt
- ✅ Lista de items com: itemId, bookId, bookTitle, quantity, unitPrice, currency, subtotal
- ✅ Subtotal do carrinho
- ✅ Currency
- ✅ Total do carrinho

#### Regras de Negócio
- ✅ Carrinho deve existir
- ✅ Visualização não altera dados
- ✅ Valores calculados pelo domínio
- ✅ `@Transactional(readOnly = true)`

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #15: Calcular Total do Carrinho

**Objetivo:** Centralizar no domínio todas as regras de cálculo do carrinho.

**Análise:** Esta story já estava 100% implementada nas stories anteriores.

**Implementado:**

#### Cálculo no Domínio
- ✅ `Cart.calculateSubtotal()` - Soma subtotais dos itens
- ✅ `Cart.calculateTotal()` - Total (igual ao subtotal, preparado para descontos)
- ✅ `CartItem.getSubtotal()` - Calcula unitPrice × quantity
- ✅ Nenhum cálculo em controller ou use case

#### Características
- ✅ Total derivado sempre dos items
- ✅ Valores nunca persistidos (sempre calculados)
- ✅ Money encapsula precisão e operações
- ✅ Carrinho vazio retorna zero
- ✅ Validações de quantidade garantem consistência

#### Testes
- ✅ Carrinho vazio (total = 0)
- ✅ Carrinho com um item
- ✅ Carrinho com múltiplos itens
- ✅ Cálculo de subtotal por item

**Status:** ✅ **COMPLETA**

---

### 🛒 Story #16: Validar Carrinho para Checkout

**Objetivo:** Centralizar validações para garantir carrinho pronto para conversão em pedido.

**Implementado:**

#### Endpoint
- ✅ `POST /api/carts/{cartId}/validate`
- ✅ Response: `ValidateCartResponse` (cartId, valid, message)
- ✅ Use Case: `ValidateCartUseCase`

#### Método no Domínio
- ✅ `Cart.validateForCheckout(Set<BookId> activeBookIds)`
- ✅ Validação explícita e centralizada
- ✅ Sem alteração de estado

#### Regras Validadas
- ✅ Carrinho deve existir
- ✅ Carrinho deve estar ACTIVE
- ✅ Carrinho deve ter ao menos 1 item
- ✅ Todos os items devem ser válidos
- ✅ Todos os livros devem estar ativos
- ✅ Total do carrinho deve ser maior que zero

#### Comportamento
- ✅ Validação não altera carrinho
- ✅ Erros de negócio claros e semânticos
- ✅ Preparado para checkout, frete e pagamento
- ✅ Use case busca livros via `BookRepository`

#### Testes
- ✅ Carrinho válido (sucesso)
- ✅ Carrinho inativo (erro)
- ✅ Carrinho vazio (erro)
- ✅ Carrinho com livro inativo (erro)

**Status:** ✅ **COMPLETA**

---

### 📦 Story #17: Modelar Pedido (Order)

**Objetivo:** Criar modelo de domínio sólido para pedidos, representando uma compra de forma consistente e imutável.

**Implementado:**

#### Aggregate Root e Value Objects
- ✅ `Order` criado como Aggregate Root
- ✅ `OrderItem` criado como Value Object (imutável)
- ✅ Identidades tipadas: `OrderId`, `OrderItemId`
- ✅ Enum `OrderStatus` (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

#### Estrutura do Order
- ✅ Atributos: id, cartId, items, subtotal, total, createdAt, status
- ✅ Items completamente imutáveis (campos final)
- ✅ Snapshot de valores (subtotal e total congelados)
- ✅ Rastreabilidade via cartId

#### Factory Method
- ✅ `Order.createFromCart(Cart)` - Cria pedido a partir do carrinho
- ✅ Copia items de CartItem para OrderItem
- ✅ Status inicial: PENDING
- ✅ Validações: carrinho ativo, não vazio

#### Métodos de Transição de Status
- ✅ `confirm()` - PENDING → CONFIRMED
- ✅ `startProcessing()` - CONFIRMED → PROCESSING
- ✅ `ship()` - PROCESSING → SHIPPED
- ✅ `deliver()` - SHIPPED → DELIVERED
- ✅ `cancel()` - Qualquer (exceto DELIVERED) → CANCELLED

#### Regras de Negócio
- ✅ Pedido nasce apenas de carrinho válido
- ✅ Pedido não pode ser alterado após criação (apenas status)
- ✅ Sem métodos addItem/removeItem/updateItem
- ✅ Total sempre derivado dos items

#### Características
- ✅ Domínio puro (sem JPA)
- ✅ Imutabilidade garantida (List.copyOf)
- ✅ Validações no construtor
- ✅ Testes unitários completos (16 testes)

**Status:** ✅ **COMPLETA**

---

### 💾 Story #18: Persistir Pedidos

**Objetivo:** Criar infraestrutura de persistência para pedidos sem vazar JPA para o domínio.

**Implementado:**

#### Estrutura de Banco
- ✅ Migration `V4__create-table-orders.sql` criada
- ✅ Tabela `tb_orders` (id, cart_id, status, subtotal, total, created_at)
- ✅ Tabela `tb_order_items` (id, order_id, book_id, book_title, quantity, unit_price)
- ✅ Relacionamento com CASCADE DELETE
- ✅ Índices: cart_id, status, created_at, order_id

#### Entities JPA
- ✅ `OrderEntity` - Entidade JPA do pedido
- ✅ `OrderItemEntity` - Entidade JPA do item
- ✅ Relacionamento OneToMany/ManyToOne bidirecional
- ✅ Cascade ALL e Orphan Removal

#### Repositório
- ✅ `OrderJpaRepository` - Spring Data JPA
- ✅ `OrderMapper` - MapStruct (Domain ↔ Entity)
- ✅ `OrderRepositoryAdapter` - Implementação do domínio

#### Conversão
- ✅ Domain → Entity (toEntityWithItems)
- ✅ Entity → Domain (toDomain)
- ✅ Conversão de Money, IDs, Status
- ✅ Items gerenciados pelo cascade

#### Integração
- ✅ `ConvertCartToOrderUseCase` funcional
- ✅ Persistência transacional
- ✅ Rollback automático em caso de erro

**Status:** ✅ **COMPLETA**

---

### 🔍 Story #19: Consultar Pedido

**Objetivo:** Permitir consulta de pedido pelo identificador para visualizar resumo e status da compra.

**Implementado:**

#### Endpoint
- ✅ `GET /api/orders/{orderId}`
- ✅ Retorna: id, status, items, subtotal, total, data de criação
- ✅ Controller: `OrderController`
- ✅ Use Case: `GetOrderUseCase`

#### Comportamento
- ✅ Consulta por ID
- ✅ Pedido inexistente retorna 404
- ✅ Todos os status podem ser consultados (incluindo CANCELLED)
- ✅ Read-only transaction

#### DTOs
- ✅ `OrderResponse` reutilizado
- ✅ `OrderItemDTO` com todos os dados
- ✅ Nenhuma entidade de domínio exposta
- ✅ Conversão via OrderDTOMapper

#### Regras de Negócio
- ✅ Sem validação de status (permite consultar histórico)
- ✅ ResourceNotFoundException para pedido inexistente
- ✅ Padrão consistente com GetCartUseCase

**Status:** ✅ **COMPLETA**

---

### 🔄 Story #20: Alterar Status do Pedido

**Objetivo:** Implementar métodos explícitos para controle de transições de status do pedido, refletindo eventos do ciclo de compra.

**Implementado:**

#### Métodos de Transição
- ✅ `confirm()` - PENDING → CONFIRMED (marcar como pago)
- ✅ `expire()` - PENDING → EXPIRED (expiração antes do pagamento)
- ✅ `cancel()` - Qualquer → CANCELLED (exceto DELIVERED)
- ✅ `startProcessing()` - CONFIRMED → PROCESSING
- ✅ `ship()` - PROCESSING → SHIPPED
- ✅ `deliver()` - SHIPPED → DELIVERED

#### OrderStatus Atualizado
- ✅ Status `EXPIRED` adicionado ao enum
- ✅ Total de 7 estados: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, EXPIRED

#### Regras de Negócio Implementadas
- ✅ Pedido cancelado não pode ser confirmado
- ✅ Pedido expirado não pode ser confirmado
- ✅ Expiração só ocorre antes do pagamento (apenas PENDING)
- ✅ Transições inválidas geram BusinessException
- ✅ Todas as regras encapsuladas no domínio
- ✅ Nenhuma lógica de status no controller

#### Validações de Transições
- ✅ Cada método valida status atual antes da transição
- ✅ Estados terminais: DELIVERED, CANCELLED, EXPIRED
- ✅ Mensagens de erro claras e específicas

#### Testes
- ✅ 4 novos testes adicionados
- ✅ Teste de expiração de pedido pendente
- ✅ Teste de validação: não expirar pedido confirmado
- ✅ Teste de validação: não confirmar pedido cancelado
- ✅ Teste de validação: não confirmar pedido expirado
- ✅ Total: 20 testes no OrderTest

**Status:** ✅ **COMPLETA**

---

### 💳 Story #21: Associar Referência de Pagamento

**Objetivo:** Preparar o pedido para rastreabilidade com gateway de pagamento através de referência externa.

**Implementado:**

#### Campo no Domínio
- ✅ `paymentReference: String` adicionado ao Order (nullable)
- ✅ Método `associatePaymentReference(String)` implementado
- ✅ Referência não pode ser alterada após associada (imutável)

#### Regras de Negócio
- ✅ Associação ocorre apenas uma vez
- ✅ Referência não pode ser nula ou vazia
- ✅ Tentativa de associar segunda vez lança BusinessException
- ✅ Pedido não pode ser confirmado sem referência de pagamento

#### Validações
- ✅ Validação em `confirm()`: exige `paymentReference` válida
- ✅ Impossível confirmar pedido sem referência
- ✅ Garante rastreabilidade obrigatória

#### Persistência
- ✅ Migration V5: `ALTER TABLE tb_orders ADD COLUMN payment_reference VARCHAR(100)`
- ✅ OrderEntity atualizada com campo
- ✅ OrderMapper atualizado (Domain ↔ Entity)

#### Preparado para Uso Futuro
- ✅ Sem integração com Mercado Pago nesta story
- ✅ Campo genérico: suporta qualquer gateway (Mercado Pago, PayPal, Stripe, etc.)
- ✅ VARCHAR(100): suporta IDs longos de diversos gateways

#### Testes
- ✅ 7 novos testes adicionados
- ✅ Teste de associação válida
- ✅ Teste de validação: referência nula
- ✅ Teste de validação: referência vazia
- ✅ Teste de validação: associação múltipla (imutabilidade)
- ✅ Teste de confirmação com referência
- ✅ Teste de validação: confirmar sem referência
- ✅ Total: 27 testes no OrderTest

**Status:** ✅ **COMPLETA**

---

### 🌐 Story #22: Disponibilizar Endpoints de Pedido

**Objetivo:** Expor API REST para criação e consulta de pedidos, permitindo integração com frontend.

**Implementado:**

#### Endpoints Disponíveis
- ✅ `POST /api/carts/{cartId}/checkout` - Criar pedido (conversão)
- ✅ `GET /api/orders/{orderId}` - Consultar pedido

#### Controllers
- ✅ `CartController` - Endpoint de checkout (atualizado)
- ✅ `OrderController` - Endpoints de pedido
- ✅ Controllers finos: apenas delegam para Use Cases

#### Use Cases
- ✅ `ConvertCartToOrderUseCase` - Lógica de conversão
  - Valida carrinho existe
  - Valida carrinho não convertido
  - Valida livros ativos
  - Valida carrinho para checkout
  - Cria Order a partir do Cart
  - Marca carrinho como convertido
  - Persiste atomicamente (transacional)
- ✅ `GetOrderUseCase` - Lógica de consulta
  - Valida pedido existe
  - Converte para DTO
  - Read-only transaction

#### Validações de Entrada
- ✅ Validação de carrinho válido (status, items, livros ativos)
- ✅ Validação de carrinho não convertido
- ✅ Validação de pedido existente
- ✅ Tratamento de erro padronizado (GlobalExceptionHandler)

#### Tratamento de Erros
- ✅ ResourceNotFoundException → 404 Not Found
- ✅ BusinessException → 422 Unprocessable Entity
- ✅ MethodArgumentNotValidException → 400 Bad Request
- ✅ Exception genérica → 500 Internal Server Error

#### Definição de Pronto do Epic Pedido
- ✅ Pedido criado somente a partir de carrinho válido
- ✅ Domínio consistente e testado (35 testes: 27 Order + 8 OrderItem)
- ✅ API funcional e documentada
- ✅ Nenhuma dependência de frete ou pagamento
- ✅ Base pronta para próximos épicos

**Status:** ✅ **COMPLETA**

---

### 📦 Story #23: Modelar Cotação de Frete (ShippingQuote)

**Objetivo:** Representar uma cotação de frete no domínio para permitir cálculo, persistência, auditoria e seleção.

**Implementado:**

#### Aggregate Root ShippingQuote
- ✅ `ShippingQuoteId` - Identidade tipada
- ✅ Associação obrigatória com `CartId`
- ✅ Status controlado: CREATED, SELECTED, EXPIRED
- ✅ Data de criação e expiração (24h)
- ✅ Lista de itens (ShippingItem)
- ✅ Lista de opções (ShippingOption)
- ✅ Seleção de opção de frete

#### Regras de Negócio
- ✅ Uma cotação pertence a um único carrinho
- ✅ Cotação inicia com status CREATED
- ✅ Cotação expirada não pode ser reutilizada
- ✅ Cotação selecionada não pode ser alterada
- ✅ Apenas opções existentes podem ser selecionadas

#### Testes
- ✅ 14 testes unitários no ShippingQuoteTest
- ✅ Cobertura completa de cenários

**Status:** ✅ **COMPLETA**

---

### 📋 Story #24: Congelar Dados dos Itens (ShippingItem)

**Objetivo:** Garantir consistência dos dados de frete mesmo que o catálogo mude posteriormente.

**Implementado:**

#### Value Object ShippingItem
- ✅ Contém: bookId, bookTitle, quantity, weight, unitPrice
- ✅ Peso e preço congelados no momento da cotação
- ✅ Não consulta catálogo após criação
- ✅ Completamente imutável

#### Regras de Negócio
- ✅ Quantidade mínima: 1
- ✅ Peso e preço obrigatórios
- ✅ Item não possui identidade própria fora da cotação
- ✅ Reuso de Weight e Money

#### Testes
- ✅ 7 testes unitários no ShippingItemTest
- ✅ Validações completas

**Status:** ✅ **COMPLETA**

---

### 🚚 Story #25: Representar Opções de Frete (ShippingOption)

**Objetivo:** Representar opções de frete retornadas pelo Melhor Envio para escolha explícita.

**Implementado:**

#### Value Object ShippingOption
- ✅ Contém: transportadora, serviceCode, serviceName, price, deliveryDays, externalReference
- ✅ Opções associadas à cotação
- ✅ Somente leitura após cálculo

#### Regras de Negócio
- ✅ Uma cotação pode ter múltiplas opções
- ✅ Opções são imutáveis
- ✅ Apenas opções existentes podem ser selecionadas
- ✅ Moeda obrigatória (via Money)

#### Observações Técnicas
- ✅ Normaliza dados do Melhor Envio
- ✅ Domínio não conhece formato externo
- ✅ ExternalReference para rastreabilidade

#### Testes
- ✅ 7 testes unitários no ShippingOptionTest

**Status:** ✅ **COMPLETA**

---

### 💾 Story #26: Persistir Cotações de Frete

**Objetivo:** Permitir rastreabilidade, auditoria e recuperação posterior de cotações.

**Implementado:**

#### Tabelas Criadas
- ✅ `tb_shipping_quotes` - Cotações
- ✅ `tb_shipping_items` - Itens da cotação
- ✅ `tb_shipping_options` - Opções de frete

#### Relacionamentos
- ✅ ShippingQuote 1→N ShippingItem (OneToMany)
- ✅ ShippingQuote 1→N ShippingOption (OneToMany)
- ✅ Cascade DELETE configurado
- ✅ Índices em cart_id e status

#### Persistência
- ✅ Migration V6 criada
- ✅ Entities JPA completas
- ✅ ShippingQuoteJpaRepository com findByCartId
- ✅ ShippingQuoteMapper (MapStruct)
- ✅ ShippingQuoteRepository (interface domínio)
- ✅ ShippingQuoteRepositoryAdapter

**Status:** ✅ **COMPLETA**

---

### 📝 Story #27: Armazenar Payload Bruto do Melhor Envio

**Objetivo:** Permitir auditoria, debug e rastreabilidade de cálculos com payload original da API.

**Implementado:**

#### Tabela tb_shipping_payloads
- ✅ Payload salvo em formato JSON
- ✅ Associação com ShippingQuote
- ✅ Provider identificado (MELHOR_ENVIO)
- ✅ Timestamp de criação

#### Model ShippingPayload
- ✅ ShippingProvider enum (MELHOR_ENVIO)
- ✅ Armazena JSON bruto da resposta
- ✅ Persistência independente das opções normalizadas

#### Observações Técnicas
- ✅ Payload não é usado no domínio
- ✅ Uso exclusivo para auditoria
- ✅ Migration V7 criada
- ✅ ShippingPayloadRepository implementado

**Status:** ✅ **COMPLETA**

---

### 🚚 Story #30: Consultar Cotação de Frete

**Objetivo**: Permitir que o cliente visualize as opções de frete calculadas antes de selecionar uma.

#### Critérios de Aceite
- ✅ Endpoint de consulta disponível
- ✅ Retorna apenas cotações com status CALCULATED
- ✅ Lista completa de opções com preço e prazo
- ✅ Validação de cotação expirada
- ✅ DTO desacoplado do domínio

#### Use Case GetShippingQuoteUseCase
- ✅ Busca cotação por ID
- ✅ Valida se status é CALCULATED
- ✅ Valida se não está expirada
- ✅ Operação read-only (`@Transactional(readOnly = true)`)

#### Endpoint
```http
GET /api/shipping/quotes/{quoteId}
```

#### Response
```json
{
  "id": "uuid",
  "cartId": "uuid",
  "toPostalCode": "05508-900",
  "status": "CALCULATED",
  "createdAt": "2026-01-13T00:21:10",
  "expiresAt": "2026-01-14T00:21:10",
  "items": [...],
  "options": [
    {
      "carrier": "Correios",
      "serviceCode": "PAC",
      "serviceName": "PAC",
      "price": 21.82,
      "currency": "BRL",
      "deliveryDays": 6,
      "externalReference": "1"
    }
  ],
  "selectedServiceCode": null
}
```

#### Regras de Negócio
- ✅ Apenas cotações calculadas podem ser consultadas
- ✅ Cotação expirada retorna erro
- ✅ Cotação não encontrada retorna 404

#### Testes
- ✅ 4 testes unitários no GetShippingQuoteUseCaseTest
- ✅ Cenários de sucesso e erro cobertos

**Status:** ✅ **COMPLETA**

---

### 🚚 Story #31: Selecionar Opção de Frete

**Objetivo**: Permitir que o cliente escolha uma das opções de frete disponíveis para prosseguir com o pedido.

#### Critérios de Aceite
- ✅ Endpoint para seleção criado
- ✅ Valida se opção existe
- ✅ Status alterado para SELECTED
- ✅ Bloqueia alterações futuras
- ✅ Persistência imediata

#### Use Case SelectShippingOptionUseCase
- ✅ Busca cotação por ID
- ✅ Delega validação para o domínio
- ✅ Persiste alteração com `@Transactional`
- ✅ Retorna cotação atualizada

#### Endpoint
```http
PUT /api/shipping/quotes/{quoteId}/select
Content-Type: application/json

{
  "serviceCode": "PAC"
}
```

#### Response
```json
{
  "id": "uuid",
  "cartId": "uuid",
  "toPostalCode": "05508-900",
  "status": "SELECTED",
  "createdAt": "2026-01-13T00:21:10",
  "expiresAt": "2026-01-14T00:21:10",
  "items": [...],
  "options": [...],
  "selectedServiceCode": "PAC"
}
```

#### Regras de Negócio (implementadas no domínio)
- ✅ Cotação deve estar calculada (CALCULATED)
- ✅ Cotação não pode estar expirada
- ✅ Opção deve existir nas opções disponíveis
- ✅ Cotação já selecionada não pode ser alterada
- ✅ Status muda para SELECTED automaticamente
- ✅ selectedServiceCode é armazenado

#### Como Descobrir ServiceCodes Disponíveis
```bash
# 1. Calcular frete
POST /api/shipping/quotes/{quoteId}/calculate

# 2. Consultar opções disponíveis
GET /api/shipping/quotes/{quoteId}

# Resposta mostra os serviceCodes:
# "options": [
#   {"serviceCode": "PAC", ...},
#   {"serviceCode": "SEDEX", ...}
# ]

# 3. Selecionar um dos códigos acima
PUT /api/shipping/quotes/{quoteId}/select
Body: {"serviceCode": "PAC"}
```

#### Testes
- ✅ 6 testes unitários no SelectShippingOptionUseCaseTest
- ✅ Cenários de sucesso e erro cobertos
- ✅ Validações de negócio testadas

**Status:** ✅ **COMPLETA**

---

### 🚚 Story #32: Expirar Cotações Automaticamente

**Objetivo**: Garantir que cotações de frete não sejam usadas após o prazo de validade.

#### Critérios de Aceite
- ✅ Campo expiresAt definido
- ✅ Validação de expiração no domínio
- ✅ Cotação expirada não pode ser usada
- ✅ Sem job automático nesta fase
- ✅ Validação feita no uso
- ✅ Preparado para scheduler futuro

#### Campo expiresAt
- ✅ Tipo: `LocalDateTime`
- ✅ Definido automaticamente: `now.plusHours(24)` (24 horas)
- ✅ Persistido no banco (migration V6)
- ✅ Retornado no DTO `ShippingQuoteResponse`

#### Validação no Domínio
```java
public boolean isExpired() {
    return status == ShippingQuoteStatus.EXPIRED 
        || LocalDateTime.now().isAfter(expiresAt);
}

public void expire() {
    if (status == ShippingQuoteStatus.SELECTED) {
        throw new BusinessException("Cotação selecionada não pode ser expirada");
    }
    this.status = ShippingQuoteStatus.EXPIRED;
}
```

#### Validações em Uso
- ✅ **CalculateShippingUseCase**: Marca como expirada antes de lançar erro
- ✅ **GetShippingQuoteUseCase**: Impede consulta de cotação expirada
- ✅ **SelectShippingOptionUseCase**: Impede seleção em cotação expirada

#### Regras de Negócio
- ✅ Cotação criada expira em 24 horas
- ✅ Cotação com status EXPIRED não pode ser usada
- ✅ Cotação além do expiresAt é considerada expirada
- ✅ Cotação SELECTED não pode ser marcada como expirada
- ✅ Validação automática em todas as operações

#### Testes
- ✅ 4 testes no ShippingQuoteTest
- ✅ 2 testes no CalculateShippingUseCaseTest
- ✅ 1 teste no GetShippingQuoteUseCaseTest
- ✅ 1 teste no SelectShippingOptionUseCaseTest

#### Preparado para Scheduler Futuro
```java
// Exemplo para implementação futura (não obrigatório agora)
@Scheduled(cron = "0 0 * * * *")
public void expireOldQuotes() {
    var oldQuotes = shippingQuoteRepository.findExpiredQuotes();
    oldQuotes.forEach(quote -> {
        if (!quote.isSelected()) {
            quote.expire();
            shippingQuoteRepository.save(quote);
        }
    });
}
```

**Status:** ✅ **COMPLETA**

---

### 🚚 Story #33: Validar Cotação para Pedido

**Objetivo**: Garantir que apenas cotações válidas e consistentes sejam usadas na criação de pedidos.

#### Critérios de Aceite
- ✅ Método validateForOrder() no domínio
- ✅ Verifica status SELECTED
- ✅ Verifica se não está expirada
- ✅ Verifica valores válidos (items, options, selectedOption)
- ✅ Erros de negócio claros
- ✅ Nenhuma dependência direta com Order
- ✅ Usado futuramente pelo Epic de Pedido

#### Método validateForOrder()
```java
/**
 * Valida se a cotação está apta para ser usada em um pedido.
 * Será usado futuramente no Epic de Pedido para garantir consistência no checkout.
 */
public void validateForOrder() {
    if (!isSelected()) {
        throw new BusinessException(
            "Cotação deve ter uma opção de frete selecionada para criar pedido"
        );
    }

    if (isExpired()) {
        throw new BusinessException(
            "Cotação expirada não pode ser usada para criar pedido"
        );
    }

    if (selectedServiceCode == null) {
        throw new BusinessException(
            "Código do serviço selecionado é obrigatório"
        );
    }

    var selectedOption = getSelectedOption();
    if (selectedOption == null) {
        throw new BusinessException(
            "Opção de frete selecionada não encontrada"
        );
    }

    if (items.isEmpty()) {
        throw new BusinessException(
            "Cotação sem itens não pode ser usada para pedido"
        );
    }

    if (options.isEmpty()) {
        throw new BusinessException(
            "Cotação sem opções de frete não pode ser usada para pedido"
        );
    }
}
```

#### Validações Realizadas
1. ✅ **Status SELECTED**: Cotação deve ter opção escolhida
2. ✅ **Não expirada**: Valida tempo e status
3. ✅ **ServiceCode presente**: Campo selectedServiceCode não pode ser nulo
4. ✅ **Opção válida**: Opção selecionada deve existir nas options
5. ✅ **Items válidos**: Lista de items não pode estar vazia
6. ✅ **Options válidas**: Lista de options não pode estar vazia

#### Uso Futuro no Epic de Pedido
```java
// Exemplo de uso futuro (não implementado ainda)
public Order createOrderWithShipping(CartId cartId, ShippingQuoteId quoteId) {
    var cart = cartRepository.findById(cartId);
    var shippingQuote = shippingQuoteRepository.findById(quoteId);
    
    // Validações
    cart.validateForCheckout(...);
    shippingQuote.validateForOrder(); // ← USO DO MÉTODO
    
    // Cria pedido com frete
    return Order.createWithShipping(cart, shippingQuote);
}
```

#### Testes
- ✅ 4 testes unitários no ShippingQuoteTest
- ✅ Valida cotação selecionada com sucesso
- ✅ Valida erro quando não selecionada
- ✅ Valida erro quando expirada
- ✅ Valida erro quando opção inválida

#### Benefícios
- ✅ **Validação centralizada**: Todas as regras em um método
- ✅ **Erros claros**: Mensagens específicas para cada caso
- ✅ **Desacoplamento**: Não depende de Order
- ✅ **Reutilizável**: Pode ser usado em qualquer contexto
- ✅ **Testável**: Fácil de testar isoladamente

**Status:** ✅ **COMPLETA**

---

## 📊 Endpoints da API

### Públicos (Catálogo)

```
GET    /api/public/books                    → Listar livros (paginado)
GET    /api/public/books/{id}               → Detalhes do livro
GET    /api/public/books/most-viewed        → Top livros mais visualizados
GET    /api/public/books/most-clicked       → Top livros mais clicados
POST   /api/public/books/{id}/metrics/view  → Registrar visualização
POST   /api/public/books/{id}/metrics/click → Registrar clique
```

### Carrinho de Compras

```
POST   /api/carts                           → Criar carrinho
GET    /api/carts/{id}                      → Visualizar carrinho
POST   /api/carts/{id}/validate             → Validar carrinho para checkout
POST   /api/carts/{id}/items                → Adicionar item
PUT    /api/carts/{id}/items/{bookId}       → Atualizar quantidade
DELETE /api/carts/{id}/items/{bookId}       → Remover item
```

### Checkout

```
POST   /api/carts/checkout                  → Checkout com ou sem frete (novo)
POST   /api/carts/{id}/checkout             → Checkout legacy (deprecated)
```

### Pedidos

```
GET    /api/orders/{id}                     → Consultar pedido
POST   /api/orders/{id}/payments            → Criar pagamento
```

### Pagamentos

```
POST   /api/payments/{id}/process           → Processar pagamento
GET    /api/payments/{id}                   → Consultar status do pagamento
POST   /api/webhooks/mercadopago            → Webhook Mercado Pago
```

### Frete (Melhor Envio)

```
POST   /api/shipping/quotes                      → Criar cotação de frete
POST   /api/shipping/quotes/{id}/calculate       → Calcular frete via Melhor Envio
GET    /api/shipping/quotes/{id}                 → Consultar cotação
PUT    /api/shipping/quotes/{id}/select          → Selecionar opção de frete
```

### Administrativos

```
POST   /api/admin/authors              → Criar autor
PUT    /api/admin/authors/{id}         → Atualizar autor
PUT    /api/admin/authors/{id}/status  → Ativar/Desativar autor

POST   /api/admin/books                → Criar livro
PUT    /api/admin/books/{id}           → Atualizar livro
PUT    /api/admin/books/{id}/status    → Ativar/Desativar livro
GET    /api/admin/books/{id}/metrics   → Consultar métricas
```

### 📬 Postman Collection

Uma collection completa do Postman está disponível em `docs/Livraria-Tunoda-API.postman_collection.json`.

**Como usar:**
1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `docs/Livraria-Tunoda-API.postman_collection.json`
4. Configure as variáveis `author_id`, `book_id`, `cart_id`, `order_id`, `shipping_quote_id` após criar os recursos
5. Teste todos os **28 endpoints** disponíveis

**Endpoints incluídos:**
- 4 endpoints de catálogo público
- 2 endpoints de métricas públicas
- 6 endpoints administrativos (autores e livros)
- 1 endpoint administrativo (métricas)
- 6 endpoints de carrinho de compras
- 3 endpoints de checkout (novo unificado + 2 variações)
- 2 endpoints de pedidos
- 3 endpoints de pagamento
- 4 endpoints de frete (Melhor Envio)
- 1 endpoint de health check

📖 **Documentação completa:** Consulte `docs/README.md` para instruções detalhadas, exemplos e fluxo de testes.

---

## 🛒 Checkout com Frete

A aplicação suporta checkout **com ou sem frete**, permitindo flexibilidade no modelo de negócio.

### Endpoint Unificado

```http
POST /api/carts/checkout
Content-Type: application/json

{
  "cartId": "uuid-do-carrinho",
  "shippingQuoteId": "uuid-da-cotacao"  // opcional
}
```

### Cenário 1: Checkout COM Frete

**Fluxo Completo:**

```
1. Criar carrinho e adicionar livros
   POST /api/carts
   POST /api/carts/{id}/items

2. Criar cotação de frete
   POST /api/shipping/quotes
   Body: {"cartId": "...", "toPostalCode": "05508-900"}

3. Calcular frete
   POST /api/shipping/quotes/{id}/calculate

4. Selecionar opção de frete
   PUT /api/shipping/quotes/{id}/select
   Body: {"serviceCode": "PAC"}

5. Finalizar checkout com frete
   POST /api/carts/checkout
   Body: {"cartId": "...", "shippingQuoteId": "..."}
   
   → Order criado com:
     - subtotal: valor dos produtos
     - shippingCost: valor do frete
     - total: subtotal + shippingCost
```

**Response:**
```json
{
  "orderId": "uuid",
  "cartId": "uuid",
  "shippingQuoteId": "uuid",
  "status": "PENDING",
  "items": [...],
  "subtotal": 100.00,
  "shippingCost": 15.50,
  "currency": "BRL",
  "total": 115.50,
  "createdAt": "2026-01-13T15:30:00"
}
```

### Cenário 2: Checkout SEM Frete (Grátis)

**Fluxo Simplificado:**

```
1. Criar carrinho e adicionar livros
   POST /api/carts
   POST /api/carts/{id}/items

2. Finalizar checkout sem frete
   POST /api/carts/checkout
   Body: {"cartId": "...", "shippingQuoteId": null}
   
   → Order criado com:
     - subtotal: valor dos produtos
     - shippingCost: 0.00
     - total: subtotal
```

**Response:**
```json
{
  "orderId": "uuid",
  "cartId": "uuid",
  "shippingQuoteId": null,
  "status": "PENDING",
  "items": [...],
  "subtotal": 100.00,
  "shippingCost": 0.00,
  "currency": "BRL",
  "total": 100.00,
  "createdAt": "2026-01-13T15:30:00"
}
```

### Validações Aplicadas

**Checkout COM Frete:**
- ✅ Carrinho deve existir e estar ativo
- ✅ Carrinho não pode estar vazio
- ✅ Livros devem estar ativos
- ✅ Cotação deve existir e pertencer ao carrinho
- ✅ Cotação deve estar com status SELECTED
- ✅ Cotação não pode estar expirada
- ✅ Opção de frete selecionada deve existir

**Checkout SEM Frete:**
- ✅ Carrinho deve existir e estar ativo
- ✅ Carrinho não pode estar vazio
- ✅ Livros devem estar ativos

---

## 🚚 Integração Melhor Envio

A aplicação está integrada com o **Melhor Envio** para cálculo de frete em tempo real.

### Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```bash
# Melhor Envio - Sandbox
MELHOR_ENVIO_TOKEN=seu-token-aqui
MELHOR_ENVIO_FROM_CEP=03295-000  # CEP de origem (sua loja)
```

### Como obter o token:

1. Acesse [sandbox.melhorenvio.com.br](https://sandbox.melhorenvio.com.br)
2. Crie uma conta de testes
3. Vá em **Configurações → Tokens**
4. Gere um novo token com os escopos necessários
5. Copie e cole no `.env`

### Funcionalidades:

✅ Cálculo de frete via API do Melhor Envio  
✅ Suporte a múltiplas transportadoras (Correios, Jadlog, etc.)  
✅ Peso enviado corretamente em quilogramas  
✅ Snapshot de itens para garantir consistência  
✅ Armazenamento de payload bruto para auditoria  
✅ Tratamento de erros e retry automático  
✅ Logs detalhados para debug  

### Fluxo:

1. Cliente cria um carrinho e adiciona livros
2. Sistema cria cotação congelando dados dos itens
3. API chama Melhor Envio com peso correto (0.82 kg, não 820 kg!)
4. Sistema normaliza e persiste opções de frete
5. Cliente visualiza transportadoras, preços e prazos

---

**Próximos Passos:**
- 🔜 Seleção de opção de frete no checkout
- 🔜 Integração com gateway de pagamento (Mercado Pago)
- 🔜 Autenticação e autorização (JWT)
- 🔜 Gestão avançada de status de pedidos
- 🔜 Listagem de pedidos do cliente
- 🔜 Notificações por e-mail
- 🔜 Dashboard de métricas
- 🔜 Documentação OpenAPI/Swagger

## 📚 Referências

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [MapStruct Documentation](https://mapstruct.org/)
- [Melhor Envio API Documentation](https://docs.melhorenvio.com.br/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design - Vaughn Vernon](https://vaughnvernon.com/)

---

**Versão:** 0.0.1-SNAPSHOT  
**Última atualização:** 13 Janeiro 2026  
**Stories Implementadas:** 48/48 ✅  
**Endpoints Disponíveis:** 31  
**Tabelas no Banco:** 15 (incluindo tb_users e tb_refresh_tokens)  
**Migrations:** 13 (V1 a V13)  
**Integrações:** Melhor Envio ✅ | Mercado Pago ✅  
**Novidade:** Usuário Admin Inicial ✅

---

## 🎯 Progresso do Projeto

### Sprint 1: Catálogo (Stories #1-7) ✅
- ✅ Modelo de domínio completo
- ✅ Persistência com MapStruct
- ✅ Endpoints públicos e administrativos
- ✅ CRUD completo de livros e autores

### Sprint 2: Analytics (Stories #8-9) ✅
- ✅ Domínio de métricas isolado
- ✅ Registro de eventos (view/click)
- ✅ Consulta de métricas agregadas
- ✅ Top livros mais visualizados/clicados

### Sprint 3: Carrinho de Compras (Stories #10-16) ✅
- ✅ Modelo de domínio do carrinho
- ✅ Persistência de carrinho e itens
- ✅ CRUD de itens do carrinho
- ✅ Cálculo automático de totais
- ✅ Validação para checkout

### Sprint 4: Pedidos - Modelagem e Persistência (Stories #17-19) ✅
- ✅ Modelo de domínio do pedido
- ✅ Persistência de pedidos e itens
- ✅ Conversão de carrinho em pedido
- ✅ Consulta de pedidos
- ✅ Transições de status básicas

### Sprint 5: Pedidos - Gestão de Status e Pagamento (Stories #20-22) ✅
- ✅ Controle completo de transições de status
- ✅ Status EXPIRED implementado
- ✅ Associação de referência de pagamento
- ✅ Endpoints de pedido disponibilizados
- ✅ Base pronta para integração com gateway

### Sprint 6: Frete - Integração Melhor Envio (Stories #23-31) 🚧 Em Andamento
#### Concluído:
- ✅ Domínio de frete completo (ShippingQuote, ShippingItem, ShippingOption)
- ✅ Persistência de cotações (4 tabelas: quotes, items, options, payloads)
- ✅ Armazenamento de payload bruto (auditoria)
- ✅ Endpoint: Criar cotação de frete (com CEP de destino)
- ✅ Endpoint: Calcular frete via Melhor Envio
- ✅ Endpoint: Consultar cotação
- ✅ Integração completa com API do Melhor Envio
- ✅ Peso correto em quilogramas (0.82 kg)
- ✅ CEP dinâmico do cliente (validação completa)
- ✅ Suporte a múltiplas transportadoras (Correios, Jadlog)
- ✅ Tratamento de erros e retry automático
- ✅ Logs detalhados para debug
- ✅ Migration V8 (coluna to_postal_code)
- ✅ Story #32: Seleção de opção de frete
- ✅ Story #33: Validar cotação para pedido (uso futuro)

### Sprint 7: Pagamento - Integração Mercado Pago ✅
- ✅ Story #34: Modelagem de pagamento
- ✅ Story #35: Criação de pagamento
- ✅ Story #36: Processamento de pagamento (Mercado Pago)
- ✅ Story #37: Webhook de notificação
- ✅ Story #38: Consultar pagamento
- ✅ Story #39: Sincronizar status pedido com pagamento
- ✅ Story #40: Abstração de gateways de pagamento

**Arquitetura Implementada:**
- ✅ Interface `PaymentGatewayService` no domínio
- ✅ Implementação `MercadoPagoPaymentService` na infraestrutura
- ✅ Factory `PaymentGatewayServiceFactory` para seleção dinâmica
- ✅ Sincronização automática Order ↔ Payment via webhook
- ✅ Zero dependência de gateway específico no domínio
- ✅ Suporte a múltiplos gateways (Strategy Pattern)

**Endpoints Disponíveis:**
- POST `/api/orders/{orderId}/payments` - Criar pagamento
- POST `/api/payments/{paymentId}/process` - Processar pagamento
- GET `/api/payments/{paymentId}` - Consultar status
- POST `/api/webhooks/mercadopago` - Receber notificações

### Sprint 8: Checkout Completo - Integração Order + Frete ✅
- ✅ Story #41: Integração Order + ShippingQuote
- ✅ Adicionado shippingQuoteId ao Order
- ✅ Adicionado shippingCost ao Order (separado do subtotal)
- ✅ Criado endpoint unificado POST /api/carts/checkout
- ✅ Suporte a checkout COM frete (frete calculado)
- ✅ Suporte a checkout SEM frete (frete grátis)
- ✅ Validações completas no domínio
- ✅ Migration V10 (colunas de frete em orders)
- ✅ Total = subtotal + shippingCost
- ✅ Endpoint legacy mantido (deprecated)
- ✅ Backward compatibility garantida

**Arquitetura Implementada:**
- ✅ Order.createFromCartWithShipping(Cart, ShippingQuote)
- ✅ Validação: cotação pertence ao carrinho
- ✅ Validação: cotação selecionada e não expirada
- ✅ CheckoutRequest DTO com cartId + shippingQuoteId opcional
- ✅ ConvertCartToOrderUseCase refatorado
- ✅ Logs detalhados do processo

**Endpoints Disponíveis:**
- POST `/api/carts/checkout` - Checkout unificado (COM ou SEM frete)
- POST `/api/carts/{cartId}/checkout` - Checkout legacy (deprecated)

### Sprint 9: Autenticação Admin - Domínio e Persistência ✅
- ✅ Story #42: Modelagem de usuário administrativo
- ✅ Aggregate Root User criado
- ✅ UserId como identidade tipada
- ✅ Email como Value Object com validação
- ✅ UserRole enum (ADMIN)
- ✅ UserStatus enum (ACTIVE, BLOCKED)
- ✅ Senha armazenada apenas como hash
- ✅ UserRepository interface no domínio
- ✅ Validações completas no construtor
- ✅ Métodos de comportamento (block/unblock)
- ✅ Zero anotações de persistência
- ✅ Clean Architecture mantida

- ✅ Story #43: Persistência de usuários administrativos
- ✅ Migration V11 (tabela tb_users)
- ✅ UserEntity (JPA) com timestamps automáticos
- ✅ UserJpaRepository (Spring Data)
- ✅ UserMapper (MapStruct)
- ✅ UserRepositoryAdapter (Adapter Pattern)
- ✅ Email com constraint UNIQUE
- ✅ Senha armazenada como hash BCrypt
- ✅ Índices para performance (email, status, role)
- ✅ Desacoplamento total (zero Spring no domínio)
- ✅ Métodos de comportamento (block/unblock)
- ✅ Zero anotações de persistência
- ✅ Clean Architecture mantida

- ✅ Story #44: Autenticação JWT para usuários administrativos
- ✅ Endpoint POST /api/auth/login implementado
- ✅ RefreshToken (Aggregate Root) criado
- ✅ JwtService (Domain Service) interface
- ✅ PasswordEncoderService (Domain Service) interface
- ✅ LoginUseCase com validação completa
- ✅ JwtServiceImpl usando io.jsonwebtoken (jjwt 0.12.3)
- ✅ PasswordEncoderServiceImpl usando BCrypt
- ✅ Spring Security configurado (stateless)
- ✅ Access Token JWT (1 hora)
- ✅ Refresh Token persistido (30 dias)
- ✅ Migration V12 (tabela tb_refresh_tokens)
- ✅ AuthenticationResponse padronizado
- ✅ Validação de credenciais segura
- ✅ Bloqueio de usuários bloqueados
- ✅ Revogação de tokens antigos
- ✅ Logs de auditoria completos

- ✅ Story #45: Renovação segura de tokens (Refresh Token)
- ✅ Endpoint POST /api/auth/refresh implementado
- ✅ RefreshTokenUseCase com token rotation
- ✅ Validação de refresh token (existência, expiração, revogação)
- ✅ Invalidação automática do token antigo
- ✅ Geração de novo access token JWT
- ✅ Geração de novo refresh token
- ✅ Verificação de status do usuário
- ✅ Logs de auditoria de renovação
- ✅ Mensagens de erro específicas
- ✅ Token rotation obrigatório (segurança)

- ✅ Story #46: Recuperar dados do usuário autenticado
- ✅ Endpoint GET /api/user/me implementado (protegido)
- ✅ JwtAuthenticationFilter criado
- ✅ Extração de userId, email e role do token JWT
- ✅ Dados retornados sem consulta ao banco
- ✅ CurrentUserResponse DTO específico
- ✅ GetCurrentUserUseCase independente
- ✅ SecurityConfiguration com endpoints protegidos
- ✅ Contexto de segurança do Spring Security
- ✅ Logs de autenticação via JWT
- ✅ Nenhuma informação sensível exposta
- ✅ Validação automática de token em requests

- ✅ Story #47: Restrição de acesso a endpoints administrativos
- ✅ SecurityConfiguration centralizada e documentada
- ✅ Endpoints /api/admin/** protegidos com ROLE_ADMIN
- ✅ Endpoints públicos bem definidos (/api/auth/**, /api/public/**)
- ✅ Endpoints autenticados separados (/api/user/**)
- ✅ CustomAccessDeniedHandler (403 Forbidden)
- ✅ CustomAuthenticationEntryPoint (401 Unauthorized)
- ✅ Respostas JSON padronizadas para erros
- ✅ Logs de tentativas de acesso não autorizado
- ✅ Separação clara entre rotas públicas e protegidas
- ✅ anyRequest().denyAll() (segurança por padrão)
- ✅ Preparado para expansão de papéis (roles)

- ✅ Story #48: Usuário administrativo inicial
- ✅ Migration V13 cria usuário admin padrão
- ✅ Credenciais de desenvolvimento: admin@livraria.com / admin123
- ✅ Hash BCrypt gerado com 12 rounds
- ✅ UUID fixo para usuário inicial
- ✅ Documentação completa (ADMIN_CREDENTIALS.md)
- ✅ Instruções de segurança para produção
- ✅ Guia de alteração de senha
- ✅ Processo documentado no README
- ✅ Boas práticas dev vs prod
- ✅ Troubleshooting completo
- ✅ Avisos de segurança claros

**Arquitetura Implementada:**
- ✅ User (Aggregate Root)
- ✅ UserId (Identidade tipada)
- ✅ Email (Value Object com regex)
- ✅ UserRole (Enum extensível)
- ✅ UserStatus (Enum de estado)
- ✅ UserRepository (Interface no domínio)
- ✅ RefreshToken (Aggregate Root)
- ✅ RefreshTokenRepository (Interface no domínio)
- ✅ JwtService (Domain Service)
- ✅ PasswordEncoderService (Domain Service)
- ✅ LoginUseCase (Application Layer)
- ✅ AuthController (REST API)
- ✅ SecurityConfiguration (Spring Security)
- ✅ Senha nunca exposta (sem getter público)
- ✅ ToString exclui passwordHash

**Endpoints Implementados:**
- POST `/api/auth/login` - Autentica usuário admin e retorna tokens
- POST `/api/auth/refresh` - Renova tokens usando refresh token
- GET `/api/user/me` - Retorna dados do usuário autenticado (protegido)

### Sprint 10: Monitoramento e Métricas - Micrometer + Actuator ✅
- ✅ Story #42: Exposição de métricas da aplicação
- ✅ Micrometer Registry Prometheus configurado
- ✅ Endpoint /actuator/metrics ativo
- ✅ Endpoint /actuator/prometheus ativo
- ✅ Métricas JVM (memory, threads, GC)
- ✅ Métricas HTTP requests (latência, percentis)
- ✅ Métricas de sistema (CPU, file descriptors)
- ✅ Segurança por profile (dev liberado, prod protegido)
- ✅ Tags de ambiente (local/dev/staging/prod)
- ✅ Health check sempre público
- ✅ Metrics/Prometheus protegidos em prod (ROLE_ADMIN)

**Arquitetura Implementada:**
- ✅ MetricsConfiguration (registro de métricas padrão)
- ✅ ActuatorSecurityConfiguration (segurança por profile)
- ✅ application.yml com configuração base restritiva
- ✅ application-{profile}.yml com exposição controlada
- ✅ SecurityFilterChain específico com @Order(1)
- ✅ Percentis de latência HTTP habilitados
- ✅ Tags customizadas por ambiente
- ✅ Documentação completa (METRICAS_IMPLEMENTATION.md)

**Endpoints Disponíveis:**
- GET `/api/v1/actuator/health` - Status da aplicação (sempre público)
- GET `/api/v1/actuator/metrics` - Lista de métricas (protegido em prod)
- GET `/api/v1/actuator/metrics/{name}` - Métrica específica (protegido em prod)
- GET `/api/v1/actuator/prometheus` - Formato Prometheus (protegido em prod)

**Métricas Expostas:**
- `jvm.memory.used/max` - Uso de memória heap/non-heap
- `jvm.threads.live/peak` - Threads ativas
- `jvm.gc.pause` - Pausas de garbage collection
- `system.cpu.usage` - Uso de CPU
- `http.server.requests` - Requests HTTP (count, latência, percentis)
- `process.uptime` - Tempo de atividade
- `process.files.open` - File descriptors abertos

**Próximas Sprints 🔜**
- Sprint 11: Gestão de Usuários Admin (CRUD de usuários)
- Sprint 12: Revogação Manual de Tokens (Logout)
- Sprint 13: Auditoria e Logs Avançados
- Sprint 14: Notificações por E-mail
- Sprint 15: Dashboard Administrativo
