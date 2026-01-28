"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Navigation from "@/components/layout/Navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import { useCart } from "@/contexts/CartContext";
import { cartService } from "@/services/cartService";
import { cepService } from "@/services/cepService";
import { paymentService } from "@/services/paymentService";
import { shippingService } from "@/services/shippingService";
import type { CartValidationResponse } from "@/types/cart";
import type { ShippingOption, ShippingQuote } from "@/types/shipping";
import type { CheckoutResponse } from "@/types/cart";
import type { Payment, PaymentMethod } from "@/types/payment";

const steps = [
  { id: 1, title: "Identificacao" },
  { id: 2, title: "Endereco" },
  { id: 3, title: "Revisao" },
  { id: 4, title: "Pagamento" },
];

type CheckoutErrors = Partial<Record<string, string>>;

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
};

type AddressInfo = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) {
    return "";
  }
  if (digits.length < 2) {
    return digits;
  }
  if (digits.length === 2) {
    return `(${digits})`;
  }

  const area = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (digits.length <= 6) {
    return `(${area}) ${rest}`;
  }
  if (digits.length <= 10) {
    return `(${area}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  return `(${area}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
};


export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, itemCount, isLoading, cartId, resetCart } = useCart();
  const [step, setStep] = useState(1);
  const [validation, setValidation] = useState<CartValidationResponse | null>(
    null
  );
  const [isValidating, setIsValidating] = useState(false);
  const [order, setOrder] = useState<CheckoutResponse | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [paymentPreferenceId, setPaymentPreferenceId] = useState<string | null>(
    null
  );
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    itemCount: number;
    shippingCost: number;
    total: number;
  } | null>(null);

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState<AddressInfo>({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [isShippingSelecting, setIsShippingSelecting] = useState(false);
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const mercadoPagoPublicKey =
    process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  useEffect(() => {
    if (!mercadoPagoPublicKey) {
      return;
    }
    initMercadoPago(mercadoPagoPublicKey, { locale: "pt-BR" });
  }, [mercadoPagoPublicKey]);

  const selectedOption = useMemo<ShippingOption | null>(() => {
    if (!shippingQuote) {
      return null;
    }
    const selectedCode = selectedService || shippingQuote.selectedServiceCode;
    if (!selectedCode) {
      return null;
    }
    return (
      shippingQuote.options.find(
        (option) => option.serviceCode === selectedCode
      ) || null
    );
  }, [shippingQuote, selectedService]);

  const totalWithShipping = useMemo(() => {
    const shippingCost = selectedOption?.price || 0;
    return subtotal + shippingCost;
  }, [subtotal, selectedOption]);
  const summarySubtotal = orderSummary?.subtotal ?? subtotal;
  const summaryItemCount = orderSummary?.itemCount ?? itemCount;
  const summaryShipping =
    orderSummary?.shippingCost ?? (selectedOption?.price ?? 0);
  const summaryTotal = orderSummary?.total ?? totalWithShipping;

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

  const extractPreferenceId = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.searchParams.get("pref_id");
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const runValidation = async () => {
      if (!cartId || items.length === 0 || isLoading) {
        if (isMounted) {
          setValidation(null);
        }
        return;
      }

      setIsValidating(true);
      try {
        const result = await cartService.validate(cartId);
        if (isMounted) {
          setValidation(result);
        }
      } catch {
        if (isMounted) {
          toast.error("Nao foi possivel validar o estoque antes do checkout.");
        }
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    };

    void runValidation();

    return () => {
      isMounted = false;
    };
  }, [cartId, items, isLoading]);

  const handleCepLookup = async () => {
    const cleanCep = address.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setErrors((prev) => ({ ...prev, cep: "Informe um CEP valido." }));
      toast.error("Informe um CEP valido.");
      return;
    }

    setIsCepLoading(true);
    try {
      const data = await cepService.getByCep(cleanCep);
      setAddress((prev) => ({
        ...prev,
        cep: cleanCep,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.cidade || prev.city,
        state: data.uf || prev.state,
      }));
      setErrors((prev) => ({ ...prev, cep: "" }));
      await fetchShippingQuote(cleanCep);
    } catch {
      toast.error("Nao foi possivel localizar o endereco pelo CEP.");
    } finally {
      setIsCepLoading(false);
    }
  };

  const fetchShippingQuote = async (postalCode: string) => {
    if (!cartId) {
      toast.error("Carrinho indisponivel para calcular frete.");
      return;
    }
    setIsShippingLoading(true);
    try {
      const quote = await shippingService.createQuote({
        cartId,
        toPostalCode: postalCode,
      });
      const calculated = await shippingService.calculate(quote.id);
      setShippingQuote(calculated);
      setSelectedService("");
    } catch {
      toast.error("Nao foi possivel calcular o frete.");
    } finally {
      setIsShippingLoading(false);
    }
  };

  const handleSelectShipping = async (serviceCode: string) => {
    if (!shippingQuote) {
      return;
    }
    setIsShippingSelecting(true);
    try {
      const updated = await shippingService.selectOption(
        shippingQuote.id,
        serviceCode
      );
      setShippingQuote(updated);
      setSelectedService(serviceCode);
    } catch {
      toast.error("Nao foi possivel selecionar o frete.");
    } finally {
      setIsShippingSelecting(false);
    }
  };

  const validateStep = (currentStep: number) => {
    const nextErrors: CheckoutErrors = {};

    if (currentStep === 1) {
      if (!customer.fullName.trim()) {
        nextErrors.fullName = "Informe seu nome completo.";
      }
      if (!customer.email.trim() || !/\S+@\S+\.\S+/.test(customer.email)) {
        nextErrors.email = "Informe um email valido.";
      }
      const phoneDigits = customer.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        nextErrors.phone = "Informe um telefone valido.";
      }
    }

    if (currentStep === 2) {
      if (address.cep.replace(/\D/g, "").length !== 8) {
        nextErrors.cep = "Informe um CEP valido.";
      }
      if (!address.street.trim()) {
        nextErrors.street = "Informe a rua.";
      }
      if (!address.number.trim()) {
        nextErrors.number = "Informe o numero.";
      }
      if (!address.neighborhood.trim()) {
        nextErrors.neighborhood = "Informe o bairro.";
      }
      if (!address.city.trim()) {
        nextErrors.city = "Informe a cidade.";
      }
      if (!address.state.trim()) {
        nextErrors.state = "Informe o estado.";
      }
      if (!selectedService || !shippingQuote) {
        nextErrors.shipping = "Selecione uma opcao de frete.";
      }
    }

    if (currentStep === 3 && validation && !validation.valid) {
      toast.error(validation.message || "Revise o estoque dos itens.");
      return false;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Revise os campos antes de continuar.");
      return false;
    }
    return true;
  };

  const createOrder = async (): Promise<CheckoutResponse | null> => {
    if (!cartId || !shippingQuote) {
      toast.error("Finalize o frete antes de concluir.");
      return null;
    }
    if (validation && !validation.valid) {
      toast.error(validation.message || "Revise o estoque dos itens.");
      return null;
    }

    setIsCreatingOrder(true);
    try {
      const created = await cartService.checkout({
        cartId,
        shippingQuoteId: shippingQuote.id,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        street: address.street,
        number: address.number,
        complement: address.complement || null,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        postalCode: address.cep,
      });
      setOrderSummary({
        subtotal,
        itemCount,
        shippingCost: selectedOption?.price || 0,
        total: subtotal + (selectedOption?.price || 0),
      });
      setOrder(created);
      resetCart();
      toast.success(`Pedido criado: ${created.orderId}`);
      return created;
    } catch {
      toast.error("Nao foi possivel criar o pedido.");
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCreatePayment = async () => {
    if (!order?.orderId) {
      toast.error("Crie o pedido antes de pagar.");
      return;
    }
    if (!paymentMethod) {
      setPaymentError("Selecione a forma de pagamento.");
      toast.error("Selecione a forma de pagamento.");
      return;
    }

    setPaymentError("");
    setIsPaymentProcessing(true);

    try {
      const createdPayment = await paymentService.create(order.orderId, {
        paymentMethod,
      });
      const processed = await paymentService.process(createdPayment.paymentId);
      setPayment(processed.payment);
      setPaymentUrl(processed.paymentUrl);
      setPaymentPreferenceId(extractPreferenceId(processed.paymentUrl));
    } catch {
      toast.error("Nao foi possivel iniciar o pagamento.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep(step)) {
      return;
    }
    if (step === 3 && !order?.orderId) {
      const created = await createOrder();
      if (!created) {
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (!payment?.paymentId) {
      return;
    }
    if (
      payment.status === "APPROVED" ||
      payment.status === "REJECTED" ||
      payment.status === "CANCELLED" ||
      payment.status === "EXPIRED"
    ) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const updated = await paymentService.getById(payment.paymentId);
        setPayment(updated);
      } catch {
        // Mantem o ultimo status quando a consulta falhar.
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [payment?.paymentId, payment?.status]);

  useEffect(() => {
    if (payment?.status === "APPROVED") {
      resetCart();
    }
  }, [payment?.status, resetCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2]">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <p className="font-inter text-[#2E2E2E] opacity-70">
                Carregando checkout...
              </p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (items.length === 0 && !order?.orderId) {
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
                href="/livros"
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
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="font-inter text-sm text-[#2E2E2E] opacity-60">
              Etapa {step} de {steps.length}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {steps.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-inter ${
                    step >= item.id
                      ? "border-[#2F5D8C] bg-[#2F5D8C]/10 text-[#2F5D8C]"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                      step >= item.id
                        ? "bg-[#2F5D8C] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {item.id}
                  </span>
                  {item.title}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {!validation?.valid && step >= 3 && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 font-inter">
                  {validation?.message ||
                    "Revise os itens com estoque indisponivel."}
                </div>
              )}

              {step === 1 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-6">
                    Identificacao
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Nome completo *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={customer.fullName}
                        onChange={(event) =>
                          setCustomer((prev) => ({
                            ...prev,
                            fullName: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.fullName
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="Seu nome completo"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={customer.email}
                        onChange={(event) =>
                          setCustomer((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.email
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="voce@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Telefone *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={customer.phone}
                        onChange={(event) =>
                          setCustomer((prev) => ({
                            ...prev,
                            phone: formatPhone(event.target.value),
                          }))
                        }
                        inputMode="tel"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.phone
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="(00) 00000-0000"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-2">
                      Endereco de Entrega
                    </h2>
                    <p className="text-sm text-[#2E2E2E] opacity-70 font-inter">
                      Preencha os dados e calcule o frete.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="cep"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        CEP *
                      </label>
                      <input
                        id="cep"
                        type="text"
                        value={address.cep}
                        onChange={(event) =>
                          setAddress((prev) => ({
                            ...prev,
                            cep: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.cep
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="00000-000"
                      />
                      {errors.cep && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.cep}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleCepLookup}
                      disabled={isCepLoading}
                      className={`mt-7 h-12 rounded-lg px-4 text-sm font-inter font-semibold transition-colors ${
                        isCepLoading
                          ? "bg-gray-200 text-gray-500"
                          : "bg-[#2F5D8C] text-white hover:bg-[#274A6F]"
                      }`}
                    >
                      {isCepLoading ? "Buscando..." : "Buscar CEP"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="street"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Rua *
                      </label>
                      <input
                        id="street"
                        type="text"
                        value={address.street}
                        onChange={(event) =>
                          setAddress((prev) => ({
                            ...prev,
                            street: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.street
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="Rua, avenida, etc"
                      />
                      {errors.street && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.street}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="number"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Numero *
                      </label>
                      <input
                        id="number"
                        type="text"
                        value={address.number}
                        onChange={(event) =>
                          setAddress((prev) => ({
                            ...prev,
                            number: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.number
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="Numero"
                      />
                      {errors.number && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.number}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="complement"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Complemento
                      </label>
                      <input
                        id="complement"
                        type="text"
                        value={address.complement}
                        onChange={(event) =>
                          setAddress((prev) => ({
                            ...prev,
                            complement: event.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-[#2F5D8C]/20 rounded-lg focus:ring-2 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C] transition-colors duration-200"
                        placeholder="Apto, bloco, etc"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="neighborhood"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Bairro *
                      </label>
                      <input
                        id="neighborhood"
                        type="text"
                        value={address.neighborhood}
                        onChange={(event) =>
                          setAddress((prev) => ({
                            ...prev,
                            neighborhood: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.neighborhood
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="Bairro"
                      />
                      {errors.neighborhood && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.neighborhood}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Cidade *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={address.city}
                        onChange={(event) =>
                          setAddress((prev) => ({
                            ...prev,
                            city: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.city
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="Cidade"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block font-inter text-sm font-medium text-[#2E2E2E] mb-2"
                      >
                        Estado *
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={address.state}
                        onChange={(event) =>
                          setAddress((prev) => ({
                            ...prev,
                            state: event.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${
                          errors.state
                            ? "border-red-300 focus:ring-red-200"
                            : "border-[#2F5D8C]/20 focus:ring-[#2F5D8C]/20 focus:border-[#2F5D8C]"
                        }`}
                        placeholder="UF"
                      />
                      {errors.state && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#2F5D8C]/10 bg-[#F7F6F2] p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-sm text-[#2E2E2E] font-semibold">
                        Frete (Melhor Envio)
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          fetchShippingQuote(address.cep.replace(/\D/g, ""))
                        }
                        disabled={isShippingLoading}
                        className="text-xs font-semibold text-[#2F5D8C] hover:text-[#274A6F]"
                      >
                        {isShippingLoading ? "Calculando..." : "Recalcular"}
                      </button>
                    </div>
                    {errors.shipping && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.shipping}
                      </p>
                    )}
                    <div className="mt-4 space-y-3">
                      {shippingQuote?.options?.length ? (
                        shippingQuote.options.map((option) => (
                          <label
                            key={option.serviceCode}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-inter transition-colors ${
                              (selectedService ||
                                shippingQuote.selectedServiceCode) ===
                              option.serviceCode
                                ? "border-[#2F5D8C] bg-white"
                                : "border-transparent bg-white/70"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={option.serviceCode}
                              checked={
                                (selectedService ||
                                  shippingQuote.selectedServiceCode) ===
                                option.serviceCode
                              }
                              onChange={() =>
                                handleSelectShipping(option.serviceCode)
                              }
                              disabled={isShippingSelecting}
                              className="accent-[#2F5D8C]"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-[#2E2E2E]">
                                {option.carrier} - {option.serviceName}
                              </p>
                              <p className="text-xs text-[#2E2E2E] opacity-70">
                                Entrega em {option.deliveryDays} dias
                              </p>
                            </div>
                            <span className="font-semibold text-[#2F5D8C]">
                              {formatPrice(option.price)}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-[#2E2E2E] opacity-70 font-inter">
                          {isShippingLoading
                            ? "Calculando opcoes..."
                            : "Informe o CEP para calcular o frete."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="font-playfair text-2xl font-bold text-[#2E2E2E] mb-6">
                    Revisao do Pedido
                  </h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={item.bookId}
                        className="flex items-center gap-4 border-b border-[#2F5D8C]/10 pb-4"
                      >
                        <Image
                          src={item.photoUrl || "/img/book-placeholder.svg"}
                          alt={`Capa do livro ${item.title}`}
                          width={64}
                          height={80}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-inter font-semibold text-[#2E2E2E]">
                            {item.title}
                          </p>
                          <p className="text-sm text-[#2E2E2E] opacity-70">
                            {item.quantity}x
                          </p>
                        </div>
                        <span className="font-inter font-semibold text-[#2F5D8C]">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
                  <h2 className="font-playfair text-2xl font-bold text-[#2E2E2E]">
                    Pagamento
                  </h2>
                  <p className="text-sm text-[#2E2E2E] opacity-70 font-inter">
                    Escolha a forma de pagamento e conclua pelo Mercado Pago.
                  </p>

                  {order?.orderId ? (
                    <div className="rounded-xl border border-[#2F5D8C]/10 bg-[#F7F6F2] px-4 py-3 text-sm font-inter text-[#2E2E2E]">
                      Pedido criado: <strong>{order.orderId}</strong>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-inter text-amber-700">
                      Confirme o pedido para liberar o pagamento.
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#2E2E2E] font-inter">
                      Forma de pagamento
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { value: "CREDIT_CARD" as const, label: "Cartao de credito" },
                        { value: "PIX" as const, label: "PIX" },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-inter transition-colors ${
                            paymentMethod === method.value
                              ? "border-[#2F5D8C] bg-white"
                              : "border-transparent bg-white/70"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={() => setPaymentMethod(method.value)}
                            disabled={!!paymentUrl}
                            className="accent-[#2F5D8C]"
                          />
                          <span className="font-semibold text-[#2E2E2E]">
                            {method.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {paymentError && (
                      <p className="text-xs text-red-500">{paymentError}</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[#2F5D8C]/10 bg-[#F7F6F2] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#2E2E2E] font-inter">
                        Status do pagamento
                      </span>
                      <span className="text-sm font-semibold text-[#2F5D8C]">
                        {paymentStatusLabel(payment?.status)}
                      </span>
                    </div>
                    {payment?.rejectionReason && (
                      <p className="text-xs text-red-600 font-inter">
                        {payment.rejectionReason}
                      </p>
                    )}
                  </div>

                  {paymentUrl ? (
                    <div className="space-y-4">
                      {paymentPreferenceId && mercadoPagoPublicKey ? (
                        <Wallet
                          key={paymentPreferenceId}
                          initialization={{ preferenceId: paymentPreferenceId }}
                        />
                      ) : (
                        <div className="rounded-2xl border border-[#2F5D8C]/10 bg-white p-5 text-sm font-inter text-[#2E2E2E]">
                          <p>
                            Clique em "Ir para pagamento" para concluir pagamento
                            por QR Code do PIX ou Cartão.
                          </p>
                          <button
                            type="button"
                            onClick={() => window.open(paymentUrl, "_blank")}
                            className="mt-4 inline-flex items-center rounded-xl bg-[#2F5D8C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#274A6F] transition-colors"
                          >
                            Ir para pagamento
                          </button>
                        </div>
                      )}

                      {paymentMethod === "PIX" && (
                        <p className="text-xs text-[#2E2E2E] opacity-70 font-inter">
                          O QR Code e o Pix Copia e Cola aparecem na tela do
                          Mercado Pago apos abrir o pagamento.
                        </p>
                      )}

                      {order?.orderId &&
                        (payment?.status === "APPROVED" ? (
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/pedido/${order.orderId}/confirmacao`)
                            }
                            className="w-full border border-[#2F5D8C] text-[#2F5D8C] hover:bg-[#2F5D8C] hover:text-white font-inter font-semibold py-3 px-6 rounded-xl transition-all"
                          >
                            Acompanhar pedido
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-full border border-gray-200 text-gray-400 font-inter font-semibold py-3 px-6 rounded-xl"
                          >
                            Acompanhar pedido (após pagamento)
                          </button>
                        ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCreatePayment}
                      disabled={isPaymentProcessing || !order?.orderId}
                      className={`w-full font-inter font-semibold py-3 px-6 rounded-xl transition-all ${
                        isPaymentProcessing || !order?.orderId
                          ? "bg-gray-300 text-gray-500"
                          : "bg-[#2F5D8C] hover:bg-[#274A6F] text-white"
                      }`}
                    >
                      {isPaymentProcessing ? "Processando..." : "Gerar pagamento"}
                    </button>
                  )}

                  {payment?.status === "APPROVED" && order?.orderId && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/pedido/${order.orderId}/confirmacao`)
                      }
                      className="w-full bg-[#C9A44C] hover:bg-[#B8934A] text-white font-inter font-semibold py-3 px-6 rounded-xl transition-all"
                    >
                      Ver confirmacao do pedido
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 border border-[#2F5D8C] text-[#2F5D8C] hover:bg-[#2F5D8C] hover:text-white font-inter font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    Voltar
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isCreatingOrder}
                    className="flex-1 bg-[#C9A44C] hover:bg-[#B8934A] text-white font-inter font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    {isCreatingOrder ? "Criando pedido..." : "Continuar"}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-playfair text-xl font-bold text-[#2E2E2E] mb-4">
                  Resumo do Pedido
                </h3>
                <div className="space-y-3 text-sm font-inter text-[#2E2E2E]">
                  <div className="flex justify-between">
                    <span>Subtotal ({summaryItemCount} itens)</span>
                    <span className="font-semibold">
                      {formatPrice(summarySubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span className="font-semibold text-[#2F5D8C]">
                      {orderSummary || selectedOption
                        ? formatPrice(summaryShipping)
                        : "Calcular"}
                    </span>
                  </div>
                  <div className="border-t border-[#2F5D8C]/10 pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-[#2F5D8C]">
                      {formatPrice(summaryTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-playfair text-lg font-bold text-[#2E2E2E] mb-3">
                  Precisa de ajuda?
                </h4>
                <p className="text-sm text-[#2E2E2E] opacity-70 font-inter">
                  Nosso suporte responde em horario comercial. Use o email ou
                  WhatsApp informado na pagina inicial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
