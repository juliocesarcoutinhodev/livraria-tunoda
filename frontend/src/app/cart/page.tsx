"use client";

import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function CartPage() {
  const { items, total, itemCount, removeItem, updateQuantity } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">
              Meu Carrinho
            </h1>
            <p className="font-inter text-lg text-[#2E2E2E] opacity-80">
              {itemCount === 0
                ? "Seu carrinho está vazio"
                : `${itemCount} ${
                    itemCount === 1
                      ? "livro selecionado"
                      : "livros selecionados"
                  }`}
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="mb-8">
                <svg
                  className="mx-auto w-24 h-24 text-[#2F5D8C] opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>
              <h2 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-4">
                Seu carrinho está vazio
              </h2>
              <p className="font-inter text-[#2E2E2E] opacity-80 mb-8 max-w-md mx-auto">
                Adicione alguns livros ao seu carrinho para continuar sua
                jornada de fé e crescimento espiritual.
              </p>
              <Link
                href="/#livros"
                className="inline-flex items-center px-8 py-4 bg-[#C9A44C] hover:bg-[#B8934A] text-white font-inter font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Ver Livros
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Book Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={`Capa do livro ${item.title}`}
                          className="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-xl"
                        />
                      </div>

                      {/* Book Info */}
                      <div className="flex-grow space-y-3">
                        <div>
                          <h3 className="font-playfair text-xl font-bold text-[#2E2E2E] mb-1">
                            {item.title}
                          </h3>
                          <p className="font-inter text-sm text-[#2E2E2E] opacity-60">
                            Por {item.author}
                          </p>
                        </div>

                        <p className="font-inter text-[#2E2E2E] opacity-80 text-sm line-clamp-2">
                          {item.description}
                        </p>

                        {/* Quantity and Price Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#2F5D8C]/10">
                          <div className="flex items-center space-x-3">
                            <span className="font-inter text-sm text-[#2E2E2E] opacity-60">
                              Quantidade:
                            </span>
                            <div className="flex items-center border border-[#2F5D8C]/20 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="px-3 py-2 text-[#2F5D8C] hover:bg-[#2F5D8C]/10 transition-colors duration-200 rounded-l-lg"
                                aria-label="Diminuir quantidade"
                              >
                                -
                              </button>
                              <span className="px-4 py-2 font-inter font-semibold text-[#2E2E2E] border-x border-[#2F5D8C]/20">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="px-3 py-2 text-[#2F5D8C] hover:bg-[#2F5D8C]/10 transition-colors duration-200 rounded-r-lg"
                                aria-label="Aumentar quantidade"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-inter text-sm text-[#2E2E2E] opacity-60 mb-1">
                              {formatPrice(item.price)} cada
                            </p>
                            <p className="font-playfair text-xl font-bold text-[#2F5D8C]">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="pt-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-700 font-inter text-sm transition-colors duration-200"
                            aria-label={`Remover ${item.title} do carrinho`}
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-24">
                  <h3 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-6">
                    Resumo do Pedido
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="font-inter text-[#2E2E2E] opacity-80">
                        Subtotal ({itemCount}{" "}
                        {itemCount === 1 ? "item" : "itens"})
                      </span>
                      <span className="font-inter font-semibold text-[#2E2E2E]">
                        {formatPrice(total)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="font-inter text-[#2E2E2E] opacity-80">
                        Frete
                      </span>
                      <span className="font-inter font-semibold text-[#3A7D44]">
                        Grátis
                      </span>
                    </div>

                    <div className="border-t border-[#2F5D8C]/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-playfair text-lg font-bold text-[#2E2E2E]">
                          Total
                        </span>
                        <span className="font-playfair text-2xl font-bold text-[#2F5D8C]">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mb-8 p-4 bg-[#F7F6F2] rounded-xl">
                    <div className="flex items-center space-x-3 text-[#3A7D44]">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-inter text-sm font-medium">
                        Frete grátis para todo o Brasil
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#3A7D44]">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-inter text-sm font-medium">
                        Entrega rápida e segura
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#3A7D44]">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-inter text-sm font-medium">
                        Pagamento 100% seguro
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full bg-[#C9A44C] hover:bg-[#B8934A] text-white font-inter font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Finalizar Compra</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    href="/#livros"
                    className="w-full mt-4 bg-transparent border-2 border-[#2F5D8C] text-[#2F5D8C] hover:bg-[#2F5D8C] hover:text-white font-inter font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
