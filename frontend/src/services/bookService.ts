/**
 * Book Service - Serviço de livros
 *
 * Gerencia operações com livros:
 * - Endpoints públicos (/api/public/books)
 * - Endpoints admin (/api/admin/books)
 *
 * @module services/bookService
 */

import { apiClient } from "@/lib/api-client";
import type {
  PaginatedResponse,
  StockAdjustment,
  MetricRequest,
} from "@/types/api";
import type {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  UpdateBookStatusRequest,
  BookMetrics,
  TopBook,
  AdminBookFilterParams,
  PublicBookFilterParams,
} from "@/types/book";

// ============================================================================
// ENDPOINTS PÚBLICOS
// ============================================================================

/**
 * Lista livros disponíveis (público, sem autenticação)
 *
 * @param params - Parâmetros de paginação e ordenação
 * @returns Lista paginada de livros
 *
 * @example
 * ```ts
 * const books = await bookService.listPublic({
 *   page: 0,
 *   size: 10,
 *   sort: "title,asc"
 * });
 * ```
 */
const listPublic = async (
  params?: PublicBookFilterParams
): Promise<PaginatedResponse<Book>> => {
  const response = await apiClient.get<PaginatedResponse<Book>>(
    "/public/books",
    { params }
  );
  return response.data;
};

/**
 * Busca detalhes de um livro (público)
 *
 * @param id - ID do livro
 * @returns Dados completos do livro
 *
 * @example
 * ```ts
 * const book = await bookService.getByIdPublic("123");
 * ```
 */
const getByIdPublic = async (id: string): Promise<Book> => {
  const response = await apiClient.get<Book>(`/public/books/${id}`);
  return response.data;
};

/**
 * Obtém top livros mais visualizados
 *
 * @param limit - Quantidade máxima de resultados (default: 10)
 * @returns Lista de livros mais visualizados
 *
 * @example
 * ```ts
 * const topBooks = await bookService.getMostViewed(5);
 * ```
 */
const getMostViewed = async (limit: number = 10): Promise<TopBook[]> => {
  const response = await apiClient.get<TopBook[]>("/public/books/most-viewed", {
    params: { limit },
  });
  return response.data;
};

/**
 * Obtém top livros mais clicados
 *
 * @param limit - Quantidade máxima de resultados (default: 10)
 * @returns Lista de livros mais clicados
 *
 * @example
 * ```ts
 * const topBooks = await bookService.getMostClicked(5);
 * ```
 */
const getMostClicked = async (limit: number = 10): Promise<TopBook[]> => {
  const response = await apiClient.get<TopBook[]>(
    "/public/books/most-clicked",
    {
      params: { limit },
    }
  );
  return response.data;
};

/**
 * Registra métrica de visualização ou clique
 *
 * @param id - ID do livro
 * @param eventType - Tipo do evento ("VIEW" | "CLICK")
 *
 * @example
 * ```ts
 * await bookService.trackMetric("123", "VIEW");
 * ```
 */
const trackMetric = async (
  id: string,
  eventType: "VIEW" | "CLICK"
): Promise<void> => {
  const data: MetricRequest = { eventType };
  await apiClient.post(`/public/books/${id}/metrics`, data);
};

// ============================================================================
// ENDPOINTS ADMIN
// ============================================================================

/**
 * Lista livros com filtros avançados (ADMIN)
 *
 * @param params - Parâmetros de filtro e paginação
 * @returns Lista paginada de livros
 *
 * @example
 * ```ts
 * const books = await bookService.listAdmin({
 *   page: 0,
 *   status: "ACTIVE",
 *   lowStock: true
 * });
 * ```
 */
const listAdmin = async (
  params?: AdminBookFilterParams
): Promise<PaginatedResponse<Book>> => {
  const response = await apiClient.get<PaginatedResponse<Book>>(
    "/admin/books",
    { params }
  );
  return response.data;
};

/**
 * Busca livro por ID (ADMIN)
 *
 * @param id - ID do livro
 * @returns Dados completos do livro
 *
 * @example
 * ```ts
 * const book = await bookService.getByIdAdmin("123");
 * ```
 */
const getByIdAdmin = async (id: string): Promise<Book> => {
  const response = await apiClient.get<Book>(`/admin/books/${id}`);
  return response.data;
};

/**
 * Cria um novo livro (ADMIN)
 *
 * @param data - Dados do novo livro
 * @returns Livro criado
 *
 * @example
 * ```ts
 * const book = await bookService.create({
 *   title: "Caminho da Esperança",
 *   description: "Uma jornada...",
 *   price: 45.90,
 *   stock: 100,
 *   weight: 300,
 *   authorIds: ["author-id-123"]
 * });
 * ```
 */
const create = async (data: CreateBookRequest): Promise<Book> => {
  const response = await apiClient.post<Book>("/admin/books", data);
  return response.data;
};

/**
 * Atualiza um livro existente (ADMIN)
 *
 * @param id - ID do livro
 * @param data - Dados atualizados
 * @returns Livro atualizado
 *
 * @example
 * ```ts
 * const updated = await bookService.update("123", {
 *   title: "Novo Título",
 *   price: 49.90,
 *   ...
 * });
 * ```
 */
const update = async (id: string, data: UpdateBookRequest): Promise<Book> => {
  const response = await apiClient.put<Book>(`/admin/books/${id}`, data);
  return response.data;
};

/**
 * Atualiza status do livro (ADMIN)
 *
 * @param id - ID do livro
 * @param status - Novo status
 *
 * @example
 * ```ts
 * await bookService.updateStatus("123", "INACTIVE");
 * ```
 */
const updateStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<void> => {
  const data: UpdateBookStatusRequest = { status };
  await apiClient.patch(`/admin/books/${id}/status`, data);
};

/**
 * Obtém métricas do livro (ADMIN)
 *
 * @param id - ID do livro
 * @returns Métricas de visualizações e cliques
 *
 * @example
 * ```ts
 * const metrics = await bookService.getMetrics("123");
 * console.log(metrics.views, metrics.clicks);
 * ```
 */
const getMetrics = async (id: string): Promise<BookMetrics> => {
  const response = await apiClient.get<BookMetrics>(
    `/admin/books/${id}/metrics`
  );
  return response.data;
};

/**
 * Ajusta estoque do livro (ADMIN)
 *
 * @param id - ID do livro
 * @param adjustment - Ajuste a ser feito (ADD, REMOVE, SET)
 * @returns Livro com estoque atualizado
 *
 * @example
 * ```ts
 * // Adiciona 50 unidades
 * await bookService.adjustStock("123", {
 *   operation: "ADD",
 *   quantity: 50,
 *   reason: "Reposição"
 * });
 *
 * // Define estoque para 100
 * await bookService.adjustStock("123", {
 *   operation: "SET",
 *   quantity: 100
 * });
 * ```
 */
const adjustStock = async (
  id: string,
  adjustment: StockAdjustment
): Promise<Book> => {
  const response = await apiClient.patch<Book>(
    `/admin/books/${id}/stock`,
    adjustment
  );
  return response.data;
};

/**
 * Book Service
 * Exporta todas as operações com livros (público e admin)
 */
export const bookService = {
  // Público
  listPublic,
  getByIdPublic,
  getMostViewed,
  getMostClicked,
  trackMetric,
  // Admin
  listAdmin,
  getByIdAdmin,
  create,
  update,
  updateStatus,
  getMetrics,
  adjustStock,
};
