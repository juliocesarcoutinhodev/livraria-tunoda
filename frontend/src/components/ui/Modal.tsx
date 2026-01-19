/**
 * Modal Component - Componente de modal reutilizável
 *
 * Modal acessível e responsivo com backdrop e animações.
 *
 * @module components/ui/Modal
 */

import { useEffect } from "react";

export interface ModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função chamada ao fechar o modal */
  onClose: () => void;
  /** Título do modal */
  title: string;
  /** Conteúdo do modal */
  children: React.ReactNode;
  /** Tipo de modal (define a cor do ícone) */
  type?: "info" | "warning" | "error" | "success";
  /** Botões de ação */
  actions?: React.ReactNode;
  /** Se pode fechar clicando no backdrop */
  closeOnBackdrop?: boolean;
}

/**
 * Componente Modal
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmar ação"
 *   type="warning"
 *   actions={
 *     <>
 *       <button onClick={handleConfirm}>Confirmar</button>
 *       <button onClick={handleCancel}>Cancelar</button>
 *     </>
 *   }
 * >
 *   <p>Tem certeza que deseja continuar?</p>
 * </Modal>
 * ```
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = "info",
  actions,
  closeOnBackdrop = true,
}: ModalProps) {
  // Fecha modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Previne scroll do body quando modal está aberto
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Cores dos ícones baseado no tipo
  const iconColors = {
    info: "text-blue-600 bg-blue-100",
    warning: "text-yellow-600 bg-yellow-100",
    error: "text-red-600 bg-red-100",
    success: "text-green-600 bg-green-100",
  };

  // Ícones baseado no tipo
  const icons = {
    info: (
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
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
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
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    error: (
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
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    success: (
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Ícone */}
            <div className={`p-3 rounded-full ${iconColors[type]}`}>
              {icons[type]}
            </div>

            {/* Título */}
            <div className="flex-1">
              <h3
                id="modal-title"
                className="text-xl font-bold text-christian-text font-playfair"
              >
                {title}
              </h3>
            </div>

            {/* Botão Fechar */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar modal"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 pb-6">
          <div className="text-christian-text/80">{children}</div>
        </div>

        {/* Ações */}
        {actions && (
          <div className="px-6 pb-6">
            <div className="flex gap-3 justify-end">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
}
