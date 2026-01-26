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
  CartItem,
  AddItemToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "@/types/cart";

type CartApiItem = {
  bookId?: string;
  book_id?: string;
  title?: string;
  bookTitle?: string;
  book_title?: string;
  quantity?: number;
  price?: number;
  unitPrice?: number;
  unitPriceAmount?: number;
  unit_price_amount?: number;
  subtotal?: number;
  total?: number;
  photoUrl?: string;
  photo_url?: string;
};

type CartApiResponse = {
  id?: string;
  cartId?: string;
  cart_id?: string;
  items?: CartApiItem[];
  subtotal?: number;
  total?: number;
  itemCount?: number;
  totalItems?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

const normalizeCartItem = (item: CartApiItem): CartItem => {
  const price =
    item.price ??
    item.unitPrice ??
    item.unitPriceAmount ??
    item.unit_price_amount ??
    0;
  const quantity = item.quantity ?? 0;
  const subtotal = item.subtotal ?? item.total ?? price * quantity;

  return {
    bookId: item.bookId ?? item.book_id ?? "",
    title: item.title ?? item.bookTitle ?? item.book_title ?? "Livro",
    price,
    quantity,
    subtotal,
    photoUrl: item.photoUrl ?? item.photo_url,
  };
};

const normalizeCart = (data: CartApiResponse): Cart => {
  const items = (data.items || []).map(normalizeCartItem);
  const subtotal =
    data.subtotal ?? data.total ?? items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount =
    data.itemCount ?? data.totalItems ?? items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: data.id ?? data.cartId ?? data.cart_id ?? "",
    items,
    subtotal,
    itemCount,
    createdAt: data.createdAt ?? data.created_at ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? data.updated_at,
  };
};

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
  const response = await apiClient.post<CartApiResponse>("/carts");
  return normalizeCart(response.data);
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
  const response = await apiClient.get<CartApiResponse>(`/carts/${id}`);
  return normalizeCart(response.data);
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
  const response = await apiClient.post<CartApiResponse>(
    `/carts/${cartId}/items`,
    data
  );
  return normalizeCart(response.data);
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
  const response = await apiClient.put<CartApiResponse>(
    `/carts/${cartId}/items/${bookId}`,
    data
  );
  return normalizeCart(response.data);
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
