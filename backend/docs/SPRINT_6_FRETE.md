# Sprint 6 - Frete: Modelagem e Persistência - COMPLETA ✅

**Data:** 12 Janeiro 2026  
**Stories:** #23, #24, #25, #26, #27  
**Status:** 100% Concluída

---

## 📋 Resumo da Sprint

Esta sprint implementou o **domínio completo de Frete**, criando a base para integração futura com Melhor Envio. Foram modelados agregados, value objects, persistência e auditoria de payloads.

---

## ✅ Stories Implementadas

### Story #23: Modelar Cotação de Frete (ShippingQuote)
- Aggregate Root ShippingQuote criado
- Status controlado: CREATED, SELECTED, EXPIRED
- Expiração automática após 24 horas
- 14 testes unitários

### Story #24: Congelar Dados dos Itens (ShippingItem)
- Campo unitPrice adicionado
- Dados congelados (peso e preço)
- Snapshot para histórico consistente
- 7 testes unitários

### Story #25: Representar Opções de Frete (ShippingOption)
- Campo externalReference adicionado
- Normalização de dados do Melhor Envio
- Domínio isolado do formato externo
- 7 testes unitários

### Story #26: Persistir Cotações de Frete
- 3 tabelas criadas (quotes, items, options)
- Migration V6
- MapStruct para mapeamento
- Repositories completos

### Story #27: Armazenar Payload Bruto
- Tabela tb_shipping_payloads criada
- JSON bruto para auditoria
- Provider enum (MELHOR_ENVIO)
- Migration V7

---

## 📦 Arquivos Criados/Alterados (Total: 24)

### Domínio (6 arquivos):
1. `ShippingQuote.java` - Aggregate Root
2. `ShippingQuoteId.java` - Identidade tipada
3. `ShippingQuoteStatus.java` - Enum
4. `ShippingItem.java` - Value Object (atualizado com unitPrice)
5. `ShippingOption.java` - Value Object (atualizado com externalReference)
6. `ShippingPayload.java` - Model de auditoria
7. `ShippingProvider.java` - Enum
8. `ShippingQuoteRepository.java` - Interface
9. `ShippingPayloadRepository.java` - Interface

### Infrastructure (9 arquivos):
10. `ShippingQuoteEntity.java`
11. `ShippingItemEntity.java`
12. `ShippingOptionEntity.java`
13. `ShippingPayloadEntity.java`
14. `ShippingQuoteJpaRepository.java`
15. `ShippingPayloadJpaRepository.java`
16. `ShippingQuoteMapper.java`
17. `ShippingPayloadMapper.java`
18. `ShippingQuoteRepositoryAdapter.java`
19. `ShippingPayloadRepositoryAdapter.java`

### Migrations (2 arquivos):
20. `V6__create-table-shipping-quotes.sql`
21. `V7__create-table-shipping-payloads.sql`

### Testes (3 arquivos):
22. `ShippingQuoteTest.java` - 14 testes
23. `ShippingItemTest.java` - 7 testes (atualizado)
24. `ShippingOptionTest.java` - 7 testes (atualizado)

**Total de Testes:** 28

---

## 🗄️ Estrutura de Banco de Dados

### 4 Tabelas Criadas:

**tb_shipping_quotes**
- Armazena cotações de frete
- Status: CREATED, SELECTED, EXPIRED
- Expiração: 24h após criação
- Índices: cart_id, status, created_at

**tb_shipping_items**
- Itens com peso e preço congelados
- Snapshot para histórico
- Cascade DELETE
- Índices: shipping_quote_id, book_id

**tb_shipping_options**
- Opções de frete normalizadas
- External reference (Melhor Envio)
- Cascade DELETE
- Índices: shipping_quote_id, service_code

**tb_shipping_payloads**
- Payload bruto em JSON
- Auditoria e debug
- Provider (MELHOR_ENVIO)
- Índices: shipping_quote_id, provider, created_at

---

## 🎯 Funcionalidades Implementadas

### 1. Modelagem de Domínio

**ShippingQuote (Aggregate Root):**
- Identificação única
- Associação obrigatória com carrinho
- Lista de items (snapshot)
- Lista de options (normalizadas)
- Expiração automática (24h)
- Seleção de opção
- Status controlado

