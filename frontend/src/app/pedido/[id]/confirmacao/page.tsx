"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import type { Order } from "@/types/order";
import type { Payment } from "@/types/payment";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

const orderStatusLabel = (status?: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return "Aguardando pagamento";
    case "CONFIRMED":
      return "Pagamento confirmado";
    case "PROCESSING":
      return "Pedido em preparo";
    case "SHIPPED":
      return "Pedido enviado";
    case "DELIVERED":
      return "Pedido entregue";
    case "CANCELLED":
      return "Pedido cancelado";
    case "EXPIRED":
      return "Pedido expirado";
    default:
      return "Status indisponivel";
  }
};

const paymentStatusLabel = (status?: Payment["status"]) => {
  switch (status) {
    case "CREATED":
      return "Criado";
    case "PENDING":
      return "Em processamento";
    case "APPROVED":
      return "Aprovado";
    case "REJECTED":
      return "Recusado";
    case "CANCELLED":
      return "Cancelado";
    case "EXPIRED":
      return "Expirado";
    default:
      return "Aguardando";
  }
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = typeof params.id === "string" ? params.id : params.id?.[0];
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const paymentReference = useMemo(
    () => order?.paymentReference || payment?.paymentId,
    [order?.paymentReference, payment?.paymentId]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!orderId) {
        return;
      }
      try {
        const data = await orderService.getById(orderId);
        if (isMounted) {
          setOrder(data);
          setError("");
        }
      } catch {
        if (isMounted) {
          setError("Nao foi possivel carregar o pedido.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  useEffect(() => {
    if (!paymentReference) {
      return;
    }
    let isMounted = true;

    const fetchPayment = async () => {
      try {
        const data = await paymentService.getById(paymentReference);
        if (isMounted) {
          setPayment(data);
        }
      } catch {
        // Mantem status atual quando falhar.
      }
    };

    void fetchPayment();

    return () => {
      isMounted = false;
    };
  }, [paymentReference]);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const data = await orderService.getById(orderId);
        setOrder(data);
      } catch {
        // Silencioso: continua exibindo o ultimo estado.
      }
    }, 20000);

    return () => window.clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (!paymentReference) {
      return;
    }
    if (
      payment?.status === "APPROVED" ||
      payment?.status === "REJECTED" ||
      payment?.status === "CANCELLED" ||
      payment?.status === "EXPIRED"
    ) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const data = await paymentService.getById(paymentReference);
        setPayment(data);
      } catch {
        // Mantem status atual quando falhar.
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [paymentReference, payment?.status]);

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#2E2E2E] mb-2">
              Confirmação do Pedido
            </h1>
            <p className="font-inter text-sm text-[#2E2E2E] opacity-70">
              Acompanhe o status do pagamento e do envio.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="font-inter text-[#2E2E2E] opacity-70">
                Carregando pedido...
              </p>
            </div>
          ) : error || !order ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700 font-inter">
              {error || "Pedido nao encontrado."}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#2E2E2E] opacity-60 font-inter">
                        Pedido
                      </p>
                      <p className="font-inter font-semibold text-[#2E2E2E]">
                        {order.orderId}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#2F5D8C]/20 bg-[#2F5D8C]/10 px-3 py-1 text-xs font-semibold text-[#2F5D8C]">
                      {orderStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                  <h2 className="font-playfair text-xl font-bold text-[#2E2E2E]">
                    Itens do pedido
                  </h2>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center justify-between border-b border-[#2F5D8C]/10 pb-3 text-sm font-inter text-[#2E2E2E]"
                      >
                        <div>
                          <p className="font-semibold">{item.bookTitle}</p>
                          <p className="text-xs opacity-60">
                            {item.quantity}x
                          </p>
                        </div>
                        <span className="font-semibold text-[#2F5D8C]">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                  <h3 className="font-playfair text-lg font-bold text-[#2E2E2E]">
                    Pagamento
                  </h3>
                  <div className="flex items-center justify-between text-sm font-inter text-[#2E2E2E]">
                    <span>Status</span>
                    <span className="font-semibold text-[#2F5D8C]">
                      {paymentStatusLabel(payment?.status)}
                    </span>
                  </div>
                  {payment?.rejectionReason && (
                    <p className="text-xs text-red-600 font-inter">
                      {payment.rejectionReason}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm font-inter text-[#2E2E2E]">
                    <span>Total</span>
                    <span className="font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                  <h3 className="font-playfair text-lg font-bold text-[#2E2E2E]">
                    Resumo
                  </h3>
                  <div className="flex items-center justify-between text-sm font-inter text-[#2E2E2E]">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-inter text-[#2E2E2E]">
                    <span>Frete</span>
                    <span className="font-semibold text-[#2F5D8C]">
                      {formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-[#2F5D8C]/10 pt-3 flex items-center justify-between font-inter text-[#2E2E2E]">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-[#2F5D8C]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/livros"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#2F5D8C] px-4 py-3 text-sm font-semibold text-[#2F5D8C] hover:bg-[#2F5D8C] hover:text-white transition-colors"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
