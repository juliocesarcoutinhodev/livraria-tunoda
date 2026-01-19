/**
 * Payments Hooks - React Query hooks para pagamentos
 *
 * Hooks para gerenciar pagamentos (Mercado Pago).
 *
 * @module hooks/usePayments
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";
import { queryKeys } from "@/lib/react-query";
import type { Payment, CreatePaymentRequest } from "@/types/payment";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para buscar pagamento por ID
 *
 * @param id - ID do pagamento
 * @param options - Opções adicionais do useQuery
 * @returns Query com dados do pagamento
 *
 * @example
 * ```tsx
 * function PaymentStatus({ id }: { id: string }) {
 *   const { data: payment, isLoading } = usePayment(id);
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       <h2>Status do Pagamento</h2>
 *       <p>Status: {payment?.status}</p>
 *       <p>Valor: R$ {payment?.amount}</p>
 *       <p>Método: {payment?.method}</p>
 *       {payment?.qrCode && (
 *         <img src={payment.qrCode} alt="QR Code PIX" />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePayment(
  id: string,
  options?: Omit<UseQueryOptions<Payment>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => paymentService.getById(id),
    staleTime: 30 * 1000, // 30 segundos (status muda frequentemente)
    refetchInterval: 30 * 1000, // Refetch a cada 30s para atualizar status
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para criar pagamento
 *
 * @returns Mutation para criar pagamento
 *
 * @example
 * ```tsx
 * function PaymentButton({ orderId }: { orderId: string }) {
 *   const createPayment = useCreatePayment();
 *
 *   const handlePay = () => {
 *     createPayment.mutate({ orderId }, {
 *       onSuccess: (payment) => {
 *         if (payment.approvalUrl) {
 *           // Redireciona para Mercado Pago
 *           window.location.href = payment.approvalUrl;
 *         }
 *       }
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handlePay} disabled={createPayment.isPending}>
 *       {createPayment.isPending ? "Processando..." : "Pagar"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.create(data),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(payment.id), payment);
    },
  });
}
