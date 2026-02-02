/**
 * useInactivityLogout Hook - Auto-logout por inatividade
 *
 * Hook para detectar inatividade do usuário e fazer logout automático.
 *
 * @module hooks/useInactivityLogout
 */

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export interface InactivityLogoutOptions {
  /** Tempo de inatividade em milissegundos (padrão: 1 hora) */
  timeout?: number;
  /** Se deve mostrar modal de aviso antes do logout */
  showWarning?: boolean;
  /** Tempo de aviso antes do logout (em milissegundos, padrão: 2 minutos) */
  warningTime?: number;
}

/**
 * Hook para auto-logout após período de inatividade
 *
 * Monitora eventos do usuário (mouse, keyboard, touch) e faz logout
 * automático após período sem atividade.
 *
 * @param options - Opções de configuração
 *
 * @example
 * ```tsx
 * function AdminLayout({ children }) {
 *   useInactivityLogout({
 *     timeout: 60 * 60 * 1000, // 1 hora
 *     showWarning: true,
 *     warningTime: 2 * 60 * 1000, // 2 minutos
 *   });
 *
 *   return <div>{children}</div>;
 * }
 * ```
 */
export function useInactivityLogout(options: InactivityLogoutOptions = {}) {
  const {
    timeout = 60 * 60 * 1000, // 1 hora padrão
    showWarning = true,
    warningTime = 2 * 60 * 1000, // 2 minutos
  } = options;

  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { addNotification } = useUIStore();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Faz logout automático sem confirmação
   */
  const performAutoLogout = useCallback(() => {
    if (!isAuthenticated) return;

    console.log("Auto-logout por inatividade");

    // Revoga no backend e limpa stores locais
    void authService.logout();
    queryClient.clear();

    // Redireciona para login com flag de sessão expirada
    router.push("/login?session_expired=true");
  }, [isAuthenticated, zustandLogout, queryClient, router]);

  /**
   * Mostra notificação de aviso de inatividade
   */
  const showInactivityWarning = useCallback(() => {
    if (!showWarning) return;

    addNotification({
      type: "warning",
      title: "Sessão próxima de expirar",
      message: "Sua sessão será encerrada em breve por inatividade.",
      duration: null, // Não fecha automaticamente
    });
  }, [showWarning, addNotification]);

  /**
   * Reseta os timers de inatividade
   */
  const resetInactivityTimer = useCallback(() => {
    // Limpa timers existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Se não está autenticado, não cria novos timers
    if (!isAuthenticated) return;

    // Cria timer de aviso (se habilitado)
    if (showWarning && warningTime > 0) {
      const warningDelay = timeout - warningTime;
      warningTimeoutRef.current = setTimeout(
        showInactivityWarning,
        warningDelay
      );
    }

    // Cria timer de logout
    timeoutRef.current = setTimeout(performAutoLogout, timeout);
  }, [
    isAuthenticated,
    timeout,
    showWarning,
    warningTime,
    showInactivityWarning,
    performAutoLogout,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Se não está autenticado, limpa timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      return;
    }

    // Eventos que indicam atividade do usuário
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    // Adiciona listeners
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Inicia timer inicial
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [isAuthenticated, resetInactivityTimer]);
}

/**
 * Hook simplificado para auto-logout com configuração padrão (1 hora)
 *
 * @example
 * ```tsx
 * function ProtectedRoute({ children }) {
 *   useAutoLogoutAfterInactivity();
 *   return <div>{children}</div>;
 * }
 * ```
 */
export function useAutoLogoutAfterInactivity() {
  useInactivityLogout({
    timeout: 60 * 60 * 1000, // 1 hora
    showWarning: true,
    warningTime: 5 * 60 * 1000, // Aviso 5 minutos antes
  });
}
