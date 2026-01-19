/**
 * Zustand Logger Middleware
 *
 * Middleware para logging de mudanças de estado no Zustand.
 * Ativado apenas em ambiente de desenvolvimento.
 *
 * @module store/middleware/logger
 */

import { StateCreator, StoreMutatorIdentifier } from "zustand";

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

/**
 * Logger middleware para Zustand
 *
 * Loga todas as mudanças de estado no console em desenvolvimento.
 *
 * @param f - State creator function
 * @param name - Nome da store (para identificação nos logs)
 * @returns State creator com logging
 *
 * @example
 * ```ts
 * import { create } from "zustand";
 * import { logger } from "@/store/middleware/logger";
 *
 * export const useMyStore = create(
 *   logger(
 *     (set) => ({
 *       count: 0,
 *       increment: () => set((state) => ({ count: state.count + 1 }))
 *     }),
 *     "MyStore"
 *   )
 * );
 * ```
 */
const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  // Wrapper para o set que adiciona logging
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loggedSet: typeof set = (partial: any, replace?: any) => {
    // Apenas loga em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      const prevState = get();
      set(partial, replace);
      const nextState = get();

      console.groupCollapsed(
        `%c🔄 ${name || "Store"} Update`,
        "color: #3b82f6; font-weight: bold;"
      );
      console.log(
        "%cPrevious State:",
        "color: #ef4444; font-weight: bold;",
        prevState
      );
      console.log(
        "%cNext State:",
        "color: #10b981; font-weight: bold;",
        nextState
      );
      console.log("%cAction:", "color: #f59e0b; font-weight: bold;", partial);
      console.groupEnd();
    } else {
      // Em produção, apenas executa o set sem logging
      set(partial, replace);
    }
  };

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;
