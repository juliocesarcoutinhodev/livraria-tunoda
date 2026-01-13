# 📍 Implementação: CEP de Destino na Cotação de Frete

## 🎯 Problema Identificado

O sistema estava calculando frete com um **CEP de destino hardcoded** (`05508-900`), o que não faz sentido em produção. O CEP de destino deve ser informado pelo cliente no momento de solicitar a cotação.

## ✅ Solução Implementada

### 1. Request agora exige CEP de destino

**Antes:**
```bash
POST /api/shipping/quotes?cartId=uuid
```

**Agora:**
```bash
POST /api/shipping/quotes
Content-Type: application/json

{
  "cartId": "uuid-do-carrinho",
  "toPostalCode": "05508-900"  // CEP do cliente
}
```

### 2. Validações Aplicadas

- **Campo obrigatório**: `toPostalCode` não pode ser vazio
- **Formato válido**: Aceita `00000-000` ou `00000000`
- **Regex**: `\d{5}-?\d{3}`

### 3. Mudanças no Domínio

#### ShippingQuote
```java
public class ShippingQuote {
    private final String toPostalCode;  // Novo campo
    
    // Validação no domínio
    private static void validateToPostalCode(String toPostalCode) {
        if (toPostalCode == null || toPostalCode.isBlank()) {
            throw new BusinessException("CEP de destino é obrigatório");
        }
        var cleanCep = toPostalCode.replace("-", "");
        if (!cleanCep.matches("\\d{8}")) {
            throw new BusinessException("CEP de destino inválido");
        }
    }
}
```

### 4. Persistência

**Migration V8** criada:
```sql
ALTER TABLE tb_shipping_quotes
ADD COLUMN to_postal_code VARCHAR(9) NOT NULL;
```

### 5. Integração Melhor Envio

O CEP informado agora é usado na chamada à API:

```java
// MelhorEnvioShippingCalculator
var to = new MelhorEnvioCalculateRequest.ToAddress(
    quote.getToPostalCode()  // Usa CEP do cliente!
);
```

---

## 🔄 Fluxo Completo Atualizado

```
1. Cliente adiciona produtos ao carrinho
   POST /api/carts
   POST /api/carts/{id}/items

2. Cliente informa CEP de entrega
   POST /api/shipping/quotes
   {
     "cartId": "uuid",
     "toPostalCode": "05508-900"  // CEP do cliente
   }

3. Sistema cria cotação e congela dados
   → Snapshot dos itens
   → Armazena CEP de destino

4. Sistema calcula frete
   POST /api/shipping/quotes/{id}/calculate
   → Envia para Melhor Envio:
     - De: 03295-000 (loja)
     - Para: 05508-900 (cliente)

5. Cliente visualiza opções
   GET /api/shipping/quotes/{id}
   {
     "id": "uuid",
     "cartId": "uuid",
     "toPostalCode": "05508-900",  // Exibe CEP usado
     "status": "CALCULATED",
     "options": [...]
   }
```

---

## 📝 Exemplo de Uso

### cURL

```bash
# 1. Criar carrinho
CART_ID=$(curl -s -X POST http://localhost:8080/api/carts | jq -r '.cartId')

# 2. Adicionar livro
curl -X POST "http://localhost:8080/api/carts/$CART_ID/items" \
  -H "Content-Type: application/json" \
  -d '{"bookId": "book-uuid", "quantity": 1}'

# 3. Criar cotação COM CEP DE DESTINO
QUOTE_ID=$(curl -s -X POST http://localhost:8080/api/shipping/quotes \
  -H "Content-Type: application/json" \
  -d "{\"cartId\": \"$CART_ID\", \"toPostalCode\": \"01310-100\"}" | jq -r '.id')

# 4. Calcular frete (agora usa o CEP informado)
curl -X POST "http://localhost:8080/api/shipping/quotes/$QUOTE_ID/calculate"
```

### Postman

1. Importe a collection atualizada
2. No request **"Criar Cotação de Frete"**:
   - Método: POST
   - URL: `{{base_url}}/api/shipping/quotes`
   - Body (raw JSON):
     ```json
     {
       "cartId": "{{cart_id}}",
       "toPostalCode": "05508-900"
     }
     ```

---

## 🎯 Benefícios

1. ✅ **CEP real do cliente**: Calcula frete correto
2. ✅ **Validação no domínio**: Garante formato correto
3. ✅ **Auditoria**: CEP salvo no banco para rastreabilidade
4. ✅ **Flexibilidade**: Mesmo cliente pode ter múltiplos endereços
5. ✅ **Preparado para produção**: Sem valores hardcoded

---

## 🔍 Validações de Erro

### CEP Inválido
```bash
POST /api/shipping/quotes
{
  "cartId": "uuid",
  "toPostalCode": "123"
}

# Response: 400 Bad Request
{
  "message": "CEP inválido. Use o formato: 00000-000 ou 00000000"
}
```

### CEP Vazio
```bash
POST /api/shipping/quotes
{
  "cartId": "uuid",
  "toPostalCode": ""
}

# Response: 400 Bad Request
{
  "message": "CEP de destino é obrigatório"
}
```

---

## 🚀 Próximos Passos

- [ ] Validação de CEP real (consultando API de CEP)
- [ ] Múltiplos endereços de entrega por usuário
- [ ] Sugestão de CEP baseado em geolocalização
- [ ] Cache de cotações por CEP

---

**Data:** 13 Janeiro 2026  
**Versão:** 0.0.1-SNAPSHOT  
**Migration:** V8  
**Breaking Change:** ⚠️ Sim - Endpoint mudou de query param para request body

