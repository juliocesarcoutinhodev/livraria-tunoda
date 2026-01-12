# Estrutura do Domínio - Carrinho de Compras

```
domain/
├── model/
│   ├── Cart.java                    ← Aggregate Root (Carrinho)
│   ├── CartId.java                  ← Identidade do Carrinho
│   ├── CartItemId.java              ← Identidade do Item
│   ├── Book.java                    ← Aggregate Root existente
│   ├── BookId.java                  ← Identidade do Livro
│   ├── Author.java                  ← Aggregate Root existente
│   ├── AuthorId.java                ← Identidade do Autor
│   └── vo/
│       ├── CartItem.java            ← Entidade Item do Carrinho
│       ├── CartStatus.java          ← Enum (ACTIVE, EXPIRED, CONVERTED)
│       ├── Money.java               ← Value Object existente
│       ├── ISBN.java                ← Value Object existente
│       ├── Weight.java              ← Value Object existente
│       ├── WeightUnit.java          ← Enum existente
│       └── Status.java              ← Enum existente (ACTIVE, INACTIVE)
│
├── exception/
│   └── BusinessException.java       ← Exceção de domínio
│
└── repository/                      ← Interfaces (próxima story)
    ├── BookRepository.java          ← Repositório de Livros (existente)
    ├── AuthorRepository.java        ← Repositório de Autores (existente)
    └── CartRepository.java          ← Repositório de Carrinho (futuro)
```

## Relacionamentos

```
┌─────────────────┐
│      Cart       │ Aggregate Root
│  (Carrinho)     │
├─────────────────┤
│ - id: CartId    │
│ - status        │
│ - createdAt     │
│ - updatedAt     │
│ - items: List   │◄────────┐
└─────────────────┘         │
                            │ 1..*
                            │
                   ┌────────┴────────┐
                   │   CartItem      │ Entidade
                   │ (Item Carrinho) │
                   ├─────────────────┤
                   │ - id            │
                   │ - bookId        │──────┐
                   │ - bookTitle     │      │
                   │ - quantity      │      │ referência
                   │ - unitPrice     │      │
                   └─────────────────┘      │
                                            │
                                    ┌───────▼────────┐
                                    │      Book      │ Aggregate Root
                                    │    (Livro)     │
                                    ├────────────────┤
                                    │ - id: BookId   │
                                    │ - title        │
                                    │ - price        │
                                    │ - authorIds    │
                                    └────────────────┘
```

## Fluxo de Operações

### 1. Criar Carrinho
```java
var cart = Cart.create();
// Status: ACTIVE
// Items: []
```

### 2. Adicionar Item
```java
var item = CartItem.create(
    bookId,
    "Clean Code",
    2,
    Money.brl(BigDecimal.valueOf(49.90))
);
cart.addItem(item);
// Items: [item]
// Quantity: 2
// Subtotal: 99.80
```

### 3. Adicionar Mesmo Livro (Incrementa)
```java
var item2 = CartItem.create(
    bookId,  // mesmo livro
    "Clean Code",
    3,
    Money.brl(BigDecimal.valueOf(49.90))
);
cart.addItem(item2);
// Items: [item] (mesmo item, quantidade atualizada)
// Quantity: 5 (2 + 3)
// Subtotal: 249.50
```

### 4. Atualizar Quantidade
```java
cart.updateItem(bookId, 10);
// Items: [item]
// Quantity: 10
// Subtotal: 499.00
```

### 5. Calcular Total
```java
var subtotal = cart.calculateSubtotal();
var total = cart.calculateTotal();
// Subtotal: 499.00
// Total: 499.00 (por enquanto igual)
```

### 6. Remover Item
```java
cart.removeItem(bookId);
// Items: []
```

### 7. Converter em Pedido
```java
cart.markAsConverted();
// Status: CONVERTED
// Carrinho não pode mais ser modificado
```

## Regras de Negócio Protegidas

### Carrinho (Cart)
```java
// ❌ Não pode adicionar item em carrinho expirado
cart.markAsExpired();
cart.addItem(item); // → BusinessException

// ❌ Não pode converter carrinho vazio
cart.markAsConverted(); // → BusinessException

// ❌ Não pode expirar carrinho já convertido
cart.markAsConverted();
cart.markAsExpired(); // → BusinessException
```

### Item (CartItem)
```java
// ❌ Quantidade deve ser maior que zero
CartItem.create(bookId, "Book", 0, price); // → BusinessException

// ❌ Título é obrigatório
CartItem.create(bookId, null, 1, price); // → BusinessException

// ❌ Preço é imutável (campo final)
item.unitPrice = newPrice; // → Erro de compilação

// ✅ Quantidade pode ser atualizada
item.updateQuantity(5); // OK
item.incrementQuantity(3); // OK
```

## Características do Design

### 1. Preço Congelado
- O preço é capturado no momento da adição
- Alterações no catálogo não afetam o carrinho
- Garante previsibilidade financeira

### 2. Título Armazenado
- Título do livro é copiado para o item
- Evita dependência do catálogo
- Garante histórico consistente

### 3. Subtotal Calculado
- Nunca persistido manualmente
- Sempre calculado: `price × quantity`
- Evita inconsistências

### 4. Status Controlado
- Transições de estado protegidas
- Validações em cada operação
- Impede modificações inválidas

### 5. Identidades Tipadas
- CartId, CartItemId, BookId
- Type Safety
- Evita erros de passagem de parâmetros

## Próximos Passos

- [ ] Persistência do Carrinho (JPA Entities)
- [ ] CartRepository (interface + implementação)
- [ ] Use Cases (criar, adicionar item, remover, etc.)
- [ ] Controllers REST
- [ ] DTOs de request/response
- [ ] Mapeamento Domain ↔ JPA ↔ DTO
y