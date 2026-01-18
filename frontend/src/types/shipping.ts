/**
 * Shipping Types - Tipos relacionados a frete
 *
 * DTOs e interfaces para cálculo e cotação de frete
 *
 * @module types/shipping
 */

/**
 * Status da cotação de frete
 */
export type ShippingQuoteStatus =
  | "PENDING"
  | "CALCULATED"
  | "SELECTED"
  | "EXPIRED";

/**
 * Opção de frete disponível
 */
export interface ShippingOption {
  /** Código do serviço (ex: "PAC", "SEDEX") */
  serviceCode: string;
  /** Nome do serviço */
  serviceName: string;
  /** Preço do frete */
  price: number;
  /** Prazo de entrega em dias */
  deliveryDays: number;
  /** Empresa transportadora */
  carrier: string;
}

/**
 * Cotação de frete
 */
export interface ShippingQuote {
  /** ID único da cotação */
  id: string;
  /** ID do carrinho */
  cartId: string;
  /** CEP de destino */
  toPostalCode: string;
  /** Opções de frete disponíveis */
  options: ShippingOption[];
  /** Código do serviço selecionado */
  selectedServiceCode?: string;
  /** Status da cotação */
  status: ShippingQuoteStatus;
  /** Data de expiração */
  expiresAt: string;
  /** Data de criação */
  createdAt: string;
}

/**
 * Requisição para criar cotação de frete
 * POST /api/shipping/quotes
 */
export interface CreateShippingQuoteRequest {
  /** ID do carrinho */
  cartId: string;
  /** CEP de destino (apenas números) */
  toPostalCode: string;
}

/**
 * Requisição para selecionar opção de frete
 * POST /api/shipping/quotes/{id}/select
 */
export interface SelectShippingOptionRequest {
  /** Código do serviço escolhido */
  serviceCode: string;
}
