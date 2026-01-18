"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleProceedToPayment = () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      // Here you would integrate with Mercado Pago or another payment gateway
      alert("Integração de pagamento será implementada em breve!");
    }, 2000);
  };

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F6F2]">
        <Navigation />

        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="font-playfair text-3xl font-bold text-[#2E2E2E] mb-4">
                Nenhum item para finalizar
              </h1>
              <p className="font-inter text-[#2E2E2E] opacity-80 mb-8">
                Adicione alguns livros ao seu carrinho primeiro.
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 font-inter text-sm text-[#2E2E2E] opacity-60">
                <li>
                  <Link
                    href="/#livros"
                    className="hover:text-[#2F5D8C] transition-colors duration-200"
                  >
                    Livros
                  </Link>
                </li>
                <li>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="hover:text-[#2F5D8C] transition-colors duration-200"
                  >
                    Carrinho
                  </Link>
                </li>
                <li>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
                <li className="text-[#2F5D8C] font-semibold">
                  Finalizar Compra
                </li>
              </ol>
            </nav>

            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">
              Finalizar Compra
            </h1>
            <p className="font-inter text-lg text-[#2E2E2E] opacity-80">
              Confirme seu pedido e prossiga para o pagamento seguro
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 py-4 border-b border-[#2F5D8C]/10 last:border-b-0"
                    >
                      <img
                        src={item.image}
                        alt={`Capa do livro ${item.title}`}
                        className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <h3 className="font-playfair text-lg font-bold text-[#2E2E2E] mb-1">
                          {item.title}
                        </h3>
                        <p className="font-inter text-sm text-[#2E2E2E] opacity-60 mb-2">
                          Por {item.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-inter text-sm text-[#2E2E2E] opacity-80">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-inter font-semibold text-[#2F5D8C]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-6">
                  Informações de Entrega
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                    >
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                    >
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                    >
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cep"
                      className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                    >
                      CEP *
                    </label>
                    <input
                      type="text"
                      id="cep"
                      name="cep"
                      required
                      className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                    >
                      Endereço Completo *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                    >
                      Cidade *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                      placeholder="Sua cidade"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                    >
                      Estado *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                    >
                      <option value="">Selecione o estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-24">
                <h3 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-6">
                  Total do Pedido
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-inter text-[#2E2E2E] opacity-80">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"}
                      )
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
                      <span className="font-playfair text-xl font-bold text-[#2E2E2E]">
                        Total
                      </span>
                      <span className="font-playfair text-3xl font-bold text-[#2F5D8C]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-3 mb-8 p-4 bg-[#F7F6F2] rounded-xl">
                  <div className="flex items-center space-x-3 text-[#3A7D44]">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-inter text-sm font-medium">
                      Pagamento 100% seguro
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
                      Entrega garantida
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[#3A7D44]">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-inter text-sm font-medium">
                      Dados protegidos por SSL
                    </span>
                  </div>
                </div>

                {/* Payment Methods Preview */}
                <div className="mb-8">
                  <p className="font-inter text-sm text-[#2E2E2E] opacity-60 mb-4">
                    Formas de pagamento aceitas:
                  </p>
                  <div className="flex space-x-2">
                    <div className="bg-[#F7F6F2] p-2 rounded">
                      <span className="font-inter text-xs text-[#2F5D8C] font-semibold">
                        PIX
                      </span>
                    </div>
                    <div className="bg-[#F7F6F2] p-2 rounded">
                      <span className="font-inter text-xs text-[#2F5D8C] font-semibold">
                        Cartão
                      </span>
                    </div>
                    <div className="bg-[#F7F6F2] p-2 rounded">
                      <span className="font-inter text-xs text-[#2F5D8C] font-semibold">
                        Boleto
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-xl font-inter font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#C9A44C] hover:bg-[#B8934A] hover:scale-105 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>Prosseguir para Pagamento</span>
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
                    </>
                  )}
                </button>

                {/* Back to Cart */}
                <Link
                  href="/cart"
                  className="w-full mt-4 bg-transparent border-2 border-[#2F5D8C] text-[#2F5D8C] hover:bg-[#2F5D8C] hover:text-white font-inter font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  Voltar ao Carrinho
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
