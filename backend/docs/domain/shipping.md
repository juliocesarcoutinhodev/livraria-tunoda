# Domínio de Frete

Contexto delimitado responsável por calcular e gerenciar opções de frete.

## Visão Geral

**Responsabilidade:** Calcular frete via Melhor Envio

**Aggregate Roots:** `ShippingQuote`

**Value Objects:** `ShippingOption`, `ShippingItem`, `Address`

**Integração:** Melhor Envio API

## Aggregate Root

### ShippingQuote

Cotação de frete para um carrinho.

#### Atributos

- `id: ShippingQuoteId` - Identificador único
- `cartId: CartId` - Referência ao carrinho
- `toPostalCode: String` - CEP de destino
- `items: List<ShippingItem>` - Itens para envio
- `options: List<ShippingOption>` - Opções de frete disponíveis
- `selectedServiceCode: String` - Serviço selecionado pelo cliente
- `status: QuoteStatus` - Status da cotação
- `expiresAt: LocalDateTime` - Validade da cotação
- `createdAt: LocalDateTime`

#### Status

- `PENDING` - Aguardando cálculo
- `CALCULATED` - Opções calculadas
- `SELECTED` - Cliente selecionou opção
- `EXPIRED` - Cotação expirada

## Value Objects

### ShippingOption

Opção de frete retornada pela API.

- `serviceCode: String` - Código do serviço (ex: "SEDEX")
- `serviceName: String` - Nome do serviço
- `company: String` - Transportadora
- `price: Money` - Preço do frete
- `deliveryDays: Integer` - Prazo de entrega
- `externalReference: String` - ID na API externa

### ShippingItem

Item para cálculo de frete.

- `bookId: BookId`
- `bookTitle: String`
- `quantity: Integer`
- `unitPrice: Money`
- `weight: Weight`

### Address

Endereço de entrega.

- `postalCode: String`
- `street: String` (opcional)
- `number: String` (opcional)
- `city: String` (opcional)
- `state: String` (opcional)

## Casos de Uso

### CreateShippingQuoteUseCase

Cria cotação a partir do carrinho.

**Input:**
- `cartId: String`
- `toPostalCode: String`

**Output:** `ShippingQuoteId`

### CalculateShippingUseCase

Calcula opções de frete via Melhor Envio.

**Fluxo:**
1. Buscar cotação pendente
2. Buscar itens do carrinho
3. Converter para formato Melhor Envio
4. Chamar API
5. Salvar opções retornadas
6. Atualizar status para CALCULATED

### SelectShippingOptionUseCase

Cliente seleciona opção de frete.

**Input:**
- `quoteId: String`
- `serviceCode: String`

### GetShippingQuoteUseCase

Busca cotação com opções.

## Integração Melhor Envio

### Endpoint

`POST /api/v2/me/shipment/calculate`

### Request

```json
{
  "from": {
    "postal_code": "03295-000"
  },
  "to": {
    "postal_code": "18950-302"
  },
  "products": [
    {
      "id": "book-uuid",
      "width": 15,
      "height": 2,
      "length": 20,
      "weight": 0.350,
      "insurance_value": 45.90,
      "quantity": 1
    }
  ]
}
```

### Response

```json
[
  {
    "id": 1,
    "name": "PAC",
    "price": "23.76",
    "delivery_time": 6,
    "company": {
      "name": "Correios"
    }
  }
]
```

## Persistência

### Tabelas

```sql
CREATE TABLE tb_shipping_quotes (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL,
    to_postal_code VARCHAR(9) NOT NULL,
    selected_service_code VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE tb_shipping_items (
    id UUID PRIMARY KEY,
    shipping_quote_id UUID NOT NULL,
    book_id UUID NOT NULL,
    book_title VARCHAR(300),
    quantity INTEGER NOT NULL,
    unit_price_amount DECIMAL(10,2),
    unit_price_currency VARCHAR(3),
    weight_value DECIMAL(10,3),
    weight_unit VARCHAR(10)
);

CREATE TABLE tb_shipping_options (
    id UUID PRIMARY KEY,
    shipping_quote_id UUID NOT NULL,
    service_code VARCHAR(50) NOT NULL,
    service_name VARCHAR(100),
    company VARCHAR(100),
    price_amount DECIMAL(10,2),
    price_currency VARCHAR(3),
    delivery_days INTEGER,
    external_reference VARCHAR(255)
);

CREATE TABLE tb_shipping_payloads (
    id UUID PRIMARY KEY,
    shipping_quote_id UUID NOT NULL,
    provider VARCHAR(50) NOT NULL,
    raw_payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

## API Endpoints

- `POST /api/shipping/quotes` - Criar cotação
- `POST /api/shipping/quotes/{id}/calculate` - Calcular frete
- `GET /api/shipping/quotes/{id}` - Buscar cotação
- `POST /api/shipping/quotes/{id}/select` - Selecionar opção

## Fluxo de Uso

1. Cliente finaliza carrinho
2. Sistema cria ShippingQuote com status PENDING
3. Cliente solicita cálculo
4. Sistema chama Melhor Envio API
5. Opções salvas, status = CALCULATED
6. Cliente seleciona opção
7. Status = SELECTED
8. Cliente prossegue para checkout

## Validações

- CEP válido (8 dígitos)
- Carrinho não vazio
- Pesos e dimensões válidos
- Cotação não expirada (válida por 24h)

## Configuração

Variáveis de ambiente:
- `MELHOR_ENVIO_TOKEN`
- `MELHOR_ENVIO_BASE_URL`
- `MELHOR_ENVIO_FROM_CEP`

## Referências

- [Melhor Envio Integration](../integrations/MELHOR_ENVIO_INTEGRATION.md)
- [Carrinho](cart.md)
- [Pedidos](orders.md)
