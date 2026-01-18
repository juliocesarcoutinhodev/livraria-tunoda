/**
 * Author Types - Tipos relacionados a autores
 *
 * DTOs e interfaces para operações com autores
 * (apenas ADMIN tem acesso)
 *
 * @module types/author
 */

import type { ResourceStatus } from "./api";

/**
 * Autor completo
 * Retornado em listagens e detalhes
 */
export interface Author {
  /** ID único do autor */
  id: string;
  /** Nome completo do autor */
  name: string;
  /** Biografia/descrição do autor */
  biography: string;
  /** URL da foto do autor */
  photoUrl?: string;
  /** Status (ACTIVE | INACTIVE) */
  status: ResourceStatus;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
  updatedAt?: string;
}

/**
 * Requisição para criar autor
 * POST /api/admin/authors
 */
export interface CreateAuthorRequest {
  /** Nome completo do autor */
  name: string;
  /** Biografia/descrição */
  biography: string;
  /** URL da foto (opcional) */
  photoUrl?: string;
}

/**
 * Requisição para atualizar autor
 * PUT /api/admin/authors/{id}
 */
export interface UpdateAuthorRequest {
  /** Nome completo do autor */
  name: string;
  /** Biografia/descrição */
  biography: string;
  /** URL da foto (opcional) */
  photoUrl?: string;
}

/**
 * Requisição para alterar status do autor
 * PATCH /api/admin/authors/{id}/status
 */
export interface UpdateAuthorStatusRequest {
  /** Novo status */
  status: ResourceStatus;
}

/**
 * Parâmetros de filtro para listagem de autores
 * GET /api/admin/authors
 */
export interface AuthorFilterParams {
  /** Número da página (zero-based) */
  page?: number;
  /** Tamanho da página */
  size?: number;
  /** Filtrar por status */
  status?: ResourceStatus;
  /** Ordenação */
  sort?: string;
}
