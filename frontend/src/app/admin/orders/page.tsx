"use client";

/**
 * Admin Orders Page
 *
 * Página de listagem de pedidos (ADMIN).
 * Exibe todos os pedidos com paginação, filtros e detalhes.
 *
 * @module app/admin/orders
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrdersAdmin } from "@/hooks";
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminFooter from "@/components/layout/AdminFooter";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CustomSelect from "@/components/ui/CustomSelect";
import type { OrderFilterParams, OrderStatus } from "@/types/order";

export default function OrdersPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Auto-logout por inatividade
  useAutoLogoutAfterInactivity();

  // Filtros para API
  const apiFilters: OrderFilterParams = {
    page: currentPage,
    size: pageSize,
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };

  // Query de pedidos
  const { data: ordersData, isLoading } = useOrdersAdmin(apiFilters);

  // Dados direto do backend
  const orders = ordersData?.content || [];
  const totalPages = ordersData
    ? Math.ceil(ordersData.totalElements / pageSize)
    : 0;

  // Reset página ao mudar filtros
  const handleStatusFilterChange = (value: OrderStatus | "ALL") => {
    setStatusFilter(value);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(0);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const badges: Record<OrderStatus, { label: string; color: string }> = {
      PENDING: {
        label: "Pendente",
        color: "bg-yellow-100 text-yellow-800",
      },
      CONFIRMED: { label: "Confirmado", color: "bg-green-100 text-green-800" },
      PROCESSING: { label: "Processando", color: "bg-blue-100 text-blue-800" },
      SHIPPED: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
      DELIVERED: { label: "Entregue", color: "bg-teal-100 text-teal-800" },
      CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800" },
      EXPIRED: { label: "Expirado", color: "bg-gray-100 text-gray-800" },
    };

    const badge = badges[status] || {
      label: "Desconhecido",
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
      >
        {badge.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                { label: "Pedidos" },
              ]}
            />

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
              <p className="text-gray-600 mt-1">
                Gerencie todos os pedidos realizados
              </p>
            </div>

            {/* Filtros */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Filtro por status */}
                <CustomSelect
                  label="Status"
                  value={statusFilter}
                  onChange={(value) =>
                    handleStatusFilterChange(value as OrderStatus | "ALL")
                  }
                  options={[
                    { value: "ALL", label: "Todos" },
                    { value: "PENDING", label: "Pendente" },
                    { value: "CONFIRMED", label: "Confirmado" },
                    { value: "PROCESSING", label: "Processando" },
                    { value: "SHIPPED", label: "Enviado" },
                    { value: "DELIVERED", label: "Entregue" },
                    { value: "CANCELLED", label: "Cancelado" },
                    { value: "EXPIRED", label: "Expirado" },
                  ]}
                />

                {/* Itens por página */}
                <CustomSelect
                  label="Itens por página"
                  value={String(pageSize)}
                  onChange={handlePageSizeChange}
                  options={[
                    { value: "5", label: "5" },
                    { value: "10", label: "10" },
                    { value: "25", label: "25" },
                    { value: "50", label: "50" },
                  ]}
                />
              </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Itens
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      Array.from({ length: pageSize }).map((_, index) => (
                        <tr key={index}>
                          {Array.from({ length: 6 }).map((_, colIndex) => (
                            <td key={colIndex} className="px-6 py-4">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          Nenhum pedido encontrado
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900">
                              #{order.orderId?.slice(0, 8) || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "itens"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatPrice(order.total)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() =>
                                router.push(`/admin/orders/${order.orderId}`)
                              }
                              className="text-christian-blue hover:text-blue-700 font-medium"
                            >
                              Ver detalhes
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {isLoading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  ))
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Nenhum pedido encontrado
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-sm font-mono text-gray-900 mb-1">
                            #{order.orderId?.slice(0, 8) || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="text-sm text-gray-600">
                          <strong>Itens:</strong> {order.items.length}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          router.push(`/admin/orders/${order.orderId}`)
                        }
                        className="w-full py-2 bg-christian-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Paginação */}
              {!isLoading && orders.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Exibindo {orders.length} de {ordersData?.totalElements || 0}{" "}
                    pedidos - Página {currentPage + 1} de {totalPages || 1}
                  </div>

                  <div className="flex items-center gap-2">
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
            </div>
          </main>

          {/* Rodapé */}
          <AdminFooter />
        </div>
      </div>
    </>
  );
}
