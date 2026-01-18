/**
 * Authors Hooks - React Query hooks para autores
 *
 * Hooks para gerenciar dados de autores (ADMIN apenas).
 * Requer autenticação com ROLE_ADMIN.
 *
 * @module hooks/useAuthors
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { authorService } from "@/services/authorService";
import { queryKeys, invalidateQueries } from "@/lib/react-query";
import type {
  Author,
  CreateAuthorRequest,
  UpdateAuthorRequest,
  AuthorFilterParams,
} from "@/types/author";
import type { PaginatedResponse } from "@/types/api";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para listar autores com paginação e filtros (ADMIN)
 *
 * @param filters - Filtros de paginação, status e ordenação
 * @param options - Opções adicionais do useQuery
 * @returns Query com lista paginada de autores
 *
 * @example
 * ```tsx
 * function AuthorsList() {
 *   const { data, isLoading } = useAuthors({
 *     page: 0,
 *     size: 10,
 *     status: "ACTIVE"
 *   });
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       {data?.content.map(author => (
 *         <AuthorCard key={author.id} author={author} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuthors(
  filters?: AuthorFilterParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Author>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.authors.list(filters),
    queryFn: () => authorService.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}

/**
 * Hook para buscar detalhes de um autor específico (ADMIN)
 *
 * @param id - ID do autor
 * @param options - Opções adicionais do useQuery
 * @returns Query com dados completos do autor
 *
 * @example
 * ```tsx
 * function AuthorDetail({ id }: { id: string }) {
 *   const { data: author, isLoading } = useAuthorDetail(id);
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       <h1>{author?.name}</h1>
 *       <p>{author?.biography}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuthorDetail(
  id: string,
  options?: Omit<UseQueryOptions<Author>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.authors.detail(id),
    queryFn: () => authorService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id,
    ...options,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para criar um novo autor (ADMIN)
 *
 * @returns Mutation para criar autor
 *
 * @example
 * ```tsx
 * function CreateAuthorForm() {
 *   const createAuthor = useCreateAuthor();
 *
 *   const handleSubmit = async (data: CreateAuthorRequest) => {
 *     await createAuthor.mutateAsync(data);
 *     toast.success("Autor criado com sucesso!");
 *   };
 *
 *   return <form onSubmit={handleSubmit}>{/* fields *\/}</form>;
 * }
 * ```
 */
export function useCreateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuthorRequest) => authorService.create(data),
    onSuccess: () => {
      invalidateQueries.authors(queryClient);
    },
  });
}

/**
 * Hook para atualizar um autor existente (ADMIN)
 *
 * @returns Mutation para atualizar autor
 *
 * @example
 * ```tsx
 * function EditAuthorForm({ authorId }: { authorId: string }) {
 *   const updateAuthor = useUpdateAuthor();
 *
 *   const handleSubmit = async (data: UpdateAuthorRequest) => {
 *     await updateAuthor.mutateAsync({ id: authorId, data });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>{/* fields *\/}</form>;
 * }
 * ```
 */
export function useUpdateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuthorRequest }) =>
      authorService.update(id, data),
    onSuccess: (updatedAuthor) => {
      // Atualiza cache do autor específico
      queryClient.setQueryData(
        queryKeys.authors.detail(updatedAuthor.id),
        updatedAuthor
      );

      // Invalida lista de autores
      invalidateQueries.authors(queryClient);
    },
  });
}

/**
 * Hook para atualizar status do autor (ADMIN)
 *
 * @returns Mutation para atualizar status
 *
 * @example
 * ```tsx
 * function AuthorStatusToggle({ author }: { author: Author }) {
 *   const updateStatus = useUpdateAuthorStatus();
 *
 *   const toggleStatus = () => {
 *     const newStatus = author.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
 *     updateStatus.mutate({ id: author.id, status: newStatus });
 *   };
 *
 *   return <Switch checked={author.status === "ACTIVE"} onChange={toggleStatus} />;
 * }
 * ```
 */
export function useUpdateAuthorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => authorService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      // Invalida autor específico e lista
      queryClient.invalidateQueries({
        queryKey: queryKeys.authors.detail(variables.id),
      });
      invalidateQueries.authors(queryClient);
    },
  });
}
