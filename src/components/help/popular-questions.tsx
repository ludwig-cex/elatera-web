import { ArrowRight } from "lucide-react";
import { getPopularArticles } from "@/lib/help-center";

export function PopularQuestions() {
  const items = getPopularArticles();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((it, i) => (
        <a
          key={i}
          href={`#${it.article.q.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`}
          className="group rounded-lg p-5 flex flex-col gap-3 transition hover:opacity-90"
          style={{
            background: "var(--color-cream)",
            border: "1px solid rgba(31,59,50,0.08)",
          }}
        >
          <div className="eyebrow" style={{ color: "var(--color-muted)" }}>
            {it.categoryTitle}
          </div>
          <div className="serif text-lg leading-tight flex-1">{it.article.q}</div>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium transition group-hover:gap-2"
            style={{ color: "var(--color-forest)" }}
          >
            Antwort ansehen
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </a>
      ))}
    </div>
  );
}
