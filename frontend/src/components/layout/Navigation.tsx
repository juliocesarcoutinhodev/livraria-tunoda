"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const { itemCount, items, subtotal, isLoading } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }
    console.info("[CartDebug] navigation itemCount", { itemCount });
  }, [itemCount]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "livros", "sobre"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#inicio") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.getElementById(hash.slice(1));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [isHome]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: "inicio", label: "Início", type: "scroll" as const },
    { id: "livros", label: "Livros", type: "scroll" as const },
    { id: "sobre", label: "Sobre", type: "scroll" as const },
    { id: "/livros", label: "Catálogo", type: "link" as const },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#2F5D8C]/10 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("inicio")}
              className="font-playfair text-xl font-bold text-[#2F5D8C] hover:text-[#3A7D44] transition-colors duration-200"
            >
              Livros Cristãos
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                if (item.type === "link") {
                  return (
                    <Link
                      key={item.id}
                      href={item.id}
                      scroll={false}
                      className="font-inter font-medium px-3 py-2 rounded-md text-sm text-[#2E2E2E] hover:text-[#2F5D8C] hover:bg-[#F7F6F2] transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  );
                }

                if (!isHome) {
                  return (
                    <Link
                      key={item.id}
                      href={`/#${item.id}`}
                      scroll={false}
                      className="font-inter font-medium px-3 py-2 rounded-md text-sm text-[#2E2E2E] hover:text-[#2F5D8C] hover:bg-[#F7F6F2] transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`font-inter font-medium px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      activeSection === item.id
                        ? "text-[#2F5D8C] bg-[#2F5D8C]/10"
                        : "text-[#2E2E2E] hover:text-[#2F5D8C] hover:bg-[#F7F6F2]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <Link
                href="/carrinho"
                className="relative p-2 text-[#2E2E2E] hover:text-[#2F5D8C] transition-colors duration-200 group"
                aria-label={`Carrinho de compras - ${itemCount} ${
                  itemCount === 1 ? "item" : "itens"
                }`}
              >
                <span className="relative inline-flex">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 z-10 bg-[#C9A44C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse ring-2 ring-white">
                      {itemCount}
                    </span>
                  )}
                </span>
              </Link>

              {isCartOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white shadow-2xl border border-[#2F5D8C]/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#2F5D8C]/10">
                    <p className="font-playfair text-lg font-bold text-[#2E2E2E]">
                      Meu Carrinho
                    </p>
                    <p className="text-xs text-[#2E2E2E] opacity-60 font-inter">
                      {itemCount === 0
                        ? "Nenhum item adicionado"
                        : `${itemCount} ${
                            itemCount === 1 ? "item" : "itens"
                          }`}
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-6 text-sm text-[#2E2E2E] opacity-60 font-inter">
                        Carregando carrinho...
                      </div>
                    ) : items.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-[#2E2E2E] opacity-60 font-inter">
                        Seu carrinho está vazio.
                      </div>
                    ) : (
                      items.slice(0, 3).map((item) => (
                        <div
                          key={item.bookId}
                          className="flex items-center gap-3 px-4 py-3 border-b border-[#2F5D8C]/10 last:border-b-0"
                        >
                          <div className="h-12 w-10 rounded-lg bg-[#F7F6F2] overflow-hidden flex-shrink-0">
                            <img
                              src={item.photoUrl || "/img/book-placeholder.svg"}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#2E2E2E] font-inter line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-[#2E2E2E] opacity-60 font-inter">
                              {item.quantity}x • R${" "}
                              {item.price.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-4 border-t border-[#2F5D8C]/10 bg-[#F7F6F2]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-inter text-[#2E2E2E] opacity-80">
                        Subtotal
                      </span>
                      <span className="text-sm font-bold text-[#2F5D8C] font-inter">
                        R$ {subtotal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <Link
                      href="/carrinho"
                      className="w-full inline-flex items-center justify-center rounded-xl bg-[#C9A44C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B8934A] transition-colors"
                    >
                      Ver carrinho
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/carrinho"
              className="relative p-2 text-[#2E2E2E] hover:text-[#2F5D8C] transition-colors duration-200 group md:hidden"
              aria-label={`Carrinho de compras - ${itemCount} ${
                itemCount === 1 ? "item" : "itens"
              }`}
            >
              <span className="relative inline-flex">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 0 013 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 z-10 bg-[#C9A44C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#2E2E2E] hover:text-[#2F5D8C] hover:bg-[#F7F6F2] transition-colors duration-200"
                aria-expanded="false"
                aria-label="Menu principal"
              >
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-200 ease-in-out ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-white border-t border-[#2F5D8C]/10`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={item.id}
                  href={item.id}
                  scroll={false}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#2E2E2E] hover:text-[#2F5D8C] hover:bg-[#F7F6F2] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              );
            }

            if (!isHome) {
              return (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  scroll={false}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#2E2E2E] hover:text-[#2F5D8C] hover:bg-[#F7F6F2] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? "text-[#2F5D8C] bg-[#2F5D8C]/10"
                    : "text-[#2E2E2E] hover:text-[#2F5D8C] hover:bg-[#F7F6F2]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
