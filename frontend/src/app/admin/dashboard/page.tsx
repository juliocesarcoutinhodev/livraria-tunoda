"use client";

/**
 * Admin Dashboard Page
 *
 * Dashboard administrativo com métricas e estatísticas.
 * Protegido pelo middleware (server-side).
 * Inclui auto-logout por inatividade (1 hora).
 *
 * @module app/admin/dashboard
 */

import { useState } from "react";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks";
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";
import { Modal } from "@/components/ui";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Auto-logout após 1 hora de inatividade
  useAutoLogoutAfterInactivity();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, redireciona
      router.push("/login");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-christian-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-christian-text font-playfair">
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-christian-text/60 mt-1">
                Bem-vindo, {user?.email || "Administrador"}
              </p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              disabled={logout.isPending}
            >
              {logout.isPending ? "Saindo..." : "Sair"}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Métricas (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Total de Livros */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-christian-text/60 font-medium">
                  Total de Livros
                </p>
                <p className="text-3xl font-bold text-christian-blue mt-2">
                  --
                </p>
              </div>
              <div className="p-3 bg-christian-blue/10 rounded-lg">
                <svg
                  className="w-8 h-8 text-christian-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 - Total de Vendas */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-christian-text/60 font-medium">
                  Total de Vendas
                </p>
                <p className="text-3xl font-bold text-christian-green mt-2">
                  --
                </p>
              </div>
              <div className="p-3 bg-christian-green/10 rounded-lg">
                <svg
                  className="w-8 h-8 text-christian-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3 - Livros Mais Clicados */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-christian-text/60 font-medium">
                  Mais Clicados
                </p>
                <p className="text-3xl font-bold text-christian-gold mt-2">
                  --
                </p>
              </div>
              <div className="p-3 bg-christian-gold/10 rounded-lg">
                <svg
                  className="w-8 h-8 text-christian-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4 - Livros Mais Visualizados */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-christian-text/60 font-medium">
                  Mais Visualizados
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">--</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem Temporária */}
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <div className="inline-block p-4 bg-christian-blue/10 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-christian-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-christian-text mb-2 font-playfair">
            Dashboard em Construção
          </h2>
          <p className="text-christian-text/60 max-w-md mx-auto">
            As métricas detalhadas serão implementadas assim que o backend
            fornecer os endpoints correspondentes.
          </p>
          <ul className="mt-6 text-left max-w-md mx-auto space-y-2 text-sm text-christian-text/80">
            <li className="flex items-center">
              <span className="text-christian-green mr-2">✓</span>
              Livros mais clicados
            </li>
            <li className="flex items-center">
              <span className="text-christian-green mr-2">✓</span>
              Livros mais visualizados
            </li>
            <li className="flex items-center">
              <span className="text-christian-green mr-2">✓</span>
              Total de vendas
            </li>
            <li className="flex items-center">
              <span className="text-christian-green mr-2">✓</span>
              Livros cadastrados
            </li>
          </ul>
        </div>
      </main>

      {/* Modal de Confirmação de Logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        title="Confirmar Logout"
        type="warning"
        closeOnBackdrop={false}
        actions={
          <>
            <button
              onClick={handleCancelLogout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-christian-text rounded-lg font-semibold transition-colors"
              disabled={logout.isPending}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              disabled={logout.isPending}
            >
              {logout.isPending ? "Saindo..." : "Sair"}
            </button>
          </>
        }
      >
        <p>
          Tem certeza que deseja sair do painel administrativo? Você precisará
          fazer login novamente para acessar esta área.
        </p>
      </Modal>
    </div>
  );
}
