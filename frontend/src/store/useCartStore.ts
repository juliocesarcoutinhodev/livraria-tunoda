/**
 * Cart Store - Zustand store para carrinho de compras
 *
 * Gerencia carrinho temporário (antes de sincronizar com backend).
 * Ideal para uso enquanto usuário não está autenticado ou antes de criar
 * o carrinho persistente no backend.
 *
 * @module store/useCartStore
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { logger } from "./middleware/logger";

/**
 * Item do carrinho
 */
export interface CartItem {
  /** ID do livro */
  id: string;
  /** Título do livro */
  title: string;
  /** Preço unitário */
  price: number;
  /** Quantidade */
  quantity: number;
  /** URL da imagem */
  image?: string;
  /** Nome do autor */
  author?: string;
}

/**
 * Interface do estado do carrinho
 */
interface CartState {
  /** Lista de itens no carrinho */
  items: CartItem[];
  /** Total do carrinho */
  total: number;
  /** Total de itens (soma das quantidades) */
  itemCount: number;
}

/**
 * Interface das ações do carrinho
 */
interface CartActions {
  /**
   * Adiciona um item ao carrinho
   * Se o item já existe, incrementa a quantidade
   *
   * @param item - Item a ser adicionado
   *
   * @example
   * ```ts
   * const { addItem } = useCartStore();
   * addItem({
   *   id: "book-123",
   *   title: "Caminho da Esperança",
   *   price: 45.90,
   *   quantity: 1,
   *   image: "/img/book.jpg"
   * });
   * ```
   */
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;

  /**
   * Remove um item do carrinho
   *
   * @param id - ID do item a ser removido
   *
   * @example
   * ```ts
   * const { removeItem } = useCartStore();
   * removeItem("book-123");
   * ```
   */
  removeItem: (id: string) => void;

  /**
   * Atualiza a quantidade de um item
   *
   * @param id - ID do item
   * @param quantity - Nova quantidade (se 0, remove o item)
   *
   * @example
   * ```ts
   * const { updateQuantity } = useCartStore();
   * updateQuantity("book-123", 5);
   * ```
   */
  updateQuantity: (id: string, quantity: number) => void;

  /**
   * Limpa todo o carrinho
   *
   * @example
   * ```ts
   * const { clearCart } = useCartStore();
   * clearCart();
   * ```
   */
  clearCart: () => void;

  /**
   * Calcula o total do carrinho
   * (geralmente chamado automaticamente após mudanças)
   */
  calculateTotal: () => void;
}

/**
 * Cart Store completa
 */
type CartStore = CartState & CartActions;

/**
 * Função auxiliar para calcular totais
 */
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

/**
 * Hook do Zustand para gerenciar carrinho temporário
 *
 * Carrinho em memória (não persiste no localStorage).
 * Ideal para uso antes de sincronizar com o backend.
 *
 * @example
 * ```tsx
 * function AddToCartButton({ book }) {
 *   const addItem = useCartStore((state) => state.addItem);
 *
 *   const handleAdd = () => {
 *     addItem({
 *       id: book.id,
 *       title: book.title,
 *       price: book.price,
 *       quantity: 1,
 *       image: book.photoUrl
 *     });
 *     toast.success("Livro adicionado ao carrinho!");
 *   };
 *
 *   return <button onClick={handleAdd}>Adicionar ao carrinho</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Usar selector para evitar re-renders desnecessários
 * function CartBadge() {
 *   const itemCount = useCartStore((state) => state.itemCount);
 *   return <span className="badge">{itemCount}</span>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Listar itens do carrinho
 * function CartItems() {
 *   const items = useCartStore((state) => state.items);
 *   const removeItem = useCartStore((state) => state.removeItem);
 *
 *   return (
 *     <div>
 *       {items.map(item => (
 *         <div key={item.id}>
 *           <p>{item.title} x {item.quantity}</p>
 *           <p>R$ {item.price * item.quantity}</p>
 *           <button onClick={() => removeItem(item.id)}>Remover</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCartStore = create<CartStore>()(
  devtools(
    logger(
      (set, get) => ({
        // Estado inicial
        items: [],
        total: 0,
        itemCount: 0,

        // Ações
        addItem: (item) =>
          set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            let newItems: CartItem[];

            if (existingItem) {
              // Item já existe: incrementa quantidade
              newItems = state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              );
            } else {
              // Item novo: adiciona ao carrinho
              newItems = [
                ...state.items,
                { ...item, quantity: item.quantity || 1 },
              ];
            }

            const { total, itemCount } = calculateTotals(newItems);
            return { items: newItems, total, itemCount };
          }, false, "addItem"),

        removeItem: (id) =>
          set((state) => {
            const newItems = state.items.filter((item) => item.id !== id);
            const { total, itemCount } = calculateTotals(newItems);
            return { items: newItems, total, itemCount };
          }, false, "removeItem"),

        updateQuantity: (id, quantity) =>
          set((state) => {
            if (quantity <= 0) {
              // Se quantidade é 0, remove o item
              return get().removeItem(id), state;
            }

            const newItems = state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            );

            const { total, itemCount } = calculateTotals(newItems);
            return { items: newItems, total, itemCount };
          }, false, "updateQuantity"),

        clearCart: () =>
          set({ items: [], total: 0, itemCount: 0 }, false, "clearCart"),

        calculateTotal: () =>
          set((state) => {
            const { total, itemCount } = calculateTotals(state.items);
            return { total, itemCount };
          }, false, "calculateTotal"),
      }),
      "CartStore"
    ),
    { name: "CartStore" }
  )
);

/**
 * Selectors úteis para evitar re-renders desnecessários
 */
export const cartSelectors = {
  /** Selector para items */
  items: (state: CartStore) => state.items,

  /** Selector para total */
  total: (state: CartStore) => state.total,

  /** Selector para itemCount */
  itemCount: (state: CartStore) => state.itemCount,

  /** Selector para verificar se carrinho está vazio */
  isEmpty: (state: CartStore) => state.items.length === 0,
};

/**
 * Hook helper para obter total de itens no carrinho
 *
 * @returns Número total de itens
 *
 * @example
 * ```tsx
 * function CartBadge() {
 *   const count = useCartItemCount();
 *   if (count === 0) return null;
 *   return <span className="badge">{count}</span>;
 * }
 * ```
 */
export const useCartItemCount = () => useCartStore(cartSelectors.itemCount);

/**
 * Hook helper para verificar se carrinho está vazio
 *
 * @returns true se carrinho está vazio
 *
 * @example
 * ```tsx
 * function CartPage() {
 *   const isEmpty = useIsCartEmpty();
 *   if (isEmpty) return <EmptyCartMessage />;
 *   return <CartItems />;
 * }
 * ```
 */
export const useIsCartEmpty = () => useCartStore(cartSelectors.isEmpty);
