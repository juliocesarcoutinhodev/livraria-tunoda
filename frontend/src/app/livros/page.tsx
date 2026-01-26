"use client";

/**
 * Catálogo de Livros - Página pública
 *
 * Grid de livros com filtros, busca, ordenação e paginação.
 * Acessível em /livros
 *
 * @module app/livros
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useBooks } from "@/hooks/useBooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/layout/Navigation";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import type { PublicBookFilterParams } from "@/types/book";

/**
 * Página de catálogo de livros
 */
export default function LivrosPage() {
  const router = useRouter();
  const { addItem, isUpdating } = useCart();
  const searchParams = useSearchParams();
  const authorFilter = searchParams.get("autor") || "";
  const authorFilterNormalized = authorFilter.trim().toLowerCase();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>("createdAt,desc");
  const [page, setPage] = useState(0);

  // Debounce na busca (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Parâmetros de filtro
  const filters = useMemo<PublicBookFilterParams>(() => {
    return {
      page,
      size: 12,
      title: debouncedSearch || undefined,
      sort: sortBy,
    };
  }, [page, debouncedSearch, sortBy]);

  // Query de livros
  const { data: booksResponse, isLoading: isLoadingBooks } = useBooks(filters);
  const books = booksResponse?.content || [];
  const totalPages = booksResponse?.totalPages || 0;
  const totalElements = booksResponse?.totalElements || 0;

  // Filtrar livros por preço (client-side)
  const filteredBooks = useMemo(() => {
    let result = books;

    if (authorFilterNormalized) {
      result = result.filter((book) =>
        book.authors.some(
          (author) =>
            author.id === authorFilter ||
            author.name.toLowerCase() === authorFilterNormalized
        )
      );
    }

    // Filtro por preço
    result = result.filter(
      (book) => book.price >= priceRange[0] && book.price <= priceRange[1]
    );

    return result;
  }, [books, priceRange, authorFilter, authorFilterNormalized]);

  // Resetar página ao mudar filtros
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, sortBy, authorFilter]);

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Renderizar skeleton de carregamento
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-md p-5">
          <Skeleton className="aspect-[3/4] w-full mb-3 rounded-lg" />
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navigation />

      {/* Header */}
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-3">
            Catálogo de Livros
          </h1>
          <p className="font-inter text-lg text-[#2E2E2E] opacity-80 max-w-2xl">
            Explore nossa coleção de livros cristãos
          </p>
        </div>
      </div>

      {/* Filtros e Ordenação */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Busca */}
            <div className="md:col-span-7">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-2 font-inter"
              >
                🔍 Buscar por título
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome do livro..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all font-inter"
              />
              {authorFilter && (
                <div className="mt-3 inline-flex items-center gap-3 rounded-full bg-[#2F5D8C]/10 px-4 py-1.5 text-sm font-inter text-[#2F5D8C]">
                  <span className="font-semibold">Autor:</span>
                  <span className="truncate max-w-[180px]">
                    {authorFilter}
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push("/livros")}
                    className="text-xs font-semibold uppercase tracking-wide text-[#2F5D8C] hover:text-[#274A6F]"
                    aria-label="Limpar filtro de autor"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </div>

            {/* Ordenação */}
            <div className="md:col-span-3">
              <label
                htmlFor="sort"
                className="block text-sm font-semibold text-gray-700 mb-2 font-inter"
              >
                Ordenar por
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all font-inter"
              >
                <option value="createdAt,desc">Mais recentes</option>
                <option value="price,asc">Menor preço</option>
                <option value="price,desc">Maior preço</option>
                <option value="title,asc">A-Z</option>
                <option value="title,desc">Z-A</option>
              </select>
            </div>

            {/* Botão Limpar */}
            <div className="md:col-span-2">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange([0, 500]);
                  setSortBy("createdAt,desc");
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Limpar
              </Button>
            </div>
          </div>

          {/* Filtro de Preço - Linha separada */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3 font-inter">
              💰 Faixa de preço:{" "}
              <span className="text-[#D4AF37] font-bold">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 font-inter">R$ 0</span>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Number(e.target.value),
                    Math.max(Number(e.target.value), priceRange[1]),
                  ])
                }
                className="flex-1 accent-[#3B82F6]"
              />
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    Math.min(priceRange[0], Number(e.target.value)),
                    Number(e.target.value),
                  ])
                }
                className="flex-1 accent-[#3B82F6]"
              />
              <span className="text-xs text-gray-500 font-inter">R$ 500</span>
            </div>
          </div>

          {/* Contador de resultados - Mais destacado */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm font-inter">
              {isLoadingBooks ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                <span className="text-gray-700">
                  Exibindo{" "}
                  <span className="font-bold text-[#3B82F6]">
                    {filteredBooks.length}
                  </span>{" "}
                  de <span className="font-bold">{totalElements}</span> livro
                  {totalElements !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Livros */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingBooks ? (
          renderSkeleton()
        ) : filteredBooks.length === 0 ? (
          // Estado vazio
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="mx-auto w-20 h-20 mb-6 text-gray-300">
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
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-gray-700 mb-2">
              Nenhum livro encontrado
            </h2>
            <p className="text-gray-500 mb-6">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setPriceRange([0, 500]);
                setSortBy("createdAt,desc");
              }}
              variant="outline"
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            {/* Grid de cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {filteredBooks.map((book) => (
                <article
                  key={book.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Imagem da capa */}
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                    <Image
                      src={book.photoUrl ?? "/img/book-placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Badge de estoque */}
                    {book.stock === 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Esgotado
                      </div>
                    )}
                    {book.stock > 0 && book.stock <= 5 && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        Últimas
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5">
                    <h3 className="font-playfair text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {book.title}
                    </h3>

                    {/* Autores */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1 font-inter">
                      {book.authors.map((author) => author.name).join(", ")}
                    </p>

                    {/* Preço */}
                    <p className="text-2xl font-bold text-[#3B82F6] mb-4">
                      {formatPrice(book.price)}
                    </p>

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => router.push(`/livros/${book.id}`)}
                        variant="primary"
                        className="w-full"
                      >
                        Ver Detalhes
                      </Button>
                      {book.stock > 0 && (
                        <Button
                          onClick={() => {
                            void addItem({
                              bookId: book.id,
                              quantity: 1,
                              title: book.title,
                              price: book.price,
                              photoUrl: book.photoUrl ?? undefined,
                            });
                          }}
                          disabled={isUpdating}
                          variant="secondary"
                          className="w-full"
                        >
                          {isUpdating ? "Adicionando..." : "➕ Adicionar"}
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  variant="outline"
                >
                  Anterior
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, index) => {
                      // Lógica para mostrar páginas ao redor da atual
                      let pageNumber: number;
                      if (totalPages <= 5) {
                        pageNumber = index;
                      } else if (page < 3) {
                        pageNumber = index;
                      } else if (page > totalPages - 4) {
                        pageNumber = totalPages - 5 + index;
                      } else {
                        pageNumber = page - 2 + index;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          variant={page === pageNumber ? "primary" : "outline"}
                          className="w-10"
                        >
                          {pageNumber + 1}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page === totalPages - 1}
                  variant="outline"
                >
                  Próximo
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer - Reutilizado da home */}
      <footer className="bg-[#2F5D8C] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-playfair text-2xl font-bold text-white mb-4">
              Transforme sua jornada espiritual
            </h3>
            <p className="font-inter text-white/80 mb-6 max-w-2xl mx-auto">
              Descubra mensagens que fortalecem a fé, renovam a esperança e
              trazem paz ao coração.
            </p>

            {/* Benefits */}
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
                <span className="font-inter font-medium">Pagamento seguro</span>
              </div>
            </div>

            {/* Social Media */}
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
                  aria-label="Siga-nos no Facebook"
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
                  aria-label="Siga-nos no Instagram"
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
                  aria-label="Inscreva-se no YouTube"
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
                  aria-label="Entre em contato por email"
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
                aria-label="Acesso administrativo"
              >
                Acesso Restrito
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
