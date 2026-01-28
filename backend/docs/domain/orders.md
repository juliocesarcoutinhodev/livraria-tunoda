# Domínio de Pedidos

Contexto delimitado responsável por gerenciar pedidos após checkout.

## Visão Geral

**Responsabilidade:** Gerenciar pedidos, itens e status

**Aggregate Roots:** `Order`

**Value Objects:** `OrderItem`, `OrderStatus`

**Propósito:** Gestão completa do ciclo de vida de pedidos

**Acompanhamento sem login:** O cliente recebe link de acompanhamento por email e pode validar o pedido via `orderId + email` no endpoint `/api/orders/lookup`.

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
- `customerName: String` - Nome do cliente
- `customerEmail: String` - Email do cliente
- `customerPhone: String` - Telefone do cliente
- `createdAt: LocalDateTime`

#### Status Possíveis

- `PENDING` - Aguardando pagamento
- `CONFIRMED` - Pagamento confirmado
- `PROCESSING` - Em processamento
- `SHIPPED` - Enviado
- `DELIVERED` - Entregue
- `CANCELLED` - Cancelado
- `EXPIRED` - Expirado

#### Métodos

- `Order.createFromCart(cart, customerName, customerEmail, customerPhone)` - Cria pedido do carrinho
- `Order.createFromCartWithShipping(cart, shippingQuote, customerName, customerEmail, customerPhone)` - Cria pedido com frete
- `confirm()` - Confirma pagamento
- `startProcessing()` - Marca como em processamento
- `ship()` - Marca como enviado
- `deliver()` - Marca como entregue
- `cancel()` - Cancela pedido
- `expire()` - Expira pedido pendente

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
    customer_name VARCHAR(120),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(30),
    created_at TIMESTAMP NOT NULL
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

- `POST /api/carts/checkout` - Criar pedido
- `GET /api/orders/{id}` - Buscar pedido
- `POST /api/orders/lookup` - Validar pedido por email
- `GET /api/admin/orders` - Listar todos (admin)

## Fluxo de Checkout

1. Cliente tem carrinho com itens
2. Cliente calcula frete
3. Cliente seleciona opção de frete
4. Sistema cria Order com status PENDING
5. Email de pedido criado enviado ao cliente
6. Cliente cria pagamento
7. Webhook confirma pagamento → status = CONFIRMED
8. Email de pagamento confirmado enviado ao cliente
9. Admin processa → status = PROCESSING
10. Admin envia → status = SHIPPED
11. Entregue → status = DELIVERED

## Integrações

- **Cart:** Origem dos itens
- **ShippingQuote:** Frete selecionado
- **Payment:** Confirmação de pagamento

## Referências

- [Carrinho](cart.md)
- [Frete](shipping.md)
- [Pagamentos](payments.md)
