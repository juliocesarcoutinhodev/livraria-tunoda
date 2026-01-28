/**
 * Order Types - Tipos relacionados a pedidos
 *
 * DTOs e interfaces para operações com pedidos
 *
 * @module types/order
 */

/**
 * Status do pedido
 */
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED";

/**
 * Item do pedido
 */
export interface OrderItem {
  /** ID do item */
  itemId: string;
  /** ID do livro */
  bookId: string;
  /** Título do livro */
  bookTitle: string;
  /** Preço unitário no momento da compra */
  unitPrice: number;
  /** Moeda */
  currency: string;
  /** Quantidade */
  quantity: number;
  /** Subtotal (unitPrice * quantity) */
  subtotal: number;
}

/**
 * Informações de frete do pedido
 */
export interface OrderShipping {
  /** Código do serviço */
  serviceCode: string;
  /** Nome do serviço */
  serviceName: string;
  /** Custo do frete */
  cost: number;
  /** Prazo de entrega em dias */
  deliveryDays: number;
  /** CEP de destino */
  toPostalCode: string;
}

/**
 * Pedido completo
 */
export interface Order {
  /** ID único do pedido */
  orderId: string;
  /** ID do carrinho */
  cartId: string;
  /** ID da cotação de frete */
  shippingQuoteId: string;
  /** Email do cliente (apenas no detalhe) */
  customerEmail?: string;
  /** Lista de itens */
  items: OrderItem[];
  /** Subtotal dos itens */
  subtotal: number;
  /** Informações de frete (apenas no detalhe) */
  shipping?: OrderShipping;
  /** Custo do frete */
  shippingCost: number;
  /** Moeda */
  currency: string;
  /** Total do pedido (subtotal + shippingCost) */
  total: number;
  /** Referência do pagamento */
  paymentReference: string;
  /** Status atual do pedido */
  status: OrderStatus;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
  updatedAt?: string;
  /** Data de pagamento */
  paidAt?: string;
  /** Data de processamento */
  processingAt?: string;
  /** Data de envio */
  shippedAt?: string;
  /** Data de entrega */
  deliveredAt?: string;
  /** Data de cancelamento */
  cancelledAt?: string;
  /** Data de expiração */
  expiredAt?: string;
}

/**
 * Parâmetros de filtro para listagem de pedidos (ADMIN)
 * GET /api/admin/orders
 */
export interface OrderFilterParams {
  /** Número da página (zero-based) */
  page?: number;
  /** Tamanho da página */
  size?: number;
  /** Filtrar por status */
  status?: OrderStatus;
  /** Ordenação */
  sort?: string;
}

/**
 * Request para consultar pedido por email
 * POST /api/orders/lookup
 */
export interface OrderLookupRequest {
  orderId: string;
  email: string;
}

export interface OrderLookupResponse {
  valid: boolean;
  orderId?: string;
  redirectUrl?: string;
  message?: string;
}
