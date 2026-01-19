/**
 * Dashboard Hooks - React Query hooks para métricas do dashboard
 *
 * Hooks para buscar estatísticas e métricas do painel administrativo.
 *
 * @module hooks/useDashboard
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import { authorService } from "@/services/authorService";
import { queryKeys } from "@/lib/react-query";
import type { TopBook } from "@/types/book";
import type { PaginatedResponse } from "@/types/api";
import type { Author } from "@/types/author";
import type { Book } from "@/types/book";

// ============================================================================
// STATISTICS QUERIES
// ============================================================================

/**
 * Hook para obter estatísticas gerais do dashboard
 *
 * @returns Query com estatísticas (total de livros, autores, etc)
 *
 * @example
 * ```tsx
 * function DashboardStats() {
 *   const { data: stats, isLoading } = useDashboardStats();
 *
 *   return (
 *     <div>
 *       <p>Total de Livros: {stats?.totalBooks}</p>
 *       <p>Total de Autores: {stats?.totalAuthors}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      // Buscar totais em paralelo
      const [booksResponse, authorsResponse, lowStockResponse] =
        await Promise.all([
          bookService.listAdmin({ page: 0, size: 1 }), // Só precisamos do total
          authorService.list({ page: 0, size: 1 }), // Só precisamos do total
          bookService.listAdmin({ page: 0, size: 10, lowStock: true }), // Livros com estoque baixo
        ]);

      return {
        totalBooks: booksResponse.totalElements || 0,
        totalAuthors: authorsResponse.totalElements || 0,
        lowStockBooks: lowStockResponse.totalElements || 0,
        lowStockItems: lowStockResponse.content || [],
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (atualiza com frequência)
  });
}

/**
 * Hook para obter top livros mais visualizados
 *
 * @param limit - Quantidade de livros a retornar (default: 10)
 * @param options - Opções adicionais do useQuery
 * @returns Query com lista de livros mais visualizados
 *
 * @example
 * ```tsx
 * function TopViewedBooks() {
 *   const { data: topBooks, isLoading } = useMostViewedBooks(5);
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       {topBooks?.map(book => (
 *         <div key={book.bookId}>
 *           {book.bookTitle}: {book.totalViews} visualizações
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMostViewedBooks(
  limit: number = 10,
  options?: Omit<UseQueryOptions<TopBook[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.books.mostViewed(limit),
    queryFn: () => bookService.getMostViewed(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}

/**
 * Hook para obter top livros mais clicados
 *
 * @param limit - Quantidade de livros a retornar (default: 10)
 * @param options - Opções adicionais do useQuery
 * @returns Query com lista de livros mais clicados
 *
 * @example
 * ```tsx
 * function TopClickedBooks() {
 *   const { data: topBooks, isLoading } = useMostClickedBooks(5);
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       {topBooks?.map(book => (
 *         <div key={book.bookId}>
 *           {book.bookTitle}: {book.totalClicks} cliques
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMostClickedBooks(
  limit: number = 10,
  options?: Omit<UseQueryOptions<TopBook[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.books.mostClicked(limit),
    queryFn: () => bookService.getMostClicked(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}

/**
 * Hook para obter livros com estoque baixo
 *
 * @param options - Opções adicionais do useQuery
 * @returns Query com lista de livros com estoque < 10
 *
 * @example
 * ```tsx
 * function LowStockAlert() {
 *   const { data, isLoading } = useLowStockBooks();
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       {data?.content.map(book => (
 *         <div key={book.id}>
 *           {book.title}: {book.stock} unidades restantes
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLowStockBooks(
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Book>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.books.lowStock(),
    queryFn: () => bookService.listAdmin({ page: 0, size: 10, lowStock: true }),
    staleTime: 2 * 60 * 1000, // 2 minutos
    ...options,
  });
}
