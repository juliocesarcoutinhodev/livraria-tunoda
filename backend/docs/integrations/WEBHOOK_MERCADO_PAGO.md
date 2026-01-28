# 🔔 Teste de Webhook - Mercado Pago

## 📊 Status Atual

✅ **WEBHOOK 100% FUNCIONANDO!** 🎉

**Fluxo completo testado:**
- ✅ Criar carrinho
- ✅ Adicionar livro
- ✅ Criar cotação de frete
- ✅ Calcular frete  
- ✅ Selecionar opção de frete
- ✅ Fazer checkout
- ✅ Criar pagamento
- ✅ Processar pagamento
- ✅ Pagar no Mercado Pago
- ✅ Webhook recebido
- ✅ Payment aprovado automaticamente

**✅ Tudo integrado e funcionando!**

---

## 📋 O que foi Implementado

### ✅ Componentes Criados

1. **DTOs:**
   - `MercadoPagoWebhookEvent` - Evento recebido do Mercado Pago
   - `MercadoPagoPaymentDetails` - Detalhes do pagamento consultados

2. **Use Case:**
   - `ProcessMercadoPagoWebhookUseCase` - Processa notificação e atualiza Payment

3. **Controller:**
   - `WebhookController` - Endpoint público `/api/webhooks/mercadopago`

4. **Client:**
   - `MercadoPagoClient.getPaymentDetails()` - Busca status atualizado do pagamento

---

## 🎯 Fluxo Completo

```
1. Cliente realiza pagamento no Mercado Pago
   ↓
2. Mercado Pago processa o pagamento
   ↓
3. Mercado Pago envia webhook para:
   POST http://seu-backend/api/webhooks/mercadopago
   ↓
4. WebhookController recebe notificação
   ↓
5. ProcessMercadoPagoWebhookUseCase:
   ├─ Busca detalhes atualizados no MP
   ├─ Encontra Payment pelo externalReference
   ├─ Atualiza status (approve/reject/cancel/expire)
   └─ Persiste
   ↓
6. Payment atualizado (APPROVED/REJECTED/etc)
```

---

## 🧪 Como Testar Localmente

### **Problema:** Mercado Pago não consegue enviar webhook para localhost

### **Solução:** Usar **ngrok** para expor localhost publicamente

---

## 🔧 Passo a Passo com ngrok

### **1. Instalar ngrok:**

```bash
# Download: https://ngrok.com/download
# Ou via snap (Linux):
sudo snap install ngrok
```

### **2. Iniciar aplicação:**

```bash
# Terminal 1: Aplicação Spring Boot
cd /home/julio/GitHub/livraria-tunoda/backend
./mvnw spring-boot:run
```

### **3. Expor localhost com ngrok:**

```bash
# Terminal 2: ngrok
ngrok http 8080
```

**Você verá:**
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8080
```

### **4. Copiar URL pública:**

```
https://abc123.ngrok-free.app
```

### **5. Atualizar notificationUrl no .env:**

```env
# IMPORTANTE: NÃO deixe espaços extras ou comentários após as URLs!
# Exemplo ERRADO:
# MERCADO_PAGO_NOTIFICATION_URL=https://abc.ngrok-free.app/api/webhooks/mercadopago  # comentário
# MERCADO_PAGO_NOTIFICATION_URL=https://abc.ngrok-free.app/api/webhooks/mercadopago 

# Exemplo CORRETO:
MERCADO_PAGO_NOTIFICATION_URL=https://abc123.ngrok-free.app/api/webhooks/mercadopago
MERCADO_PAGO_SUCCESS_URL=http://localhost:3000/payment/success
MERCADO_PAGO_FAILURE_URL=http://localhost:3000/payment/failure
MERCADO_PAGO_PENDING_URL=http://localhost:3000/payment/pending
```

**⚠️ ATENÇÃO:** Certifique-se de que NÃO há:
- Espaços no final das URLs
- Comentários na mesma linha das variáveis
- Quebras de linha dentro dos valores

**Sintoma de erro:** Se você ver nos logs `POST "/api/webhooks/mercadopago%20`, significa que há espaço extra!

### **6. Reiniciar aplicação** para carregar nova URL

---

## ✅ Testar Webhook - Fluxo Completo

### **1. Criar carrinho e checkout:**

```bash
# 1. Criar carrinho
POST http://localhost:8080/api/carts

# 2. Adicionar livro (substitua IDs)
POST http://localhost:8080/api/carts/{cartId}/items
{
  "bookId": "SEU_BOOK_ID",
  "quantity": 1
}

# 3. Criar cotação de frete
POST http://localhost:8080/api/shipping/quotes
{
  "cartId": "{cartId}",
  "toPostalCode": "18960-302"
}

# 4. Calcular frete
POST http://localhost:8080/api/shipping/quotes/{quoteId}/calculate

# 5. Selecionar frete
PUT http://localhost:8080/api/shipping/quotes/{quoteId}/select
{
  "serviceCode": "PAC"
}

# 6. Fazer checkout
POST http://localhost:8080/api/carts/checkout
{
  "cartId": "{cartId}",
  "shippingQuoteId": "{quoteId}",
  "customerName": "Nome do cliente",
  "customerEmail": "cliente@email.com",
  "customerPhone": "11999999999",
  "street": "Rua A",
  "number": "123",
  "complement": null,
  "neighborhood": "Centro",
  "city": "Sao Paulo",
  "state": "SP",
  "postalCode": "01000-000"
}

# Retorna: { "orderId": "..." }
```

