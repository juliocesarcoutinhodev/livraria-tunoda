/**
 * useDebounce Hook - Hook para debounce de valores
 *
 * Atrasa a execução de uma função até que ela pare de ser chamada
 * por um determinado período de tempo.
 *
 * @module hooks/useDebounce
 */

import { useState, useEffect } from "react";

/**
 * Hook para debounce de valores
 *
 * @param value - Valor a ser "debouncado"
 * @param delay - Delay em milissegundos (default: 500ms)
 * @returns Valor debouncado
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [searchTerm, setSearchTerm] = useState("");
 *   const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // Fazer busca na API
 *       performSearch(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Buscar..."
 *     />
 *   );
 * }
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}