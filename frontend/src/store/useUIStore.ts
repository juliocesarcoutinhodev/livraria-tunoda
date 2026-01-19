/**
 * UI Store - Zustand store para estado de interface do usuário
 *
 * Gerencia estado não-persistido de UI como modais, sidebar,
 * notificações e loading states.
 *
 * @module store/useUIStore
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { logger } from "./middleware/logger";

/**
 * Tipo de notificação
 */
export type NotificationType = "success" | "error" | "warning" | "info";

/**
 * Interface de notificação
 */
export interface Notification {
  /** ID único da notificação */
  id: string;
  /** Tipo da notificação */
  type: NotificationType;
  /** Título da notificação */
  title?: string;
  /** Mensagem da notificação */
  message: string;
  /** Duração em ms (null = não fecha automaticamente) */
  duration?: number | null;
  /** Timestamp de criação */
  createdAt: number;
}

/**
 * Tipo de modal disponível
 */
export type ModalType =
  | "login"
  | "register"
  | "forgot-password"
  | "confirm"
  | "book-detail"
  | "checkout"
  | null;

/**
 * Interface do estado de UI
 */
interface UIState {
  /** Sidebar está aberta (mobile) */
  isSidebarOpen: boolean;
  /** Modal atual aberto */
  currentModal: ModalType;
  /** Dados do modal (ex: bookId para book-detail) */
  modalData: unknown;
  /** Lista de notificações ativas */
  notifications: Notification[];
  /** Loading global (ex: ao fazer logout) */
  isLoading: boolean;
  /** Mensagem de loading */
  loadingMessage?: string;
}

/**
 * Interface das ações de UI
 */
interface UIActions {
  /**
   * Abre a sidebar (mobile)
   *
   * @example
   * ```tsx
   * function MenuButton() {
   *   const openSidebar = useUIStore((state) => state.openSidebar);
   *   return <button onClick={openSidebar}>Menu</button>;
   * }
   * ```
   */
  openSidebar: () => void;

  /**
   * Fecha a sidebar
   *
   * @example
   * ```tsx
   * function Sidebar() {
   *   const { isSidebarOpen, closeSidebar } = useUIStore();
   *   if (!isSidebarOpen) return null;
   *   return <div onClick={closeSidebar}>Sidebar</div>;
   * }
   * ```
   */
  closeSidebar: () => void;

  /**
   * Toggle da sidebar
   */
  toggleSidebar: () => void;

  /**
   * Abre um modal
   *
   * @param modal - Tipo do modal
   * @param data - Dados opcionais do modal
   *
   * @example
   * ```tsx
   * function BookCard({ book }) {
   *   const openModal = useUIStore((state) => state.openModal);
   *
   *   const handleClick = () => {
   *     openModal("book-detail", { bookId: book.id });
   *   };
   *
   *   return <button onClick={handleClick}>Ver detalhes</button>;
   * }
   * ```
   */
  openModal: (modal: ModalType, data?: unknown) => void;

  /**
   * Fecha o modal atual
   *
   * @example
   * ```tsx
   * function Modal() {
   *   const closeModal = useUIStore((state) => state.closeModal);
   *   return <button onClick={closeModal}>Fechar</button>;
   * }
   * ```
   */
  closeModal: () => void;

  /**
   * Adiciona uma notificação
   *
   * @param notification - Dados da notificação (sem id e createdAt)
   * @returns ID da notificação criada
   *
   * @example
   * ```tsx
   * function SaveButton() {
   *   const addNotification = useUIStore((state) => state.addNotification);
   *
   *   const handleSave = async () => {
   *     try {
   *       await save();
   *       addNotification({
   *         type: "success",
   *         message: "Salvo com sucesso!",
   *         duration: 3000
   *       });
   *     } catch (error) {
   *       addNotification({
   *         type: "error",
   *         message: "Erro ao salvar",
   *         duration: 5000
   *       });
   *     }
   *   };
   *
   *   return <button onClick={handleSave}>Salvar</button>;
   * }
   * ```
   */
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => string;

  /**
   * Remove uma notificação específica
   *
   * @param id - ID da notificação
   *
   * @example
   * ```tsx
   * function NotificationItem({ notification }) {
   *   const removeNotification = useUIStore((state) => state.removeNotification);
   *
   *   return (
   *     <div>
   *       <p>{notification.message}</p>
   *       <button onClick={() => removeNotification(notification.id)}>
   *         Fechar
   *       </button>
   *     </div>
   *   );
   * }
   * ```
   */
  removeNotification: (id: string) => void;

