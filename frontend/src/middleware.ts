/**
 * Next.js Middleware - Proteção de Rotas
 *
 * Middleware para proteger rotas administrativas e verificar autenticação.
 * Executado no Edge Runtime antes de cada requisição.
 *
 * Rotas protegidas:
 * - /admin/** → Requer autenticação + role ADMIN
 * - /checkout → Requer autenticação (futuro)
 *
 * @module middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidToken, hasRole } from "@/lib/jwt-utils";

/**
 * Rotas públicas que não requerem autenticação
 */
const PUBLIC_ROUTES = ["/", "/login", "/403"];

/**
 * Rotas que requerem autenticação
 */
const PROTECTED_ROUTES = ["/admin"];

/**
 * Rotas que requerem role ADMIN
 */
const ADMIN_ROUTES = ["/admin"];

/**
 * Obtém o access token do request
 *
 * Tenta obter de cookies ou headers (para compatibilidade)
 */
function getAccessToken(request: NextRequest): string | null {
  // Tenta obter do cookie
  const cookieToken = request.cookies.get(
    "livraria_tunoda_access_token"
  )?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Tenta obter do header Authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Verifica se a rota atual requer proteção
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Verifica se a rota atual requer role ADMIN
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Middleware do Next.js
 *
 * Executa em cada requisição para verificar autenticação e permissões
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acesso às rotas públicas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Verifica se a rota requer proteção
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Obtém o access token
  const accessToken = getAccessToken(request);

  // Se não há token, redireciona para login com query param
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Valida o token
  if (!isValidToken(accessToken)) {
    // Token inválido ou expirado
    // TODO: Implementar tentativa de refresh token automático
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verifica se a rota requer role ADMIN
  if (isAdminRoute(pathname)) {
    if (!hasRole(accessToken, "ADMIN")) {
      // Usuário autenticado mas sem role ADMIN
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  // Tudo OK, permite acesso
  return NextResponse.next();
}

/**
 * Configuração do matcher
 *
 * Define quais rotas o middleware deve processar
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|img).*)",
  ],
};
