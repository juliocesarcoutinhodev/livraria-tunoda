"use client";

import { useState, useEffect } from "react";

interface AboutProps {
  className?: string;
}

export default function About({ className = "" }: AboutProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("sobre");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const achievements = [
    { number: "25+", label: "Anos de Ministério" },
    { number: "50k+", label: "Vidas Impactadas" },
    { number: "12", label: "Livros Publicados" },
    { number: "200+", label: "Palestras Realizadas" },
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      title: "Fé",
      description:
        "Fortalecimento da fé através da palavra e do testemunho pessoal",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ),
      title: "Amor",
      description: "Demonstração do amor de Cristo em cada palavra e ação",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      title: "Esperança",
      description:
        "Renovação da esperança através de mensagens transformadoras",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Paz",
      description: "Cultivo da paz interior que excede todo entendimento",
    },
  ];

  return (
    <section
      id="sobre"
      className={`py-16 md:py-24 bg-[#F7F6F2] relative overflow-hidden ${className}`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#2F5D8C] opacity-5 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3A7D44] opacity-5 rounded-full translate-x-48 translate-y-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">
            Sobre o{" "}
            <span className="text-[#2F5D8C] relative inline-block">
              Autor
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
            Conheça a trajetória de fé e dedicação que inspira milhares de
            pessoas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Author Photo */}
          <div
            className={`lg:order-1 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-[#2F5D8C] to-[#3A7D44] rounded-3xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img
                src="/img/img2.jpeg"
                alt="Pastor Iraquitan Tunoda - Autor dos livros cristãos e missionário no Japão"
                className="relative w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
            </div>
          </div>

          {/* Author Info */}
          <div
            className={`lg:order-2 space-y-6 transition-all duration-1000 ease-out delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="space-y-4">
              <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-[#2E2E2E]">
                Pastor Iraquitan Tunoda
              </h3>
              <p className="font-inter text-lg text-[#2F5D8C] font-semibold">
                Escritor, Pastor Missionário e Conferencista
              </p>
            </div>

            <div className="space-y-4 font-inter text-[#2E2E2E] opacity-90 leading-relaxed">
              <p>
                Com mais de duas décadas dedicadas ao ministério cristão, Pastor
                Iraquitan Tunoda tem uma trajetória única e inspiradora, tendo
                servido como missionário no
                <span className="font-semibold text-[#2F5D8C]">
                  {" "}
                  Japão por mais de 20 anos
                </span>
                , propagando o evangelho e tocando milhares de vidas através de
                suas mensagens transformadoras.
              </p>
              <p>
                Sua experiência missionária no Oriente trouxe uma perspectiva
                única sobre a fé cristã, combinando sabedoria bíblica profunda
                com compreensão intercultural. Graduado em Teologia, ele dedica
                sua vida a tornar as verdades eternas relevantes e acessíveis
                para pessoas de todas as culturas.
              </p>
              <p>
                Seus livros são fruto de décadas de ministério internacional,
                oração e estudo das Escrituras, oferecendo palavras de{" "}
                <span className="font-semibold text-[#2F5D8C]">esperança</span>,{" "}
                <span className="font-semibold text-[#3A7D44]">paz</span> e{" "}
                <span className="font-semibold text-[#C9A44C]">renovação</span>{" "}
                para todos que buscam crescimento espiritual e propósito divino.
              </p>
            </div>

            {/* Contact Info */}
            <div className="pt-6 border-t border-[#2F5D8C]/20">
              <p className="font-inter text-sm text-[#2E2E2E] opacity-70 mb-4">
                Conecte-se com Pastor Iraquitan:
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/iraquitantunoda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F5D8C] hover:text-[#3A7D44] transition-colors duration-200"
                  aria-label="Instagram do Pastor Iraquitan Tunoda"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100083341390935&rdid=TTYhm7BxojJgMEeB&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16wuK3cYrV%2F"
                  className="text-[#2F5D8C] hover:text-[#3A7D44] transition-colors duration-200"
                  target="_blank"
                  aria-label="Facebook do Pastor Iraquitan Tunoda"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[#2F5D8C] hover:text-[#3A7D44] transition-colors duration-200"
                  aria-label="YouTube do Pastor João"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 ease-out delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {achievements.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="font-playfair text-3xl lg:text-4xl font-bold text-[#2F5D8C] mb-2 group-hover:text-[#3A7D44] transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="font-inter text-sm lg:text-base text-[#2E2E2E] opacity-80 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ease-out delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2F5D8C]/10 rounded-full text-[#2F5D8C] group-hover:bg-[#2F5D8C] group-hover:text-white transition-all duration-300 mb-4">
                  {value.icon}
                </div>
                <h4 className="font-playfair text-xl font-bold text-[#2E2E2E] mb-3 group-hover:text-[#2F5D8C] transition-colors duration-300">
                  {value.title}
                </h4>
                <p className="font-inter text-sm text-[#2E2E2E] opacity-80 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
