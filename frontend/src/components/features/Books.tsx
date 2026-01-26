"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useBooks, useTrackBookMetric } from "@/hooks/useBooks";
import Skeleton from "@/components/ui/Skeleton";
import type { Book } from "@/types/book";

interface BooksProps {
  className?: string;
}

export default function Books({ className = "" }: BooksProps) {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Busca os livros disponíveis em destaque (máximo 3 por enquanto)
  const {
    data: booksResponse,
    isLoading,
    error,
  } = useBooks({
    page: 0,
    size: 3,
    sort: "createdAt,desc", // Mais recentes primeiro
  });
  const trackMetric = useTrackBookMetric();

  const books = (booksResponse?.content || []).slice(0, 3);

  const handleAddToCart = (book: Book) => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: 1,
      image: book.photoUrl ?? undefined,
      author: book.authors.map((a) => a.name).join(", "),
    });

    // Feedback visual
    setAddedItems((prev) => new Set(prev).add(book.id));

    // Registra métrica de clique
    trackMetric.mutate({ bookId: book.id, eventType: "CLICK" });

    // Remove feedback após 2 segundos
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(book.id);
        return newSet;
      });
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (error) {
    return (
      <section id="livros" className={`py-16 md:py-24 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">
              Erro ao carregar livros. Tente novamente mais tarde.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="livros" className={`py-16 md:py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">
            Livros em{" "}
            <span className="text-[#2F5D8C] relative inline-block">
              Destaque
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#C9A44C] opacity-60"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,8 Q50,2 100,8 T200,8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="font-inter text-xl text-[#2E2E2E] opacity-80 max-w-3xl mx-auto leading-relaxed">
            Os livros mais lidos que trazem{" "}
            <span className="font-semibold text-[#2F5D8C]">paz</span>,{" "}
            <span className="font-semibold text-[#3A7D44]">esperança</span> e{" "}
            <span className="font-semibold text-[#C9A44C]">renovação</span> para
            sua jornada espiritual.
          </p>
        </div>

        {/* Books Grid - Responsivo e centralizado */}
        <div
          className={`grid gap-8 lg:gap-10 ${
            books.length === 1
              ? "grid-cols-1 max-w-sm mx-auto"
              : books.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#F7F6F2] rounded-2xl p-6 shadow-sm"
              >
                <Skeleton height={380} className="mb-6 rounded-xl" />
                <Skeleton height={32} width="80%" className="mb-4" />
                <Skeleton height={60} width="100%" className="mb-4" />
                <div className="flex items-center justify-between pt-4">
                  <div className="flex-1">
                    <Skeleton height={16} width="60%" className="mb-2" />
                    <Skeleton height={28} width="40%" />
                  </div>
                  <Skeleton height={48} width={120} />
                </div>
              </div>
            ))
          ) : books && books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.id}
                className="group bg-[#F7F6F2] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Book Cover */}
                <div className="relative mb-6 overflow-hidden rounded-xl bg-white">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={book.photoUrl || "/img/book-placeholder.jpg"}
                      alt={`Capa do livro ${book.title}`}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Badge de estoque */}
                  {book.stock < 5 && book.stock > 0 && (
                    <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-inter font-semibold text-white">
                        Últimas unidades!
                      </span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="space-y-4">
                  <h3 className="font-playfair text-2xl font-bold text-[#2E2E2E] group-hover:text-[#2F5D8C] transition-colors duration-300">
                    {book.title}
                  </h3>

                  <p className="font-inter text-[#2E2E2E] opacity-80 leading-relaxed line-clamp-2 text-sm">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#2F5D8C]/10">
                    <div className="space-y-1">
                      <p className="font-inter text-sm text-[#2E2E2E] opacity-60">
                        Por {book.authors.map((a) => a.name).join(", ")}
                      </p>
                      <p className="font-playfair text-2xl font-bold text-[#2F5D8C]">
                        {formatPrice(book.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(book)}
                      disabled={addedItems.has(book.id) || book.stock === 0}
                      className={`relative px-6 py-3 rounded-xl font-inter font-semibold text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#C9A44C]/30 disabled:scale-100 ${
                        addedItems.has(book.id)
                          ? "bg-[#3A7D44] text-white cursor-not-allowed"
                          : book.stock === 0
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-[#C9A44C] hover:bg-[#B8934A] text-white shadow-lg hover:shadow-xl"
                      }`}
                      aria-label={`Adicionar ${book.title} ao carrinho`}
                    >
                      {book.stock === 0 ? (
                        "Esgotado"
                      ) : addedItems.has(book.id) ? (
                        <span className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Adicionado!</span>
                        </span>
                      ) : (
                        "Adicionar"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#2E2E2E] opacity-60">
                Nenhum livro disponível no momento.
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 pt-8 border-t border-[#2F5D8C]/10">
          <p className="font-inter text-lg text-[#2E2E2E] opacity-80 mb-6">
            Transforme sua jornada espiritual com nossa coleção completa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-[#3A7D44]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-inter font-medium">Frete grátis</span>
            </div>
            <div className="flex items-center space-x-2 text-[#3A7D44]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-inter font-medium">Entrega rápida</span>
            </div>
            <div className="flex items-center space-x-2 text-[#3A7D44]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-inter font-medium">Pagamento seguro</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
