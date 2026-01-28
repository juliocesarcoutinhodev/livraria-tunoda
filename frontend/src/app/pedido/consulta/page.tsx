"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import { orderService } from "@/services/orderService";

export default function OrderLookupPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!orderId.trim() || !email.trim()) {
      setError("Informe o codigo do pedido e o email.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await orderService.lookup({
        orderId: orderId.trim(),
        email: email.trim(),
      });
      if (result.valid && result.redirectUrl) {
        router.push(result.redirectUrl);
        return;
      }
      setError(result.message || "Pedido nao encontrado para este email.");
    } catch {
      setError("Nao foi possivel localizar o pedido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-2">
              Consultar Pedido
            </h1>
            <p className="text-sm text-[#2E2E2E] opacity-70 font-inter mb-6">
              Informe o codigo do pedido e o email usado na compra.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="orderId"
                  className="block text-sm font-medium text-[#2E2E2E] font-inter mb-2"
                >
                  Codigo do pedido
                </label>
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                  placeholder="ex: 2ccc9783-67c8-4881-b474-dd6780c75f8d"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2E2E2E] font-inter mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                  placeholder="cliente@email.com"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-inter font-semibold py-3 px-6 rounded-xl transition-all ${
                  isLoading
                    ? "bg-gray-300 text-gray-500"
                    : "bg-[#2F5D8C] hover:bg-[#274A6F] text-white"
                }`}
              >
                {isLoading ? "Consultando..." : "Ver pedido"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
