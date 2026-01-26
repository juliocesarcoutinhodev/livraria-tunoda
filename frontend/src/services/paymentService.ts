/**
 * Payment Service - Serviço de pagamentos
 *
 * Gerencia operações de pagamento (Mercado Pago)
 *
 * @module services/paymentService
 */

import { apiClient } from "@/lib/api-client";
import type {
  Payment,
  CreatePaymentRequest,
  ProcessPaymentResponse,
} from "@/types/payment";

/**
 * Cria um pagamento para um pedido
 *
 * @param orderId - ID do pedido
 * @param data - Dados do pagamento (paymentMethod)
 * @returns Dados do pagamento criado
 *
 * @example
 * ```ts
 * const payment = await paymentService.create("order-123", {
 *   paymentMethod: "PIX"
 * });
 * ```
 */
const create = async (
  orderId: string,
  data: CreatePaymentRequest
): Promise<Payment> => {
  const response = await apiClient.post<Payment>(
    `/orders/${orderId}/payments`,
    data
  );
  return response.data;
};

/**
 * Busca um pagamento por ID
 *
 * @param id - ID do pagamento
 * @returns Dados completos do pagamento
 *
 * @example
 * ```ts
 * const payment = await paymentService.getById("payment-123");
 * console.log(payment.status, payment.method);
 * ```
 */
const getById = async (id: string): Promise<Payment> => {
  const response = await apiClient.get<Payment>(`/payments/${id}`);
  return response.data;
};

/**
 * Processa um pagamento no gateway (Mercado Pago)
 *
 * @param paymentId - ID do pagamento
 * @returns URL de pagamento + dados atualizados
 *
 * @example
 * ```ts
 * const result = await paymentService.process("payment-123");
 * window.open(result.paymentUrl, "_blank");
 * ```
 */
const process = async (paymentId: string): Promise<ProcessPaymentResponse> => {
  const response = await apiClient.post<ProcessPaymentResponse>(
    `/payments/${paymentId}/process`
  );
  return response.data;
};

/**
 * Payment Service
 * Exporta todas as operações com pagamentos
 */
export const paymentService = {
  create,
  getById,
  process,
};
