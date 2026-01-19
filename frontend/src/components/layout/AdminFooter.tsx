/**
 * AdminFooter - Rodapé do painel administrativo
 *
 * Rodapé simples com informações de copyright e versão
 *
 * @module components/layout/AdminFooter
 */

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 py-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <p>© {currentYear} Livraria Tunoda. Todos os direitos reservados.</p>
          <p className="mt-2 sm:mt-0">
            Painel Administrativo <span className="text-gray-400">v1.0.0</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
