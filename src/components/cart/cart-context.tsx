"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

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

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, item]);
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
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
