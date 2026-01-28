/**
 * Hooks Barrel Export
 *
 * Exporta todos os hooks customizados em um único arquivo.
 *
 * @module hooks
 */

// Auth hooks
export {
  useAuth,
  useIsAuthenticated,
  useHasRole,
  useLogin,
  useLogout,
} from "./useAuth";

// Books hooks
export {
  useBooks,
  useBookDetail,
  useMostViewedBooks,
  useMostClickedBooks,
  useTrackBookMetric,
  useBooksAdmin,
  useBookDetailAdmin,
  useBookMetrics,
  useCreateBook,
  useUpdateBook,
  useUpdateBookStatus,
  useAdjustBookStock,
} from "./useBooks";

// Authors hooks
export {
  useAuthors,
  useAuthorDetail,
  useCreateAuthor,
  useUpdateAuthor,
  useUpdateAuthorStatus,
} from "./useAuthors";

// Cart hooks
export {
  useCart,
  useCreateCart,
  useAddItemToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useCheckout,
} from "./useCart";

// Shipping hooks
export {
  useShippingQuote,
  useCreateShippingQuote,
  useCalculateShipping,
  useSelectShippingOption,
} from "./useShipping";

// Orders hooks
export { useOrder, useOrdersAdmin } from "./useOrders";

// Payments hooks
export { usePayment, useCreatePayment } from "./usePayments";

// Dashboard hooks
export {
  useDashboardStats,
  useDashboardMetrics,
  useMostViewedBooks as useDashboardMostViewed,
  useMostClickedBooks as useDashboardMostClicked,
  useLowStockBooks,
} from "./useDashboard";

// Utility hooks
export { useRateLimit } from "./useRateLimit";
export { useDebounce } from "./useDebounce";
