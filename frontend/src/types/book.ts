/**
 * Book Types - Tipos relacionados a livros
 *
 * DTOs e interfaces para operações com livros
 * (público e admin)
 *
 * @module types/book
 */

import type { ResourceStatus } from "./api";
import type { Author } from "./author";

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
  /** Preço em reais */
  price: number;
  /** Quantidade em estoque */
  stock: number;
  /** Peso em gramas (para cálculo de frete) */
  weight: number;
  /** ISBN (opcional) */
  isbn?: string;
  /** URL da foto da capa */
  photoUrl?: string;
  /** Lista de autores */
  authors: Author[];
  /** Status (ACTIVE | INACTIVE) */
  status: ResourceStatus;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
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
  /** Preço em reais */
  price: number;
  /** URL da foto da capa */
  photoUrl?: string;
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
  /** Preço em reais */
  price: number;
  /** Quantidade inicial em estoque */
  stock: number;
  /** Peso em gramas */
  weight: number;
  /** ISBN (opcional) */
  isbn?: string;
  /** URL da foto da capa (opcional) */
  photoUrl?: string;
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
  /** Preço em reais */
  price: number;
  /** Peso em gramas */
  weight: number;
  /** ISBN (opcional) */
  isbn?: string;
  /** URL da foto da capa (opcional) */
  photoUrl?: string;
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
  bookId: string;
  /** Título do livro */
  title: string;
  /** Contagem (views ou clicks) */
  count: number;
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
  /** Retornar apenas livros com estoque baixo (<10) */
  lowStock?: boolean;
  /** Ordenação */
  sort?: string;
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
