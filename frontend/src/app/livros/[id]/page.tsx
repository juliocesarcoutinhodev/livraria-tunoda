"use client";

/**
 * Detalhes do Livro - Página pública refinada
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useBookDetail, useBooks, useTrackBookMetric } from "@/hooks/useBooks";
import { useAddItemToCart, useCreateCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Navigation from "@/components/layout/Navigation";
import toast from "react-hot-toast";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  const addItem = useAddItemToCart();
  const createCart = useCreateCart();
  const trackMetric = useTrackBookMetric();
  const hasTrackedView = useRef(false);
  const [cartId, setCartId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("cartId") || "";
    setCartId(id);
  }, []);

  const { data: book, isLoading, error } = useBookDetail(bookId);
  const { data: relatedResponse, isLoading: isLoadingRelated } = useBooks(
    {
      page: 0,
      size: 8,
      sort: "createdAt,desc",
    },
    {
      enabled: !!bookId,
    }
  );

  const relatedBooks = useMemo(() => {
    if (!book || !relatedResponse?.content?.length) {
      return [];
    }

    const authorIds = new Set(book.authors.map((author) => author.id));

    return relatedResponse.content
      .filter(
        (candidate) =>
          candidate.id !== book.id &&
          candidate.authors.some((author) => authorIds.has(author.id))
      )
      .slice(0, 3);
  }, [book, relatedResponse]);

  const shortDescription = useMemo(() => {
    if (!book?.description) {
      return "";
    }

    return book.description.replace(/\s+/g, " ").trim().slice(0, 160);
  }, [book?.description]);

  useEffect(() => {
    if (!book || hasTrackedView.current) {
      return;
    }

    hasTrackedView.current = true;
    trackMetric.mutate({ bookId: book.id, eventType: "VIEW" });
  }, [book, trackMetric]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const ensureCartId = async () => {
    if (cartId) {
      return cartId;
    }

    try {
      const cart = await createCart.mutateAsync();
      localStorage.setItem("cartId", cart.id);
      setCartId(cart.id);
      return cart.id;
    } catch (err) {
      toast.error("Não foi possível criar o carrinho. Tente novamente.");
      return "";
    }
  };

  const handleAddToCart = async () => {
    if (!book) {
      return;
    }

    const resolvedCartId = await ensureCartId();
    if (!resolvedCartId) {
      return;
    }

    addItem.mutate(
      {
        cartId: resolvedCartId,
        data: {
          bookId: book.id,
          quantity,
        },
      },
      {
        onSuccess: () => {
          setIsAdded(true);
          toast.success("Livro adicionado ao carrinho");
          setTimeout(() => setIsAdded(false), 2000);
        },
        onError: () => {
          toast.error("Não foi possível adicionar ao carrinho.");
        },
      }
    );
  };

  const handleBuyNow = async () => {
    if (!book) {
      return;
    }

    setIsBuyingNow(true);
    const resolvedCartId = await ensureCartId();
    if (!resolvedCartId) {
      setIsBuyingNow(false);
      return;
    }

    addItem.mutate(
      {
        cartId: resolvedCartId,
        data: {
          bookId: book.id,
          quantity,
        },
      },
      {
        onSuccess: () => {
          toast.success("Livro adicionado ao carrinho");
          router.push("/checkout");
        },
        onError: () => {
          toast.error("Não foi possível iniciar a compra.");
          setIsBuyingNow(false);
        },
      }
    );
  };

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://livrariatunoda.com.br";
  const pageUrl = `${siteUrl}/livros/${bookId}`;
  const structuredData = useMemo(() => {
    if (!book) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "Book",
      name: book.title,
      description: book.description,
      image: book.photoUrl || undefined,
      isbn: book.isbn || undefined,
      numberOfPages: book.pages || undefined,
      author: book.authors.map((author) => ({
        "@type": "Person",
        name: author.name,
      })),
      offers: {
        "@type": "Offer",
        priceCurrency: book.currency || "BRL",
        price: book.price,
        availability:
          book.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: pageUrl,
      },
      weight:
        book.weight != null
          ? {
              "@type": "QuantitativeValue",
              value: book.weight,
              unitText: book.weightUnit,
            }
          : undefined,
    };
  }, [book, pageUrl]);
  const isActionPending = addItem.isPending || createCart.isPending;

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#F7F6F2]">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              </div>
              <div className="lg:col-span-3 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4">
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
              Livro não encontrado
            </h1>
            <p className="text-gray-600 mb-6 font-inter">
              O livro que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => router.push("/livros")} variant="primary">
              Voltar ao Catálogo
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{book.title} | Livraria Tunoda</title>
        <meta name="description" content={shortDescription} />
        <meta property="og:title" content={book.title} />
        <meta property="og:description" content={shortDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={pageUrl} />
        {book.photoUrl && <meta property="og:image" content={book.photoUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={book.title} />
        <meta name="twitter:description" content={shortDescription} />
        {book.photoUrl && (
          <meta name="twitter:image" content={book.photoUrl} />
        )}
      </Head>
      <Navigation />

      <div className="min-h-screen bg-[#F7F6F2]">
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm font-inter">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#3B82F6] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">›</span>
              <Link
                href="/livros"
                className="text-gray-600 hover:text-[#3B82F6] transition-colors"
              >
                Livros
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-md">
                {book.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Image Column - 40% */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <div className="group relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in">
                  <Image
                    src={book.photoUrl ?? "/img/book-placeholder.jpg"}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  {book.stock === 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      Esgotado
                    </div>
                  )}
                  {book.stock > 0 && book.stock <= 5 && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                      Últimas {book.stock}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Column - 60% */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title & Author */}
              <div>
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {book.title}
                </h1>
                <div className="space-y-3">
                  {book.authors.map((author) => (
                    <div key={author.id}>
                      <Link
                        href={`/livros?autor=${encodeURIComponent(author.name)}`}
                        className="text-lg font-semibold text-[#2F5D8C] hover:text-[#274A6F] transition-colors font-inter"
                      >
                        {author.name}
                      </Link>
                      <p className="text-sm text-gray-600 font-inter leading-relaxed line-clamp-2">
                        {author.biography
                          ? author.biography
                          : "Biografia disponível em breve."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed font-inter">
                  {book.description}
                </p>
              </div>

              {/* Metadata Card */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                {book.isbn && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">📖</span>
                    <span className="font-semibold text-gray-700 min-w-[80px]">
                      ISBN:
                    </span>
                    <span className="text-gray-600 font-mono">{book.isbn}</span>
                  </div>
                )}
                {book.pages != null && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">📄</span>
                    <span className="font-semibold text-gray-700 min-w-[80px]">
                      Páginas:
                    </span>
                    <span className="text-gray-600">{book.pages}</span>
                  </div>
                )}
                {book.weight != null && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">⚖️</span>
                    <span className="font-semibold text-gray-700 min-w-[80px]">
                      Peso:
                    </span>
                    <span className="text-gray-600">
                      {book.weight} {book.weightUnit || ""}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">📦</span>
                  <span className="font-semibold text-gray-700 min-w-[80px]">
                    Estoque:
                  </span>
                  <span
                    className={`font-medium ${book.stock === 0 ? "text-red-600" : book.stock <= 5 ? "text-amber-600" : "text-green-600"}`}
                  >
                    {book.stock === 0 ? "Esgotado" : `${book.stock} unidades`}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-6">
                <p className="text-4xl font-bold text-[#3B82F6] font-inter">
                  {formatPrice(book.price)}
                </p>
              </div>

              {/* Quantity Control */}
              {book.stock > 0 && (
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-700 font-inter">
                    Quantidade:
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      variant="outline"
                      size="sm"
                      className="w-10 h-10"
                    >
                      −
                    </Button>
                    <span className="text-lg font-bold w-12 text-center font-inter">
                      {quantity}
                    </span>
                    <Button
                      onClick={() =>
                        setQuantity((q) => Math.min(book.stock, q + 1))
                      }
                      variant="outline"
                      size="sm"
                      className="w-10 h-10"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0 || isActionPending}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {book.stock === 0
                    ? "Indisponível"
                    : isAdded
                      ? "✓ Adicionado!"
                      : isActionPending
                        ? "Adicionando..."
                        : "➕ Adicionar ao Carrinho"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={book.stock === 0 || isActionPending || isBuyingNow}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  {book.stock === 0
                    ? "Indisponível"
                    : isBuyingNow || isActionPending
                      ? "Processando compra..."
                      : "Comprar Agora"}
                </Button>
                <Button
                  onClick={() => router.push("/livros")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  ← Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sobre os Autores */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between font-playfair text-2xl font-bold text-gray-900">
                Sobre o(s) Autor(es)
                <span className="text-gray-400 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-6 space-y-6">
                {book.authors.map((author) => (
                  <div
                    key={author.id}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    {author.photoUrl && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                        <Image
                          src={author.photoUrl}
                          alt={author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/livros?autor=${encodeURIComponent(author.name)}`}
                        className="text-lg font-semibold text-[#2F5D8C] hover:text-[#274A6F] transition-colors font-inter"
                      >
                        {author.name}
                      </Link>
                      <p className="text-sm text-gray-600 font-inter leading-relaxed mt-2">
                        {author.biography
                          ? author.biography
                          : "Biografia disponível em breve."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

        {/* Livros Relacionados */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-3xl font-bold text-gray-900">
              Livros Relacionados
            </h2>
            <Link
              href="/livros"
              className="text-sm font-semibold text-[#2F5D8C] hover:text-[#274A6F] transition-colors font-inter"
            >
              Ver catálogo completo →
            </Link>
          </div>
          {isLoadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-5">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : relatedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map((related) => (
                <div
                  key={related.id}
                  className="bg-white rounded-2xl shadow-sm p-5 flex flex-col"
                >
                  <Link
                    href={`/livros/${related.id}`}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50"
                  >
                    <Image
                      src={related.photoUrl ?? "/img/book-placeholder.jpg"}
                      alt={related.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="mt-4 flex-1">
                    <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-inter mb-4">
                      {related.authors.map((author) => author.name).join(", ")}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-bold text-[#2F5D8C] mb-4">
                      {formatPrice(related.price)}
                    </p>
                    <Link
                      href={`/livros/${related.id}`}
                      className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#2F5D8C] px-4 py-2 text-sm font-semibold text-[#2F5D8C] hover:bg-[#2F5D8C] hover:text-white transition-all"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-gray-600 font-inter text-sm">
              Nenhum livro relacionado encontrado para este autor.
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-[#2F5D8C] py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="font-playfair text-2xl font-bold text-white mb-4">
                Transforme sua jornada espiritual
              </h3>
              <p className="font-inter text-white/80 mb-6 max-w-2xl mx-auto">
                Descubra mensagens que fortalecem a fé, renovam a esperança e
                trazem paz ao coração.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-[#C9A44C] mb-8">
                <div className="flex items-center space-x-2">
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
                  <span className="font-inter font-medium">Frete grátis</span>
                </div>
                <div className="flex items-center space-x-2">
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
                  <span className="font-inter font-medium">Entrega rápida</span>
                </div>
                <div className="flex items-center space-x-2">
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
                  <span className="font-inter font-medium">
                    Pagamento seguro
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <p className="font-inter text-white/80 text-sm mb-4">
                  Siga-nos nas redes sociais
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:contato@exemplo.com"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 text-center">
              <p className="font-inter text-white/60 text-sm">
                © 2026 Pastor Iraquitan Tunoda. Todos os direitos reservados.
                <span className="mx-2 text-white/30">•</span>
                <a
                  href="/login"
                  className="text-white/40 hover:text-white/70 transition-colors duration-200 text-xs"
                >
                  Acesso Restrito
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
