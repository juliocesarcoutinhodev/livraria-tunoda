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
  CreatePaymentResponse,
} from "@/types/payment";

/**
 * Cria um pagamento para um pedido
 *
 * @param data - Dados do pagamento (orderId)
 * @returns Dados do pagamento criado com URL de aprovação
 *
 * @example
 * ```ts
 * const payment = await paymentService.create({
 *   orderId: "order-123"
 * });
 * // Redirecionar usuário para payment.approvalUrl
 * window.location.href = payment.approvalUrl;
 * ```
 */
const create = async (
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  const response = await apiClient.post<CreatePaymentResponse>(
    "/payments",
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
 * Payment Service
 * Exporta todas as operações com pagamentos
 */
export const paymentService = {
  create,
  getById,
};
