import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { CartProvider } from "@/contexts/CartContext";
import ScrollManager from "@/components/ScrollManager";
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
  title:
    "Pastor Iraquitan Tunoda - 25 Anos Transformando Vidas | Livros Cristãos",
  description:
    "Pastor e missionário no Japão há 25 anos. Descubra livros cristãos inspiradores que fortalecem a fé, renovam a esperança e trazem paz ao coração. Mensagens transformadoras para sua jornada espiritual.",
  keywords:
    "livros cristãos, Pastor Iraquitan Tunoda, missionário Japão, fé, esperança, paz, espiritualidade, renovação espiritual, mensagens cristãs, livros religiosos",
  authors: [{ name: "Pastor Iraquitan Tunoda" }],
  creator: "Pastor Iraquitan Tunoda",
  publisher: "Livraria Tunoda",

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://livrariatunoda.com.br",
    siteName: "Livraria Tunoda - Livros Cristãos",
    title: "Pastor Iraquitan Tunoda - 25 Anos Transformando Vidas",
    description:
      "Pastor e missionário no Japão. Livros cristãos que fortalecem a fé e renovam a esperança.",
    images: [
      {
        url: "/img/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pastor Iraquitan Tunoda - Livros Cristãos",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Pastor Iraquitan Tunoda - 25 Anos Transformando Vidas",
    description:
      "Livros cristãos inspiradores que fortalecem a fé e renovam a esperança.",
    images: ["/img/twitter-image.jpg"],
    creator: "@pastortunoda",
  },

  // App Links
  alternates: {
    canonical: "https://livrariatunoda.com.br",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Other meta tags
  category: "religion",
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
        <ReactQueryProvider>
          <CartProvider>{children}</CartProvider>
        </ReactQueryProvider>
        <ScrollManager />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#363636",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
