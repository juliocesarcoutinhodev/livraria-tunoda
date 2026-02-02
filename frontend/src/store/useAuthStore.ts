/**
 * Auth Store - Zustand store para autenticação
 *
 * Gerencia estado de autenticação com persistência no localStorage.
 * Inclui informações do usuário e estado de autenticação.
 *
 * @module store/useAuthStore
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { logger } from "./middleware/logger";
import type { User } from "@/types/auth";

/**
 * Interface do estado de autenticação
 */
interface AuthState {
  /** Dados do usuário autenticado */
  user: User | null;
  /** Flag de autenticação */
  isAuthenticated: boolean;
}

/**
 * Interface das ações de autenticação
 */
interface AuthActions {
  /**
   * Define dados de autenticação após login
   *
   * @param user - Dados do usuário
   *
   * @example
   * ```ts
   * const { setAuth } = useAuthStore();
   * setAuth(userData);
   * ```
   */
  setAuth: (user: User) => void;

  /**
   * Atualiza dados do usuário
   *
   * @param user - Novos dados do usuário
   *
   * @example
   * ```ts
   * const { setUser } = useAuthStore();
   * setUser(updatedUserData);
   * ```
   */
  setUser: (user: User) => void;

  /**
   * Faz logout e limpa todos os dados de autenticação
   *
   * @example
   * ```ts
   * const { logout } = useAuthStore();
   * logout();
   * ```
   */
  logout: () => void;

  /**
   * Verifica se usuário tem uma role específica
   *
   * @param requiredRole - Role necessária (ex: "ROLE_ADMIN")
   * @returns true se usuário tem a role
   *
   * @example
   * ```ts
   * const { hasRole } = useAuthStore();
   * if (hasRole("ROLE_ADMIN")) {
   *   // Usuário é admin
   * }
   * ```
   */
  hasRole: (requiredRole: string) => boolean;
}

/**
 * Auth Store completa
 */
type AuthStore = AuthState & AuthActions;

/**
 * Hook do Zustand para gerenciar autenticação
 *
 * Inclui persistência no localStorage e devtools (apenas dev).
 *
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { setAuth, isAuthenticated } = useAuthStore();
 *
 *   const handleLogin = async () => {
 *     const response = await authService.login(credentials);
 *     setAuth(userData);
 *   };
 *
 *   if (isAuthenticated) {
 *     return <p>Você está logado!</p>;
 *   }
 *
 *   return <button onClick={handleLogin}>Login</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Usar selector para evitar re-renders desnecessários
 * function UserName() {
 *   const userName = useAuthStore((state) => state.user?.name);
 *   return <p>Olá, {userName}!</p>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Verificar role
 * function AdminPanel() {
 *   const hasRole = useAuthStore((state) => state.hasRole);
 *
 *   if (!hasRole("ROLE_ADMIN")) {
 *     return <p>Acesso negado</p>;
 *   }
 *
 *   return <AdminDashboard />;
 * }
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  // Devtools (apenas em desenvolvimento)
  devtools(
    // Logger (apenas em desenvolvimento)
    logger(
      // Persist (salva no localStorage)
      persist(
        (set, get) => ({
          // Estado inicial
          user: null,
          isAuthenticated: false,

          // Ações
          setAuth: (user) =>
            set(
              {
                user,
                isAuthenticated: true,
              },
              false,
              "setAuth"
            ),

          setUser: (user) => set({ user }, false, "setUser"),

          logout: () =>
            set(
              {
                user: null,
                isAuthenticated: false,
              },
              false,
              "logout"
            ),

          hasRole: (requiredRole) => {
            const { user } = get();
            return user?.role === requiredRole;
          },
        }),
        {
          name: "auth-storage", // Nome da chave no localStorage
          storage: createJSONStorage(() => localStorage), // Usa localStorage
          // Particiona o estado: apenas persiste user e estado de auth
          partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
          }),
        }
      ),
      "AuthStore" // Nome para o logger
    ),
    { name: "AuthStore" } // Nome para devtools
  )
);

/**
 * Selectors úteis para evitar re-renders desnecessários
 */
export const authSelectors = {
  /** Selector para user */
  user: (state: AuthStore) => state.user,

  /** Selector para isAuthenticated */
  isAuthenticated: (state: AuthStore) => state.isAuthenticated,

  /** Selector para user name */
  userName: (state: AuthStore) => state.user?.name,

  /** Selector para user email */
  userEmail: (state: AuthStore) => state.user?.email,

  /** Selector para user role */
  userRole: (state: AuthStore) => state.user?.role,
};

/**
 * Hook helper para verificar se está autenticado
 *
 * @returns true se usuário está autenticado
 *
 * @example
 * ```tsx
 * function ProtectedRoute({ children }) {
 *   const isAuth = useIsAuthenticated();
 *
 *   if (!isAuth) return <Navigate to="/login" />;
 *   return children;
 * }
 * ```
 */
export const useIsAuthenticated = () =>
  useAuthStore(authSelectors.isAuthenticated);

/**
 * Hook helper para obter dados do usuário
 *
 * @returns Dados do usuário ou null
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const user = useCurrentUser();
 *   if (!user) return <p>Não autenticado</p>;
 *   return <p>Olá, {user.name}!</p>;
 * }
 * ```
 */
export const useCurrentUser = () => useAuthStore(authSelectors.user);
