/**
 * Auth Service - Serviço de autenticação
 *
 * Gerencia operações de autenticação:
 * - Login
 * - Refresh token (via cookies HttpOnly)
 * - Logout
 * - Obter usuário atual
 *
 * @module services/authService
 */

import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  LoginRequest,
  AuthenticationResponse,
  User,
} from "@/types/auth";

/**
 * Faz login do usuário
 *
 * @param data - Credenciais de login (email, password)
 * @returns Resposta com tokens e informações de autenticação
 *
 * @example
 * ```ts
 * const auth = await authService.login({
 *   email: "admin@example.com",
 *   password: "senha123"
 * });
 * console.log(auth.expiresIn);
 * ```
 */
const login = async (data: LoginRequest): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>(
    "/auth/login",
    data
  );

  const authData = response.data;

  // DEPOIS: Busca dados completos do usuário
  // Cookies HttpOnly já foram setados pelo backend
  try {
    const user = await getCurrentUser();

    // IMPORTANTE: Atualiza o Zustand store também!
    useAuthStore
      .getState()
      .setAuth({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch {
    // Se falhar (ex: backend não está rodando /user/me),
    // ainda assim atualiza o Zustand com dados básicos

    useAuthStore
      .getState()
      .setAuth({
        id: "",
        name: "",
        email: data.email,
        role: "USER",
      });
  }

  return authData;
};

/**
 * Renova o access token usando refresh token
 *
 * @returns Nova resposta de autenticação
 *
 * @example
 * ```ts
 * const auth = await authService.refresh();
 * ```
 */
const refresh = async (): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>("/auth/refresh");
  return response.data;
};

/**
 * Obtém dados do usuário autenticado atual
 *
 * @returns Dados do usuário
 *
 * @example
 * ```ts
 * const user = await authService.getCurrentUser();
 * console.log(user.name, user.role);
 * ```
 */
const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/user/me");
  return response.data;
};

/**
 * Faz logout do usuário
 *
 * 1. Tenta revogar refresh token no backend
 * 2. Limpa todos os dados de autenticação (localStorage + cookies)
 * 3. Limpa Zustand store
 *
 * @example
 * ```ts
 * await authService.logout();
 * router.push("/login");
 * ```
 */
const logout = async (): Promise<void> => {
  try {
    // Tenta revogar o refresh token no backend (via cookie)
    await apiClient.post("/auth/revoke");
  } catch (error) {
    // Se falhar (ex: backend offline, token já expirado), continua
    console.warn("Erro ao revogar token no backend:", error);
  } finally {
    // Limpa Zustand store
    useAuthStore.getState().logout();
  }
};

/**
 * Auth Service
 * Exporta todas as operações de autenticação
 */
export const authService = {
  login,
  refresh,
  getCurrentUser,
  logout,
};
