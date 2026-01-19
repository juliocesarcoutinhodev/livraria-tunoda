"use client";

/**
 * AdminSidebar - Sidebar de navegação administrativa
 *
 * Menu lateral para navegação entre páginas administrativas.
 * Responsivo: drawer no mobile, sidebar fixa no desktop.
 *
 * @module components/layout/AdminSidebar
 */

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { useLogout } from "@/hooks";
import { Modal } from "@/components/ui";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: "Autores",
    href: "/admin/authors",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    label: "Livros",
    href: "/admin/books",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  {
    label: "Pedidos",
    href: "/admin/orders",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/login");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleNavItemClick = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-christian-blue text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isMobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Backdrop (Mobile) */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-christian-blue font-playfair">
              Painel Admin
            </h1>
            <p className="text-sm text-christian-text/60 mt-1">
              Livraria Tunoda
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <button
                  key={item.href}
                  onClick={() => handleNavItemClick(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                    ${
                      isActive
                        ? "bg-christian-blue text-white shadow-md"
                        : "text-christian-text hover:bg-gray-100"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info + Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-christian-text">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-christian-text/60">{user?.role}</p>
            </div>
            <button
              onClick={handleLogoutClick}
              disabled={logout.isPending}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>{logout.isPending ? "Saindo..." : "Sair"}</span>
            </button>
          </div>
        </div>
      </aside>

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
    </>
  );
}
