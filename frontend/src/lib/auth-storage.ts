/**
 * Auth Storage - Gerenciamento seguro de tokens no localStorage
 *
 * Responsável por armazenar e recuperar tokens de autenticação
 * de forma segura no navegador.
 *
 * @module lib/auth-storage
 */

const ACCESS_TOKEN_KEY = "livraria_tunoda_access_token";
const REFRESH_TOKEN_KEY = "livraria_tunoda_refresh_token";
const USER_KEY = "livraria_tunoda_user";

/**
 * Interface do usuário autenticado
 */
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Salva o access token no localStorage
 *
 * @param token - JWT access token
 */
export const saveAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

/**
 * Recupera o access token do localStorage
 *
 * @returns O access token ou null se não existir
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

/**
 * Salva o refresh token no localStorage
 *
 * @param token - JWT refresh token
 */
export const saveRefreshToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/**
 * Recupera o refresh token do localStorage
 *
 * @returns O refresh token ou null se não existir
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

/**
 * Salva os dados do usuário no localStorage
 *
 * @param user - Dados do usuário autenticado
 */
export const saveUser = (user: StoredUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Recupera os dados do usuário do localStorage
 *
 * @returns Os dados do usuário ou null se não existir
 */
export const getUser = (): StoredUser | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

/**
 * Salva todos os dados de autenticação de uma vez
 *
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 * @param user - Dados do usuário
 */
export const saveAuthData = (
  accessToken: string,
  refreshToken: string,
  user: StoredUser
): void => {
  saveAccessToken(accessToken);
  saveRefreshToken(refreshToken);
  saveUser(user);
};

/**
 * Remove todos os dados de autenticação do localStorage
 * Usado no logout
 */
export const clearAuthData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Verifica se o usuário está autenticado
 *
 * @returns true se houver um access token válido
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Verifica se o usuário tem uma role específica
 *
 * @param requiredRole - Role necessária (ex: "ROLE_ADMIN")
 * @returns true se o usuário tiver a role
 */
export const hasRole = (requiredRole: string): boolean => {
  const user = getUser();
  return user?.role === requiredRole;
};
