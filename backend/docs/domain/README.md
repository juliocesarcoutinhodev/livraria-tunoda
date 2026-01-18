# Domínios

Documentação dos contextos delimitados (Bounded Contexts) e seus modelos de domínio.

## Visão Geral

O projeto está organizado em **contextos delimitados** independentes, cada um com suas próprias regras de negócio, agregados e responsabilidades.

## Contextos Implementados

### [Catálogo](catalog.md)

**Responsabilidade:** Gerenciar livros e autores

**Aggregate Roots:** `Book`, `Author`

**Value Objects:** `ISBN`, `Money`, `Weight`, `Status`

### [Analytics](analytics.md)

**Responsabilidade:** Rastrear eventos de interação do usuário

**Aggregate Roots:** `BookMetric`

**Propósito:** Observabilidade e análise de comportamento

### [Carrinho de Compras](cart.md)

**Responsabilidade:** Gerenciar carrinhos e itens antes do checkout

**Aggregate Roots:** `Cart`

**Value Objects:** `CartItem`

### [Pedidos](orders.md)

**Responsabilidade:** Gerenciar pedidos após checkout

**Aggregate Roots:** `Order`

**Value Objects:** `OrderItem`, `OrderStatus`

### [Frete](shipping.md)

**Responsabilidade:** Calcular e gerenciar opções de frete

**Aggregate Roots:** `ShippingQuote`

**Value Objects:** `ShippingOption`, `Address`

**Integração:** Melhor Envio

### [Pagamentos](payments.md)

**Responsabilidade:** Processar pagamentos

**Aggregate Roots:** `Payment`

**Value Objects:** `PaymentStatus`, `PaymentMethod`

**Integração:** Mercado Pago

### [Usuários](users.md)

**Responsabilidade:** Gerenciar usuários administrativos e autenticação

**Aggregate Roots:** `User`, `RefreshToken`

**Value Objects:** `Email`, `UserRole`, `UserStatus`

## Princípios de Design

### Bounded Contexts

Cada contexto é isolado e independente:

- Baixo acoplamento entre contextos
- Evolução independente
- Comunicação via eventos ou IDs
- Facilita migração para microservices

### Aggregate Roots

Cada contexto tem seus próprios Aggregate Roots que garantem:

- Consistência transacional dentro do agregado
- Encapsulamento de regras de negócio
- Invariantes sempre válidas

### Associações via IDs

Relacionamentos entre contextos são via IDs, não referências diretas:

```
Book (Catálogo) ---[authorIds]---> Author (Catálogo)
Order (Pedidos) ---[bookIds]-----> Book (Catálogo)
Payment (Pagamentos) ---[orderId]-> Order (Pedidos)
```

Isso garante:
- Desacoplamento
- Consistência eventual
- Escalabilidade

## Comunicação Entre Contextos

### Consultas

Contextos podem consultar outros via repositories ou APIs:

```java
// Order precisa de dados do Book
BookId bookId = orderItem.getBookId();
Book book = bookRepository.findById(bookId);
```

### Eventos (Futuro)

Para operações assíncronas, pode-se usar eventos de domínio:

```java
// Quando um pedido é criado
OrderCreatedEvent event = new OrderCreatedEvent(orderId);
eventPublisher.publish(event);
```

## Vantagens da Abordagem

- **Manutenibilidade:** Código organizado por domínio de negócio
- **Escalabilidade:** Fácil extrair contextos para microservices
- **Testabilidade:** Testes isolados por contexto
- **Clareza:** Limites claros de responsabilidade
- **Evolução:** Mudanças em um contexto não afetam outros

## Estrutura de Código

```
domain/
├── model/          # Contexto de Catálogo
│   ├── Author.java
│   ├── Book.java
│   └── vo/
├── metric/         # Contexto de Analytics
│   └── BookMetric.java
├── cart/           # Contexto de Carrinho
│   └── Cart.java
├── order/          # Contexto de Pedidos
│   └── Order.java
├── shipping/       # Contexto de Frete
│   └── ShippingQuote.java
├── payment/        # Contexto de Pagamentos
│   └── Payment.java
└── user/           # Contexto de Usuários
    ├── User.java
    └── RefreshToken.java
```

## Referências

- [Clean Architecture](../architecture/clean-architecture.md)
- [DDD - Bounded Contexts](../architecture/ddd-bounded-contexts.md)
- [Modelo de Domínio Completo](../architecture/domain-model.md)
