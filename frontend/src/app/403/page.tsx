"use client";

/**
 * 403 Forbidden Page
 *
 * Página exibida quando o usuário tenta acessar uma rota
 * para a qual não tem permissão.
 *
 * @module app/403
 */

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

export default function ForbiddenPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-christian-background via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Card de Erro */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center">
          {/* Ícone de Acesso Negado */}
          <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
            <svg
              className="w-16 h-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>

          {/* Código de Erro */}
          <h1 className="text-6xl font-bold text-red-600 font-playfair mb-2">
            403
          </h1>

          {/* Título */}
          <h2 className="text-2xl font-bold text-christian-text font-playfair mb-4">
            Acesso Negado
          </h2>

          {/* Descrição */}
          <p className="text-christian-text/70 mb-8 leading-relaxed">
            Você não tem permissão para acessar esta página. Esta área é
            restrita a administradores.
          </p>

          {/* Ações */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-christian-blue hover:bg-christian-green text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-christian-blue focus:ring-offset-2"
            >
              Voltar para Página Inicial
            </button>

            <button
              onClick={handleGoBack}
              className="w-full bg-gray-200 hover:bg-gray-300 text-christian-text font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Voltar
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-red-600 hover:text-red-700 font-medium py-2 transition-colors duration-200"
            >
              Sair e Fazer Login com Outra Conta
            </button>
          </div>
        </div>

        {/* Informação Adicional */}
        <div className="mt-6 text-center text-sm text-christian-text/50">
          <p>Se você acredita que isso é um erro, entre em contato com o</p>
          <p>administrador do sistema.</p>
        </div>
      </div>
    </div>
  );
}
