/**
 * Order Service - Serviço de pedidos
 *
 * Gerencia operações com pedidos
 *
 * @module services/orderService
 */

import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";
import type { Order, OrderFilterParams } from "@/types/order";

/**
 * Busca um pedido por ID
 *
 * @param id - ID do pedido
 * @returns Dados completos do pedido
 *
 * @example
 * ```ts
 * const order = await orderService.getById("order-123");
 * console.log(order.status, order.total);
 * ```
 */
const getById = async (id: string): Promise<Order> => {
  const response = await apiClient.get<Order>(`/orders/${id}`);
  return response.data;
};

/**
 * Lista pedidos com paginação (ADMIN)
 *
 * @param params - Parâmetros de filtro e paginação
 * @returns Lista paginada de pedidos
 *
 * @example
 * ```ts
 * const orders = await orderService.listAdmin({
 *   page: 0,
 *   size: 20,
 *   status: "PENDING_PAYMENT"
 * });
 * ```
 */
const listAdmin = async (
  params?: OrderFilterParams
): Promise<PaginatedResponse<Order>> => {
  const response = await apiClient.get<PaginatedResponse<Order>>(
    "/admin/orders",
    { params }
  );
  return response.data;
};

/**
 * Order Service
 * Exporta todas as operações com pedidos
 */
export const orderService = {
  getById,
  listAdmin,
};
