/**
 * CEP Types - Tipos relacionados a consulta de CEP
 *
 * @module types/cep
 */

export interface CepLookupResponse {
  atualizadoEm?: string;
  cep: string;
  codigoMunicipio?: number;
  logradouro?: string;
  numero?: string | null;
  bairro?: string;
  cidade?: string;
  uf?: string;
}
