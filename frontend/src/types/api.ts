/**
 * API Types - Tipos comuns usados em toda a API
 *
 * Interfaces e tipos genéricos compartilhados entre
 * diferentes módulos da aplicação.
 *
 * @module types/api
 */

/**
 * Formato padrão de erro da API
 * Baseado no GlobalExceptionHandler do backend
 */
export interface ApiErrorResponse {
  /** Timestamp do erro */
  timestamp: string;
  /** Código HTTP do erro */
  status: number;
  /** Nome do erro (ex: "Not Found") */
  error: string;
  /** Mensagem descritiva do erro */
  message: string;
  /** Path da requisição que gerou o erro */
  path: string;
  /** ID de correlação para rastreamento */
  correlationId?: string;
  /** Erros de validação (quando status = 422) */
  errors?: ValidationError[];
}

/**
 * Erro de validação de campo
 */
export interface ValidationError {
  /** Nome do campo com erro */
  field: string;
  /** Mensagem de erro do campo */
  message: string;
}

/**
 * Resposta paginada genérica
 * Usada em endpoints que retornam listas com paginação
 *
 * @template T - Tipo dos itens no array content
 */
export interface PaginatedResponse<T> {
  /** Array de itens da página atual */
  content: T[];
  /** Número da página atual (zero-based) */
  page: number;
  /** Tamanho da página */
  size: number;
  /** Total de elementos em todas as páginas */
  totalElements: number;
  /** Total de páginas */
  totalPages: number;
  /** Indica se é a primeira página */
  first?: boolean;
  /** Indica se é a última página */
  last?: boolean;
}

/**
 * Parâmetros de paginação para requisições
 */
export interface PaginationParams {
  /** Número da página (zero-based, default: 0) */
  page?: number;
  /** Tamanho da página (default: 10) */
  size?: number;
  /** Ordenação (ex: "title,asc" ou "createdAt,desc") */
  sort?: string;
}

/**
 * Status de recursos (autores, livros, etc)
 */
export type ResourceStatus = "ACTIVE" | "INACTIVE";

/**
 * Tipos de operações em estoque
 */
export type StockOperation = "ADD" | "REMOVE" | "SET";

/**
 * Ajuste de estoque
 */
export interface StockAdjustment {
  /** Tipo de operação */
  operation: StockOperation;
  /** Quantidade a ajustar */
  quantity: number;
  /** Motivo do ajuste (opcional) */
  reason?: string;
}

/**
 * Tipo de evento de métrica
 */
export type MetricEventType = "VIEW" | "CLICK";

/**
 * Requisição para registrar métrica
 */
export interface MetricRequest {
  /** Tipo do evento */
  eventType: MetricEventType;
}

/**
 * Resposta vazia (204 No Content)
 */
export type EmptyResponse = void;
