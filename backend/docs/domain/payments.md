# Domínio de Pagamentos

Contexto delimitado responsável por processar pagamentos via Mercado Pago.

## Visão Geral

**Responsabilidade:** Processar pagamentos e gerenciar status

**Aggregate Roots:** `Payment`

**Value Objects:** `PaymentStatus`, `PaymentMethod`

**Integração:** Mercado Pago API

## Aggregate Root

### Payment

#### Atributos

- `id: PaymentId` - Identificador único
- `orderId: OrderId` - Referência ao pedido
- `amount: Money` - Valor total
- `status: PaymentStatus` - Status do pagamento
- `method: PaymentMethod` - Método de pagamento
- `externalId: String` - ID no Mercado Pago
- `preferenceId: String` - ID da preferência criada
- `approvalUrl: String` - URL para pagamento
- `createdAt: LocalDateTime`
- `updatedAt: LocalDateTime`

#### Status Possíveis

- `PENDING` - Aguardando pagamento
- `APPROVED` - Aprovado
- `IN_PROCESS` - Em processamento
- `REJECTED` - Rejeitado
- `CANCELLED` - Cancelado
- `REFUNDED` - Reembolsado

## Value Objects

### PaymentStatus

Enum com status possíveis.

### PaymentMethod

- `CREDIT_CARD` - Cartão de crédito
- `DEBIT_CARD` - Cartão de débito
- `PIX` - PIX
- `BOLETO` - Boleto bancário

## Casos de Uso

### CreatePaymentUseCase

Cria pagamento e gera preferência no Mercado Pago.

**Input:**
- `orderId: String`

**Output:**
- `paymentId: String`
- `approvalUrl: String` - URL para cliente pagar

**Fluxo:**
1. Buscar Order
2. Criar Payment com status PENDING
3. Criar preferência no Mercado Pago
4. Salvar preferenceId e approvalUrl
5. Retornar URL para cliente

### ProcessWebhookUseCase

Processa notificação do Mercado Pago.

**Input:**
- `paymentId: String` (do Mercado Pago)
- `topic: String`

**Fluxo:**
1. Buscar detalhes do pagamento na API
2. Atualizar Payment local
3. Se APPROVED → confirmar Order

### GetPaymentUseCase

Busca status do pagamento.

### RefundPaymentUseCase (Futuro)

Solicita reembolso.

## Integração Mercado Pago

### Criar Preferência

`POST /checkout/preferences`

**Request:**
```json
{
  "items": [
    {
      "title": "Pedido #123",
      "quantity": 1,
      "unit_price": 145.90
    }
  ],
  "back_urls": {
    "success": "http://localhost:3000/payment/success",
    "failure": "http://localhost:3000/payment/failure",
    "pending": "http://localhost:3000/payment/pending"
  },
  "notification_url": "http://localhost:8080/api/webhooks/mercadopago",
  "statement_descriptor": "Livraria Tunoda"
}
```

**Response:**
```json
{
  "id": "123456789-abc-def",
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

### Consultar Pagamento

`GET /v1/payments/{id}`

**Response:**
```json
{
  "id": 123456789,
  "status": "approved",
  "status_detail": "accredited",
  "transaction_amount": 145.90,
  "payment_method_id": "visa"
}
```

### Webhook

`POST /api/webhooks/mercadopago`

**Request:**
```json
{
  "id": 123456789,
  "topic": "payment",
  "type": "payment"
}
```

## Persistência

### Tabela

```sql
CREATE TABLE tb_payments (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(50) NOT NULL,
    method VARCHAR(50),
    external_id VARCHAR(255),
    preference_id VARCHAR(255),
    approval_url TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_payments_order_id ON tb_payments(order_id);
CREATE INDEX idx_payments_external_id ON tb_payments(external_id);
CREATE INDEX idx_payments_status ON tb_payments(status);
```

## API Endpoints

- `POST /api/payments` - Criar pagamento
- `GET /api/payments/{id}` - Buscar pagamento
- `POST /api/webhooks/mercadopago` - Webhook (público)

## Fluxo de Pagamento

1. Cliente cria Order
2. Sistema cria Payment com status PENDING
3. Sistema cria preferência no Mercado Pago
4. Cliente é redirecionado para `approval_url`
5. Cliente paga no Mercado Pago
6. Mercado Pago envia webhook
7. Sistema atualiza Payment status
8. Se APPROVED → Order status = PAYMENT_CONFIRMED

## Segurança

### Validação de Webhook

- Verificar origem (IP do Mercado Pago)
- Consultar API para confirmar dados
- Idempotência (processar webhook apenas uma vez)

### Dados Sensíveis

- Nunca armazenar dados de cartão
- Tokens são gerenciados pelo Mercado Pago
- Compliance PCI-DSS via Mercado Pago

## Configuração

Variáveis de ambiente:
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_BASE_URL`
- `MERCADO_PAGO_SUCCESS_URL`
- `MERCADO_PAGO_FAILURE_URL`
- `MERCADO_PAGO_PENDING_URL`
- `MERCADO_PAGO_NOTIFICATION_URL`

## Tratamento de Erros

- Timeout na API → Retry com backoff
- Pagamento rejeitado → Permitir nova tentativa
- Webhook duplicado → Idempotência
- API indisponível → Circuit breaker

## Monitoramento

Métricas importantes:
- Taxa de aprovação de pagamentos
- Tempo médio de processamento
- Falhas na API
- Webhooks recebidos vs processados

## Melhorias Futuras

- Suporte a múltiplos métodos de pagamento
- Split de pagamento (marketplace)
- Assinatura recorrente
- Pagamento parcelado
- Cashback

## Referências

- [Mercado Pago Integration](../integrations/mercado-pago.md)
- [Webhook](../integrations/WEBHOOK_MERCADO_PAGO.md)
- [Pedidos](orders.md)
