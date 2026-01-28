# Domínio de Carrinho de Compras

Contexto delimitado responsável por gerenciar carrinhos e itens antes do checkout.

## Visão Geral

**Responsabilidade:** Gerenciar carrinhos de compras e seus itens

**Aggregate Roots:** `Cart`

**Value Objects:** `CartItem`

**Propósito:** Gestão do carrinho de compras antes da conversão em pedido

## Aggregate Root

### Cart

Aggregate Root que representa um carrinho de compras.

#### Atributos

- `id: CartId` - Identificador único do carrinho
- `items: List<CartItem>` - Lista de itens no carrinho
- `createdAt: LocalDateTime` - Data de criação
- `updatedAt: LocalDateTime` - Última atualização

#### Regras de Negócio

- Carrinho pode ter 0 ou mais itens
- Não pode haver itens duplicados (mesmo bookId)
- Quantidade de cada item deve ser > 0
- Subtotal calculado automaticamente
- Carrinho expira após 30 dias de inatividade

#### Métodos

**Criação:**
- `Cart.create()` - Cria carrinho vazio

**Manipulação:**
- `addItem(bookId, quantity, price)` - Adiciona item
- `updateItemQuantity(bookId, quantity)` - Atualiza quantidade
- `removeItem(bookId)` - Remove item
- `clear()` - Limpa carrinho
- `isEmpty()` - Verifica se está vazio
- `calculateSubtotal()` - Calcula subtotal

## Value Object

### CartItem

Representa um item dentro do carrinho.

#### Atributos

- `bookId: BookId` - Referência ao livro
- `bookTitle: String` - Título do livro (cache)
- `quantity: Integer` - Quantidade (mínimo 1)
- `unitPrice: Money` - Preço unitário
- `subtotal: Money` - Subtotal calculado (quantity * unitPrice)

#### Regras de Negócio

- Imutável
- Quantity deve ser >= 1
- Subtotal calculado automaticamente
- UnitPrice não pode ser negativo

## Casos de Uso

### CreateCartUseCase

Cria novo carrinho vazio.

**Output:** `CartResponse` com ID do carrinho

### AddItemToCartUseCase

Adiciona item ao carrinho.

**Input:**
- `cartId: String`
- `bookId: String`
- `quantity: Integer`

**Regras:**
- Verificar se livro existe e está ativo
- Se item já existe, incrementar quantidade
- Atualizar timestamp do carrinho

### UpdateCartItemUseCase

Atualiza quantidade de item existente.

**Input:**
- `cartId: String`
- `bookId: String`
- `quantity: Integer`

**Regras:**
- Quantidade > 0: atualizar
- Quantidade = 0: remover item

### RemoveCartItemUseCase

Remove item do carrinho.

**Input:**
- `cartId: String`
- `bookId: String`

### GetCartUseCase

Busca carrinho com todos os itens.

**Input:** `cartId: String`

**Output:** `CartResponse` completo

### ClearCartUseCase

Remove todos os itens do carrinho, mantendo o carrinho ativo.

**Input:** `cartId: String`

**Output:** `CartResponse` com carrinho vazio

**Regras:**
- Carrinho deve existir
- Carrinho deve estar com status ACTIVE
- Remove todos os itens da lista
- Atualiza timestamp do carrinho
- Não deleta o carrinho (apenas limpa itens)

**Exceções:**
- `ResourceNotFoundException` - Carrinho não encontrado
- `BusinessException` - Carrinho não está ativo

## Persistência

### Entidade JPA

- `CartEntity` - Representação JPA do Cart
- `CartItemEntity` - Representação JPA do CartItem (embedded)

### Repository

- `CartRepository` - Interface no domínio
- `CartRepositoryAdapter` - Implementação na infraestrutura

### Tabela

```sql
CREATE TABLE tb_carts (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE tb_cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES tb_carts(id),
    book_id UUID NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price_amount DECIMAL(10,2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL,
    CONSTRAINT uk_cart_book UNIQUE(cart_id, book_id)
);

CREATE INDEX idx_cart_items_cart_id ON tb_cart_items(cart_id);
```

## API Endpoints

### Públicos

- `POST /api/carts` - Criar carrinho
- `GET /api/carts/{id}` - Buscar carrinho
- `POST /api/carts/{id}/items` - Adicionar item
- `PUT /api/carts/{cartId}/items/{bookId}` - Atualizar quantidade
- `DELETE /api/carts/{cartId}/items/{bookId}` - Remover item
- `DELETE /api/carts/{cartId}/clear` - Limpar carrinho (remove todos os itens)
- `POST /api/carts/{id}/validate` - Validar carrinho para checkout
- `POST /api/carts/checkout` - Realizar checkout

## Fluxo de Uso

```
1. Cliente cria carrinho
   POST /api/carts
   → Retorna cartId

2. Cliente adiciona livros
   POST /api/carts/{cartId}/items
   Body: { bookId, quantity }

3. Cliente ajusta quantidades
   PUT /api/carts/{cartId}/items/{bookId}
   Body: { quantity }

4. Cliente remove itens
   DELETE /api/carts/{cartId}/items/{bookId}

4.1. Cliente pode limpar todo o carrinho (opcional)
     DELETE /api/carts/{cartId}/clear
     → Remove todos os itens, mantém carrinho ativo

5. Cliente visualiza carrinho
   GET /api/carts/{cartId}
   → Retorna items, subtotal

6. Cliente faz checkout
   POST /api/carts/checkout
   Body: { cartId, shippingQuoteId, customerName, customerEmail, customerPhone, street, number, complement, neighborhood, city, state, postalCode }
   → Converte Cart em Order
```

## Transição para Pedido

Quando cliente faz checkout:

1. Cart é convertido em Order
2. Items do cart viram OrderItems
3. Cart permanece no sistema (histórico)
4. Order segue fluxo de pagamento

## Características

### Isolamento

Cart é contexto independente. Não conhece Order, Payment ou Shipping.

### Cache de Dados

CartItem armazena `bookTitle` para evitar consultas frequentes ao catálogo.

### Expiração

Carrinhos abandonados podem ser removidos após 30 dias (cleanup job).

## Validações

- Livro deve existir e estar ativo
- Quantidade deve ser > 0
- Estoque suficiente (verificado no checkout)
- Preço deve ser atual (atualizado ao adicionar)

## Integrações

### Com Catálogo

Cart consulta Book para:
- Verificar se livro existe e está ativo
- Obter preço atual
- Obter título (para cache)

### Com Pedidos

No checkout, Cart é convertido em Order.

## Melhorias Futuras

- Carrinho persistente por usuário (multi-device)
- Carrinho salvo (save for later)
- Sugestões de produtos relacionados
- Cupons de desconto
- Limites de quantidade por produto
- Validação de estoque em tempo real

## Referências

- [Modelo de Domínio](../architecture/domain-model.md)
- [Pedidos](orders.md)
- [Catálogo](catalog.md)
- [API Endpoints](../api/endpoints.md)
