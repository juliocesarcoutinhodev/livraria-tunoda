"use client";

/**
 * Detalhes do Livro - Página pública
 *
 * Exibe informações completas de um livro específico
 *
 * @module app/livros/[id]
 */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useBookDetail } from "@/hooks/useBooks";
import { useAddItemToCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  const addItem = useAddItemToCart();
  const [cartId, setCartId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Carregar cartId do localStorage
  useEffect(() => {
    const id = localStorage.getItem("cartId") || "";
    setCartId(id);
  }, []);

  // Query do livro
  const { data: book, isLoading, error } = useBookDetail(bookId);

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Renderizar skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-gray-700 mb-4">
            Livro não encontrado
          </h1>
          <Button onClick={() => router.push("/livros")} variant="outline">
            Voltar ao catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <button
            onClick={() => router.push("/livros")}
            className="hover:text-primary transition-colors"
          >
            ← Voltar ao catálogo
          </button>
        </nav>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagem */}
          <div className="relative aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={book.photoUrl ?? "/img/book-placeholder.jpg"}
              alt={book.title}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Badge de estoque */}
            {book.stock === 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded">
                Esgotado
              </div>
            )}
            {book.stock > 0 && book.stock <= 5 && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white text-sm font-semibold px-4 py-2 rounded">
                Últimas {book.stock} unidades
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600">
                {book.authors.map((author) => author.name).join(", ")}
              </p>
            </div>

            {/* Descrição */}
            <div className="prose prose-lg">
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* ISBN */}
            {book.isbn && (
              <div className="text-sm text-gray-500">
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </div>
            )}

            {/* Preço */}
            <div className="border-t border-b border-gray-200 py-6">
              <p className="text-4xl font-bold text-primary">
                {formatPrice(book.price)}
              </p>
            </div>

            {/* Controle de quantidade */}
            {book.stock > 0 && (
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-700">
                  Quantidade:
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    variant="outline"
                    size="sm"
                    className="w-10"
                  >
                    −
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    onClick={() =>
                      setQuantity((q) => Math.min(book.stock, q + 1))
                    }
                    variant="outline"
                    size="sm"
                    className="w-10"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-4">
              {book.stock > 0 ? (
                <Button
                  onClick={() => {
                    if (cartId) {
                      addItem.mutate(
                        {
                          cartId,
                          data: {
                            bookId: book.id,
                            quantity,
                          },
                        },
                        {
                          onSuccess: () => {
                            router.push("/cart");
                          },
                        }
                      );
                    }
                  }}
                  disabled={addItem.isPending}
                  className="flex-1"
                  size="lg"
                >
                  {addItem.isPending
                    ? "Adicionando..."
                    : "Adicionar ao carrinho"}
                </Button>
              ) : (
                <Button disabled className="flex-1" size="lg">
                  Indisponível
                </Button>
              )}
            </div>

            {/* Informações adicionais */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Peso:</span>
                <span className="font-semibold">
                  {book.weight} {book.weightUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estoque:</span>
                <span className="font-semibold">
                  {book.stock > 0 ? `${book.stock} unidades` : "Esgotado"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold">
                  {book.status === "ACTIVE" ? "Disponível" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