**ShippingItem (Value Object):**
- bookId, bookTitle, quantity
- weight (congelado)
- unitPrice (congelado)
- Não consulta catálogo
- Totalmente imutável

**ShippingOption (Value Object):**
- serviceCode, serviceName
- price, deliveryDays, company
- externalReference (rastreabilidade)
- Normalização de dados externos
- Totalmente imutável

**ShippingPayload (Model):**
- JSON bruto da API
- Provider identificado
- Auditoria independente
- Não usado no domínio

### 2. Regras de Negócio

**Cotação:**
- ✅ Uma cotação por carrinho
- ✅ Status inicial: CREATED
- ✅ Expira após 24 horas
- ✅ Expirada não pode ser usada
- ✅ Selecionada não pode ser alterada
- ✅ Apenas opções existentes podem ser selecionadas

**Items:**
- ✅ Quantidade mínima: 1
- ✅ Peso e preço obrigatórios
- ✅ Dados congelados (snapshot)
- ✅ Alterações no catálogo não afetam cotação

**Options:**
- ✅ Múltiplas opções por cotação
- ✅ Somente leitura
- ✅ Moeda obrigatória
- ✅ Prazo > 0

### 3. Persistência

**Características:**
- Cascade DELETE controlado
- FetchType.LAZY (performance)
- Índices estratégicos
- Relacionamentos bidirecionais JPA
- Mapeamento Domain ↔ Entity (MapStruct)

---

## 📊 Diagrama de Estados

```
ShippingQuote Status:

    CREATED
       |
       ├──> selectOption() ──> SELECTED (final)
       |
       └──> expire() ──> EXPIRED (final)
                         (ou após 24h)

Estados Terminais: SELECTED, EXPIRED
```

---

## 🔄 Fluxo Futuro (Integração Melhor Envio)

```
1. Cliente adiciona items ao carrinho
   ↓
2. Sistema busca dados dos livros (peso, preço)
   ↓
3. Sistema cria ShippingItems (snapshot)
   ↓
4. Sistema chama API Melhor Envio
   ↓
5. Sistema salva payload bruto (auditoria)
   ↓
6. Sistema normaliza opções (ShippingOptions)
   ↓
7. Sistema cria ShippingQuote
   ↓
8. Sistema persiste cotação
   ↓
9. Cliente visualiza opções
   ↓
10. Cliente seleciona opção
    ↓
11. Sistema atualiza status → SELECTED
    ↓
12. Cliente prossegue para pagamento
```

---

## 🎯 Decisões de Design Importantes

### 1. Snapshot de Dados (ShippingItem)
- **Decisão:** Congelar peso e preço
- **Motivo:** Alterações no catálogo não devem afetar cotações
- **Benefício:** Histórico consistente e auditável

### 2. Normalização de Opções
- **Decisão:** ShippingOption separado de payload
- **Motivo:** Domínio não conhece formato externo
- **Benefício:** Flexibilidade para múltiplos provedores

### 3. Payload Bruto Separado
- **Decisão:** Tabela independente (tb_shipping_payloads)
- **Motivo:** Auditoria sem acoplamento
- **Benefício:** Debug e troubleshooting sem afetar domínio

### 4. Expiração Automática (24h)
- **Decisão:** Campo expiresAt + verificação
- **Motivo:** Cotações antigas não devem ser reutilizadas
- **Benefício:** Valores sempre atualizados

### 5. Status Controlado
- **Decisão:** Enum com transições validadas
- **Motivo:** Evita estados inválidos
- **Benefício:** Integridade de dados

---

## 📈 Métricas da Sprint

| Métrica | Valor |
|---------|-------|
| Stories Concluídas | 5 |
| Arquivos Criados/Alterados | 24 |
| Linhas de Código | ~1200 |
| Testes Unitários | 28 |
| Tabelas Criadas | 4 |
| Migrations | 2 (V6, V7) |
| Enums Criados | 2 |
| Value Objects | 2 (atualizado) + 1 (novo) |
| Aggregate Roots | 1 |

---

## 🧪 Cobertura de Testes

