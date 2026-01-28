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
import { useCart } from "@/contexts/CartContext";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Navigation from "@/components/layout/Navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import toast from "react-hot-toast";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  const { addItem, isUpdating } = useCart();
  const trackMetric = useTrackBookMetric();
  const hasTrackedView = useRef(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const { data: book, isLoading, error } = useBookDetail(bookId);
  const { data: relatedResponse, isLoading: isLoadingRelated } = useBooks(
    {
      page: 0,
      size: 8,
      sortBy: "createdAt",
      sortDirection: "desc",
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

  const handleAddToCart = async () => {
    if (!book) {
      return;
    }
    trackMetric.mutate({ bookId: book.id, eventType: "CLICK" });
    const added = await addItem({
      bookId: book.id,
      quantity,
      title: book.title,
      price: book.price,
      photoUrl: book.photoUrl ?? undefined,
    });
    if (!added) {
      return;
    }
    setIsAdded(true);
    toast.success("Livro adicionado ao carrinho");
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!book) {
      return;
    }

    setIsBuyingNow(true);
    trackMetric.mutate({ bookId: book.id, eventType: "CLICK" });
    const added = await addItem({
      bookId: book.id,
      quantity,
      title: book.title,
      price: book.price,
      photoUrl: book.photoUrl ?? undefined,
    });
    if (!added) {
      setIsBuyingNow(false);
      return;
    }
    toast.success("Livro adicionado ao carrinho");
    router.push("/checkout");
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
  const isActionPending = isUpdating;

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
                    src={book.photoUrl ?? "/img/book-placeholder.svg"}
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
                      src={related.photoUrl ?? "/img/book-placeholder.svg"}
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

        <SiteFooter />
      </div>
    </>
  );
}
