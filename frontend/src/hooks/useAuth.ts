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
import { authService } from "@/services/authService";
import { queryKeys, invalidateQueries } from "@/lib/react-query";
import { isAuthenticated } from "@/lib/auth-storage";
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
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    // Apenas executa se houver token de autenticação
    enabled: isAuthenticated(),
    // Não refetch automaticamente (dados do usuário não mudam frequentemente)
    refetchOnWindowFocus: false,
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
  const { data: user } = useAuth();
  return !!user;
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
  const { data: user } = useAuth();
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
 * Hook para fazer logout
 *
 * @returns Mutation para logout
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const logout = useLogout();
 *   const router = useRouter();
 *
 *   const handleLogout = () => {
 *     logout.mutate(undefined, {
 *       onSuccess: () => {
 *         toast.success("Logout realizado");
 *         router.push("/");
 *       }
 *     });
 *   };
 *
 *   return <button onClick={handleLogout}>Sair</button>;
 * }
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Limpa todo o cache após logout
      queryClient.clear();
    },
  });
}
