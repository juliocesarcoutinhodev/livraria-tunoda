/**
 * Author Service - Serviço de autores (ADMIN)
 *
 * Gerencia operações CRUD de autores.
 * Requer autenticação com ROLE_ADMIN.
 *
 * @module services/authorService
 */

import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";
import type {
  Author,
  CreateAuthorRequest,
  UpdateAuthorRequest,
  UpdateAuthorStatusRequest,
  AuthorFilterParams,
} from "@/types/author";

/**
 * Lista autores com paginação e filtros
 *
 * @param params - Parâmetros de paginação e filtros
 * @returns Lista paginada de autores
 *
 * @example
 * ```ts
 * const authors = await authorService.list({
 *   page: 0,
 *   size: 10,
 *   status: "ACTIVE"
 * });
 * ```
 */
const list = async (
  params?: AuthorFilterParams
): Promise<PaginatedResponse<Author>> => {
  const response = await apiClient.get<PaginatedResponse<Author>>(
    "/admin/authors",
    { params }
  );
  return response.data;
};

/**
 * Busca um autor por ID
 *
 * @param id - ID do autor
 * @returns Dados do autor
 *
 * @example
 * ```ts
 * const author = await authorService.getById("123");
 * ```
 */
const getById = async (id: string): Promise<Author> => {
  const response = await apiClient.get<Author>(`/admin/authors/${id}`);
  return response.data;
};

/**
 * Cria um novo autor
 *
 * @param data - Dados do novo autor
 * @returns Autor criado
 *
 * @example
 * ```ts
 * const author = await authorService.create({
 *   name: "Pastor Tunoda",
 *   biography: "Missionário no Japão",
 *   photoUrl: "https://..."
 * });
 * ```
 */
const create = async (data: CreateAuthorRequest): Promise<Author> => {
  const response = await apiClient.post<Author>("/admin/authors", data);
  return response.data;
};

/**
 * Atualiza um autor existente
 *
 * @param id - ID do autor
 * @param data - Dados atualizados
 * @returns Autor atualizado
 *
 * @example
 * ```ts
 * const updated = await authorService.update("123", {
 *   name: "Novo Nome",
 *   biography: "Nova biografia"
 * });
 * ```
 */
const update = async (
  id: string,
  data: UpdateAuthorRequest
): Promise<Author> => {
  const response = await apiClient.put<Author>(`/admin/authors/${id}`, data);
  return response.data;
};

/**
 * Atualiza o status do autor (ACTIVE/INACTIVE)
 *
 * @param id - ID do autor
 * @param status - Novo status
 *
 * @example
 * ```ts
 * await authorService.updateStatus("123", "INACTIVE");
 * ```
 */
const updateStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<void> => {
  const data: UpdateAuthorStatusRequest = { status };
  await apiClient.patch(`/admin/authors/${id}/status`, data);
};

/**
 * Author Service
 * Exporta todas as operações com autores (ADMIN)
 */
export const authorService = {
  list,
  getById,
  create,
  update,
  updateStatus,
};
