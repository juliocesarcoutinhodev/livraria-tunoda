/**
 * Store Barrel Export
 *
 * Exporta todos os Zustand stores em um único arquivo.
 *
 * @module store
 */

// Auth Store
export {
  useAuthStore,
  authSelectors,
  useIsAuthenticated,
  useCurrentUser,
} from "./useAuthStore";

// Cart Store
export {
  useCartStore,
  cartSelectors,
  useCartItemCount,
  useIsCartEmpty,
  type CartItem,
} from "./useCartStore";

// UI Store
export {
  useUIStore,
  uiSelectors,
  useNotification,
  type Notification,
  type NotificationType,
  type ModalType,
} from "./useUIStore";

// Middleware
export { logger } from "./middleware/logger";