### ShippingQuoteTest (14 testes):
1. ✅ Criar cotação com status CREATED
2. ✅ Validar CartId obrigatório
3. ✅ Validar items obrigatórios
4. ✅ Validar options obrigatórias
5. ✅ Selecionar opção de frete
6. ✅ Validar opção inexistente
7. ✅ Validar alteração de opção selecionada
8. ✅ Expirar cotação
9. ✅ Validar expiração de cotação selecionada
10. ✅ Validar seleção em cotação expirada
11. ✅ Verificar expiração por tempo
12. ✅ Lista de items imutável
13. ✅ Lista de options imutável
14. ✅ Retornar null quando sem seleção

### ShippingItemTest (7 testes):
1. ✅ Criar item válido (com unitPrice)
2. ✅ Calcular peso total
3. ✅ Validar BookId obrigatório
4. ✅ Validar título obrigatório
5. ✅ Validar quantidade maior que zero
6. ✅ Validar peso obrigatório
7. ✅ Validar preço obrigatório (novo)

### ShippingOptionTest (7 testes):
1. ✅ Criar opção válida (com externalReference)
2. ✅ Validar código de serviço obrigatório
3. ✅ Validar nome de serviço obrigatório
4. ✅ Validar preço obrigatório
5. ✅ Validar prazo maior que zero
6. ✅ Validar transportadora obrigatória
7. ✅ Validar referência externa obrigatória (novo)

---

## ✅ Benefícios Implementados

### Para o Negócio:
- ✅ Múltiplas opções de frete
- ✅ Histórico de cotações preservado
- ✅ Auditoria completa (payload bruto)
- ✅ Rastreabilidade com Melhor Envio

### Para o Cliente:
- ✅ Escolha explícita de frete
- ✅ Transparência de valores
- ✅ Prazos claros

### Para o Sistema:
- ✅ Domínio isolado de API externa
- ✅ Preparado para múltiplos provedores
- ✅ Debug facilitado (payload bruto)
- ✅ Performance (índices estratégicos)

---

## 🚀 Preparado para Próximas Sprints

### Sprint 7: Integração com Melhor Envio
```java
// Use Case: CalculateShippingUseCase
var melhorEnvioResponse = melhorEnvioClient.calculate(...);
var rawPayload = objectMapper.writeValueAsString(melhorEnvioResponse);
var options = normalize(melhorEnvioResponse);
var quote = ShippingQuote.create(cartId, items, options);
shippingQuoteRepository.save(quote);
shippingPayloadRepository.save(ShippingPayload.create(..., rawPayload));
```

### Sprint 8: Seleção de Frete no Checkout
```java
// Use Case: SelectShippingOptionUseCase
var quote = shippingQuoteRepository.findByCartId(cartId);
quote.selectOption(serviceCode);
shippingQuoteRepository.save(quote);
```

### Sprint 9: Cálculo de Total com Frete
```java
// Order.calculateTotal()
var subtotal = calculateSubtotal();
var shippingCost = getShippingCost();  // Da opção selecionada
return subtotal.add(shippingCost);
```

---

## 📋 Comparações Importantes

### CartItem vs ShippingItem

| Aspecto | CartItem | ShippingItem |
|---------|----------|--------------|
| Propósito | Seleção | Snapshot para frete |
| Peso | Não tem | Congelado |
| Preço | Congelado do Book | Congelado do CartItem |
| Mutável | Sim (quantidade) | Não (imutável) |

### ShippingOptions vs Payload

| Aspecto | ShippingOptions | ShippingPayload |
|---------|-----------------|-----------------|
| Formato | Normalizado | JSON bruto |
| Uso | Domínio | Auditoria |
| Dados | Essenciais | Completo |
| Carregamento | Sempre | Sob demanda |

---

## ✅ **STATUS: SPRINT 6 COMPLETA E TESTADA!**

**Implementado:**
- ✅ Domínio completo de frete
- ✅ 3 Value Objects (ShippingItem, ShippingOption, ShippingPayload)
- ✅ 1 Aggregate Root (ShippingQuote)
- ✅ 2 Enums (ShippingQuoteStatus, ShippingProvider)
- ✅ 4 tabelas de banco
- ✅ 2 migrations
- ✅ Persistência completa
- ✅ 28 testes unitários
- ✅ Auditoria com payload bruto

**Preparado para:**
- Integração com Melhor Envio (API)
- Seleção de frete no checkout
- Cálculo de total com frete
- Múltiplos provedores futuros
- Relatórios e análises

O domínio de frete está **completo, testado e pronto para integração com Melhor Envio**! 🚀

