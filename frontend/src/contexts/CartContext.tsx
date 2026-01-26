"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
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

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(emptyCartState);
  const cartRef = useRef<CartState>(emptyCartState);

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
      setState((prev) => ({ ...prev, cartId: stored }));
      return stored;
    }

    const cart = await cartService.create();
    localStorage.setItem("cartId", cart.id);
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
      return { cart: await cartService.getById(currentCartId), cartId: currentCartId };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const cart = await cartService.create();
        localStorage.setItem("cartId", cart.id);
        return { cart, cartId: cart.id };
      }
      throw error;
    }
  };

  const refreshCart = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const currentCartId = await ensureCartId();
      const { cart, cartId } = await fetchCart(currentCartId);
      applyCart(cart, cartId);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível carregar o carrinho."));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const currentCartId = await ensureCartId();
        const { cart, cartId } = await fetchCart(currentCartId);
        if (isMounted) {
          applyCart(cart, cartId);
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

  const addItem = async (payload: AddToCartPayload) => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    const previous = cartRef.current;
    const quantity = Math.max(1, payload.quantity ?? 1);

    if (previous.cartId) {
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
    }

    try {
      const currentCartId = await ensureCartId();
      const cart = await cartService.addItem(currentCartId, {
        bookId: payload.bookId,
        quantity,
      });
      applyCart(cart, currentCartId);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        try {
          const newCartId = await createFreshCart();
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
