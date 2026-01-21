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
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBooks } from "@/hooks/useBooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useAddItemToCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import type { PublicBookFilterParams } from "@/types/book";

/**
 * Página de catálogo de livros
 */
export default function LivrosPage() {
  const router = useRouter();
  const addItem = useAddItemToCart();
  const [cartId, setCartId] = useState<string>("");

  // Carregar cartId do localStorage
  useEffect(() => {
    const id = localStorage.getItem("cartId") || "";
    setCartId(id);
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

    // Filtro por preço
    result = result.filter(
      (book) => book.price >= priceRange[0] && book.price <= priceRange[1]
    );

    return result;
  }, [books, priceRange]);

  // Resetar página ao mudar filtros
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, sortBy]);

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Renderizar skeleton de carregamento
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-3 md:p-4">
          <Skeleton className="aspect-[3/4] w-full mb-3 rounded-lg" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-3" />
          <Skeleton className="h-6 w-1/3 mb-3" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      {/* Hero Section */}
      <section className="bg-[#2F5D8C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            Catálogo de Livros
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl">
            Explore nossa coleção de livros cristãos para edificação e
            crescimento espiritual
          </p>
        </div>
      </section>

      {/* Filtros e Ordenação */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Buscar por título
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome do livro..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D8C] focus:border-transparent transition-all"
              />
            </div>

            {/* Ordenação */}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ordenar por
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D8C] focus:border-transparent transition-all"
              >
                <option value="createdAt,desc">Mais relevantes</option>
                <option value="price,asc">Menor preço</option>
                <option value="price,desc">Maior preço</option>
                <option value="createdAt,desc">Mais recentes</option>
                <option value="title,asc">A-Z</option>
                <option value="title,desc">Z-A</option>
              </select>
            </div>
          </div>

          {/* Filtro de Preço */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Faixa de preço: {formatPrice(priceRange[0])} -{" "}
              {formatPrice(priceRange[1])}
            </label>
            <div className="flex items-center gap-4">
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
                className="flex-1"
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
                className="flex-1"
              />
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600 font-medium">
            {isLoadingBooks ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <span>
                Exibindo {filteredBooks.length} de {totalElements} livro
                {totalElements !== 1 ? "s" : ""}
              </span>
            )}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              {filteredBooks.map((book) => (
                <article
                  key={book.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  {/* Imagem da capa - reduzida */}
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                    <Image
                      src={book.photoUrl ?? "/img/book-placeholder.jpg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    {/* Badge de estoque */}
                    {book.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
                        Esgotado
                      </div>
                    )}
                    {book.stock > 0 && book.stock <= 5 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
                        Últimas
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <h3 className="font-playfair text-sm md:text-base font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                      {book.title}
                    </h3>

                    {/* Autores */}
                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-1">
                      {book.authors.map((author) => author.name).join(", ")}
                    </p>

                    {/* Preço */}
                    <p className="text-lg md:text-xl font-bold text-[#C9A44C] mb-3 md:mb-4 mt-auto">
                      {formatPrice(book.price)}
                    </p>

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => router.push(`/livros/${book.id}`)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs md:text-sm"
                      >
                        Ver Detalhes
                      </Button>
                      {book.stock > 0 && (
                        <Button
                          onClick={() => {
                            if (cartId) {
                              addItem.mutate({
                                cartId,
                                data: {
                                  bookId: book.id,
                                  quantity: 1,
                                },
                              });
                            }
                          }}
                          disabled={addItem.isPending}
                          className="flex-1"
                        >
                          Adicionar
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
    </div>
  );
}
