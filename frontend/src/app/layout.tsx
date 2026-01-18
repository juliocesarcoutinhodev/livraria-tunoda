import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Livros Cristãos - Fortalecendo a Fé e Renovando a Esperança",
  description:
    "Descubra uma coleção inspiradora de livros cristãos que trazem paz, confiança e alegria para sua jornada espiritual. Mensagens transformadoras para renovar seu coração.",
  keywords:
    "livros cristãos, fé, esperança, paz, pastor, espiritualidade, renovação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} font-inter antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
