"use client";

import { useState, useEffect } from "react";

interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className={`min-h-screen bg-[#F7F6F2] flex items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div
        className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Mobile: Imagem primeiro */}
        <div className="order-1 lg:order-1 flex justify-center lg:justify-start">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#2F5D8C] to-[#3A7D44] rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <img
              src="/img/img1.jpeg"
              alt="Pastor Iraquitan Tunoda - Missionário e autor dos livros cristãos, transmitindo paz e serenidade"
              className="relative w-80 h-96 sm:w-96 sm:h-[28rem] lg:w-full lg:h-[32rem] object-cover rounded-2xl shadow-2xl"
              loading="eager"
            />
          </div>
        </div>

        {/* Conteúdo de texto */}
        <div className="order-2 lg:order-2 text-center lg:text-left space-y-8">
          {/* Headline Principal */}
          <h1
            className={`font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Uma palavra que{" "}
            <span className="text-[#2F5D8C] relative inline-block">
              fortalece
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
            </span>{" "}
            sua fé e renova sua{" "}
            <span className="text-[#3A7D44]">esperança</span>
          </h1>

          {/* Subtítulo */}
          <p
            className={`font-inter text-xl sm:text-2xl text-[#2E2E2E] opacity-80 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-80 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Descubra mensagens de{" "}
            <span className="font-semibold text-[#2F5D8C]">paz</span>,{" "}
            <span className="font-semibold text-[#3A7D44]">confiança</span> e{" "}
            <span className="font-semibold text-[#C9A44C]">alegria</span> que
            transformarão sua jornada espiritual e trarão renovação para seu
            coração.
          </p>

          {/* Botão CTA */}
          <div
            className={`transition-all duration-700 delay-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() => {
                const element = document.getElementById("livros");
                if (element) {
                  const offsetTop = element.offsetTop - 80;
                  window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                  });
                }
              }}
              className="group relative inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl font-inter font-semibold text-white bg-[#C9A44C] rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-[#C9A44C] focus:ring-opacity-30"
              aria-label="Adquirir os livros cristãos - Clique para comprar"
            >
              <span className="relative z-10 flex items-center">
                Adquirir os livros
                <svg
                  className="ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#C9A44C] to-[#B8934A] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Elementos decorativos */}
          <div className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 border-2 border-[#C9A44C] border-opacity-20 rounded-full"></div>
          <div className="hidden lg:block absolute -bottom-6 -left-6 w-16 h-16 border-2 border-[#3A7D44] border-opacity-20 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
