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
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

/**
 * Item do pedido
 */
export interface OrderItem {
  /** ID do livro */
  bookId: string;
  /** Título do livro */
  title: string;
  /** Preço unitário no momento da compra */
  price: number;
  /** Quantidade */
  quantity: number;
  /** Subtotal (price * quantity) */
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
  id: string;
  /** Email do cliente */
  customerEmail: string;
  /** Lista de itens */
  items: OrderItem[];
  /** Subtotal dos itens */
  subtotal: number;
  /** Informações de frete */
  shipping: OrderShipping;
  /** Custo do frete */
  shippingCost: number;
  /** Total do pedido (subtotal + shippingCost) */
  total: number;
  /** Status atual do pedido */
  status: OrderStatus;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
  updatedAt?: string;
  /** Data de pagamento */
  paidAt?: string;
  /** Data de envio */
  shippedAt?: string;
  /** Data de entrega */
  deliveredAt?: string;
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
