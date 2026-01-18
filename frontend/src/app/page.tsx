import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Books from "@/components/Books";
import About from "@/components/About";

export default function Home() {
  return (
    <div className="relative">
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-[#C9A44C]">
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
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 text-center">
              <p className="font-inter text-white/60 text-sm">
                © 2026 Pastor Iraquitan Tunoda. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
