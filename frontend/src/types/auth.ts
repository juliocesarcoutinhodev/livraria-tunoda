/**
 * Authentication Types - Tipos relacionados à autenticação
 *
 * DTOs e interfaces espelhando os contratos da API
 * para autenticação e gerenciamento de usuários.
 *
 * @module types/auth
 */

/**
 * Requisição de login
 * POST /api/auth/login
 */
export interface LoginRequest {
  /** Email do usuário */
  email: string;
  /** Senha do usuário */
  password: string;
}

/**
 * Resposta de autenticação
 * Retornada em login e refresh token
 */
export interface AuthenticationResponse {
  /** JWT access token */
  accessToken?: string;
  /** JWT refresh token */
  refreshToken?: string;
  /** Tipo do token (geralmente "Bearer") */
  tokenType?: string;
  /** Tempo de expiração em segundos */
  expiresIn?: number;
}

/**
 * Requisição de refresh token
 * POST /api/auth/refresh
 */
export interface RefreshTokenRequest {
  /** Refresh token válido */
  refreshToken: string;
}

/**
 * Usuário autenticado
 * GET /api/user/me
 */
export interface User {
  /** ID único do usuário */
  id: string;
  /** Nome completo */
  name: string;
  /** Email */
  email: string;
  /** Role/Perfil (ex: "ROLE_USER", "ROLE_ADMIN") */
  role: string;
}

/**
 * Requisição de registro (se implementado futuramente)
 */
export interface RegisterRequest {
  /** Nome completo */
  name: string;
  /** Email */
  email: string;
  /** Senha */
  password: string;
  /** Confirmação da senha */
  passwordConfirmation: string;
}

/**
 * Requisição de esqueci senha (se implementado futuramente)
 */
export interface ForgotPasswordRequest {
  /** Email do usuário */
  email: string;
}

/**
 * Requisição de reset de senha (se implementado futuramente)
 */
export interface ResetPasswordRequest {
  /** Token de reset */
  token: string;
  /** Nova senha */
  password: string;
  /** Confirmação da nova senha */
  passwordConfirmation: string;
}
