/**
 * Breadcrumb - Componente de navegação hierárquica
 *
 * Exibe o caminho de navegação atual no formato:
 * Home > Categoria > Página Atual
 *
 * @module components/layout/Breadcrumb
 */

import Link from "next/link";

export interface BreadcrumbItem {
  /** Texto exibido */
  label: string;
  /** URL de destino (opcional para último item) */
  href?: string;
}

export interface BreadcrumbProps {
  /** Lista de itens do breadcrumb */
  items: BreadcrumbItem[];
}

/**
 * Componente Breadcrumb
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: "Dashboard", href: "/admin/dashboard" },
 *     { label: "Autores", href: "/admin/authors" },
 *     { label: "Novo Autor" }
 *   ]}
 * />
 * ```
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {!isLast && item.href ? (
                <>
                  <Link
                    href={item.href}
                    className="text-christian-text/60 hover:text-christian-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                  <svg
                    className="w-4 h-4 mx-2 text-christian-text/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                <span className="text-christian-text font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
