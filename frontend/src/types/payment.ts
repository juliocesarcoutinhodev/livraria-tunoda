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
  | "CREATED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

/**
 * Método de pagamento
 */
export type PaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PIX"
  | "BOLETO"
  | "BANK_TRANSFER";

/**
 * Pagamento
 */
export interface Payment {
  /** ID único do pagamento */
  paymentId: string;
  /** ID do pedido associado */
  orderId: string;
  /** Valor do pagamento */
  amount: number;
  /** Moeda */
  currency: string;
  /** Status do pagamento */
  status: PaymentStatus;
  /** Método de pagamento */
  method: PaymentMethod;
  /** Gateway utilizado (ex: MERCADO_PAGO) */
  gateway: string;
  /** Referência externa no gateway */
  externalReference?: string | null;
  /** Motivo de rejeição, quando aplicável */
  rejectionReason?: string | null;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
  updatedAt?: string | null;
}

/**
 * Requisição para criar pagamento
 * POST /api/orders/{orderId}/payments
 */
export interface CreatePaymentRequest {
  /** Método de pagamento */
  paymentMethod: PaymentMethod;
}

export interface ProcessPaymentResponse {
  /** Dados do pagamento atualizado */
  payment: Payment;
  /** URL de pagamento (Mercado Pago) */
  paymentUrl: string;
}
