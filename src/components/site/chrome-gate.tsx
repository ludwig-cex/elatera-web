"use client";

import { usePathname } from "next/navigation";

// Hides the global site chrome (top bar, header, footer) on the dedicated
// checkout route so the checkout stays distraction-free. The cart/provider
// context stays mounted (it lives higher in the tree).
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/checkout")) return null;
  return <>{children}</>;
}
