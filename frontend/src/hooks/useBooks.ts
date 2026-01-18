/**
 * Books Hooks - React Query hooks para livros
 *
 * Hooks para gerenciar dados de livros (público e admin) com React Query.
 * Inclui queries, mutations e optimistic updates.
 *
 * @module hooks/useBooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import { queryKeys, invalidateQueries } from "@/lib/react-query";
import type {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  BookMetrics,
  AdminBookFilterParams,
  PublicBookFilterParams,
} from "@/types/book";
import type { PaginatedResponse, StockAdjustment } from "@/types/api";

// ============================================================================
// QUERIES - Livros Públicos
// ============================================================================

/**
 * Hook para listar livros disponíveis (público, sem autenticação)
 *
 * @param filters - Filtros de paginação e ordenação
 * @param options - Opções adicionais do useQuery
 * @returns Query com lista paginada de livros
 *
 * @example
 * ```tsx
 * function BooksList() {
 *   const { data, isLoading, error } = useBooks({
 *     page: 0,
 *     size: 10,
 *     sort: "title,asc"
 *   });
 *
 *   if (isLoading) return <div>Carregando...</div>;
 *   if (error) return <div>Erro ao carregar livros</div>;
 *
 *   return (
 *     <div>
 *       {data?.content.map(book => (
 *         <BookCard key={book.id} book={book} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBooks(
  filters?: PublicBookFilterParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Book>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.books.list(filters),
    queryFn: () => bookService.listPublic(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}

/**
 * Hook para buscar detalhes de um livro específico (público)
 *
 * @param id - ID do livro
 * @param options - Opções adicionais do useQuery
 * @returns Query com dados completos do livro
 *
 * @example
 * ```tsx
 * function BookDetail({ id }: { id: string }) {
 *   const { data: book, isLoading } = useBookDetail(id);
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       <h1>{book?.title}</h1>
 *       <p>{book?.description}</p>
 *       <p>R$ {book?.price}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBookDetail(
  id: string,
  options?: Omit<UseQueryOptions<Book>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => bookService.getByIdPublic(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id, // Apenas executa se o ID existir
    ...options,
  });
}

/**
 * Hook para buscar top livros mais visualizados
 *
 * @param limit - Quantidade máxima de resultados (default: 10)
 * @returns Query com lista de livros mais visualizados
 *
 * @example
 * ```tsx
 * function TopBooks() {
 *   const { data: topBooks } = useMostViewedBooks(5);
 *
 *   return (
 *     <div>
 *       {topBooks?.map(book => (
 *         <div key={book.bookId}>{book.title} - {book.count} views</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMostViewedBooks(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.books.mostViewed(limit),
    queryFn: () => bookService.getMostViewed(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar top livros mais clicados
 *
 * @param limit - Quantidade máxima de resultados (default: 10)
 * @returns Query com lista de livros mais clicados
 */
