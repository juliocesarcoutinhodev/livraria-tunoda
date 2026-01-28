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
import SiteFooter from "@/components/layout/SiteFooter";
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

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  // Debounce na busca (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Parâmetros de filtro
  const filters = useMemo<PublicBookFilterParams>(() => {
    return {
      page,
      size: 12,
      title: debouncedSearch || undefined,
      sortBy,
      sortDirection,
    };
  }, [page, debouncedSearch, sortBy, sortDirection]);

  // Query de livros
  const { data: booksResponse, isLoading: isLoadingBooks } = useBooks(filters);
  const books = booksResponse?.content || [];
  const totalPages = booksResponse?.totalPages || 0;
  const totalElements = booksResponse?.totalElements || 0;

  // Filtrar livros por autor (client-side)
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

    return result;
  }, [books, authorFilter, authorFilterNormalized]);

  // Resetar página ao mudar filtros
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, sortBy, sortDirection, authorFilter]);

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
                value={`${sortBy}:${sortDirection}`}
                onChange={(e) => {
                  const [nextSortBy, nextDirection] = e.target.value.split(":");
                  setSortBy(nextSortBy);
                  setSortDirection(nextDirection as "asc" | "desc");
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all font-inter"
              >
                <option value="createdAt:desc">Mais recentes</option>
                <option value="title:asc">A-Z</option>
                <option value="title:desc">Z-A</option>
              </select>
            </div>

            {/* Botão Limpar */}
            <div className="md:col-span-2">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSortBy("createdAt");
                  setSortDirection("desc");
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Limpar
              </Button>
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
                setSortBy("createdAt");
                setSortDirection("desc");
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

      <SiteFooter />
    </div>
  );
}
