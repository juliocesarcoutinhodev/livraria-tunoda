/**
 * Rate Limit Hook
 *
 * Hook para limitar número de tentativas por tempo (rate limiting).
 * Útil para prevenir ataques de força bruta em formulários de login.
 *
 * @module hooks/useRateLimit
 */

import { useState, useCallback, useEffect } from "react";

interface RateLimitConfig {
  /** Número máximo de tentativas permitidas */
  maxAttempts: number;
  /** Janela de tempo em milissegundos */
  windowMs: number;
  /** Mensagem de erro quando limite é atingido */
  errorMessage?: string;
}

interface RateLimitReturn {
  /** Verifica se pode fazer uma tentativa */
  canAttempt: boolean;
  /** Registra uma tentativa */
  recordAttempt: () => void;
  /** Número de tentativas restantes */
  remainingAttempts: number;
  /** Tempo restante em segundos até poder tentar novamente */
  resetTimeSeconds: number;
  /** Reseta o contador de tentativas */
  reset: () => void;
}

/**
 * Hook para rate limiting (controle de tentativas)
 *
 * @param config - Configuração do rate limit
 * @returns Objeto com funções e estados do rate limit
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const rateLimit = useRateLimit({
 *     maxAttempts: 5,
 *     windowMs: 60 * 1000, // 1 minuto
 *   });
 *
 *   const handleSubmit = () => {
 *     if (!rateLimit.canAttempt) {
 *       toast.error(`Muitas tentativas. Aguarde ${rateLimit.resetTimeSeconds}s`);
 *       return;
 *     }
 *
 *     rateLimit.recordAttempt();
 *     // ... fazer login
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {!rateLimit.canAttempt && (
 *         <p>Aguarde {rateLimit.resetTimeSeconds}s para tentar novamente</p>
 *       )}
 *       <button disabled={!rateLimit.canAttempt}>Entrar</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useRateLimit(config: RateLimitConfig): RateLimitReturn {
  const { maxAttempts, windowMs } = config;

  const [attempts, setAttempts] = useState<number[]>([]);
  const [resetTimeSeconds, setResetTimeSeconds] = useState(0);

  // Atualiza contador de tempo restante a cada segundo
  useEffect(() => {
    if (resetTimeSeconds > 0) {
      const timer = setInterval(() => {
        setResetTimeSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resetTimeSeconds]);

  // Limpa tentativas antigas
  const cleanOldAttempts = useCallback(() => {
    const now = Date.now();
    const validAttempts = attempts.filter(
      (timestamp) => now - timestamp < windowMs
    );
    if (validAttempts.length !== attempts.length) {
      setAttempts(validAttempts);
    }
    return validAttempts;
  }, [attempts, windowMs]);

  // Calcula tentativas válidas
  const validAttempts = cleanOldAttempts();
  const remainingAttempts = Math.max(0, maxAttempts - validAttempts.length);
  const canAttempt = remainingAttempts > 0;

  // Registra uma tentativa
  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const newAttempts = [...validAttempts, now];
    setAttempts(newAttempts);

    // Se atingiu o limite, calcula tempo de reset
    if (newAttempts.length >= maxAttempts) {
      const oldestAttempt = newAttempts[0];
      const resetTime = oldestAttempt + windowMs - now;
      setResetTimeSeconds(Math.ceil(resetTime / 1000));
    }
  }, [validAttempts, maxAttempts, windowMs]);

  // Reseta o contador
  const reset = useCallback(() => {
    setAttempts([]);
    setResetTimeSeconds(0);
  }, []);

  return {
    canAttempt,
    recordAttempt,
    remainingAttempts,
    resetTimeSeconds,
    reset,
  };
}
