/**
 * Cart Service - Serviço de carrinho de compras
 *
 * Gerencia operações do carrinho:
 * - Criar carrinho
 * - Adicionar/remover itens
 * - Atualizar quantidades
 * - Checkout
 *
 * @module services/cartService
 */

import { apiClient } from "@/lib/api-client";
import type {
  Cart,
  AddItemToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "@/types/cart";

/**
 * Cria um novo carrinho
 *
 * @returns Carrinho criado (vazio)
 *
 * @example
 * ```ts
 * const cart = await cartService.create();
 * localStorage.setItem("cartId", cart.id);
 * ```
 */
const create = async (): Promise<Cart> => {
  const response = await apiClient.post<Cart>("/carts");
  return response.data;
};

/**
 * Busca carrinho por ID
 *
 * @param id - ID do carrinho
 * @returns Dados do carrinho com itens
 *
 * @example
 * ```ts
 * const cart = await cartService.getById("cart-123");
 * ```
 */
const getById = async (id: string): Promise<Cart> => {
  const response = await apiClient.get<Cart>(`/carts/${id}`);
  return response.data;
};

/**
 * Adiciona um item ao carrinho
 *
 * @param cartId - ID do carrinho
 * @param data - Item a adicionar (bookId, quantity)
 * @returns Carrinho atualizado
 *
 * @example
 * ```ts
 * const cart = await cartService.addItem("cart-123", {
 *   bookId: "book-456",
 *   quantity: 2
 * });
 * ```
 */
const addItem = async (
  cartId: string,
  data: AddItemToCartRequest
): Promise<Cart> => {
  const response = await apiClient.post<Cart>(`/carts/${cartId}/items`, data);
  return response.data;
};

/**
 * Atualiza quantidade de um item
 *
 * @param cartId - ID do carrinho
 * @param bookId - ID do livro
 * @param quantity - Nova quantidade
 * @returns Carrinho atualizado
 *
 * @example
 * ```ts
 * const cart = await cartService.updateItem("cart-123", "book-456", 5);
 * ```
 */
const updateItem = async (
  cartId: string,
  bookId: string,
  quantity: number
): Promise<Cart> => {
  const data: UpdateCartItemRequest = { quantity };
  const response = await apiClient.put<Cart>(
    `/carts/${cartId}/items/${bookId}`,
    data
  );
  return response.data;
};

/**
 * Remove um item do carrinho
 *
 * @param cartId - ID do carrinho
 * @param bookId - ID do livro
 *
 * @example
 * ```ts
 * await cartService.removeItem("cart-123", "book-456");
 * ```
 */
const removeItem = async (cartId: string, bookId: string): Promise<void> => {
  await apiClient.delete(`/carts/${cartId}/items/${bookId}`);
};

/**
 * Limpa todo o carrinho
 *
 * @param cartId - ID do carrinho
 *
 * @example
 * ```ts
 * await cartService.clear("cart-123");
 * ```
 */
const clear = async (cartId: string): Promise<void> => {
  await apiClient.delete(`/carts/${cartId}/clear`);
};

/**
 * Realiza checkout do carrinho (cria pedido)
 *
 * @param cartId - ID do carrinho
 * @param data - Dados do checkout (shippingQuoteId, customerEmail)
 * @returns Dados do pedido criado
 *
 * @example
 * ```ts
 * const order = await cartService.checkout("cart-123", {
 *   shippingQuoteId: "quote-789",
 *   customerEmail: "cliente@email.com"
 * });
 * console.log("Pedido criado:", order.orderId);
 * ```
 */
const checkout = async (
  cartId: string,
  data: CheckoutRequest
): Promise<CheckoutResponse> => {
  const response = await apiClient.post<CheckoutResponse>(
    `/carts/${cartId}/checkout`,
    data
  );
  return response.data;
};

/**
 * Cart Service
 * Exporta todas as operações com carrinho
 */
export const cartService = {
  create,
  getById,
  addItem,
  updateItem,
  removeItem,
  clear,
  checkout,
};
