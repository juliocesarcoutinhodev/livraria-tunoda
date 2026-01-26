"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { cartService } from "@/services/cartService";
import type { Cart, CartItem } from "@/types/cart";

interface CartState {
  cartId: string | null;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isUpdating: boolean;
}

export interface AddToCartPayload {
  bookId: string;
  quantity?: number;
  title?: string;
  price?: number;
  photoUrl?: string;
}

interface CartContextType extends CartState {
  addItem: (payload: AddToCartPayload) => Promise<boolean>;
  removeItem: (bookId: string) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const emptyCartState: CartState = {
  cartId: null,
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: true,
  isUpdating: false,
};

type CartSnapshot = Pick<
  CartState,
  "cartId" | "items" | "subtotal" | "itemCount"
>;

const readCartSnapshot = (): CartState => {
  if (typeof window === "undefined") {
    return emptyCartState;
  }

  const raw = localStorage.getItem("cartSnapshot");
  if (!raw) {
    return emptyCartState;
  }

  try {
    const snapshot = JSON.parse(raw) as CartSnapshot;
    return {
      ...emptyCartState,
      ...snapshot,
      isLoading: true,
    };
  } catch {
    return emptyCartState;
  }
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

const logCartDebug = (message: string, payload?: Record<string, unknown>) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  if (payload) {
    console.info(`[CartDebug] ${message}`, payload);
  } else {
    console.info(`[CartDebug] ${message}`);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(emptyCartState);
  const cartRef = useRef<CartState>(emptyCartState);
  const pathname = usePathname();
  const hasHandledPathname = useRef(false);

  const applyCart = (cart: Cart, cartId?: string) => {
    setState((prev) => {
      const nextState = {
        ...prev,
        cartId: cartId ?? cart.id,
        items: cart.items || [],
        subtotal: cart.subtotal || 0,
        itemCount: cart.itemCount || 0,
      };
      cartRef.current = nextState;
      return nextState;
    });
  };

  const ensureCartId = async () => {
    const stored = localStorage.getItem("cartId");
    if (stored && stored !== "undefined" && stored !== "null") {
      logCartDebug("ensureCartId: using stored cartId", { cartId: stored });
      setState((prev) => ({ ...prev, cartId: stored }));
      return stored;
    }

    const cart = await cartService.create();
    localStorage.setItem("cartId", cart.id);
    logCartDebug("ensureCartId: created new cartId", { cartId: cart.id });
    applyCart(cart, cart.id);
    return cart.id;
  };

  const createFreshCart = async () => {
    const cart = await cartService.create();
    localStorage.setItem("cartId", cart.id);
    applyCart(cart, cart.id);
    return cart.id;
  };

  const fetchCart = async (currentCartId: string) => {
    try {
      const cart = await cartService.getById(currentCartId);
      logCartDebug("fetchCart: fetched cart", {
        cartId: currentCartId,
        itemCount: cart.itemCount,
        itemsLength: cart.items.length,
      });
      return { cart, cartId: currentCartId };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logCartDebug("fetchCart: cartId not found (404), creating new cart", {
          cartId: currentCartId,
        });
        const cart = await cartService.create();
        localStorage.setItem("cartId", cart.id);
        return { cart, cartId: cart.id };
      }
      throw error;
    }
  };

  const refreshCart = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const currentCartId = await ensureCartId();
      const { cart, cartId } = await fetchCart(currentCartId);
      const hasServerItems = (cart.items?.length ?? 0) > 0 || cart.itemCount > 0;
      const hasLocalItems =
        cartRef.current.items.length > 0 || cartRef.current.itemCount > 0;
      if (hasServerItems || !hasLocalItems) {
        applyCart(cart, cartId);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível carregar o carrinho."));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const snapshot = readCartSnapshot();
      const hasSnapshot =
        !!snapshot.cartId || snapshot.items.length > 0 || snapshot.itemCount > 0;
      logCartDebug("init: snapshot", {
        cartId: snapshot.cartId,
        itemCount: snapshot.itemCount,
        itemsLength: snapshot.items.length,
      });
      if (isMounted && hasSnapshot) {
        setState((prev) => ({
          ...prev,
          ...snapshot,
          isLoading: true,
        }));
      } else if (isMounted) {
        setState((prev) => ({ ...prev, isLoading: true }));
      }
      try {
        const currentCartId = await ensureCartId();
        const { cart, cartId } = await fetchCart(currentCartId);
        if (isMounted) {
          const hasServerItems =
            (cart.items?.length ?? 0) > 0 || cart.itemCount > 0;
          const hasLocalItems =
            snapshot.items.length > 0 ||
            snapshot.itemCount > 0 ||
            cartRef.current.items.length > 0 ||
            cartRef.current.itemCount > 0;
          logCartDebug("init: decide applyCart", {
            hasServerItems,
            hasLocalItems,
            cartId,
          });
          if (hasServerItems || !hasLocalItems) {
            applyCart(cart, cartId);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            getErrorMessage(error, "Não foi possível iniciar o carrinho.")
          );
        }
      } finally {
        if (isMounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    cartRef.current = state;
  }, [state]);

  useEffect(() => {
    logCartDebug("state: updated", {
      cartId: state.cartId,
      itemCount: state.itemCount,
      itemsLength: state.items.length,
      isLoading: state.isLoading,
    });
  }, [state.cartId, state.itemCount, state.items.length, state.isLoading]);

  useEffect(() => {
    if (!pathname) {
      return;
    }
    if (!hasHandledPathname.current) {
      hasHandledPathname.current = true;
      return;
    }
    logCartDebug("route change: refreshCart", { pathname });
    void refreshCart();
  }, [pathname, refreshCart]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const snapshot: CartSnapshot = {
      cartId: state.cartId,
      items: state.items,
      subtotal: state.subtotal,
      itemCount: state.itemCount,
    };
    localStorage.setItem("cartSnapshot", JSON.stringify(snapshot));
  }, [state.cartId, state.items, state.subtotal, state.itemCount]);

  const addItem = async (payload: AddToCartPayload) => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    const quantity = Math.max(1, payload.quantity ?? 1);

    try {
      const currentCartId = await ensureCartId();
      logCartDebug("addItem: start", { cartId: currentCartId });
      const previous = cartRef.current;
      const existing = previous.items.find(
        (item) => item.bookId === payload.bookId
      );
      const optimisticItems = existing
        ? previous.items.map((item) =>
            item.bookId === payload.bookId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: (item.price || 0) * (item.quantity + quantity),
                }
              : item
          )
        : [
            ...previous.items,
            {
              bookId: payload.bookId,
              title: payload.title || "Livro selecionado",
              price: payload.price || 0,
              quantity,
              subtotal: (payload.price || 0) * quantity,
              photoUrl: payload.photoUrl,
            },
          ];

      const optimisticSubtotal = optimisticItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const optimisticCount = optimisticItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setState((prev) => ({
        ...prev,
        items: optimisticItems,
        subtotal: optimisticSubtotal,
        itemCount: optimisticCount,
      }));

      const cart = await cartService.addItem(currentCartId, {
        bookId: payload.bookId,
        quantity,
      });
      logCartDebug("addItem: server response", {
        cartId: currentCartId,
        itemCount: cart.itemCount,
        itemsLength: cart.items.length,
      });
      applyCart(cart, currentCartId);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        try {
          const newCartId = await createFreshCart();
          const previous = cartRef.current;
          const existing = previous.items.find(
            (item) => item.bookId === payload.bookId
          );
          const optimisticItems = existing
            ? previous.items.map((item) =>
                item.bookId === payload.bookId
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      subtotal: (item.price || 0) * (item.quantity + quantity),
                    }
                  : item
              )
            : [
                ...previous.items,
                {
                  bookId: payload.bookId,
                  title: payload.title || "Livro selecionado",
                  price: payload.price || 0,
                  quantity,
                  subtotal: (payload.price || 0) * quantity,
                  photoUrl: payload.photoUrl,
                },
              ];

          const optimisticSubtotal = optimisticItems.reduce(
            (sum, item) => sum + item.subtotal,
            0
          );
          const optimisticCount = optimisticItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          setState((prev) => ({
            ...prev,
            items: optimisticItems,
            subtotal: optimisticSubtotal,
            itemCount: optimisticCount,
          }));

          const cart = await cartService.addItem(newCartId, {
            bookId: payload.bookId,
            quantity,
          });
          applyCart(cart, newCartId);
          return true;
        } catch (retryError) {
          setState(previous);
          cartRef.current = previous;
          toast.error(
            getErrorMessage(
              retryError,
              "Não foi possível adicionar ao carrinho."
            )
          );
          return false;
        }
      }

      setState(previous);
      cartRef.current = previous;
      toast.error(
        getErrorMessage(error, "Não foi possível adicionar ao carrinho.")
      );
      return false;
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(bookId);
      return;
    }

    setState((prev) => ({ ...prev, isUpdating: true }));
    const previous = cartRef.current;

    const optimisticItems = previous.items.map((item) =>
      item.bookId === bookId
        ? {
            ...item,
            quantity,
            subtotal: (item.price || 0) * quantity,
          }
        : item
    );
    const optimisticSubtotal = optimisticItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const optimisticCount = optimisticItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setState((prev) => ({
      ...prev,
      items: optimisticItems,
      subtotal: optimisticSubtotal,
      itemCount: optimisticCount,
    }));

    try {
      const currentCartId = await ensureCartId();
      const cart = await cartService.updateItem(currentCartId, bookId, quantity);
      applyCart(cart, currentCartId);
    } catch (error) {
      setState(previous);
      cartRef.current = previous;
      toast.error(
        getErrorMessage(error, "Não foi possível atualizar a quantidade.")
      );
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  };

  const removeItem = async (bookId: string) => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    const previous = cartRef.current;

    const optimisticItems = previous.items.filter(
      (item) => item.bookId !== bookId
    );
    const optimisticSubtotal = optimisticItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const optimisticCount = optimisticItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setState((prev) => ({
      ...prev,
      items: optimisticItems,
      subtotal: optimisticSubtotal,
      itemCount: optimisticCount,
    }));

    try {
      const currentCartId = await ensureCartId();
      await cartService.removeItem(currentCartId, bookId);
      const cart = await cartService.getById(currentCartId);
      applyCart(cart, currentCartId);
    } catch (error) {
      setState(previous);
      cartRef.current = previous;
      toast.error(
        getErrorMessage(error, "Não foi possível remover o item do carrinho.")
      );
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  };

  const clearCart = async () => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    const previous = cartRef.current;
    setState((prev) => ({ ...prev, items: [], subtotal: 0, itemCount: 0 }));

    try {
      const currentCartId = await ensureCartId();
      await cartService.clear(currentCartId);
      const cart = await cartService.getById(currentCartId);
      applyCart(cart, currentCartId);
    } catch (error) {
      setState(previous);
      cartRef.current = previous;
      toast.error(
        getErrorMessage(error, "Não foi possível limpar o carrinho.")
      );
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refreshCart,
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
