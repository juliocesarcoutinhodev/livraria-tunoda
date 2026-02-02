/**
 * Auth Hooks - React Query hooks para autenticação
 *
 * Hooks para gerenciar estado de autenticação do usuário.
 *
 * @module hooks/useAuth
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { authService } from "@/services/authService";
import { queryKeys, invalidateQueries } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import type { User, LoginRequest } from "@/types/auth";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obter dados do usuário autenticado atual
 *
 * @param options - Opções adicionais do useQuery
 * @returns Query com dados do usuário
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { data: user, isLoading } = useAuth();
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!user) return <p>Faça login</p>;
 *
 *   return (
 *     <div>
 *       <p>Olá, {user.name}!</p>
 *       <p>Email: {user.email}</p>
 *       <p>Role: {user.role}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(
  options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    // Apenas executa se houver token de autenticação
    enabled: isAuthenticated,
    // Não refetch automaticamente (dados do usuário não mudam frequentemente)
    refetchOnWindowFocus: false,
    retry: false,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
    },
    ...options,
  });
}

/**
 * Hook auxiliar para verificar se usuário está autenticado
 *
 * @returns true se usuário está autenticado
 *
 * @example
 * ```tsx
 * function ProtectedRoute({ children }) {
 *   const isAuth = useIsAuthenticated();
 *
 *   if (!isAuth) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return children;
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

/**
 * Hook auxiliar para verificar se usuário tem uma role específica
 *
 * @param requiredRole - Role necessária (ex: "ROLE_ADMIN")
 * @returns true se usuário tem a role
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const isAdmin = useHasRole("ROLE_ADMIN");
 *
 *   if (!isAdmin) {
 *     return <p>Acesso negado</p>;
 *   }
 *
 *   return <AdminDashboard />;
 * }
 * ```
 */
export function useHasRole(requiredRole: string): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.role === requiredRole;
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para fazer login
 *
 * @returns Mutation para login
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const login = useLogin();
 *   const router = useRouter();
 *
 *   const handleSubmit = async (data: LoginRequest) => {
 *     try {
 *       await login.mutateAsync(data);
 *       toast.success("Login realizado com sucesso!");
 *       router.push("/dashboard");
 *     } catch (error) {
 *       toast.error("Email ou senha inválidos");
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" type="email" />
 *       <input name="password" type="password" />
 *       <button disabled={login.isPending}>
 *         {login.isPending ? "Entrando..." : "Entrar"}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {
      // Após login, busca dados do usuário
      invalidateQueries.authMe(queryClient);
    },
  });
}

/**
 * Hook para fazer logout seguro
 *
 * Executa todo o processo de logout:
 * 1. Revoga refresh token no backend (se disponível)
 * 2. Limpa Zustand store (via authService.logout)
 * 3. Limpa localStorage e cookies
 * 4. Invalida cache do React Query
 *
 * @returns Mutation para logout
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const logout = useLogout();
 *   const router = useRouter();
 *
 *   const handleLogout = async () => {
 *     await logout.mutateAsync();
 *     router.push("/login");
 *   };
 *
 *   return (
 *     <button onClick={handleLogout} disabled={logout.isPending}>
 *       {logout.isPending ? "Saindo..." : "Sair"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Tenta revogar refresh token no backend
      // Se falhar (ex: backend offline), authService.logout() faz limpeza local
      await authService.logout();
    },
    onSuccess: () => {
      // Limpa TODO o cache do React Query
      queryClient.clear();
      console.log("Logout completo realizado com sucesso");
    },
    onError: (error) => {
      // Mesmo em erro, limpa cache por segurança
      queryClient.clear();
      console.warn("Erro no logout, mas cache foi limpo:", error);
    },
  });
}
