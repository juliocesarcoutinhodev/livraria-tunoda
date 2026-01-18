/**
 * Payment Types - Tipos relacionados a pagamentos
 *
 * DTOs e interfaces para operações com pagamentos
 * (integração com Mercado Pago)
 *
 * @module types/payment
 */

/**
 * Status do pagamento
 */
export type PaymentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "REFUNDED";

/**
 * Método de pagamento
 */
export type PaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PIX"
  | "BOLETO"
  | "OTHER";

/**
 * Pagamento
 */
export interface Payment {
  /** ID único do pagamento */
  id: string;
  /** ID do pedido associado */
  orderId: string;
  /** Valor do pagamento */
  amount: number;
  /** Status do pagamento */
  status: PaymentStatus;
  /** Método de pagamento */
  method?: PaymentMethod;
  /** ID externo (Mercado Pago) */
  externalId?: string;
  /** URL para aprovação (caso necessário) */
  approvalUrl?: string;
  /** Código QR para PIX */
  qrCode?: string;
  /** Texto do QR Code PIX */
  qrCodeText?: string;
  /** URL do boleto */
  boletoUrl?: string;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
  updatedAt?: string;
  /** Data de aprovação */
  approvedAt?: string;
}

/**
 * Requisição para criar pagamento
 * POST /api/payments
 */
export interface CreatePaymentRequest {
  /** ID do pedido */
  orderId: string;
}

/**
 * Resposta da criação de pagamento
 */
export interface CreatePaymentResponse {
  /** ID do pagamento */
  id: string;
  /** Status inicial */
  status: PaymentStatus;
  /** URL para aprovação (redirect) */
  approvalUrl?: string;
  /** Código QR PIX */
  qrCode?: string;
  /** Texto do QR Code PIX */
  qrCodeText?: string;
}
