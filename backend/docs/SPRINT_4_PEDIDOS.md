# Sprint 4 - Pedidos (Orders) - COMPLETA ✅

**Data:** 12 Janeiro 2026  
**Stories:** #17, #18, #19  
**Status:** 100% Concluída

---

## 📋 Resumo da Sprint

Esta sprint implementou o **domínio completo de pedidos**, desde a modelagem até a persistência e consulta. Um pedido representa uma compra confirmada, criada a partir de um carrinho válido.

---

## ✅ Stories Implementadas

### Story #17: Modelar Pedido (Order)
- Aggregate Root `Order` com regras de negócio
- Value Object `OrderItem` completamente imutável
- Enum `OrderStatus` com 6 estados
- Factory method `createFromCart(Cart)`
- Métodos de transição de status
- 16 testes unitários

### Story #18: Persistir Pedidos
- Migration V4 (tb_orders + tb_order_items)
- Entities JPA (OrderEntity + OrderItemEntity)
- OrderMapper com MapStruct
- OrderRepositoryAdapter
- Integração transacional completa

### Story #19: Consultar Pedido
- Use Case `GetOrderUseCase`
- Controller `OrderController`
- Endpoint `GET /api/orders/{orderId}`
- DTO `OrderResponse` reutilizado

---

## 📦 Arquivos Criados (Total: 12)

### Domínio (5 arquivos)
1. `OrderId.java` - Identidade tipada
2. `OrderItemId.java` - Identidade tipada do item
3. `OrderStatus.java` - Enum (PENDING → DELIVERED/CANCELLED)
4. `OrderItem.java` - Value Object imutável
5. `Order.java` - Aggregate Root

### Application (4 arquivos)
6. `OrderResponse.java` - DTO de resposta
7. `OrderItemDTO.java` - DTO do item
8. `OrderDTOMapper.java` - Mapper Domain → DTO
9. `ConvertCartToOrderUseCase.java` - Conversão carrinho → pedido
10. `GetOrderUseCase.java` - Consulta de pedido

### Infrastructure (7 arquivos)
11. `V4__create-table-orders.sql` - Migration
12. `OrderEntity.java` - Entity JPA
13. `OrderItemEntity.java` - Entity JPA do item
14. `OrderJpaRepository.java` - Spring Data JPA
15. `OrderMapper.java` - Mapper Domain ↔ Entity
16. `OrderRepositoryAdapter.java` - Implementação repositório
17. `OrderController.java` - Controller REST

### Testes (2 arquivos)
18. `OrderTest.java` - 16 testes do domínio
19. `OrderItemTest.java` - 8 testes do value object

---

## 🗄️ Estrutura de Banco de Dados

### Tabela: tb_orders
- **Colunas:** id, cart_id, status, subtotal_amount, subtotal_currency, total_amount, total_currency, created_at
- **Índices:** cart_id, status, created_at
- **Propósito:** Armazenar pedidos (snapshot do carrinho)

### Tabela: tb_order_items
- **Colunas:** id, order_id, book_id, book_title, quantity, unit_price_amount, unit_price_currency
- **FK:** order_id → tb_orders (CASCADE DELETE)
- **Índices:** order_id, book_id
- **Propósito:** Itens do pedido (snapshot dos produtos)

---

## 🔄 Fluxo Completo: Carrinho → Pedido

```
1. Cliente cria carrinho
   POST /api/carts → CartResponse

2. Cliente adiciona items ao carrinho
   POST /api/carts/{cartId}/items → CartResponse

3. Sistema valida carrinho (opcional)
   POST /api/carts/{cartId}/validate → ValidateCartResponse

4. Cliente faz checkout (conversão)
   POST /api/carts/{cartId}/checkout → OrderResponse
   ├─ Valida carrinho (status, items, livros ativos)
   ├─ Cria Order a partir do Cart (snapshot)
   ├─ Marca Cart como CONVERTED
   ├─ Persiste Order e Cart atomicamente
   └─ Retorna OrderResponse

5. Cliente consulta pedido
   GET /api/orders/{orderId} → OrderResponse
```

