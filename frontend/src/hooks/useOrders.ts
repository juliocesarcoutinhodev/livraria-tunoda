/**
 * Orders Hooks - React Query hooks para pedidos
 *
 * Hooks para gerenciar pedidos.
 *
 * @module hooks/useOrders
 */

import {
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { queryKeys } from "@/lib/react-query";
import type { Order, OrderFilterParams } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para buscar pedido por ID
 *
 * @param id - ID do pedido
 * @param options - Opções adicionais do useQuery
 * @returns Query com dados do pedido
 *
 * @example
 * ```tsx
 * function OrderDetail({ id }: { id: string }) {
 *   const { data: order, isLoading } = useOrder(id);
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       <h1>Pedido #{order?.id}</h1>
 *       <p>Status: {order?.status}</p>
 *       <p>Total: R$ {order?.total}</p>
 *       {order?.items.map(item => (
 *         <div key={item.bookId}>
 *           <p>{item.title} x {item.quantity}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOrder(
  id: string,
  options?: Omit<UseQueryOptions<Order>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getById(id),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook para listar pedidos (ADMIN)
 *
 * @param filters - Filtros de paginação e status
 * @param options - Opções adicionais do useQuery
 * @returns Query com lista paginada de pedidos
 *
 * @example
 * ```tsx
 * function AdminOrdersList() {
 *   const { data, isLoading } = useOrdersAdmin({
 *     page: 0,
 *     size: 20,
 *     status: "PENDING_PAYMENT"
 *   });
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <table>
 *       {data?.content.map(order => (
 *         <tr key={order.id}>
 *           <td>{order.id}</td>
 *           <td>{order.customerEmail}</td>
 *           <td>{order.status}</td>
 *           <td>R$ {order.total}</td>
 *         </tr>
 *       ))}
 *     </table>
 *   );
 * }
 * ```
 */
export function useOrdersAdmin(
  filters?: OrderFilterParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Order>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => orderService.listAdmin(filters),
    staleTime: 1 * 60 * 1000, // 1 minuto
    ...options,
  });
}
