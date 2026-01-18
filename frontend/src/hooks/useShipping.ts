/**
 * Shipping Hooks - React Query hooks para cálculo de frete
 *
 * Hooks para gerenciar cotações de frete.
 *
 * @module hooks/useShipping
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { shippingService } from "@/services/shippingService";
import { queryKeys } from "@/lib/react-query";
import type {
  ShippingQuote,
  CreateShippingQuoteRequest,
} from "@/types/shipping";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para buscar cotação de frete por ID
 *
 * @param id - ID da cotação
 * @param options - Opções adicionais do useQuery
 * @returns Query com dados da cotação
 *
 * @example
 * ```tsx
 * function ShippingOptions({ quoteId }: { quoteId: string }) {
 *   const { data: quote, isLoading } = useShippingQuote(quoteId);
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       {quote?.options.map(option => (
 *         <div key={option.serviceCode}>
 *           <p>{option.serviceName}</p>
 *           <p>R$ {option.price}</p>
 *           <p>{option.deliveryDays} dias</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useShippingQuote(
  id: string,
  options?: Omit<UseQueryOptions<ShippingQuote>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.shipping.quote(id),
    queryFn: () => shippingService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para criar cotação de frete
 *
 * @returns Mutation para criar cotação
 *
 * @example
 * ```tsx
 * function ShippingCalculator({ cartId }: { cartId: string }) {
 *   const createQuote = useCreateShippingQuote();
 *   const [cep, setCep] = useState("");
 *
 *   const handleCalculate = () => {
 *     createQuote.mutate({
 *       cartId,
 *       toPostalCode: cep
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <input value={cep} onChange={(e) => setCep(e.target.value)} />
 *       <button onClick={handleCalculate}>Calcular frete</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCreateShippingQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShippingQuoteRequest) =>
      shippingService.createQuote(data),
    onSuccess: (quote) => {
      queryClient.setQueryData(queryKeys.shipping.quote(quote.id), quote);
    },
  });
}

/**
 * Hook para calcular opções de frete
 *
 * @returns Mutation para calcular opções
 *
 * @example
 * ```tsx
 * function CalculateShipping({ quoteId }: { quoteId: string }) {
 *   const calculate = useCalculateShipping();
 *
 *   const handleCalculate = () => {
 *     calculate.mutate(quoteId, {
 *       onSuccess: (quote) => {
 *         console.log("Opções:", quote.options);
 *       }
 *     });
 *   };
 *
 *   return <button onClick={handleCalculate}>Calcular</button>;
 * }
 * ```
 */
export function useCalculateShipping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: string) => shippingService.calculate(quoteId),
    onSuccess: (quote) => {
      queryClient.setQueryData(queryKeys.shipping.quote(quote.id), quote);
    },
  });
}

/**
 * Hook para selecionar opção de frete
 *
 * @returns Mutation para selecionar opção
 *
 * @example
 * ```tsx
 * function ShippingOption({ quoteId, option }: Props) {
 *   const selectOption = useSelectShippingOption();
 *
 *   const handleSelect = () => {
 *     selectOption.mutate({
 *       quoteId,
 *       serviceCode: option.serviceCode
 *     });
 *   };
 *
 *   return <button onClick={handleSelect}>Selecionar {option.serviceName}</button>;
 * }
 * ```
 */
export function useSelectShippingOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quoteId,
      serviceCode,
    }: {
      quoteId: string;
      serviceCode: string;
    }) => shippingService.selectOption(quoteId, serviceCode),
    onSuccess: (quote) => {
      queryClient.setQueryData(queryKeys.shipping.quote(quote.id), quote);
    },
  });
}
