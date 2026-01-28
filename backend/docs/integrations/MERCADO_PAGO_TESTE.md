# 🚀 Guia Rápido - Testar Integração Mercado Pago

## ✅ Credenciais Configuradas

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-5244436858640354-011312-b81448db9909f81393d96ad2bf7ecca8-3131449924
MERCADO_PAGO_PUBLIC_KEY=APP_USR-61c04803-6d0b-4a03-ad6e-f484c20b6538
```

**Status:** ✅ Credenciais de TESTE configuradas no `.env`

---

## 📋 Fluxo Completo de Teste

### **1. Criar Carrinho**
```bash
POST http://localhost:8080/api/carts
```

**Response:** Anote o `cartId`

---

### **2. Adicionar Livro ao Carrinho**
```bash
POST http://localhost:8080/api/carts/{cartId}/items
Content-Type: application/json

{
  "bookId": "seu-book-id",
  "quantity": 1
}
```

---

### **3. Criar Cotação de Frete**
```bash
POST http://localhost:8080/api/shipping/quotes
Content-Type: application/json

{
  "cartId": "seu-cart-id",
  "toPostalCode": "01310-100"
}
```

**Response:** Anote o `quoteId`

---

### **4. Calcular Frete**
```bash
POST http://localhost:8080/api/shipping/quotes/{quoteId}/calculate
```

---

### **5. Selecionar Opção de Frete**
```bash
PUT http://localhost:8080/api/shipping/quotes/{quoteId}/select
Content-Type: application/json

{
  "serviceCode": "PAC"
}
```

---

### **6. Converter Carrinho em Pedido (Checkout)**
```bash
POST http://localhost:8080/api/carts/checkout
Content-Type: application/json

{
  "cartId": "SEU_CART_ID",
  "shippingQuoteId": "SEU_QUOTE_ID",
  "customerName": "Nome do cliente",
  "customerEmail": "cliente@email.com",
  "customerPhone": "11999999999"
}
```

**Response:** Anote o `orderId`

---

### **7. Criar Pagamento**
```bash
POST http://localhost:8080/api/orders/{orderId}/payments
Content-Type: application/json

{
  "paymentMethod": "PIX"
}
```

**Response:** Anote o `paymentId`

**Exemplo de Response:**
```json
{
  "paymentId": "7785fa94-bb59-4957-9c8a-1d74e4036ff6",
  "orderId": "ab26fd9c-9069-4d8f-8d0e-73f8a47689c0",
  "amount": 159.70,
  "currency": "BRL",
  "method": "PIX",
  "status": "CREATED",
  "gateway": "MERCADO_PAGO",
  "externalReference": null,
  "rejectionReason": null,
  "createdAt": "2026-01-13T13:08:11",
  "updatedAt": "2026-01-13T13:08:11"
}
```

---

### **8. ⭐ NOVO - Processar Pagamento (Mercado Pago)**
```bash
POST http://localhost:8080/api/payments/{paymentId}/process
```

**Response Esperado:**
```json
{
  "payment": {
    "paymentId": "7785fa94-bb59-4957-9c8a-1d74e4036ff6",
    "orderId": "ab26fd9c-9069-4d8f-8d0e-73f8a47689c0",
    "amount": 159.70,
    "currency": "BRL",
    "method": "PIX",
    "status": "PENDING",
    "gateway": "MERCADO_PAGO",
    "externalReference": "1234567890",
    "rejectionReason": null,
    "createdAt": "2026-01-13T13:08:11",
    "updatedAt": "2026-01-13T13:15:00"
  },
  "paymentUrl": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1234567890"
}
```

**O que acontece:**
- ✅ Cria preferência no Mercado Pago
- ✅ Atualiza Payment com `externalReference` (ID da preferência)
- ✅ Muda status de `CREATED` → `PENDING`
- ✅ Retorna URL para o cliente realizar o pagamento

---

## 🔍 Verificações no Banco de Dados

```sql
-- Ver pagamento atualizado
SELECT * FROM tb_payments 
WHERE id = 'seu-payment-id';

-- Verificar campos atualizados:
-- status: 'PENDING'
-- external_reference: '1234567890' (ID do Mercado Pago)
-- updated_at: timestamp atualizado
```

---

## 🎯 Variáveis do Postman

Configure essas variáveis no Postman:

```
base_url = http://localhost:8080
cart_id = (obter após criar carrinho)
book_id = (obter da listagem de livros)
quote_id = (obter após criar cotação)
order_id = (obter após checkout)
payment_id = (obter após criar pagamento)
```

---

## ⚠️ Possíveis Erros

### **400 - auto_return invalid**
```json
{
  "message": "auto_return invalid. back_url.success must be defined",
  "error": "invalid_auto_return"
}
```
**Causa:** O Mercado Pago não aceita `auto_return: "approved"` com URLs localhost.

**Solução Aplicada:** Campo `auto_return` foi removido do request. O cliente precisará fechar a janela manualmente após o pagamento.

**Nota:** Em produção, você pode configurar URLs públicas e habilitar o `auto_return`.

---

### **404 - Payment not found**
```json
{
  "message": "Pagamento não encontrado"
}
```
**Solução:** Verifique se o `paymentId` está correto

---

### **422 - Payment already processed**
```json
{
  "message": "Pagamento já foi processado anteriormente"
}
```
**Solução:** Este payment já tem `externalReference`. Use outro payment.

---

### **404 - Order not found**
```json
{
  "message": "Pedido não encontrado"
}
```
**Solução:** Verifique se o pedido existe e está vinculado ao payment

---

### **500 - Mercado Pago error**
```json
{
  "message": "Falha ao criar preferência de pagamento"
}
```
**Solução:** 
- Verifique se o token está correto no `.env`
- Reinicie a aplicação
- Verifique logs para detalhes

---

## 📊 Logs para Debug

Configure log level DEBUG para ver detalhes:

```yaml
logging:
  level:
    br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago: DEBUG
```

**O que você verá nos logs:**
- Request completo enviado ao Mercado Pago
- Response completo do Mercado Pago
- Preferência criada com sucesso
- ExternalReference associado ao Payment

---

## ✅ Checklist de Teste

- [ ] Criar carrinho
- [ ] Adicionar livro
- [ ] Criar cotação frete
- [ ] Calcular frete
- [ ] Selecionar frete
- [ ] Fazer checkout (criar order)
- [ ] Criar payment
- [ ] **Processar payment** (novo!)
- [ ] Verificar `paymentUrl` no response
- [ ] Verificar banco (status=PENDING, externalReference preenchido)

---

## 🎉 Resultado Final

Se tudo funcionar, você terá:

1. ✅ Payment com status `PENDING`
2. ✅ Payment com `externalReference` preenchido (ID do MP)
3. ✅ URL de pagamento válida
4. ✅ Cliente pode acessar URL e pagar

---

**Próximo passo:** Implementar webhook para receber notificação quando o pagamento for aprovado/rejeitado pelo Mercado Pago.
