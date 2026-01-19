"use client";

/**
 * Admin Dashboard Page
 *
 * Dashboard administrativo com métricas e estatísticas reais.
 * Protegido pelo middleware (server-side).
 * Inclui auto-logout por inatividade (1 hora).
 *
 * @module app/admin/dashboard
 */

import { useState } from "react";
import { useAuthStore } from "@/store";
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminFooter from "@/components/layout/AdminFooter";
import Breadcrumb from "@/components/layout/Breadcrumb";
import StockAdjustmentModal from "@/components/ui/StockAdjustmentModal";
import type { Book } from "@/types/book";
import {
  useDashboardStats,
  useDashboardMostViewed,
  useDashboardMostClicked,
  useLowStockBooks,
} from "@/hooks";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Auto-logout após 1 hora de inatividade
  useAutoLogoutAfterInactivity();

  // Buscar métricas
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: mostViewed, isLoading: viewedLoading } =
    useDashboardMostViewed(5);
  const { data: mostClicked, isLoading: clickedLoading } =
    useDashboardMostClicked(5);
  const { data: lowStockData, isLoading: stockLoading } = useLowStockBooks();

  // Estado do modal de ajuste de estoque
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  /**
   * Abre modal de ajuste de estoque
   */
  const openStockModal = (book: Book) => {
    setSelectedBook(book);
    setShowStockModal(true);
  };

  /**
   * Fecha modal de ajuste de estoque
   */
  const closeStockModal = () => {
    setShowStockModal(false);
    setSelectedBook(null);
  };

  return (
    <div className="flex min-h-screen bg-christian-background">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {/* Breadcrumb */}
          <Breadcrumb items={[{ label: "Dashboard" }]} />

          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-christian-text font-playfair">
              Dashboard Administrativo
            </h1>
            <p className="text-christian-text/60 mt-1">
              Bem-vindo, {user?.name || user?.email || "Administrador"}
            </p>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1 - Total de Livros */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-christian-text/60 font-medium">
                    Total de Livros
                  </p>
                  {statsLoading ? (
                    <div className="h-10 w-16 bg-gray-200 animate-pulse rounded mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-christian-blue mt-2">
                      {stats?.totalBooks || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-christian-blue/10 rounded-lg">
                  <svg
                    className="w-8 h-8 text-christian-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2 - Total de Autores */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-christian-text/60 font-medium">
                    Total de Autores
                  </p>
                  {statsLoading ? (
                    <div className="h-10 w-16 bg-gray-200 animate-pulse rounded mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-christian-green mt-2">
                      {stats?.totalAuthors || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-christian-green/10 rounded-lg">
                  <svg
                    className="w-8 h-8 text-christian-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 3 - Estoque Baixo */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-christian-text/60 font-medium">
                    Estoque Baixo
                  </p>
                  {statsLoading ? (
                    <div className="h-10 w-16 bg-gray-200 animate-pulse rounded mt-2" />
                  ) : (
                    <p
                      className={`text-3xl font-bold mt-2 ${
                        (stats?.lowStockBooks || 0) > 0
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {stats?.lowStockBooks || 0}
                    </p>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    (stats?.lowStockBooks || 0) > 0
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-8 h-8 ${
                      (stats?.lowStockBooks || 0) > 0
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Tabelas */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top 5 Mais Visualizados */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-christian-text">
                    Top 5 Mais Visualizados
                  </h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {viewedLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 animate-pulse rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : mostViewed && mostViewed.length > 0 ? (
                  <div className="space-y-4">
                    {mostViewed.map((book, index) => (
                      <div
                        key={book.id}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-christian-blue/10 rounded-full flex items-center justify-center font-bold text-christian-blue">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-christian-text truncate">
                            {book.title}
                          </p>
                          <p className="text-sm text-christian-text/60">
                            <span className="font-medium text-blue-600">
                              {book.totalMetrics.toLocaleString("pt-BR")}
                            </span>{" "}
                            visualizações
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-christian-text/60">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p>Nenhum livro visualizado ainda</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top 5 Mais Clicados */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-christian-text">
                    Top 5 Mais Clicados
                  </h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {clickedLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 animate-pulse rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : mostClicked && mostClicked.length > 0 ? (
                  <div className="space-y-4">
                    {mostClicked.map((book, index) => (
                      <div
                        key={book.id}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-christian-green/10 rounded-full flex items-center justify-center font-bold text-christian-green">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-christian-text truncate">
                            {book.title}
                          </p>
                          <p className="text-sm text-christian-text/60">
                            <span className="font-medium text-green-600">
                              {book.totalMetrics.toLocaleString("pt-BR")}
                            </span>{" "}
                            cliques
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-christian-text/60">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                    <p>Nenhum livro clicado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alerta de Estoque Baixo */}
          {!stockLoading &&
            lowStockData &&
            lowStockData.content &&
            lowStockData.content.length > 0 && (
              <div className="bg-white border-l-2 border-amber-500 rounded-lg shadow-md overflow-hidden">
                {/* Header do Alerta */}
                <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-2.5 bg-gray-200 rounded-lg">
                      <svg
                        className="w-6 h-6 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        Livros com Estoque Baixo
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {lowStockData.totalElements}{" "}
                        {lowStockData.totalElements === 1 ? "livro" : "livros"}{" "}
                        com menos de 10 unidades. Recomendamos reposição.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de Livros */}
                <div className="p-6">
                  <div className="space-y-4">
                    {lowStockData.content.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-semibold text-gray-900 truncate">
                            {book.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1.5">
                            Estoque:{" "}
                            <span className="font-bold text-red-600">
                              {book.stock}{" "}
                              {book.stock === 1 ? "unidade" : "unidades"}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => openStockModal(book)}
                          className="ml-4 px-4 py-2 border-2 border-christian-blue text-christian-blue hover:bg-christian-blue hover:text-white rounded-lg font-medium transition-colors flex-shrink-0"
                        >
                          Repor
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </main>

        {/* Rodapé */}
        <AdminFooter />
      </div>

      {/* Modal de Ajuste de Estoque */}
      <StockAdjustmentModal
        book={selectedBook}
        isOpen={showStockModal}
        onClose={closeStockModal}
      />
    </div>
  );
}
