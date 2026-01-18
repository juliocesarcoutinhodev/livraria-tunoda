# Domínio de Pedidos

Contexto delimitado responsável por gerenciar pedidos após checkout.

## Visão Geral

**Responsabilidade:** Gerenciar pedidos, itens e status

**Aggregate Roots:** `Order`

**Value Objects:** `OrderItem`, `OrderStatus`

**Propósito:** Gestão completa do ciclo de vida de pedidos

## Aggregate Root

### Order

#### Atributos

- `id: OrderId` - Identificador único
- `cartId: CartId` - Referência ao carrinho original
- `items: List<OrderItem>` - Itens do pedido
- `status: OrderStatus` - Status atual
- `subtotal: Money` - Subtotal dos itens
- `shippingCost: Money` - Custo do frete
- `total: Money` - Total (subtotal + frete)
- `paymentReference: String` - Referência do pagamento
- `shippingQuoteId: ShippingQuoteId` - Cotação de frete selecionada
- `customerEmail: String` - Email do cliente
- `createdAt: LocalDateTime`
- `updatedAt: LocalDateTime`

#### Status Possíveis

- `PENDING_PAYMENT` - Aguardando pagamento
- `PAYMENT_CONFIRMED` - Pagamento confirmado
- `PROCESSING` - Em processamento
- `SHIPPED` - Enviado
- `DELIVERED` - Entregue
- `CANCELLED` - Cancelado

#### Métodos

- `Order.createFromCart(cart, shippingQuote)` - Cria pedido do carrinho
- `confirmPayment(paymentReference)` - Confirma pagamento
- `markAsProcessing()` - Marca como em processamento
- `markAsShipped(trackingCode)` - Marca como enviado
- `markAsDelivered()` - Marca como entregue
- `cancel(reason)` - Cancela pedido

## Value Objects

### OrderItem

- `bookId: BookId`
- `bookTitle: String`
- `quantity: Integer`
- `unitPrice: Money`
- `subtotal: Money`

### OrderStatus

Enum com estados do pedido.

## Casos de Uso

### CreateOrderFromCartUseCase

Converte carrinho em pedido após checkout.

### ConfirmPaymentUseCase

Atualiza status após confirmação de pagamento.

### GetOrderUseCase

Busca detalhes do pedido.

### ListOrdersUseCase

Lista todos os pedidos (admin).

## Persistência

### Tabela

```sql
CREATE TABLE tb_orders (
    id UUID PRIMARY KEY,
    cart_id UUID,
    status VARCHAR(50) NOT NULL,
    subtotal_amount DECIMAL(10,2) NOT NULL,
    subtotal_currency VARCHAR(3) NOT NULL,
    shipping_cost_amount DECIMAL(10,2),
    shipping_cost_currency VARCHAR(3),
    total_amount DECIMAL(10,2) NOT NULL,
    total_currency VARCHAR(3) NOT NULL,
    payment_reference VARCHAR(255),
    shipping_quote_id UUID,
    customer_email VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE tb_order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES tb_orders(id),
    book_id UUID NOT NULL,
    book_title VARCHAR(300) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price_amount DECIMAL(10,2) NOT NULL,
    unit_price_currency VARCHAR(3) NOT NULL
);
```

## API Endpoints

- `POST /api/carts/{cartId}/checkout` - Criar pedido
- `GET /api/orders/{id}` - Buscar pedido
- `GET /api/admin/orders` - Listar todos (admin)

## Fluxo de Checkout

1. Cliente tem carrinho com itens
2. Cliente calcula frete
3. Cliente seleciona opção de frete
4. Sistema cria Order com status PENDING_PAYMENT
5. Cliente cria pagamento
6. Webhook confirma pagamento → status = PAYMENT_CONFIRMED
7. Admin processa → status = PROCESSING
8. Admin envia → status = SHIPPED
9. Entregue → status = DELIVERED

## Integrações

- **Cart:** Origem dos itens
- **ShippingQuote:** Frete selecionado
- **Payment:** Confirmação de pagamento

## Referências

- [Carrinho](cart.md)
- [Frete](shipping.md)
- [Pagamentos](payments.md)
