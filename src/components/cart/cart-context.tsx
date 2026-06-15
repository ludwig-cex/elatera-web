"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

const STORAGE_KEY = "nutrasana_cart";

export type CartItem = {
  productSlug: string;
  productName: string;
  variant: string;
  months: 1 | 3 | 6;
  capsules: number;
  priceCents: number;
  isSubscription: boolean;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isSavingsModalOpen: boolean;
  /** Wall-clock ms when the current "reservation" window started.
   *  Null while the cart is empty. Used by the drawer's countdown banner. */
  reservedSince: number | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  open: () => void;
  close: () => void;
  openSavingsModal: () => void;
  closeSavingsModal: () => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [reservedSince, setReservedSince] = useState<number | null>(null);

  // Hydrate from sessionStorage after mount (SSR-safe: avoids hydration
  // mismatch). Lets the dedicated /checkout page survive a reload or deep link
  // without losing the cart.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        items?: CartItem[];
        reservedSince?: number | null;
      };
      if (Array.isArray(parsed.items) && parsed.items.length > 0) {
        setItems(parsed.items);
        setReservedSince(
          typeof parsed.reservedSince === "number" ? parsed.reservedSince : Date.now(),
        );
      }
    } catch {
      // ignore — storage blocked or corrupt
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items, reservedSince }));
    } catch {
      // ignore
    }
  }, [items, reservedSince]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, item]);
    setIsOpen(true);
    // Start the reservation window on the first item; keep it stable while the
    // cart is non-empty so the countdown persists across drawer close/reopen.
    setReservedSince((prev) => prev ?? Date.now());
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setReservedSince(null);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setReservedSince(null);
  }, []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const openSavingsModal = useCallback(() => setIsSavingsModalOpen(true), []);
  const closeSavingsModal = useCallback(() => setIsSavingsModalOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isSavingsModalOpen,
        reservedSince,
        addToCart,
        removeFromCart,
        clearCart,
        open,
        close,
        openSavingsModal,
        closeSavingsModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
