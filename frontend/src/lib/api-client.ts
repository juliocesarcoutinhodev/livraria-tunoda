/**
 * API Client - Cliente HTTP configurado para comunicação com backend
 *
 * Instância Axios com interceptors para:
 * - Enviar cookies de autenticação automaticamente
 * - Tratar erros globalmente
 * - Refresh token automático
 * - Retry logic para erros de rede
 *
 * @module lib/api-client
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiErrorResponse } from "@/types/api";
// Tokens agora são gerenciados via cookies HttpOnly no backend

// Obtém baseURL das variáveis de ambiente
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Instância principal do Axios
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  withCredentials: true, // necessário para cookies cross-site
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Flag para evitar múltiplos refresh simultâneos
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];

/**
 * Processa fila de requisições que falharam durante refresh
 */
const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

/**
 * REQUEST INTERCEPTOR
 * Adiciona JWT e correlation ID em todas as requisições
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adiciona correlation ID único para rastreamento
    const correlationId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    config.headers["X-Correlation-ID"] = correlationId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Trata erros e implementa refresh token automático
 */
apiClient.interceptors.response.use(
  // Sucesso: retorna response
  (response) => response,

  // Erro: trata e possivelmente faz refresh
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const requestUrl = originalRequest?.url || "";

    // Evita refresh em endpoints de auth para não criar loops
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/revoke") ||
      requestUrl.includes("/auth/revoke-all");

    // Erro 401: Token expirado - tenta refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Já está refreshing: enfileira requisição
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenta fazer refresh
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        // Processa fila de requisições pendentes
        processQueue(null);
        isRefreshing = false;

        // Refaz requisição original
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falhou: faz logout
        processQueue(refreshError as Error);
        isRefreshing = false;
        if (typeof window !== "undefined") {
          const { useAuthStore } = await import("@/store/useAuthStore");
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Erro 403: Sem permissão
    if (error.response?.status === 403) {
      console.error("Acesso negado:", error.response.data?.message);
      // Opcionalmente redirecionar para página de erro
    }

    // Erro 422: Validação
    if (error.response?.status === 422) {
      const apiError = error.response.data;
      console.error("Erro de validação:", apiError.errors || apiError.message);
    }

    // Erro 5xx: Servidor
    if (error.response && error.response.status >= 500) {
      console.error("Erro no servidor:", error.response.data?.message);
    }

    // Erro de rede
    if (!error.response) {
      console.error("Erro de rede:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper para extrair mensagem de erro da API
 *
 * @param error - Erro do Axios
 * @returns Mensagem de erro formatada
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse;
    return apiError?.message || error.message || "Erro desconhecido";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
};

/**
 * Helper para verificar se é erro de validação
 *
 * @param error - Erro do Axios
 * @returns true se for erro 422 com validações
 */
export const isValidationError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 422;
  }
  return false;
};

/**
 * Helper para obter erros de validação
 *
 * @param error - Erro do Axios
 * @returns Array de erros de validação ou null
 */
export const getValidationErrors = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse;
    return apiError?.errors || null;
  }
  return null;
};

export default apiClient;
