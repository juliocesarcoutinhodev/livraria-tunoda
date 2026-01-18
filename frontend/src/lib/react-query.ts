/**
 * React Query Configuration
 *
 * Configuração centralizada do QueryClient com defaults otimizados
 * para cache, refetch e retry.
 *
 * @module lib/react-query
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Configuração padrão do QueryClient
 *
 * - **staleTime**: 5 minutos - Tempo que os dados são considerados "frescos"
 * - **cacheTime**: 10 minutos - Tempo que dados não usados permanecem em cache
 * - **refetchOnWindowFocus**: true - Refetch ao focar na janela
 * - **refetchOnReconnect**: true - Refetch ao reconectar à internet
 * - **retry**: 1 - Tentar 1 vez em caso de erro
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Dados ficam "frescos" por 5 minutos
      staleTime: 5 * 60 * 1000, // 5 minutos

      // Dados ficam em cache por 10 minutos após ficarem inativos
      gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)

      // Refetch ao focar na janela do navegador
      refetchOnWindowFocus: true,

      // Refetch ao reconectar à internet
      refetchOnReconnect: true,

      // Tentar 1 vez em caso de erro
      retry: 1,

      // Função de retry: não retenta em erros 4xx (exceto 408, 429)
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Tentar 0 vezes para mutations (não retentar automaticamente)
      retry: 0,
    },
  },
};

/**
 * Cria uma nova instância do QueryClient
 *
 * @returns QueryClient configurado
 *
 * @example
 * ```tsx
 * const queryClient = createQueryClient();
 * ```
 */
export function createQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}

/**
 * Query Keys - Chaves padronizadas para queries
 *
 * Seguindo o padrão hierárquico recomendado:
 * - ['books'] - Lista todos os livros
 * - ['books', { filters }] - Lista com filtros
 * - ['books', id] - Detalhe de um livro
 * - ['books', id, 'metrics'] - Métricas de um livro
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */
export const queryKeys = {
  // ============================================================================
  // BOOKS (Livros)
  // ============================================================================
  books: {
    /** Lista todos os livros públicos */
    all: ["books"] as const,

    /** Lista de livros com filtros */
    list: (filters?: unknown) =>
      [...queryKeys.books.all, filters] as const,

    /** Detalhe de um livro específico */
    detail: (id: string) => [...queryKeys.books.all, id] as const,

    /** Métricas de um livro (ADMIN) */
    metrics: (id: string) =>
      [...queryKeys.books.detail(id), "metrics"] as const,

    /** Top livros mais visualizados */
    mostViewed: (limit?: number) =>
      [...queryKeys.books.all, "most-viewed", limit] as const,

    /** Top livros mais clicados */
    mostClicked: (limit?: number) =>
      [...queryKeys.books.all, "most-clicked", limit] as const,
  },

  // ============================================================================
  // BOOKS ADMIN
  // ============================================================================
  booksAdmin: {
    /** Lista todos os livros (ADMIN) */
    all: ["books", "admin"] as const,

    /** Lista de livros com filtros (ADMIN) */
    list: (filters?: unknown) =>
      [...queryKeys.booksAdmin.all, filters] as const,

    /** Detalhe de um livro (ADMIN) */
    detail: (id: string) => [...queryKeys.booksAdmin.all, id] as const,
  },

  // ============================================================================
  // AUTHORS (Autores)
  // ============================================================================
  authors: {
    /** Lista todos os autores */
    all: ["authors"] as const,

    /** Lista de autores com filtros */
    list: (filters?: unknown) =>
      [...queryKeys.authors.all, filters] as const,

    /** Detalhe de um autor específico */
    detail: (id: string) => [...queryKeys.authors.all, id] as const,
  },

  // ============================================================================
  // AUTH (Autenticação)
  // ============================================================================
  auth: {
    /** Usuário atual autenticado */
    me: ["auth", "me"] as const,
  },

  // ============================================================================
  // CART (Carrinho)
  // ============================================================================
  cart: {
    /** Detalhe do carrinho */
    detail: (id: string) => ["cart", id] as const,
  },

  // ============================================================================
  // SHIPPING (Frete)
  // ============================================================================
  shipping: {
    /** Cotação de frete */
    quote: (id: string) => ["shipping", "quote", id] as const,
  },

  // ============================================================================
  // ORDERS (Pedidos)
  // ============================================================================
  orders: {
    /** Lista todos os pedidos */
    all: ["orders"] as const,

    /** Lista de pedidos com filtros */
    list: (filters?: unknown) =>
      [...queryKeys.orders.all, filters] as const,

    /** Detalhe de um pedido específico */
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
  },

  // ============================================================================
  // PAYMENTS (Pagamentos)
  // ============================================================================
  payments: {
    /** Detalhe de um pagamento */
    detail: (id: string) => ["payments", id] as const,
  },
} as const;

/**
 * Helper para invalidar queries relacionadas a livros
 *
 * @example
 * ```tsx
 * const mutation = useMutation({
 *   mutationFn: bookService.create,
 *   onSuccess: () => {
 *     invalidateBooks(queryClient);
 *   }
 * });
 * ```
 */
export const invalidateQueries = {
  /** Invalida todas as queries de livros */
  books: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.books.all }),

  /** Invalida todas as queries de livros admin */
  booksAdmin: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.booksAdmin.all }),

  /** Invalida todas as queries de autores */
  authors: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.authors.all }),

  /** Invalida query do usuário atual */
  authMe: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me }),

  /** Invalida query do carrinho */
  cart: (queryClient: QueryClient, cartId: string) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail(cartId) }),

  /** Invalida todas as queries de pedidos */
  orders: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
};
