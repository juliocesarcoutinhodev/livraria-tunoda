# DELETE /api/carts/{cartId}/clear

Endpoint para limpar completamente o carrinho de compras, removendo todos os itens.

## Requisição

### Método
```
DELETE /api/carts/{cartId}/clear
```

### Path Parameters

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cartId | String (UUID) | Sim | Identificador único do carrinho |

### Headers

Nenhum header especial é necessário.

### Body

Nenhum body é necessário.

---

## Resposta

### Success Response

**Status:** `200 OK`

**Body:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [],
  "subtotal": {
    "amount": 0.00,
    "currency": "BRL"
  },
  "total": {
    "amount": 0.00,
    "currency": "BRL"
  },
  "itemCount": 0,
  "status": "ACTIVE",
  "createdAt": "2026-01-26T10:00:00",
  "updatedAt": "2026-01-26T10:30:00"
}
```

### Error Responses

#### Carrinho não encontrado

**Status:** `404 Not Found`

**Body:**
```json
{
  "status": 404,
  "message": "Carrinho não encontrado",
  "timestamp": "2026-01-26T10:30:00"
}
```

#### Carrinho não está ativo

**Status:** `400 Bad Request`

**Body:**
```json
{
  "status": 400,
  "message": "Carrinho não está ativo",
  "timestamp": "2026-01-26T10:30:00"
}
```

---

## Regras de Negócio

1. **Carrinho deve existir**
   - Se o carrinho não for encontrado, retorna `404 Not Found`

2. **Carrinho deve estar ativo**
   - Carrinhos com status `CONVERTED` ou `EXPIRED` não podem ser limpos
   - Retorna `400 Bad Request` se status não for `ACTIVE`

3. **Remove todos os itens**
   - Limpa completamente a lista de itens do carrinho
   - Atualiza o timestamp `updatedAt`

4. **Mantém o carrinho**
   - O carrinho NÃO é deletado
   - Permanece com status `ACTIVE`
   - Pode receber novos itens posteriormente

5. **Transacional**
   - Operação é executada dentro de uma transação
   - Em caso de erro, nenhuma alteração é persistida

---

## Casos de Uso

### Cenário 1: Cliente quer recomeçar suas compras

```bash
# Cliente tem carrinho com 3 itens
GET /api/carts/550e8400-e29b-41d4-a716-446655440000

# Resposta:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    { "bookId": "...", "quantity": 2, "subtotal": 99.80 },
    { "bookId": "...", "quantity": 1, "subtotal": 49.90 },
    { "bookId": "...", "quantity": 3, "subtotal": 59.70 }
  ],
  "subtotal": 209.40,
  "itemCount": 6
}

# Cliente limpa o carrinho
DELETE /api/carts/550e8400-e29b-41d4-a716-446655440000/clear

# Resposta:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [],
  "subtotal": 0.00,
  "itemCount": 0,
  "status": "ACTIVE"
}

# Cliente pode adicionar novos itens no mesmo carrinho
POST /api/carts/550e8400-e29b-41d4-a716-446655440000/items
Body: { "bookId": "...", "quantity": 1 }
```

### Cenário 2: Frontend precisa resetar carrinho

```typescript
// React/TypeScript
const handleClearCart = async () => {
  try {
    await cartService.clear(cartId);
    toast.success('Carrinho limpo com sucesso!');
    queryClient.invalidateQueries(['cart', cartId]);
  } catch (error) {
    toast.error('Erro ao limpar carrinho');
  }
};
```

---

## Diferença entre operações

| Operação | Endpoint | Comportamento |
|----------|----------|---------------|
| **Remover item** | `DELETE /api/carts/{cartId}/items/{bookId}` | Remove UM item específico do carrinho |
| **Limpar carrinho** | `DELETE /api/carts/{cartId}/clear` | Remove TODOS os itens do carrinho |

---

## Exemplo com cURL

```bash
# Limpar carrinho
curl -X DELETE "http://localhost:8080/api/carts/550e8400-e29b-41d4-a716-446655440000/clear" \
     -H "Accept: application/json"

# Resposta esperada (200 OK)
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [],
  "subtotal": {
    "amount": 0.00,
    "currency": "BRL"
  },
  "itemCount": 0,
  "status": "ACTIVE",
  "createdAt": "2026-01-26T10:00:00",
  "updatedAt": "2026-01-26T10:30:15"
}
```

---

## Exemplo com Postman

1. Abra a collection `Livraria-Tunoda-API.postman_collection.json`
2. Navegue até: **Carrinho > Limpar Carrinho**
3. Certifique-se de ter a variável `{{cart_id}}` configurada
4. Clique em **Send**
5. Verifique a resposta com status `200 OK` e carrinho vazio

---

## Implementação

### Domain Layer

```java
// Cart.java (domain/model)
public void clear() {
    ensureCanBeModified();  // Valida status ACTIVE
    items.clear();          // Remove todos os itens
    this.updatedAt = LocalDateTime.now();
}
```

### Application Layer

```java
// ClearCartUseCase.java (application/usecase)
@Transactional
public CartResponse execute(String cartId) {
    var cart = cartRepository.findById(CartId.of(cartId))
        .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

    if (!cart.isActive()) {
        throw new BusinessException("Carrinho não está ativo");
    }

    cart.clear();
    var savedCart = cartRepository.save(cart);

    return cartDTOMapper.toResponse(savedCart);
}
```

### Infrastructure Layer

```java
// CartController.java (infrastructure/web/controller)
@DeleteMapping("/{cartId}/clear")
public ResponseEntity<CartResponse> clearCart(@PathVariable String cartId) {
    var response = clearCartUseCase.execute(cartId);
    return ResponseEntity.ok(response);
}
```

---

## Histórico de Mudanças

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0 | 2026-01-26 | Endpoint criado e documentado |

---

## Ver também

- [Domínio de Carrinho](../domain/cart.md)
- [Endpoints da API](endpoints.md)
- [Remover Item do Carrinho](endpoints.md#remover-item)
