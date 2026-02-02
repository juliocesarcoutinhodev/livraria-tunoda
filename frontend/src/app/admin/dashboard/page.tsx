"use client";

/**
 * Admin Dashboard Page
 *
 * Dashboard administrativo com métricas e estatísticas reais.
 * Protegido por guard client-side no layout de /admin.
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
  useDashboardMetrics,
  useLowStockBooks,
} from "@/hooks";

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(value);

const formatShortDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

const buildLinePath = (values: number[], width: number, height: number) => {
  if (values.length === 0) {
    return "";
  }
  const padding = 16;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const maxValue = Math.max(1, ...values);

  return values
    .map((value, index) => {
      const x =
        padding +
        (values.length === 1
          ? innerWidth / 2
          : (innerWidth / (values.length - 1)) * index);
      const y = padding + innerHeight - (value / maxValue) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const buildAreaPath = (linePath: string, width: number, height: number) => {
  if (!linePath) {
    return "";
  }
  const padding = 16;
  const bottom = height - padding;
  return `${linePath} L ${width - padding} ${bottom} L ${padding} ${bottom} Z`;
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Auto-logout após 1 hora de inatividade
  useAutoLogoutAfterInactivity();

  // Buscar métricas
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const dashboardDays = 30;
  const dashboardTopLimit = 5;
  const { data: dashboardMetrics, isLoading: metricsLoading } =
    useDashboardMetrics(dashboardDays, dashboardTopLimit);
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

  const ordersByDay = dashboardMetrics?.ordersByDay ?? [];
  const topSold = dashboardMetrics?.topSold ?? [];
  const mostViewed = dashboardMetrics?.mostViewed ?? [];
  const mostClicked = dashboardMetrics?.mostClicked ?? [];

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

            {/* Card 4 - Total de Pedidos */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-christian-text/60 font-medium">
                    Total de Pedidos
                  </p>
                  {metricsLoading ? (
                    <div className="h-10 w-20 bg-gray-200 animate-pulse rounded mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-christian-gold mt-2">
                      {dashboardMetrics?.kpis.totalOrders || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-christian-gold/15 rounded-lg">
                  <svg
                    className="w-8 h-8 text-christian-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 5 - Pedidos no Mês */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-christian-text/60 font-medium">
                    Pedidos no Mês
                  </p>
                  {metricsLoading ? (
                    <div className="h-10 w-20 bg-gray-200 animate-pulse rounded mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-christian-green mt-2">
                      {dashboardMetrics?.kpis.ordersMonthly || 0}
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
                      d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 6 - Pedidos Hoje */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-christian-text/60 font-medium">
                    Pedidos Hoje
                  </p>
                  {metricsLoading ? (
                    <div className="h-10 w-20 bg-gray-200 animate-pulse rounded mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-christian-blue mt-2">
                      {dashboardMetrics?.kpis.ordersDaily || 0}
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Graficos de Pedidos e Ranking */}
          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-christian-text">
                      Pedidos dos ultimos {dashboardDays} dias
                    </h2>
                    <p className="text-sm text-christian-text/60 mt-1">
                      Tendencia diaria de pedidos criados
                    </p>
                  </div>
                  <div className="text-sm text-christian-text/60">
                    {ordersByDay.length
                      ? `${formatCompactNumber(
                          ordersByDay.reduce(
                            (sum, item) => sum + item.count,
                            0
                          )
                        )} pedidos`
                      : "Sem dados"}
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {metricsLoading ? (
                  <div className="h-40 bg-gray-100 animate-pulse rounded-lg" />
                ) : ordersByDay.length > 0 ? (
                  <div>
                    <svg
                      viewBox="0 0 600 200"
                      className="w-full h-48"
                      role="img"
                      aria-label="Pedidos por dia"
                    >
                      <defs>
                        <linearGradient id="ordersFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#2F5D8C" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2F5D8C" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <path
                        d={buildAreaPath(
                          buildLinePath(
                            ordersByDay.map((item) => item.count),
                            600,
                            200
                          ),
                          600,
                          200
                        )}
                        fill="url(#ordersFill)"
                      />
                      <path
                        d={buildLinePath(
                          ordersByDay.map((item) => item.count),
                          600,
                          200
                        )}
                        fill="none"
                        stroke="#2F5D8C"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="flex items-center justify-between text-xs text-christian-text/50 mt-3">
                      <span>{formatShortDate(ordersByDay[0].date)}</span>
                      <span>{formatShortDate(ordersByDay[ordersByDay.length - 1].date)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-christian-text/60">
                    Nenhum pedido registrado no periodo.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-christian-text">
                    Top vendidos
                  </h3>
                  <p className="text-sm text-christian-text/60 mt-1">
                    Ultimos {dashboardDays} dias
                  </p>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {metricsLoading ? (
                    <div className="space-y-3">
                      {[...Array(dashboardTopLimit)].map((_, index) => (
                        <div
                          key={index}
                          className="h-4 bg-gray-100 animate-pulse rounded"
                        />
                      ))}
                    </div>
                  ) : topSold.length > 0 ? (
                    topSold.map((item) => {
                      const maxValue = Math.max(
                        1,
                        ...topSold.map((entry) => entry.totalSold)
                      );
                      return (
                        <div key={item.bookId}>
                          <div className="flex items-center justify-between text-xs text-christian-text/70">
                            <span className="truncate pr-3">{item.title}</span>
                            <span className="font-semibold text-christian-blue">
                              {item.totalSold}
                            </span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-gray-100">
                            <div
                              className="h-2 rounded-full bg-christian-blue"
                              style={{
                                width: `${(item.totalSold / maxValue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-christian-text/60">
                      Sem vendas registradas.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-christian-text">
                    Mais visualizados
                  </h3>
                  <p className="text-sm text-christian-text/60 mt-1">
                    Ultimos {dashboardDays} dias
                  </p>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {metricsLoading ? (
                    <div className="space-y-3">
                      {[...Array(dashboardTopLimit)].map((_, index) => (
                        <div
                          key={index}
                          className="h-4 bg-gray-100 animate-pulse rounded"
                        />
                      ))}
                    </div>
                  ) : mostViewed.length > 0 ? (
                    mostViewed.map((item) => {
                      const maxValue = Math.max(
                        1,
                        ...mostViewed.map((entry) => entry.total)
                      );
                      return (
                        <div key={item.bookId}>
                          <div className="flex items-center justify-between text-xs text-christian-text/70">
                            <span className="truncate pr-3">{item.title}</span>
                            <span className="font-semibold text-blue-600">
                              {item.total}
                            </span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-gray-100">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{
                                width: `${(item.total / maxValue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-christian-text/60">
                      Sem visualizacoes.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-christian-text">
                    Mais clicados
                  </h3>
                  <p className="text-sm text-christian-text/60 mt-1">
                    Ultimos {dashboardDays} dias
                  </p>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {metricsLoading ? (
                    <div className="space-y-3">
                      {[...Array(dashboardTopLimit)].map((_, index) => (
                        <div
                          key={index}
                          className="h-4 bg-gray-100 animate-pulse rounded"
                        />
                      ))}
                    </div>
                  ) : mostClicked.length > 0 ? (
                    mostClicked.map((item) => {
                      const maxValue = Math.max(
                        1,
                        ...mostClicked.map((entry) => entry.total)
                      );
                      return (
                        <div key={item.bookId}>
                          <div className="flex items-center justify-between text-xs text-christian-text/70">
                            <span className="truncate pr-3">{item.title}</span>
                            <span className="font-semibold text-green-600">
                              {item.total}
                            </span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-gray-100">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{
                                width: `${(item.total / maxValue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-christian-text/60">
                      Sem cliques registrados.
                    </p>
                  )}
                </div>
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
