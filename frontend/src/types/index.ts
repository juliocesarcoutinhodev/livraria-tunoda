/**
 * Types Barrel Export
 *
 * Exporta todos os tipos TypeScript em um único arquivo.
 * Facilita imports e mantém organização.
 *
 * @module types
 */

// ============================================================================
// API - Tipos comuns
// ============================================================================
export type {
  ApiErrorResponse,
  ValidationError,
  PaginatedResponse,
  PaginationParams,
  ResourceStatus,
  WeightUnit,
  Currency,
  StockOperation,
  StockAdjustment,
  MetricEventType,
  MetricRequest,
  EmptyResponse,
} from "./api";

// ============================================================================
// Auth - Autenticação
// ============================================================================
export type {
  LoginRequest,
  AuthenticationResponse,
  RefreshTokenRequest,
  User,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "./auth";

// ============================================================================
// Author - Autores
// ============================================================================
export type {
  Author,
  AuthorSummary,
  CreateAuthorRequest,
  UpdateAuthorRequest,
  UpdateAuthorStatusRequest,
  AuthorFilterParams,
} from "./author";

// ============================================================================
// Book - Livros
// ============================================================================
export type {
  Book,
  BookSummary,
  CreateBookRequest,
  UpdateBookRequest,
  UpdateBookStatusRequest,
  BookMetrics,
  TopBook,
  AdminBookFilterParams,
  PublicBookFilterParams,
} from "./book";

// ============================================================================
// Cart - Carrinho
// ============================================================================
export type {
  CartItem,
  Cart,
  AddItemToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "./cart";

// ============================================================================
// Shipping - Frete
// ============================================================================
export type {
  ShippingQuoteStatus,
  ShippingOption,
  ShippingQuote,
  CreateShippingQuoteRequest,
  SelectShippingOptionRequest,
} from "./shipping";

// ============================================================================
// Order - Pedidos
// ============================================================================
export type {
  OrderStatus,
  OrderItem,
  OrderShipping,
  Order,
  OrderFilterParams,
  OrderLookupRequest,
  OrderLookupResponse,
} from "./order";

// ============================================================================
// Payment - Pagamentos
// ============================================================================
export type {
  PaymentStatus,
  PaymentMethod,
  Payment,
  CreatePaymentRequest,
  ProcessPaymentResponse,
} from "./payment";
