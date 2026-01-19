/**
 * JWT Utilities - Funções para validação de JWT
 *
 * Utilitários leves para validação de tokens JWT no middleware.
 * Nota: Validação completa de assinatura é feita pelo backend.
 *
 * @module lib/jwt-utils
 */

/**
 * Interface do payload JWT decodificado
 */
export interface JWTPayload {
  sub: string; // User ID
  role: string; // User role (ex: "ADMIN", "USER")
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}

/**
 * Decodifica um JWT sem verificar a assinatura
 *
 * ATENÇÃO: Esta função apenas decodifica o payload.
 * A validação completa da assinatura é feita pelo backend.
 *
 * @param token - JWT token
 * @returns Payload decodificado ou null se inválido
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tem 3 partes separadas por ponto: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decodifica a parte do payload (segunda parte)
    const payload = parts[1];
    const decodedPayload = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Verifica se um token JWT está expirado
 *
 * @param token - JWT token
 * @returns true se o token está expirado
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp é em segundos, Date.now() é em milissegundos
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Extrai a role do usuário do token JWT
 *
 * @param token - JWT token
 * @returns Role do usuário ou null se inválido
 */
export function getRoleFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.role || null;
}

/**
 * Valida se o token tem uma role específica
 *
 * @param token - JWT token
 * @param requiredRole - Role necessária (ex: "ADMIN")
 * @returns true se o usuário tem a role necessária
 */
export function hasRole(token: string, requiredRole: string): boolean {
  const role = getRoleFromToken(token);
  return role === requiredRole;
}

/**
 * Valida se um token JWT é válido e não expirado
 *
 * @param token - JWT token
 * @returns true se o token é válido
 */
export function isValidToken(token: string): boolean {
  if (!token || token.trim() === "") {
    return false;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return false;
  }

  return !isTokenExpired(token);
}
