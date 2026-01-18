# React Query - Documentação das Query Keys

Este documento lista todas as query keys usadas no projeto com React Query.

## 📋 Padrão de Nomenclatura

Seguimos o padrão hierárquico recomendado pelo TanStack Query:

```typescript
['entity'] // Lista todos
['entity', filters] // Lista com filtros
['entity', id] // Detalhe de um item
['entity', id, 'relation'] // Relacionamento/subrecurso
```

---

## 🔑 Query Keys Disponíveis

### **Books (Livros Públicos)**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['books']` | Lista todos os livros públicos | `useBooks()` |
| `['books', filters]` | Lista com filtros (page, size, sort) | `useBooks(filters)` |
| `['books', id]` | Detalhe de um livro específico | `useBookDetail(id)` |
| `['books', id, 'metrics']` | Métricas de um livro (ADMIN) | `useBookMetrics(id)` |
| `['books', 'most-viewed', limit]` | Top livros mais visualizados | `useMostViewedBooks(limit)` |
| `['books', 'most-clicked', limit]` | Top livros mais clicados | `useMostClickedBooks(limit)` |

**Exemplo de uso:**

```typescript
import { useBooks, useBookDetail } from "@/hooks";

// Lista de livros
const { data } = useBooks({ page: 0, size: 10 });

// Detalhe de um livro
const { data: book } = useBookDetail("book-123");
```

---

### **Books Admin**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['books', 'admin']` | Lista todos os livros (ADMIN) | `useBooksAdmin()` |
| `['books', 'admin', filters]` | Lista com filtros (status, author, lowStock) | `useBooksAdmin(filters)` |
| `['books', 'admin', id]` | Detalhe de um livro (ADMIN) | `useBookDetailAdmin(id)` |

**Exemplo de uso:**

```typescript
import { useBooksAdmin } from "@/hooks";

// Livros com estoque baixo
const { data } = useBooksAdmin({ lowStock: true, status: "ACTIVE" });
```

---

### **Authors (Autores)**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['authors']` | Lista todos os autores | `useAuthors()` |
| `['authors', filters]` | Lista com filtros (page, size, status) | `useAuthors(filters)` |
| `['authors', id]` | Detalhe de um autor específico | `useAuthorDetail(id)` |

**Exemplo de uso:**

```typescript
import { useAuthors, useAuthorDetail } from "@/hooks";

// Lista de autores ativos
const { data } = useAuthors({ status: "ACTIVE" });

// Detalhe de um autor
const { data: author } = useAuthorDetail("author-123");
```

---

### **Auth (Autenticação)**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['auth', 'me']` | Dados do usuário autenticado | `useAuth()` |

**Exemplo de uso:**

```typescript
import { useAuth, useIsAuthenticated, useHasRole } from "@/hooks";

// Dados do usuário
const { data: user } = useAuth();

// Verificações
const isAuth = useIsAuthenticated();
const isAdmin = useHasRole("ROLE_ADMIN");
```

---

### **Cart (Carrinho)**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['cart', id]` | Dados do carrinho | `useCart(id)` |

**Exemplo de uso:**

```typescript
import { useCart, useAddItemToCart } from "@/hooks";

// Buscar carrinho
const cartId = localStorage.getItem("cartId") || "";
const { data: cart } = useCart(cartId);

// Adicionar item
const addItem = useAddItemToCart();
addItem.mutate({ cartId, data: { bookId: "book-123", quantity: 1 } });
```

---

### **Shipping (Frete)**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['shipping', 'quote', id]` | Cotação de frete | `useShippingQuote(id)` |

**Exemplo de uso:**

```typescript
import { useShippingQuote, useCalculateShipping } from "@/hooks";

// Buscar cotação
const { data: quote } = useShippingQuote("quote-123");

// Calcular frete
const calculate = useCalculateShipping();
calculate.mutate("quote-123");
```

---

### **Orders (Pedidos)**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['orders']` | Lista todos os pedidos | `useOrdersAdmin()` |
| `['orders', filters]` | Lista com filtros (page, size, status) | `useOrdersAdmin(filters)` |
| `['orders', id]` | Detalhe de um pedido | `useOrder(id)` |

**Exemplo de uso:**

```typescript
import { useOrder, useOrdersAdmin } from "@/hooks";

// Detalhe de pedido
const { data: order } = useOrder("order-123");

// Lista de pedidos (ADMIN)
const { data } = useOrdersAdmin({ status: "PENDING_PAYMENT" });
```

---

### **Payments (Pagamentos)**

| Query Key | Descrição | Hook Relacionado |
|-----------|-----------|------------------|
| `['payments', id]` | Dados do pagamento | `usePayment(id)` |

**Exemplo de uso:**

```typescript
import { usePayment, useCreatePayment } from "@/hooks";

// Buscar pagamento (atualiza a cada 30s)
const { data: payment } = usePayment("payment-123");

// Criar pagamento
const createPayment = useCreatePayment();
createPayment.mutate({ orderId: "order-123" });
```

---

## 🔄 Invalidação de Cache

Após mutações, o cache é automaticamente invalidado usando os helpers:

```typescript
import { queryKeys, invalidateQueries } from "@/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidar todas as queries de livros
invalidateQueries.books(queryClient);

// Invalidar todas as queries de autores
invalidateQueries.authors(queryClient);

// Invalidar usuário atual
invalidateQueries.authMe(queryClient);

// Invalidar carrinho específico
invalidateQueries.cart(queryClient, "cart-123");

// Invalidar pedidos
invalidateQueries.orders(queryClient);
```

---

## ⚙️ Configuração Padrão

### Stale Time

- **Books**: 5 minutos
- **Books Admin**: 2 minutos
- **Authors**: 5 minutos
- **Auth**: 10 minutos
- **Cart**: 1 minuto
- **Shipping**: 5 minutos
- **Orders**: 2 minutos (admin) / 2 minutos (usuário)
- **Payments**: 30 segundos (com refetch automático)

### Cache Time (gcTime)

- **Global**: 10 minutos

---

## 📊 Optimistic Updates

As mutations implementam optimistic updates onde apropriado:

### Exemplo - Update de Livro

```typescript
const updateBook = useUpdateBook();

updateBook.mutate({ id: "book-123", data: updatedData });
// ✅ Cache atualizado imediatamente (optimistic)
// ✅ Invalida listas após sucesso
```

### Exemplo - Adicionar ao Carrinho

```typescript
const addItem = useAddItemToCart();

addItem.mutate({ cartId, data: { bookId, quantity } });
// ✅ Cache do carrinho atualizado imediatamente
```

---

## 🎯 Prefetch (quando necessário)

Para melhorar performance, você pode fazer prefetch de dados:

```typescript
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import { bookService } from "@/services/bookService";

const queryClient = useQueryClient();

// Prefetch ao fazer hover em um link
const handleMouseEnter = (bookId: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.books.detail(bookId),
    queryFn: () => bookService.getByIdPublic(bookId),
  });
};
```

---

## 🚀 Boas Práticas

1. **Sempre use as query keys do `queryKeys` object** - Nunca escreva strings manualmente
2. **Invalide corretamente** - Use os helpers `invalidateQueries`
3. **Stale time apropriado** - Dados que mudam frequentemente = stale time menor
4. **Prefetch inteligente** - Use prefetch em hover para melhorar UX
5. **Loading/Error states** - Sempre trate `isLoading` e `error`
6. **Optimistic updates** - Use quando apropriado para melhor UX

---

## 📚 Referências

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
