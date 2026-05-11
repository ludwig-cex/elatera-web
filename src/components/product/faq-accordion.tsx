"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/products";

export function FaqAccordion({ product }: { product: Product }) {
  return (
    <div className="space-y-10">
      {product.faqs.map((cat) => (
        <div key={cat.category}>
          <div className="eyebrow mb-4">{cat.category}</div>
          <Accordion.Root type="multiple" className="space-y-2">
            {cat.items.map((item, idx) => {
              const value = `${cat.category}-${idx}`;
              return (
                <Accordion.Item
                  key={value}
                  value={value}
                  className="rounded-lg overflow-hidden"
                  style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <Accordion.Header>
                    <Accordion.Trigger
                      className="group w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-cream/40 transition"
                    >
                      <span className="serif text-lg leading-tight">{item.q}</span>
                      <ChevronDown
                        className="w-5 h-5 flex-none transition-transform group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content
                    className="overflow-hidden data-[state=open]:animate-[slideDown_220ms_ease-out] data-[state=closed]:animate-[slideUp_180ms_ease-in]"
                  >
                    <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft" style={{ color: "var(--color-ink-soft)" }}>
                      {item.a}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </div>
      ))}

      <style jsx global>{`
        @keyframes slideDown {
          from { height: 0; opacity: 0; }
          to { height: var(--radix-accordion-content-height); opacity: 1; }
        }
        @keyframes slideUp {
          from { height: var(--radix-accordion-content-height); opacity: 1; }
          to { height: 0; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
