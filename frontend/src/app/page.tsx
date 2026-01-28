import Navigation from "@/components/layout/Navigation";
import SiteFooter from "@/components/layout/SiteFooter";
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

        <SiteFooter />
      </main>
    </div>
  );
}
