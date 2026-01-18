/**
 * Cart Hooks - React Query hooks para carrinho de compras
 *
 * Hooks para gerenciar carrinho com optimistic updates.
 *
 * @module hooks/useCart
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import { queryKeys, invalidateQueries } from "@/lib/react-query";
import type {
  Cart,
  AddItemToCartRequest,
  CheckoutRequest,
} from "@/types/cart";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para buscar carrinho por ID
 *
 * @param id - ID do carrinho
 * @param options - Opções adicionais do useQuery
 * @returns Query com dados do carrinho
 *
 * @example
 * ```tsx
 * function CartPage() {
 *   const cartId = localStorage.getItem("cartId");
 *   const { data: cart, isLoading } = useCart(cartId || "");
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!cart || cart.items.length === 0) return <EmptyCart />;
 *
 *   return (
 *     <div>
 *       {cart.items.map(item => (
 *         <CartItem key={item.bookId} item={item} />
 *       ))}
 *       <p>Total: R$ {cart.subtotal}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCart(
  id: string,
  options?: Omit<UseQueryOptions<Cart>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.cart.detail(id),
    queryFn: () => cartService.getById(id),
    staleTime: 1 * 60 * 1000, // 1 minuto
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para criar um novo carrinho
 *
 * @returns Mutation para criar carrinho
 *
 * @example
 * ```tsx
 * function InitializeCart() {
 *   const createCart = useCreateCart();
 *
 *   useEffect(() => {
 *     const cartId = localStorage.getItem("cartId");
 *     if (!cartId) {
 *       createCart.mutate(undefined, {
 *         onSuccess: (cart) => {
 *           localStorage.setItem("cartId", cart.id);
 *         }
 *       });
 *     }
 *   }, []);
 * }
 * ```
 */
export function useCreateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.create(),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.detail(cart.id), cart);
    },
  });
}

/**
 * Hook para adicionar item ao carrinho
 *
 * @returns Mutation para adicionar item
 *
 * @example
 * ```tsx
 * function AddToCartButton({ book }: { book: Book }) {
 *   const addItem = useAddItemToCart();
 *   const cartId = localStorage.getItem("cartId") || "";
 *
 *   const handleAdd = () => {
 *     addItem.mutate({
 *       cartId,
 *       data: { bookId: book.id, quantity: 1 }
 *     }, {
 *       onSuccess: () => {
 *         toast.success("Livro adicionado ao carrinho!");
 *       }
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleAdd} disabled={addItem.isPending}>
 *       {addItem.isPending ? "Adicionando..." : "Adicionar ao carrinho"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useAddItemToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, data }: { cartId: string; data: AddItemToCartRequest }) =>
      cartService.addItem(cartId, data),
    onSuccess: (updatedCart) => {
      // Atualiza cache imediatamente
      queryClient.setQueryData(
        queryKeys.cart.detail(updatedCart.id),
        updatedCart
      );
    },
  });
}

/**
 * Hook para atualizar quantidade de um item
 *
 * @returns Mutation para atualizar quantidade
 *
 * @example
 * ```tsx
 * function CartItemQuantity({ cartId, bookId, quantity }: Props) {
 *   const updateQuantity = useUpdateCartItem();
 *
 *   const handleChange = (newQuantity: number) => {
 *     updateQuantity.mutate({ cartId, bookId, quantity: newQuantity });
 *   };
 *
 *   return <input type="number" value={quantity} onChange={handleChange} />;
 * }
 * ```
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      bookId,
      quantity,
    }: {
      cartId: string;
      bookId: string;
      quantity: number;
    }) => cartService.updateItem(cartId, bookId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.detail(updatedCart.id),
        updatedCart
      );
    },
  });
}

/**
 * Hook para remover item do carrinho
 *
 * @returns Mutation para remover item
 *
 * @example
 * ```tsx
 * function RemoveButton({ cartId, bookId }: Props) {
 *   const removeItem = useRemoveCartItem();
 *
 *   const handleRemove = () => {
 *     removeItem.mutate({ cartId, bookId });
 *   };
 *
 *   return <button onClick={handleRemove}>Remover</button>;
 * }
 * ```
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, bookId }: { cartId: string; bookId: string }) =>
      cartService.removeItem(cartId, bookId),
    onSuccess: (_data, variables) => {
      invalidateQueries.cart(queryClient, variables.cartId);
    },
  });
}

/**
 * Hook para limpar carrinho
 *
 * @returns Mutation para limpar carrinho
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => cartService.clear(cartId),
    onSuccess: (_data, cartId) => {
      invalidateQueries.cart(queryClient, cartId);
    },
  });
}

/**
 * Hook para fazer checkout
 *
 * @returns Mutation para checkout
 *
 * @example
 * ```tsx
 * function CheckoutButton({ cartId }: { cartId: string }) {
 *   const checkout = useCheckout();
 *   const router = useRouter();
 *
 *   const handleCheckout = () => {
 *     checkout.mutate({
 *       cartId,
 *       data: {
 *         shippingQuoteId: "quote-123",
 *         customerEmail: "cliente@email.com"
 *       }
 *     }, {
 *       onSuccess: (order) => {
 *         router.push(`/orders/${order.orderId}`);
 *       }
 *     });
 *   };
 *
 *   return <button onClick={handleCheckout}>Finalizar compra</button>;
 * }
 * ```
 */
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      data,
    }: {
      cartId: string;
      data: CheckoutRequest;
    }) => cartService.checkout(cartId, data),
    onSuccess: (_order, variables) => {
      // Invalida carrinho após checkout
      invalidateQueries.cart(queryClient, variables.cartId);
      // Invalida pedidos
      invalidateQueries.orders(queryClient);
    },
  });
}