export function useMostClickedBooks(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.books.mostClicked(limit),
    queryFn: () => bookService.getMostClicked(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para registrar métrica de visualização ou clique
 *
 * @returns Mutation para trackear métricas
 *
 * @example
 * ```tsx
 * function BookCard({ book }: { book: Book }) {
 *   const trackMetric = useTrackBookMetric();
 *
 *   useEffect(() => {
 *     // Registra view quando componente monta
 *     trackMetric.mutate({ bookId: book.id, eventType: "VIEW" });
 *   }, [book.id]);
 *
 *   const handleClick = () => {
 *     // Registra click quando usuário clica
 *     trackMetric.mutate({ bookId: book.id, eventType: "CLICK" });
 *   };
 *
 *   return <button onClick={handleClick}>Ver detalhes</button>;
 * }
 * ```
 */
export function useTrackBookMetric() {
  return useMutation({
    mutationFn: ({
      bookId,
      eventType,
    }: {
      bookId: string;
      eventType: "VIEW" | "CLICK";
    }) => bookService.trackMetric(bookId, eventType),
    // Não precisa invalidar queries (métricas são apenas para tracking)
  });
}

// ============================================================================
// QUERIES - Livros Admin
// ============================================================================

/**
 * Hook para listar livros com filtros avançados (ADMIN)
 *
 * @param filters - Filtros de paginação, status, autor, estoque baixo
 * @returns Query com lista paginada de livros
 *
 * @example
 * ```tsx
 * function AdminBooksList() {
 *   const { data } = useBooksAdmin({
 *     page: 0,
 *     status: "ACTIVE",
 *     lowStock: true
 *   });
 *
 *   return (
 *     <table>
 *       {data?.content.map(book => (
 *         <tr key={book.id}>
 *           <td>{book.title}</td>
 *           <td>{book.stock}</td>
 *         </tr>
 *       ))}
 *     </table>
 *   );
 * }
 * ```
 */
export function useBooksAdmin(filters?: AdminBookFilterParams) {
  return useQuery({
    queryKey: queryKeys.booksAdmin.list(filters),
    queryFn: () => bookService.listAdmin(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos (dados admin mudam mais frequentemente)
  });
}

/**
 * Hook para buscar detalhes de um livro (ADMIN)
 *
 * @param id - ID do livro
 * @returns Query com dados completos do livro
 */
export function useBookDetailAdmin(id: string) {
  return useQuery({
    queryKey: queryKeys.booksAdmin.detail(id),
    queryFn: () => bookService.getByIdAdmin(id),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!id,
  });
}

/**
 * Hook para buscar métricas de um livro (ADMIN)
 *
 * @param id - ID do livro
 * @returns Query com métricas (views, clicks)
 *
 * @example
 * ```tsx
 * function BookMetrics({ bookId }: { bookId: string }) {
 *   const { data: metrics } = useBookMetrics(bookId);
 *
 *   return (
 *     <div>
 *       <p>Visualizações: {metrics?.views}</p>
 *       <p>Cliques: {metrics?.clicks}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBookMetrics(id: string) {
  return useQuery<BookMetrics>({
    queryKey: queryKeys.books.metrics(id),
    queryFn: () => bookService.getMetrics(id),
    staleTime: 1 * 60 * 1000, // 1 minuto (métricas mudam frequentemente)
    enabled: !!id,
  });
}

// ============================================================================
// MUTATIONS - Livros Admin
// ============================================================================

/**
 * Hook para criar um novo livro (ADMIN)
 *
 * @returns Mutation para criar livro
 *
 * @example
 * ```tsx
 * function CreateBookForm() {
 *   const createBook = useCreateBook();
 *
 *   const handleSubmit = async (data: CreateBookRequest) => {
 *     try {
 *       await createBook.mutateAsync(data);
 *       toast.success("Livro criado com sucesso!");
 *       router.push("/admin/books");
 *     } catch (error) {
 *       toast.error("Erro ao criar livro");
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {/* form fields *\/}
 *       <button disabled={createBook.isPending}>
 *         {createBook.isPending ? "Criando..." : "Criar"}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookRequest) => bookService.create(data),
    onSuccess: () => {
      // Invalida todas as queries de livros após criar
      invalidateQueries.books(queryClient);
      invalidateQueries.booksAdmin(queryClient);
    },
  });
}

/**
 * Hook para atualizar um livro existente (ADMIN)
 *
 * @returns Mutation para atualizar livro
 *
 * @example
 * ```tsx
 * function EditBookForm({ bookId }: { bookId: string }) {
 *   const updateBook = useUpdateBook();
 *
 *   const handleSubmit = async (data: UpdateBookRequest) => {
 *     await updateBook.mutateAsync({ id: bookId, data });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>{/* fields *\/}</form>;
 * }
 * ```
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) =>
      bookService.update(id, data),
    onSuccess: (updatedBook) => {
      // Atualiza cache do livro específico (optimistic update)
      queryClient.setQueryData(
        queryKeys.books.detail(updatedBook.id),
        updatedBook
      );
      queryClient.setQueryData(
        queryKeys.booksAdmin.detail(updatedBook.id),
        updatedBook
      );

      // Invalida listas
      invalidateQueries.books(queryClient);
      invalidateQueries.booksAdmin(queryClient);
    },
  });
}

/**
 * Hook para atualizar status do livro (ADMIN)
 *
 * @returns Mutation para atualizar status
 *
 * @example
 * ```tsx
 * function BookStatusToggle({ book }: { book: Book }) {
 *   const updateStatus = useUpdateBookStatus();
 *
 *   const toggleStatus = () => {
 *     const newStatus = book.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
 *     updateStatus.mutate({ id: book.id, status: newStatus });
 *   };
 *
 *   return <Switch checked={book.status === "ACTIVE"} onChange={toggleStatus} />;
 * }
 * ```
 */
export function useUpdateBookStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => bookService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      // Invalida livro específico e listas
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.booksAdmin.detail(variables.id),
      });
      invalidateQueries.books(queryClient);
      invalidateQueries.booksAdmin(queryClient);
    },
  });
}

/**
 * Hook para ajustar estoque do livro (ADMIN)
 *
 * @returns Mutation para ajustar estoque
 *
 * @example
 * ```tsx
 * function StockAdjustment({ bookId }: { bookId: string }) {
 *   const adjustStock = useAdjustBookStock();
 *
 *   const addStock = () => {
 *     adjustStock.mutate({
 *       id: bookId,
 *       adjustment: {
 *         operation: "ADD",
 *         quantity: 50,
 *         reason: "Reposição"
 *       }
 *     });
 *   };
 *
 *   return <button onClick={addStock}>Adicionar 50 unidades</button>;
 * }
 * ```
 */
export function useAdjustBookStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adjustment }: { id: string; adjustment: StockAdjustment }) =>
      bookService.adjustStock(id, adjustment),
    onSuccess: (updatedBook) => {
      // Atualiza cache imediatamente
      queryClient.setQueryData(
        queryKeys.books.detail(updatedBook.id),
        updatedBook
      );
      queryClient.setQueryData(
        queryKeys.booksAdmin.detail(updatedBook.id),
        updatedBook
      );

      // Invalida listas
      invalidateQueries.booksAdmin(queryClient);
    },
  });
}
