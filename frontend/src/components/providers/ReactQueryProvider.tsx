/**
 * React Query Provider
 *
 * Provider do React Query com QueryClient e Devtools.
 * Deve ser usado no layout raiz da aplicação.
 *
 * @module components/providers/ReactQueryProvider
 */

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "@/lib/react-query";
import { useState } from "react";

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * Provider do React Query
 *
 * Cria uma instância do QueryClient e fornece para toda a aplicação.
 * Em desenvolvimento, também habilita as React Query Devtools.
 *
 * @example
 * ```tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <ReactQueryProvider>
 *       {children}
 *     </ReactQueryProvider>
 *   );
 * }
 * ```
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // Cria QueryClient no estado para evitar recriação em cada render
  // Isso é importante para SSR/Next.js
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - apenas em desenvolvimento */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
