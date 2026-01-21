import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/features/Hero";
import Books from "@/components/features/Books";
import About from "@/components/features/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Pastor Iraquitan Tunoda - 25 Anos Transformando Vidas | Livros Cristãos",
  description:
    "Pastor e missionário no Japão há 25 anos. Descubra livros cristãos inspiradores que fortalecem a fé e renovam a esperança.",
};

export default function Home() {
  // Structured Data (JSON-LD) para SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Iraquitan Tunoda",
    jobTitle: "Pastor e Missionário",
    description:
      "Pastor cristão e missionário no Japão há 25 anos, autor de livros cristãos inspiradores",
    url: "https://livrariatunoda.com.br",
    sameAs: [
      "https://facebook.com/pastortunoda",
      "https://instagram.com/pastortunoda",
      "https://youtube.com/pastortunoda",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Livraria Tunoda",
    },
    alumniOf: {
      "@type": "Organization",
      name: "Missão no Japão",
    },
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Livraria Tunoda",
    url: "https://livrariatunoda.com.br",
    description: "Loja de livros cristãos do Pastor Iraquitan Tunoda",
    publisher: {
      "@type": "Person",
      name: "Iraquitan Tunoda",
    },
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />

      <Navigation />

      <main>
        {/* Hero Section */}
        <section id="inicio">
          <Hero />
        </section>

        {/* Books Section */}
        <Books />

        {/* About Section */}
        <About />

        {/* Footer */}
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
                  <span className="font-inter font-medium">
                    Pagamento seguro
                  </span>
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
      </main>
    </div>
  );
}
