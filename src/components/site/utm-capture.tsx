"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

// Snapshots attribution params on first landing so they survive internal
// navigation to the cart. Renders nothing.
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
