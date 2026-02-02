"use client";

/**
 * Admin Layout - Guard client-side para rotas administrativas
 *
 * Verifica sessão via /user/me usando cookies HttpOnly.
 * Redireciona para /login se não autenticado.
 *
 * @module app/admin/layout
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const isAdminRole = (role: string | null | undefined) =>
  role === "ADMIN" || role === "ROLE_ADMIN";

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname() || "/admin";
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (cancelled) return;

        useAuthStore.getState().setAuth(user);

        if (!isAdminRole(user.role)) {
          router.replace("/403");
          return;
        }

        setChecking(false);
      } catch (error) {
        if (cancelled) return;

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          useAuthStore.getState().logout();
          router.replace(
            `/login?redirect=${encodeURIComponent(pathname)}`
          );
          return;
        }

        // Em caso de erro não relacionado a auth, libera a rota
        setChecking(false);
      }
    };

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-christian-background">
        <div className="text-sm text-gray-600">Verificando sessão...</div>
      </div>
    );
  }

  return <>{children}</>;
}
