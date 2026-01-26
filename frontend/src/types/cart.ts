/**
 * Cart Types - Tipos relacionados ao carrinho de compras
 *
 * DTOs e interfaces para operações com carrinho
 *
 * @module types/cart
 */

/**
 * Item do carrinho
 */
export interface CartItem {
  /** ID do livro */
  bookId: string;
  /** Título do livro */
  title: string;
  /** Preço unitário */
  price: number;
  /** Quantidade */
  quantity: number;
  /** Subtotal (price * quantity) */
  subtotal: number;
  /** URL da foto */
  photoUrl?: string;
}

/**
 * Carrinho completo
 */
export interface Cart {
  /** ID único do carrinho */
  id: string;
  /** Lista de itens */
  items: CartItem[];
  /** Subtotal do carrinho */
  subtotal: number;
  /** Total de itens */
  itemCount: number;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
  updatedAt?: string;
}

/**
 * Requisição para adicionar item ao carrinho
 * POST /api/carts/{cartId}/items
 */
export interface AddItemToCartRequest {
  /** ID do livro */
  bookId: string;
  /** Quantidade */
  quantity: number;
}

/**
 * Requisição para atualizar quantidade do item
 * PUT /api/carts/{cartId}/items/{bookId}
 */
export interface UpdateCartItemRequest {
  /** Nova quantidade */
  quantity: number;
}

/**
 * Requisição de checkout
 * POST /api/carts/{cartId}/checkout
 */
export interface CheckoutRequest {
  /** ID da cotação de frete selecionada */
  shippingQuoteId: string;
  /** Email do cliente */
  customerEmail: string;
}

/**
 * Resposta do checkout
 */
export interface CheckoutResponse {
  /** ID do pedido criado */
  orderId: string;
  /** Status do pedido */
  status: string;
  /** Total do pedido */
  total: number;
}

/**
 * Validação de carrinho antes do checkout
 * POST /api/carts/{cartId}/validate
 */
export interface CartValidationItem {
  /** ID do livro */
  bookId: string;
  /** Título do livro */
  title: string;
  /** Quantidade solicitada */
  requestedQuantity: number;
  /** Quantidade disponível em estoque */
  availableQuantity: number;
  /** Status do item (ex: OK, OUT_OF_STOCK, INSUFFICIENT_STOCK) */
  status: string;
  /** Mensagem opcional do backend */
  message?: string | null;
}

export interface CartValidationError {
  /** Código do erro */
  code: string;
  /** Mensagem do erro */
  message: string;
  /** ID do livro (opcional) */
  bookId?: string;
}

export interface CartValidationResponse {
  /** ID do carrinho */
  cartId: string;
  /** Carrinho válido para checkout */
  valid: boolean;
  /** Mensagem geral */
  message: string;
  /** Detalhes por item */
  items: CartValidationItem[];
  /** Erros globais */
  errors: CartValidationError[];
}
