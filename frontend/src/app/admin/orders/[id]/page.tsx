"use client";

/**
 * Admin Order Details Page
 *
 * Página de visualização detalhada de um pedido (ADMIN).
 * Exibe todas as informações do pedido: itens, frete, status, etc.
 *
 * @module app/admin/orders/[id]
 */

import { useParams, useRouter } from "next/navigation";
import { useOrder } from "@/hooks";
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminFooter from "@/components/layout/AdminFooter";
import Breadcrumb from "@/components/layout/Breadcrumb";
import type { OrderStatus } from "@/types/order";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  // Auto-logout por inatividade
  useAutoLogoutAfterInactivity();

  // Query do pedido
  const { data: order, isLoading, error } = useOrder(orderId);

  const getStatusBadge = (status: OrderStatus) => {
    const badges: Record<
      OrderStatus,
      { label: string; color: string; icon: string }
    > = {
      PENDING: {
        label: "Pendente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳",
      },
      CONFIRMED: {
        label: "Confirmado",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✓",
      },
      PROCESSING: {
        label: "Processando",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "⚙️",
      },
      SHIPPED: {
        label: "Enviado",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "📦",
      },
      DELIVERED: {
        label: "Entregue",
        color: "bg-teal-100 text-teal-800 border-teal-200",
        icon: "✓",
      },
      CANCELLED: {
        label: "Cancelado",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "✗",
      },
      EXPIRED: {
        label: "Expirado",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "⌛",
      },
    };

    const badge = badges[status] || {
      label: "Desconhecido",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: "?",
    };
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${badge.color}`}
      >
        <span className="text-lg">{badge.icon}</span>
        {badge.label}
      </div>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const normalized = dateString?.trim();
    if (!normalized) {
      return "-";
    }

    let date: Date | null = null;
    if (normalized.includes("/")) {
      const [datePart, timePart] = normalized.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      if (day && month && year) {
        if (timePart) {
          const [hour, minute] = timePart.split(":").map(Number);
          date = new Date(year, month - 1, day, hour || 0, minute || 0);
        } else {
          date = new Date(year, month - 1, day);
        }
      }
    } else {
      date = new Date(normalized);
    }

    if (!date || Number.isNaN(date.getTime())) {
      return normalized;
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christian-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Pedido não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              O pedido solicitado não existe ou você não tem permissão para
              visualizá-lo.
            </p>
            <button
              onClick={() => router.push("/admin/orders")}
              className="px-6 py-2 bg-christian-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Voltar para pedidos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
          <main className="flex-1 p-4 lg:p-8">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/admin/dashboard" },
                { label: "Pedidos", href: "/admin/orders" },
                { label: `#${order.orderId?.slice(0, 8) || "N/A"}` },
              ]}
            />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-mono">
                  Pedido #{order.orderId?.slice(0, 8) || "N/A"}
                </h1>
                <p className="text-gray-600 mt-1">
                  Criado em {formatDate(order.createdAt)}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Itens do Pedido */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Itens do Pedido ({order.items.length})
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {item.bookTitle}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Preço unitário: {formatPrice(item.unitPrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totais */}
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frete</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(order.shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Total</span>
                        <span className="text-christian-blue">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações de Frete */}
                {order.shipping && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                        Informações de Entrega
                      </h2>
                    </div>
                    <div className="p-6">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">
                            Serviço
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {order.shipping.serviceName} (
                            {order.shipping.serviceCode})
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">
                            Prazo de Entrega
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {order.shipping.deliveryDays} dia
                            {order.shipping.deliveryDays !== 1 ? "s" : ""} úteis
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">
                            CEP de Destino
                          </dt>
                          <dd className="text-sm text-gray-900 font-mono">
                            {order.shipping.toPostalCode}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">
                            Custo do Frete
                          </dt>
                          <dd className="text-sm font-semibold text-gray-900">
                            {formatPrice(order.shipping.cost)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna Lateral */}
              <div className="space-y-6">
                {/* Cliente */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Cliente
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-900 break-words">
                      {order.customerEmail}
                    </p>
                  </div>
                </div>

                {/* Linha do Tempo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
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
                      Linha do Tempo
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Criado */}
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600"
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
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Pedido Criado
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Pago */}
                      {order.paidAt && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
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
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Pagamento Confirmado
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.paidAt)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Processando */}
                      {order.processingAt && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8 8 0 104.582 9m0 0H9m11 11v-5h-.581m0 0a8 8 0 01-15.356-2m15.356 2H15"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Pedido em Processamento
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.processingAt)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Enviado */}
                      {order.shippedAt && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Pedido Enviado
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.shippedAt)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Entregue */}
                      {order.deliveredAt && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Pedido Entregue
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.deliveredAt)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Cancelado */}
                      {order.cancelledAt && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Pedido Cancelado
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.cancelledAt)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Expirado */}
                      {order.expiredAt && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-gray-600"
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
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Pedido Expirado
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.expiredAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <button
                      onClick={() => router.push("/admin/orders")}
                      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Voltar para pedidos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Rodapé */}
          <AdminFooter />
        </div>
      </div>
    </>
  );
}
