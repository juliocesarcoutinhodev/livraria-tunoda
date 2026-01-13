# 🚚 Integração Melhor Envio - Documentação Técnica

## Visão Geral

A integração com o Melhor Envio permite calcular opções de frete em tempo real, retornando diferentes transportadoras com seus respectivos preços e prazos de entrega.

## 🎯 Funcionalidades Implementadas

✅ Cálculo de frete via API do Melhor Envio (Sandbox)  
✅ Suporte a múltiplas transportadoras:
  - Correios (SEDEX)
  - Jadlog (.Package, .Com)
✅ Peso enviado corretamente em **quilogramas** (double)  
✅ Snapshot de itens do carrinho (dados congelados)  
✅ Armazenamento de payload bruto para auditoria  
✅ Tratamento de erros e retry automático  
✅ Logs detalhados para debug  
✅ Status da cotação (CREATED, CALCULATED, EXPIRED)

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Configure no arquivo `.env` na raiz do projeto:

```bash
# Melhor Envio - Sandbox
MELHOR_ENVIO_TOKEN=seu-token-sandbox-aqui
MELHOR_ENVIO_FROM_CEP=03295-000  # CEP de origem (sua loja)
```

### 2. Como Obter o Token

1. Acesse [sandbox.melhorenvio.com.br](https://sandbox.melhorenvio.com.br)
2. Crie uma conta de testes
3. Vá em **Configurações → Tokens**
4. Clique em **Gerar novo token**
5. Selecione os escopos necessários:
   - `shipping-calculate`
   - `shipping-checkout`
   - `shipping-tracking`
6. Copie o token gerado
7. Cole no arquivo `.env`

### 3. Reiniciar a Aplicação

Após configurar o token, reinicie a aplicação para carregar as novas variáveis.

---

## 📊 Fluxo de Integração

```
1. Cliente cria carrinho e adiciona livros
   POST /api/carts
   POST /api/carts/{cartId}/items

2. Sistema cria cotação (snapshot dos itens)
   POST /api/shipping/quotes?cartId={cartId}
   └─> Congela: título, peso, preço

3. Sistema calcula frete via Melhor Envio
   POST /api/shipping/quotes/{quoteId}/calculate
   └─> Envia peso em KG (ex: 0.82)
   └─> Retorna opções normalizadas

4. Cliente visualiza opções de frete
   GET /api/shipping/quotes/{quoteId}
   └─> SEDEX: R$ 14,33 (2 dias)
   └─> Jadlog .Package: R$ 14,76 (5 dias)
   └─> Jadlog .Com: R$ 14,88 (4 dias)

5. Cliente seleciona opção e finaliza compra
   (próxima sprint)
```

---

## 🔧 Detalhes Técnicos

### Peso: A Questão Crítica! ⚠️

A API do Melhor Envio espera o peso em **quilogramas como double**, não em gramas como inteiro!

**❌ Errado:**
```json
{"weight": 820}  // Interpretado como 820 kg!
```

**✅ Correto:**
```json
{"weight": 0.82}  // 0.82 kg = 820 gramas
```

### Estrutura de Request

```json
{
  "from": {
    "postal_code": "03295-000"
  },
  "to": {
    "postal_code": "05508-900"
  },
  "products": [
    {
      "id": "uuid-do-livro",
      "width": 15,
      "height": 2,
      "length": 20,
      "weight": 0.82,  // Em quilogramas!
      "insurance_value": 64.90,
      "quantity": 1
    }
  ]
}
```

### Estrutura de Response

```json
{
  "id": "cotacao-uuid",
  "cartId": "carrinho-uuid",
  "status": "CALCULATED",
  "items": [
    {
      "bookId": "livro-uuid",
      "bookTitle": "Clean Code",
      "quantity": 1,
      "unitPrice": 64.90,
      "weight": {
        "value": 0.82,
        "unit": "KILOGRAMS"
      }
    }
  ],
  "options": [
    {
      "serviceCode": "SEDEX",
      "serviceName": "SEDEX",
      "company": "Correios",
      "price": 14.33,
      "currency": "BRL",
      "deliveryDays": 2,
      "externalReference": "2"
    }
  ],
  "createdAt": "2026-01-13T00:07:50",
  "expiresAt": "2026-01-20T00:07:50"
}
```

---

## 🗄️ Estrutura de Banco de Dados

### Tabelas Criadas

1. **tb_shipping_quotes** - Cotações de frete
2. **tb_shipping_items** - Itens da cotação (snapshot)
3. **tb_shipping_options** - Opções de frete retornadas
4. **tb_shipping_payloads** - Payload bruto (auditoria)

### Relacionamentos

```
ShippingQuote (1) ──< (N) ShippingItem
ShippingQuote (1) ──< (N) ShippingOption
ShippingQuote (1) ──< (N) ShippingPayload
```

---

## 🧪 Testando a Integração

### 1. Via Script Automatizado

Execute o script de teste:

```bash
./test-melhor-envio.sh
```

O script automaticamente:
- Cria um carrinho
- Adiciona um livro
- Cria cotação de frete
- Calcula via Melhor Envio
- Exibe as opções

### 2. Via Postman

1. Importe a collection: `docs/Livraria-Tunoda-API.postman_collection.json`
2. Acesse a pasta **"Frete - Melhor Envio"**
3. Execute os requests na ordem:
   - Criar Cotação de Frete
   - Calcular Frete via Melhor Envio
   - Consultar Cotação

### 3. Exemplo Manual com cURL

```bash
# 1. Criar carrinho
CART_ID=$(curl -s -X POST http://localhost:8080/api/carts | jq -r '.cartId')

# 2. Adicionar livro
curl -X POST "http://localhost:8080/api/carts/$CART_ID/items" \
  -H "Content-Type: application/json" \
  -d '{"bookId": "seu-book-id", "quantity": 1}'

# 3. Criar cotação
QUOTE_ID=$(curl -s -X POST "http://localhost:8080/api/shipping/quotes?cartId=$CART_ID" | jq -r '.id')

# 4. Calcular frete
curl -X POST "http://localhost:8080/api/shipping/quotes/$QUOTE_ID/calculate"

# 5. Consultar resultado
curl "http://localhost:8080/api/shipping/quotes/$QUOTE_ID"
```

---

## 🐛 Troubleshooting

### Erro: "Peso ultrapassa o limite máximo"

**Causa:** O peso está sendo enviado incorretamente (em gramas ao invés de kg)

**Solução:** Verificar se o peso está como `double` em kg no request

```java
// ✅ Correto
weight=0.82  // 0.82 kg

// ❌ Errado
weight=820   // Interpretado como 820 kg
```

### Erro: "Transportadora não atende este trecho"

**Causa:** Os CEPs de origem/destino não são atendidos pela transportadora

**Solução:** Normal para algumas transportadoras. O sistema filtra automaticamente as opções válidas.

### Erro: "Token inválido"

**Causa:** Token expirado ou incorreto

**Solução:**
1. Gerar novo token no sandbox do Melhor Envio
2. Atualizar o `.env`
3. Reiniciar a aplicação

### Nenhuma opção retornada

**Causa:** Todas as transportadoras retornaram erro

**Solução:** Verificar logs detalhados:

```bash
# Os logs mostram cada erro específico:
WARN  b.c.i.l.i.g.m.MelhorEnvioClient - Melhor Envio retornou 2 opções com erro:
WARN  b.c.i.l.i.g.m.MelhorEnvioClient -   - Serviço: PAC, Erro: Transportadora não atende este trecho.
WARN  b.c.i.l.i.g.m.MelhorEnvioClient -   - Serviço: SEDEX, Erro: Peso ultrapassa o limite máximo de 30,00kg.
```

---

## 📈 Logs e Monitoramento

### Logs Disponíveis

```properties
# Habilitar logs DEBUG para Melhor Envio (application.yml)
logging:
  level:
    br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio: DEBUG
```

### Informações Logadas

- Request completo enviado à API
- Response completa da API
- Opções válidas vs com erro
- Tempo de processamento
- Erros específicos de cada transportadora

---

## 🚀 Próximos Passos

- [ ] Seleção de opção de frete no checkout
- [ ] Validação de CEP de entrega do cliente
- [ ] Cache de cotações para otimizar performance
- [ ] Webhook para rastreamento de pedido
- [ ] Suporte a múltiplos CEPs de origem (filiais)
- [ ] Integração com ambiente de produção

---

## 📚 Referências

- [Documentação Oficial do Melhor Envio](https://docs.melhorenvio.com.br/)
- [API Reference - Calculate](https://docs.melhorenvio.com.br/reference/calculate)
- [Sandbox do Melhor Envio](https://sandbox.melhorenvio.com.br)

---

**Última atualização:** 13 Janeiro 2026  
**Versão da API:** v2  
**Ambiente:** Sandbox  
**Status:** ✅ Funcionando

