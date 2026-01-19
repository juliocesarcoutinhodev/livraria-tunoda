/**
 * Auth Service - Serviço de autenticação
 *
 * Gerencia operações de autenticação:
 * - Login
 * - Refresh token
 * - Logout
 * - Obter usuário atual
 *
 * @module services/authService
 */

import { apiClient } from "@/lib/api-client";
import { saveAuthData, clearAuthData } from "@/lib/auth-storage";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  LoginRequest,
  AuthenticationResponse,
  RefreshTokenRequest,
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
 * console.log(auth.accessToken);
 * ```
 */
const login = async (data: LoginRequest): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>(
    "/auth/login",
    data
  );

  const authData = response.data;

  // PRIMEIRO: Salva os tokens com dados básicos no localStorage
  // Isso permite que próximas requisições tenham autenticação
  saveAuthData(authData.accessToken, authData.refreshToken, {
    id: "",
    name: "",
    email: data.email,
    role: "USER",
  });

  // DEPOIS: Busca dados completos do usuário
  // Agora a requisição terá o token no header
  try {
    const user = await getCurrentUser();

    // Atualiza com dados completos do usuário no localStorage
    saveAuthData(authData.accessToken, authData.refreshToken, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // IMPORTANTE: Atualiza o Zustand store também!
    useAuthStore
      .getState()
      .setAuth(authData.accessToken, authData.refreshToken, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (error) {
    // Se falhar (ex: backend não está rodando /user/me),
    // ainda assim atualiza o Zustand com dados básicos

    useAuthStore
      .getState()
      .setAuth(authData.accessToken, authData.refreshToken, {
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
 * @param refreshToken - Refresh token válido
 * @returns Nova resposta de autenticação
 *
 * @example
 * ```ts
 * const auth = await authService.refresh("refresh_token_aqui");
 * ```
 */
const refresh = async (
  refreshToken: string
): Promise<AuthenticationResponse> => {
  const request: RefreshTokenRequest = { refreshToken };
  const response = await apiClient.post<AuthenticationResponse>(
    "/auth/refresh",
    request
  );
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
 * Remove todos os dados de autenticação do localStorage
 *
 * @example
 * ```ts
 * authService.logout();
 * router.push("/login");
 * ```
 */
const logout = (): void => {
  clearAuthData();
  // Opcionalmente, fazer chamada ao backend para invalidar token
  // await apiClient.post("/auth/logout");
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