  /**
   * Limpa todas as notificações
   *
   * @example
   * ```tsx
   * function ClearAllButton() {
   *   const clearNotifications = useUIStore((state) => state.clearNotifications);
   *   return <button onClick={clearNotifications}>Limpar todas</button>;
   * }
   * ```
   */
  clearNotifications: () => void;

  /**
   * Define loading global
   *
   * @param isLoading - Estado de loading
   * @param message - Mensagem opcional
   *
   * @example
   * ```tsx
   * function LogoutButton() {
   *   const setLoading = useUIStore((state) => state.setLoading);
   *
   *   const handleLogout = async () => {
   *     setLoading(true, "Saindo...");
   *     await logout();
   *     setLoading(false);
   *   };
   *
   *   return <button onClick={handleLogout}>Sair</button>;
   * }
   * ```
   */
  setLoading: (isLoading: boolean, message?: string) => void;
}

/**
 * UI Store completa
 */
type UIStore = UIState & UIActions;

/**
 * Hook do Zustand para gerenciar estado de UI
 *
 * Não persiste no localStorage (estado em memória).
 *
 * @example
 * ```tsx
 * // Sidebar
 * function MobileMenu() {
 *   const { isSidebarOpen, toggleSidebar } = useUIStore();
 *
 *   return (
 *     <button onClick={toggleSidebar}>
 *       {isSidebarOpen ? "Fechar" : "Abrir"} Menu
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Notificações
 * function Notifications() {
 *   const notifications = useUIStore((state) => state.notifications);
 *
 *   return (
 *     <div className="notifications">
 *       {notifications.map(notif => (
 *         <NotificationItem key={notif.id} notification={notif} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Loading global
 * function GlobalLoading() {
 *   const { isLoading, loadingMessage } = useUIStore();
 *
 *   if (!isLoading) return null;
 *
 *   return (
 *     <div className="loading-overlay">
 *       <Spinner />
 *       {loadingMessage && <p>{loadingMessage}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useUIStore = create<UIStore>()(
  devtools(
    logger(
      (set) => ({
        // Estado inicial
        isSidebarOpen: false,
        currentModal: null,
        modalData: null,
        notifications: [],
        isLoading: false,
        loadingMessage: undefined,

        // Ações - Sidebar
        openSidebar: () => set({ isSidebarOpen: true }, false, "openSidebar"),

        closeSidebar: () =>
          set({ isSidebarOpen: false }, false, "closeSidebar"),

        toggleSidebar: () =>
          set(
            (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
            false,
            "toggleSidebar"
          ),

        // Ações - Modal
        openModal: (modal, data) =>
          set({ currentModal: modal, modalData: data }, false, "openModal"),

        closeModal: () =>
          set({ currentModal: null, modalData: null }, false, "closeModal"),

        // Ações - Notificações
        addNotification: (notification) => {
          const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newNotification: Notification = {
            ...notification,
            id,
            createdAt: Date.now(),
            duration: notification.duration ?? 5000, // 5s default
          };

          set(
            (state) => ({
              notifications: [...state.notifications, newNotification],
            }),
            false,
            "addNotification"
          );

          // Auto-remove após duration (se definido)
          if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
              set(
                (state) => ({
                  notifications: state.notifications.filter((n) => n.id !== id),
                }),
                false,
                "removeNotification(auto)"
              );
            }, newNotification.duration);
          }

          return id;
        },

        removeNotification: (id) =>
          set(
            (state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            "removeNotification"
          ),

        clearNotifications: () =>
          set({ notifications: [] }, false, "clearNotifications"),

        // Ações - Loading
        setLoading: (isLoading, message) =>
          set({ isLoading, loadingMessage: message }, false, "setLoading"),
      }),
      "UIStore"
    ),
    { name: "UIStore" }
  )
);

/**
 * Selectors úteis para evitar re-renders desnecessários
 */
export const uiSelectors = {
  /** Selector para isSidebarOpen */
  isSidebarOpen: (state: UIStore) => state.isSidebarOpen,

  /** Selector para currentModal */
  currentModal: (state: UIStore) => state.currentModal,

  /** Selector para notifications */
  notifications: (state: UIStore) => state.notifications,

  /** Selector para isLoading */
  isLoading: (state: UIStore) => state.isLoading,
};

/**
 * Hook helper para notificações
 *
 * @returns Função para adicionar notificação
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const notify = useNotification();
 *
 *   const handleSuccess = () => {
 *     notify({ type: "success", message: "Operação concluída!" });
 *   };
 *
 *   return <button onClick={handleSuccess}>Salvar</button>;
 * }
 * ```
 */
export const useNotification = () =>
  useUIStore((state) => state.addNotification);
