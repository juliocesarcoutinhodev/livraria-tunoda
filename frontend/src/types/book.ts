/**
 * Book Types - Tipos relacionados a livros
 *
 * DTOs e interfaces para operações com livros
 * (público e admin)
 *
 * @module types/book
 */

import type { ResourceStatus, WeightUnit, Currency } from "./api";
import type { AuthorSummary } from "./author";

/**
 * Livro completo
 * Usado em listagens e detalhes
 */
export interface Book {
  /** ID único do livro */
  id: string;
  /** Título do livro */
  title: string;
  /** Descrição/sinopse */
  description: string;
  /** URL da foto da capa */
  photoUrl: string | null;
  /** ISBN (opcional) */
  isbn: string | null;
  /** Preço */
  price: number;
  /** Moeda do preço (BRL, USD, EUR) */
  currency: Currency;
  /** Peso */
  weight: number;
  /** Unidade de peso (KG ou G) */
  weightUnit: WeightUnit;
  /** Quantidade em estoque */
  stock: number;
  /** Status (ACTIVE | INACTIVE) */
  status: "ACTIVE" | "INACTIVE";
  /** Lista de autores (resumida) */
  authors: AuthorSummary[];
  /** Data de criação (opcional para resposta pública) */
  createdAt?: string;
  /** Data da última atualização (opcional para resposta pública) */
  updatedAt?: string;
}

/**
 * Livro resumido (usado em listas públicas)
 */
export interface BookSummary {
  /** ID único do livro */
  id: string;
  /** Título do livro */
  title: string;
  /** Descrição resumida */
  description: string;
  /** Preço */
  price: number;
  /** Moeda do preço */
  currency: Currency;
  /** URL da foto da capa */
  photoUrl: string | null;
  /** Nome dos autores (string concatenada) */
  authorsNames: string;
}

/**
 * Requisição para criar livro
 * POST /api/admin/books
 */
export interface CreateBookRequest {
  /** Título do livro */
  title: string;
  /** Descrição/sinopse */
  description: string;
  /** URL da foto da capa (opcional) */
  photoUrl?: string;
  /** ISBN (opcional) */
  isbn?: string;
  /** Preço */
  price: number;
  /** Moeda (default: BRL) */
  currency?: Currency;
  /** Peso */
  weight: number;
  /** Unidade de peso (default: G) */
  weightUnit?: WeightUnit;
  /** Quantidade inicial em estoque */
  stock: number;
  /** IDs dos autores */
  authorIds: string[];
}

/**
 * Requisição para atualizar livro
 * PUT /api/admin/books/{id}
 */
export interface UpdateBookRequest {
  /** Título do livro */
  title: string;
  /** Descrição/sinopse */
  description: string;
  /** URL da foto da capa (opcional) */
  photoUrl?: string;
  /** ISBN (opcional) */
  isbn?: string;
  /** Preço */
  price: number;
  /** Moeda */
  currency?: Currency;
  /** Peso */
  weight: number;
  /** Unidade de peso */
  weightUnit?: WeightUnit;
  /** Status do livro */
  status: ResourceStatus;
  /** Estoque */
  stock: number;
  /** IDs dos autores */
  authorIds: string[];
}

/**
 * Requisição para alterar status do livro
 * PATCH /api/admin/books/{id}/status
 */
export interface UpdateBookStatusRequest {
  /** Novo status */
  status: ResourceStatus;
}

/**
 * Métricas do livro
 * GET /api/admin/books/{id}/metrics
 */
export interface BookMetrics {
  /** Total de visualizações */
  views: number;
  /** Total de cliques */
  clicks: number;
  /** Data da última visualização */
  lastViewedAt?: string;
}

/**
 * Top livro (mais visualizado ou clicado)
 */
export interface TopBook {
  /** ID do livro */
  id: string;
  /** Título do livro */
  title: string;
  /** URL da foto da capa */
  photoUrl: string | null;
  /** Contagem (views ou clicks) */
  totalMetrics: number;
}

/**
 * Resposta do backend para livros mais visualizados/clicados
 */
export interface TopBooksResponse {
  /** Lista de livros */
  books: TopBook[];
  /** Data/hora da geração */
  generatedAt: string;
}

/**
 * Parâmetros de filtro para listagem de livros (ADMIN)
 * GET /api/admin/books
 */
export interface AdminBookFilterParams {
  /** Número da página (zero-based) */
  page?: number;
  /** Tamanho da página */
  size?: number;
  /** Filtrar por status */
  status?: ResourceStatus;
  /** Filtrar por autor */
  authorId?: string;
  /** Buscar por título (case-insensitive, busca parcial) */
  title?: string;
  /** Retornar apenas livros com estoque baixo (<5) */
  lowStock?: boolean;
  /** Campo para ordenação (ex: title, price, createdAt) */
  sortBy?: string;
  /** Direção da ordenação (asc ou desc) */
  sortDirection?: "asc" | "desc";
}

/**
 * Parâmetros de filtro para listagem pública
 * GET /api/public/books
 */
export interface PublicBookFilterParams {
  /** Número da página (zero-based) */
  page?: number;
  /** Tamanho da página */
  size?: number;
  /** Ordenação */
  sort?: string;
}