### **2. Criar e processar payment:**

```bash
# 7. Criar payment
POST http://localhost:8080/api/orders/{orderId}/payments
{
  "paymentMethod": "CREDIT_CARD"
}

# Retorna: { "paymentId": "abc-123..." }

# 8. Processar payment
POST http://localhost:8080/api/payments/{paymentId}/process

# Retorna:
# {
#   "payment": {
#     "externalReference": "3131449924-xyz..."
#   },
#   "paymentUrl": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
# }
```

### **3. IMPORTANTE: Copiar o paymentUrl retornado e abrir no navegador**

❗ **NÃO crie outro pagamento manualmente!**
❗ **Use a URL exata retornada pela API!**

### **4. Realizar pagamento de teste:**

Faça login com conta de teste:
- Usuário: `TESTUSER3831...` (criado no Mercado Pago)
- Senha: `54K5ff7YGn` (da sua conta de teste)

Use cartão de teste:
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: `11/25`
- Nome: `APRO`

### **5. Mercado Pago enviará webhook automaticamente:**

```json
POST https://abc123.ngrok-free.app/api/webhooks/mercadopago
{
  "id": 123456,
  "live_mode": false,
  "type": "payment",
  "action": "payment.updated",
  "data": {
    "id": "1234567890"
  }
}
```

### **4. Verificar logs da aplicação:**

```
INFO  Webhook recebido do Mercado Pago. Type: payment, Action: payment.updated
INFO  Processando webhook do Mercado Pago. Payment ID do MP: 1234567890
INFO  Detalhes obtidos do MP. Status: approved, ExternalRef: payment-uuid
INFO  Aprovando payment: payment-uuid
INFO  Webhook processado com sucesso
```

### **5. Verificar Payment no banco:**

```sql
SELECT * FROM tb_payments WHERE id = 'payment-uuid';
```

**Resultado esperado:**
```
status: 'APPROVED'
updated_at: (timestamp atualizado)
```

---

## 🧪 Testar Manualmente (Sem ngrok)

Se não conseguir usar ngrok, pode testar manualmente:

### **1. Simular webhook com curl:**

```bash
curl -X POST http://localhost:8080/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123456,
    "live_mode": false,
    "type": "payment",
    "action": "payment.updated",
    "date_created": "2026-01-13T10:00:00Z",
    "data": {
      "id": "SEU_MERCADO_PAGO_PAYMENT_ID_AQUI"
    }
  }'
```

**Substitua:** `SEU_MERCADO_PAGO_PAYMENT_ID_AQUI` pelo ID real do pagamento no Mercado Pago

---

## 📊 Cenários de Teste

| Status no MP | Ação no Sistema | Payment Final |
|--------------|-----------------|---------------|
| `approved` | `payment.approve()` | APPROVED |
| `rejected` | `payment.reject(reason)` | REJECTED |
| `cancelled` | `payment.cancel()` | CANCELLED |
| `expired` | `payment.expire()` | EXPIRED |
| `pending` | Nenhuma ação | PENDING |
| `in_process` | Nenhuma ação | PENDING |

---

## 🚨 Troubleshooting

### **✅ Como confirmar que funcionou:**

**1. Nos logs, você DEVE ver:**
```
INFO  Webhook recebido do Mercado Pago. Type: payment, Action: payment.created
INFO  Detalhes obtidos do MP. Status: approved, ExternalRef: 0a163f9f-6fcd-44d8-a9a2-719982a8eb81
INFO  Aprovando payment: 0a163f9f-6fcd-44d8-a9a2-719982a8eb81
INFO  Webhook processado com sucesso
```

**2. No banco:**
```sql
SELECT * FROM tb_payments WHERE id = '0a163f9f-6fcd-44d8-a9a2-719982a8eb81';
-- status deve estar 'APPROVED'
```

---

## 🔒 Validação de Assinatura (Futuro)

**Atualmente:** Endpoint público sem validação de assinatura

**Recomendação para produção:**
1. Implementar validação de assinatura HMAC do Mercado Pago
2. Verificar IP de origem
3. Implementar rate limiting

**Referência:** https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks#editor_8

---

## ✅ Idempotência Implementada

O sistema garante que:
- ✅ Webhook duplicado não altera Payment já aprovado
- ✅ Logs informam quando webhook é ignorado por idempotência
- ✅ Sempre retorna 200 OK para o Mercado Pago

---

## 🎉 Story Completa!

### ✅ Critérios de Aceite Implementados:

1. ✅ Endpoint `POST /api/webhooks/mercadopago` criado
2. ✅ Processar eventos (approved, rejected, cancelled, expired)
3. ✅ Buscar Payment via externalReference
4. ✅ Atualizar status do pagamento
5. ✅ Operação idempotente
6. ✅ Logar payload completo

**Webhook funcionando 100%!** 🚀
