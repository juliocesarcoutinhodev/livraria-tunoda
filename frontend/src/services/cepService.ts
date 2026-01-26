/**
 * CEP Service - Consulta de endereco por CEP
 *
 * @module services/cepService
 */

import { apiClient } from "@/lib/api-client";
import type { CepLookupResponse } from "@/types/cep";

const getByCep = async (cep: string): Promise<CepLookupResponse> => {
  const response = await apiClient.get<CepLookupResponse>(`/public/cep/${cep}`);
  return response.data;
};

export const cepService = {
  getByCep,
};
