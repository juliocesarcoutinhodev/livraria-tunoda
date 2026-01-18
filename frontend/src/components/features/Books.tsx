"use client";

import { useState } from "react";
import { useCart, Book } from "@/contexts/CartContext";

const booksData: Book[] = [
  {
    id: "1",
    title: "Caminho da Esperança",
    description:
      "Uma jornada transformadora através das palavras sagradas que renovam o coração e fortalecem a fé em momentos de dificuldade.",
    price: 45.9,
    image: "/img/img3.jpeg",
    author: "Pastor Iraquitan Tunoda",
  },
  {
    id: "2",
    title: "Paz que Excede",
    description:
      "Descubra como encontrar serenidade verdadeira em meio ao caos do mundo moderno através dos ensinamentos cristãos.",
    price: 52.9,
    image: "/img/img4.jpeg",
    author: "Pastor Iraquitan Tunoda",
  },
  {
    id: "3",
    title: "Alegria Renovada",
    description:
      "Mensagens inspiradoras que despertam a alegria interior e transformam perspectivas através do poder da palavra divina.",
    price: 48.9,
    image: "/img/img1.jpeg",
    author: "Pastor Iraquitan Tunoda",
  },
  {
    id: "4",
    title: "Fé Inabalável",
    description:
      "Reflexões profundas sobre como construir uma fé sólida que permanece firme diante das tempestades da vida.",
    price: 55.9,
    image: "/img/img2.jpeg",
    author: "Pastor Iraquitan Tunoda",
  },
  {
    id: "5",
    title: "Confiança Plena",
    description:
      "Aprenda a depositar sua confiança completamente em Deus e experimente a liberdade que vem da entrega total.",
    price: 49.9,
    image: "/img/img3.jpeg",
    author: "Pastor Iraquitan Tunoda",
  },
  {
    id: "6",
    title: "Propósito Divino",
    description:
      "Descubra o plano que Deus tem para sua vida e como caminhar em direção ao seu propósito com determinação.",
    price: 58.9,
    image: "/img/img4.jpeg",
    author: "Pastor Iraquitan Tunoda",
  },
];

interface BooksProps {
  className?: string;
}

export default function Books({ className = "" }: BooksProps) {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToCart = (book: Book) => {
    addItem(book);
    setAddedItems((prev) => new Set(prev).add(book.id));

    // Remove visual feedback after 2 seconds
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

  return (
    <section id="livros" className={`py-16 md:py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">
            Nossa Coleção de{" "}
            <span className="text-[#2F5D8C] relative inline-block">
              Livros
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
            Mensagens transformadoras que trazem{" "}
            <span className="font-semibold text-[#2F5D8C]">paz</span>,{" "}
            <span className="font-semibold text-[#3A7D44]">esperança</span> e{" "}
            <span className="font-semibold text-[#C9A44C]">renovação</span> para
            sua jornada espiritual.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {booksData.map((book) => (
            <div
              key={book.id}
              className="group bg-[#F7F6F2] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Book Cover */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img
                  src={book.image}
                  alt={`Capa do livro ${book.title}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Book Info */}
              <div className="space-y-4">
                <h3 className="font-playfair text-2xl font-bold text-[#2E2E2E] group-hover:text-[#2F5D8C] transition-colors duration-300">
                  {book.title}
                </h3>

                <p className="font-inter text-[#2E2E2E] opacity-80 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#2F5D8C]/10">
                  <div className="space-y-1">
                    <p className="font-inter text-sm text-[#2E2E2E] opacity-60">
                      Por {book.author}
                    </p>
                    <p className="font-playfair text-2xl font-bold text-[#2F5D8C]">
                      {formatPrice(book.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={addedItems.has(book.id)}
                    className={`relative px-6 py-3 rounded-xl font-inter font-semibold text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#C9A44C]/30 disabled:scale-100 ${
                      addedItems.has(book.id)
                        ? "bg-[#3A7D44] text-white cursor-not-allowed"
                        : "bg-[#C9A44C] hover:bg-[#B8934A] text-white shadow-lg hover:shadow-xl"
                    }`}
                    aria-label={`Adicionar ${book.title} ao carrinho`}
                  >
                    {addedItems.has(book.id) ? (
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
                      "Adicionar ao carrinho"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
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
