"use client";

/**
 * Admin Books Page
 *
 * Página de listagem e gerenciamento de livros (ADMIN).
 * Inclui: busca, filtros, ordenação, paginação, ações inline.
 *
 * @module app/admin/books
 */

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useBooksAdmin,
  useUpdateBookStatus,
  useAuthors,
  useDebounce,
} from "@/hooks";
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminFooter from "@/components/layout/AdminFooter";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Modal from "@/components/ui/Modal";
import CustomSelect from "@/components/ui/CustomSelect";
import StockAdjustmentModal from "@/components/ui/StockAdjustmentModal";
import { getErrorMessage } from "@/lib/api-client";
import type { Book, AdminBookFilterParams } from "@/types/book";
import type { ResourceStatus } from "@/types/api";

export default function BooksPage() {
  const router = useRouter();
  const [searchTitle, setSearchTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "ALL">(
    "ALL"
  );
  const [authorFilter, setAuthorFilter] = useState<string>("ALL");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [sortBy, setSortBy] = useState<"title" | "price" | "createdAt">(
    "title"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado do modal de ajuste de estoque
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockBook, setStockBook] = useState<Book | null>(null);

  // Auto-logout por inatividade
  useAutoLogoutAfterInactivity();

  // Debounce da busca por título (300ms de delay)
  const debouncedSearchTitle = useDebounce(searchTitle, 300);

  // Filtros para API com paginação
  const apiFilters: AdminBookFilterParams = useMemo(
    () => ({
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDirection,
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(authorFilter !== "ALL" && { authorId: authorFilter }),
      ...(debouncedSearchTitle.trim() && {
        title: debouncedSearchTitle.trim(),
      }),
      ...(lowStockFilter && { lowStock: true }),
    }),
    [
      currentPage,
      pageSize,
      sortBy,
      sortDirection,
      statusFilter,
      authorFilter,
      debouncedSearchTitle,
      lowStockFilter,
    ]
  );

  // Queries
  const {
    data: booksData,
    isLoading: booksLoading,
    error,
  } = useBooksAdmin(apiFilters);
  const { data: authorsData } = useAuthors({ status: "ACTIVE", size: 100 }); // Busca todos autores ativos
  const updateBookStatus = useUpdateBookStatus();

  // Dados direto do backend
  const books = booksData?.content || [];
  const totalPages = booksData
    ? Math.ceil(booksData.totalElements / pageSize)
    : 0;
  const totalElements = booksData?.totalElements || 0;

  // Reset para primeira página ao mudar filtros
  const handleSearchChange = (value: string) => {
    setSearchTitle(value);
    setCurrentPage(0);
  };

  const handleStatusFilterChange = (value: ResourceStatus | "ALL") => {
    setStatusFilter(value);
    setCurrentPage(0);
  };

  const handleAuthorFilterChange = (value: string) => {
    setAuthorFilter(value);
    setCurrentPage(0);
  };

  const handleLowStockToggle = () => {
    setLowStockFilter(!lowStockFilter);
    setCurrentPage(0);
  };

  const handleSortChange = (field: "title" | "price" | "createdAt") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setCurrentPage(0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleToggleStatus = (book: Book) => {
    setSelectedBook(book);
    setShowConfirmModal(true);
    setErrorMessage(null);
  };

  /**
   * Abre modal de ajuste de estoque
   */
  const openStockModal = (book: Book) => {
    setStockBook(book);
    setShowStockModal(true);
  };

  /**
   * Fecha modal de ajuste de estoque
   */
  const closeStockModal = () => {
    setShowStockModal(false);
    setStockBook(null);
  };

  const confirmToggleStatus = async () => {
    if (!selectedBook) return;

    const newStatus: ResourceStatus =
      selectedBook.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = newStatus === "ACTIVE" ? "ativado" : "desativado";

    try {
      await updateBookStatus.mutateAsync({
        id: selectedBook.id,
        status: newStatus,
      });
      setShowConfirmModal(false);
      setSelectedBook(null);
      setErrorMessage(null);

      toast.success(`Livro ${actionText} com sucesso!`, {
        icon: newStatus === "ACTIVE" ? "✅" : "🚫",
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      toast.error(`Erro: ${message}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getStockBadge = (stock: number) => {
    if (stock < 5) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Baixo ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {stock}
      </span>
    );
  };

  const getStatusBadge = (status: ResourceStatus) => {
    return status === "ACTIVE" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Ativo
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inativo
      </span>
    );
  };

  const isLoading = booksLoading;

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
          <main className="flex-1 p-4 lg:p-8 w-full">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/admin/dashboard" },
                { label: "Livros", href: "/admin/books" },
              ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Gerenciar Livros
                </h1>
                <p className="text-sm text-gray-600">
                  {totalElements} livro{totalElements !== 1 ? "s" : ""}{" "}
                  encontrado
                  {totalElements !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={() => router.push("/admin/books/new")}
                className="mt-3 sm:mt-0 bg-christian-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center sm:justify-start whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novo Livro
              </button>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                {/* Busca por título */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Buscar por título
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTitle}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Digite o título do livro..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent"
                  />
                </div>

                {/* Filtro por status */}
                <CustomSelect
                  label="Status"
                  value={statusFilter}
                  onChange={(value) =>
                    handleStatusFilterChange(value as ResourceStatus | "ALL")
                  }
                  options={[
                    { value: "ALL", label: "Todos" },
                    { value: "ACTIVE", label: "Ativos" },
                    { value: "INACTIVE", label: "Inativos" },
                  ]}
                />

                {/* Filtro por autor */}
                <CustomSelect
                  label="Autor"
                  value={authorFilter}
                  onChange={handleAuthorFilterChange}
                  options={[
                    { value: "ALL", label: "Todos os autores" },
                    ...(authorsData?.content.map((author) => ({
                      value: author.id,
                      label: author.name,
                    })) || []),
                  ]}
                />

                {/* Filtro estoque baixo */}
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lowStockFilter}
                      onChange={handleLowStockToggle}
                      className="rounded border-gray-300 text-christian-blue focus:ring-christian-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Estoque baixo (&lt;5)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Tabela Desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Livro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Autores
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortChange("price")}
                      >
                        <div className="flex items-center">
                          Preço
                          {sortBy === "price" && (
                            <svg
                              className={`w-4 h-4 ml-1 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estoque
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortChange("createdAt")}
                      >
                        <div className="flex items-center">
                          Criado
                          {sortBy === "createdAt" && (
                            <svg
                              className={`w-4 h-4 ml-1 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      // Loading skeleton
                      Array.from({ length: pageSize }).map((_, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-16 w-12 bg-gray-200 rounded animate-pulse"></div>
                              <div className="ml-4">
                                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse ml-auto"></div>
                          </td>
                        </tr>
                      ))
                    ) : books.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          {error
                            ? "Erro ao carregar livros"
                            : "Nenhum livro encontrado"}
                        </td>
                      </tr>
                    ) : (
                      books.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-16 w-12 flex-shrink-0">
                                {book.photoUrl ? (
                                  <Image
                                    src={book.photoUrl}
                                    alt={book.title}
                                    width={48}
                                    height={64}
                                    className="h-16 w-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                                    <svg
                                      className="w-6 h-6 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div
                                  className="text-sm font-medium text-gray-900 max-w-xs truncate cursor-help"
                                  title={book.title}
                                >
                                  {book.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                  ISBN: {book.isbn || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {book.authors.map((author, index) => (
                                <span key={author.id}>
                                  {author.name}
                                  {index < book.authors.length - 1 && ", "}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(book.price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStockBadge(book.stock)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(book.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openStockModal(book)}
                                className="text-purple-600 hover:text-purple-700 p-1 rounded"
                                title="Ajustar Estoque"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  router.push(`/admin/books/${book.id}/edit`)
                                }
                                className="text-christian-blue hover:text-blue-700 p-1 rounded"
                                title="Editar"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  router.push(`/admin/books/${book.id}/metrics`)
                                }
                                className="text-green-600 hover:text-green-700 p-1 rounded"
                                title="Ver Métricas"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleToggleStatus(book)}
                                className={`p-1 rounded ${
                                  book.status === "ACTIVE"
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-green-600 hover:text-green-700"
                                }`}
                                title={
                                  book.status === "ACTIVE"
                                    ? "Desativar"
                                    : "Ativar"
                                }
                              >
                                {book.status === "ACTIVE" ? (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards Mobile */}
            <div className="lg:hidden space-y-4">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-12 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
                        <div className="flex space-x-2">
                          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : books.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                  {error
                    ? "Erro ao carregar livros"
                    : "Nenhum livro encontrado"}
                </div>
              ) : (
                books.map((book) => (
                  <div
                    key={book.id}
                    className={`bg-white rounded-lg shadow-sm p-3 border border-gray-200 ${
                      book.status === "INACTIVE" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 w-full">
                      {/* Capa do livro */}
                      <div className="flex-shrink-0">
                        {book.photoUrl ? (
                          <Image
                            src={book.photoUrl}
                            alt={book.title}
                            width={48}
                            height={64}
                            className="h-16 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">
                          {book.title}
                        </h3>

                        <p className="text-xs text-gray-600 truncate mb-1">
                          {book.authors.map((a) => a.name).join(", ")}
                        </p>

                        <div className="text-xs text-gray-600 mb-2 truncate">
                          <span className="font-medium">
                            {formatPrice(book.price)}
                          </span>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="truncate inline-block max-w-[120px] align-bottom">
                            {book.isbn || "N/A"}
                          </span>
                        </div>

                        {/* Status compacto */}
                        <div className="flex items-center gap-1 mb-2">
                          {getStockBadge(book.stock)}
                          {getStatusBadge(book.status)}
                        </div>

                        {/* Actions compactos */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => openStockModal(book)}
                            className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
                            title="Ajustar Estoque"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              router.push(`/admin/books/${book.id}/edit`)
                            }
                            className="p-1.5 bg-christian-blue hover:bg-blue-700 text-white rounded text-xs"
                            title="Editar"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              router.push(`/admin/books/${book.id}/metrics`)
                            }
                            className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                            title="Métricas"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(book)}
                            disabled={updateBookStatus.isPending}
                            className={`p-1.5 rounded text-xs transition-colors disabled:opacity-50 ${
                              book.status === "ACTIVE"
                                ? "bg-red-100 hover:bg-red-200 text-red-800"
                                : "bg-green-100 hover:bg-green-200 text-green-800"
                            }`}
                            title={
                              book.status === "ACTIVE" ? "Desativar" : "Ativar"
                            }
                          >
                            {book.status === "ACTIVE" ? (
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm mt-4">
                <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                  <span className="text-sm text-gray-700">
                    Itens por página:
                  </span>
                  <div className="w-20">
                    <CustomSelect
                      value={String(pageSize)}
                      onChange={(value) => handlePageSizeChange(Number(value))}
                      options={[
                        { value: "5", label: "5" },
                        { value: "10", label: "10" },
                        { value: "25", label: "25" },
                        { value: "50", label: "50" },
                      ]}
                    />
                  </div>
                  <span className="text-sm text-gray-700">
                    {currentPage * pageSize + 1}-
                    {Math.min((currentPage + 1) * pageSize, totalElements)} de{" "}
                    {totalElements}
                  </span>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Primeira
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Anterior
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(
                      0,
                      Math.min(currentPage - 2, totalPages - 5)
                    );
                    const page = startPage + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded border ${
                          currentPage === page
                            ? "bg-christian-blue text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {page + 1}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Próxima
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Última
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Rodapé */}
          <AdminFooter />
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={
          selectedBook?.status === "ACTIVE" ? "Desativar Livro" : "Ativar Livro"
        }
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja{" "}
            {selectedBook?.status === "ACTIVE" ? "desativar" : "ativar"} o livro{" "}
            <strong>{selectedBook?.title}</strong>?
          </p>
          {selectedBook?.status === "ACTIVE" && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ O livro não aparecerá mais na loja para os clientes.
            </p>
          )}
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            disabled={updateBookStatus.isPending}
            onClick={confirmToggleStatus}
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm ${
              selectedBook?.status === "ACTIVE"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
            } ${updateBookStatus.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {updateBookStatus.isPending
              ? "Processando..."
              : selectedBook?.status === "ACTIVE"
                ? "Desativar"
                : "Ativar"}
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmModal(false)}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-christian-blue sm:mt-0 sm:col-start-1 sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal de Ajuste de Estoque */}
      <StockAdjustmentModal
        book={stockBook}
        isOpen={showStockModal}
        onClose={closeStockModal}
      />
    </>
  );
}
