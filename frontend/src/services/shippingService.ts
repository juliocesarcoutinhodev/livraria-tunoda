/**
 * Shipping Service - Serviço de cálculo de frete
 *
 * Gerencia operações de cotação e seleção de frete
 *
 * @module services/shippingService
 */

import { apiClient } from "@/lib/api-client";
import type {
  ShippingQuote,
  CreateShippingQuoteRequest,
  SelectShippingOptionRequest,
} from "@/types/shipping";

/**
 * Cria uma cotação de frete
 *
 * @param data - Dados da cotação (cartId, toPostalCode)
 * @returns Cotação criada (ainda sem opções calculadas)
 *
 * @example
 * ```ts
 * const quote = await shippingService.createQuote({
 *   cartId: "cart-123",
 *   toPostalCode: "12345678"
 * });
 * ```
 */
const createQuote = async (
  data: CreateShippingQuoteRequest
): Promise<ShippingQuote> => {
  const response = await apiClient.post<ShippingQuote>(
    "/shipping/quotes",
    data
  );
  return response.data;
};

/**
 * Calcula opções de frete para uma cotação
 *
 * @param id - ID da cotação
 * @returns Cotação com opções de frete calculadas
 *
 * @example
 * ```ts
 * const quote = await shippingService.calculate("quote-123");
 * console.log(quote.options); // [PAC, SEDEX, ...]
 * ```
 */
const calculate = async (id: string): Promise<ShippingQuote> => {
  const response = await apiClient.post<ShippingQuote>(
    `/shipping/quotes/${id}/calculate`
  );
  return response.data;
};

/**
 * Busca uma cotação por ID
 *
 * @param id - ID da cotação
 * @returns Dados da cotação
 *
 * @example
 * ```ts
 * const quote = await shippingService.getById("quote-123");
 * ```
 */
const getById = async (id: string): Promise<ShippingQuote> => {
  const response = await apiClient.get<ShippingQuote>(`/shipping/quotes/${id}`);
  return response.data;
};

/**
 * Seleciona uma opção de frete
 *
 * @param id - ID da cotação
 * @param serviceCode - Código do serviço escolhido (ex: "PAC")
 * @returns Cotação atualizada com serviço selecionado
 *
 * @example
 * ```ts
 * const quote = await shippingService.selectOption("quote-123", "PAC");
 * ```
 */
const selectOption = async (
  id: string,
  serviceCode: string
): Promise<ShippingQuote> => {
  const data: SelectShippingOptionRequest = { serviceCode };
  const response = await apiClient.put<ShippingQuote>(
    `/shipping/quotes/${id}/select`,
    data
  );
  return response.data;
};

/**
 * Shipping Service
 * Exporta todas as operações de cálculo de frete
 */
export const shippingService = {
  createQuote,
  calculate,
  getById,
  selectOption,
};