---

## 🎯 Principais Decisões de Design

### 1. Imutabilidade do Pedido
- **Order** só permite alteração de `status`
- **OrderItem** completamente imutável (campos final)
- Sem métodos addItem/removeItem/updateItem

### 2. Snapshot de Valores
- Subtotal e Total armazenados (não recalculados)
- Preço congelado no momento da conversão
- Título do livro armazenado (histórico)

### 3. Rastreabilidade
- Order armazena `cartId` (qual carrinho originou)
- Permite auditoria e análise de conversão

### 4. Separação Cart vs Order
- **Cart:** Temporário, mutável, pode ser modificado
- **Order:** Permanente, imutável, apenas status muda

### 5. Status Explícitos
- Transições controladas por métodos (confirm, ship, deliver, cancel)
- Regras de transição validadas no domínio

---

## 📊 Endpoints Implementados

### Carrinho → Pedido
```
POST /api/carts/{cartId}/checkout
→ Converte carrinho em pedido
→ Status 201 CREATED
→ OrderResponse
```

### Consulta de Pedido
```
GET /api/orders/{orderId}
→ Retorna pedido completo
→ Status 200 OK ou 404 Not Found
→ OrderResponse
```

---

## ✅ Testes Realizados

### Domínio (24 testes)
- ✅ Criação de Order a partir de Cart válido
- ✅ Validações (cart nulo, inativo, vazio)
- ✅ Transições de status completas
- ✅ Regras de cancelamento
- ✅ Imutabilidade de items
- ✅ Cálculos de subtotal/total
- ✅ OrderItem validações

### Integração (Postman)
- ✅ Conversão de carrinho em pedido
- ✅ Consulta de pedido criado
- ✅ Erro 404 para pedido inexistente

---

## 📈 Métricas da Sprint

| Métrica | Valor |
|---------|-------|
| Stories Concluídas | 3 |
| Arquivos Criados | 19 |
| Linhas de Código (aprox.) | ~1.200 |
| Testes Unitários | 24 |
| Endpoints Novos | 2 |
| Tabelas Criadas | 2 |
| Migration SQL | 1 (V4) |

---

## 🚀 Próximos Passos (Sprint 5)

Sugestões de continuação:

### 1. Gestão Completa de Pedidos
- Listar pedidos (do cliente ou admin)
- Filtrar por status
- Paginação

### 2. Atualização de Status Administrativa
- Endpoint para confirmar pedido
- Endpoint para enviar pedido
- Endpoint para marcar como entregue

### 3. Cancelamento de Pedidos
- Regras de cancelamento (apenas até certo status)
- Endpoint de cancelamento

### 4. Histórico e Auditoria
- Visualizar histórico de alterações
- Timestamp de cada mudança de status

---

## 🎓 Aprendizados e Boas Práticas

### ✅ O que funcionou bem:
1. **Separação clara Cart vs Order** - Responsabilidades bem definidas
2. **Imutabilidade** - Pedidos seguros e consistentes
3. **Snapshot** - Histórico preservado mesmo com alterações no catálogo
4. **Transação atômica** - Rollback automático em caso de erro
5. **Padrão consistente** - Mesma estrutura de Cart aplicada a Order

### 📝 Pontos de Atenção:
1. Relacionamento bidirecional JPA (OrderEntity ↔ OrderItemEntity)
2. Cascade ALL necessário para persistir items automaticamente
3. List.copyOf() garante imutabilidade da lista de items
4. OrderStatus separado de CartStatus (contextos diferentes)

---

## 📚 Documentação Atualizada

- ✅ README.md com seção de Domínio de Pedidos
- ✅ README.md com Stories #17, #18, #19
- ✅ README.md com endpoints de pedidos
- ✅ README.md com estrutura de tabelas
- ✅ Postman Collection atualizada (22 endpoints)
- ✅ Sprint 4 documentada no progresso

---

**Sprint 4 - Pedidos: COMPLETA e TESTADA! ✅**

