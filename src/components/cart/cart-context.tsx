"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type WaitlistItem = {
  productSlug: string;
  productName: string;
  variant: string;
  months: 1 | 3 | 6;
  capsules: number;
  priceCents: number;
  isSubscription: boolean;
};

type CartState = {
  items: WaitlistItem[];
  isOpen: boolean;
  isSavingsModalOpen: boolean;
  addToWaitlist: (item: WaitlistItem) => void;
  removeFromWaitlist: (index: number) => void;
  clearWaitlist: () => void;
  open: () => void;
  close: () => void;
  openSavingsModal: () => void;
  closeSavingsModal: () => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WaitlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);

  const addToWaitlist = useCallback((item: WaitlistItem) => {
    setItems((prev) => [...prev, item]);
    setIsOpen(true);
  }, []);

  const removeFromWaitlist = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearWaitlist = useCallback(() => setItems([]), []);
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
        addToWaitlist,
        removeFromWaitlist,
        clearWaitlist,
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
