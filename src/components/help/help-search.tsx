"use client";

import { useState, useMemo } from "react";
import { Search, ArrowRight } from "lucide-react";
import { searchHelp } from "@/lib/help-center";

export function HelpSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchHelp(query), [query]);
  const showResults = query.trim().length >= 2;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          background: "var(--color-ivory)",
          boxShadow: "0 10px 32px -16px rgba(15,42,35,0.30)",
          border: "1px solid rgba(31,59,50,0.10)",
        }}
      >
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--color-muted)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wie können wir Ihnen helfen?"
          aria-label="Hilfe-Center durchsuchen"
          className="w-full pl-14 pr-5 py-4 text-base outline-none bg-transparent"
        />
      </div>

      {showResults && (
        <div
          className="mt-4 rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-ivory)",
            border: "1px solid rgba(31,59,50,0.10)",
            boxShadow: "0 14px 40px -16px rgba(15,42,35,0.22)",
          }}
        >
          {results.length === 0 ? (
            <div className="p-6 text-center text-sm" style={{ color: "var(--color-muted)" }}>
              Keine Treffer. Schreiben Sie uns gerne direkt — wir helfen persönlich weiter.
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {results.slice(0, 6).map((r, i) => (
                <li key={i}>
                  <a
                    href={`#${r.categorySlug}`}
                    className="flex items-start gap-3 p-4 transition"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-cream)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="flex-1">
                      <div
                        className="text-[11px] uppercase tracking-widest mb-1"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {r.categoryTitle}
                      </div>
                      <div className="serif text-lg leading-tight">{r.article.q}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 mt-1 flex-none opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
