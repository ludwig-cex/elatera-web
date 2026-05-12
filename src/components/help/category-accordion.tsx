"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { HELP_CATEGORIES } from "@/lib/help-center";

export function CategoryAccordion() {
  return (
    <div className="space-y-10">
      {HELP_CATEGORIES.map((cat) => (
        <section key={cat.slug} id={cat.slug} className="scroll-mt-28">
          <div className="mb-5">
            <div className="eyebrow mb-2">Kategorie</div>
            <h2 className="serif text-2xl sm:text-3xl leading-tight">{cat.title}</h2>
            <p className="text-sm mt-1.5" style={{ color: "var(--color-muted)" }}>
              {cat.description}
            </p>
          </div>

          <Accordion.Root type="multiple" className="space-y-2">
            {cat.articles.map((item, idx) => {
              const value = `${cat.slug}-${idx}`;
              return (
                <Accordion.Item
                  key={value}
                  value={value}
                  className="rounded-lg overflow-hidden"
                  style={{
                    background: "var(--color-ivory)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition hover:bg-[var(--color-cream)]">
                      <span className="serif text-lg leading-tight">{item.q}</span>
                      <Plus
                        className="w-5 h-5 flex-none transition-transform group-data-[state=open]:rotate-45"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_220ms_ease-out] data-[state=closed]:animate-[slideUp_180ms_ease-in]">
                    <div
                      className="px-5 pb-5 text-[15px] leading-relaxed"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {item.a}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </section>
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
