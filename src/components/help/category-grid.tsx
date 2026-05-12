import { Package, PillBottle, RefreshCw, Repeat, CreditCard, Info } from "lucide-react";
import { HELP_CATEGORIES, type HelpCategory } from "@/lib/help-center";

const ICONS = {
  package: Package,
  pillbottle: PillBottle,
  refresh: RefreshCw,
  repeat: Repeat,
  creditcard: CreditCard,
  info: Info,
} as const;

function categoryIcon(icon: HelpCategory["icon"]) {
  const Icon = ICONS[icon];
  return <Icon className="w-6 h-6" />;
}

export function CategoryGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {HELP_CATEGORIES.map((cat) => (
        <a
          key={cat.slug}
          href={`#${cat.slug}`}
          className="group rounded-2xl p-6 transition hover:-translate-y-0.5"
          style={{
            background: "var(--color-ivory)",
            border: "1px solid rgba(31,59,50,0.08)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div
            className="w-11 h-11 rounded-full mb-4 flex items-center justify-center"
            style={{ background: "var(--color-cream)", color: "var(--color-forest)" }}
          >
            {categoryIcon(cat.icon)}
          </div>
          <h3 className="serif text-xl leading-tight mb-1">{cat.title}</h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-muted)" }}>
            {cat.description}
          </p>
          <div
            className="text-xs uppercase tracking-widest font-medium transition group-hover:opacity-70"
            style={{ color: "var(--color-forest)" }}
          >
            {cat.articles.length} Beiträge ›
          </div>
        </a>
      ))}
    </div>
  );
}
