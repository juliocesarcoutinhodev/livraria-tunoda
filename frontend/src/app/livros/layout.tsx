/**
 * Layout do Catálogo de Livros
 *
 * Define metadados SEO e estrutura da página de catálogo
 *
 * @module app/livros/layout
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Livros | Livraria Tunoda",
  description:
    "Explore nossa coleção de livros cristãos para edificação espiritual. Encontre obras sobre fé, esperança, amor e crescimento pessoal.",
  keywords: [
    "livros cristãos",
    "literatura cristã",
    "livros evangélicos",
    "catálogo",
    "livraria cristã",
    "fé",
    "esperança",
  ],
  openGraph: {
    title: "Catálogo de Livros Cristãos",
    description:
      "Descubra livros que edificam e transformam vidas através da palavra",
    type: "website",
    locale: "pt_BR",
  },
};

export default function LivrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
