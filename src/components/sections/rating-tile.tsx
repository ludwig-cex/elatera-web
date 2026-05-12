import { Star } from "lucide-react";

export function RatingTile({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
        style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" style={{ color: "var(--color-copper)" }} />
          ))}
        </div>
        <div className="text-sm">
          <span className="font-medium">4,8 / 5,0</span>
          <span className="text-muted ml-1.5">aus über 1.200 Bewertungen</span>
        </div>
      </div>
    );
  }
  return (
    <div
      className="rounded-2xl p-7 text-center max-w-sm mx-auto"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex justify-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current" style={{ color: "var(--color-copper)" }} />
        ))}
      </div>
      <div className="serif text-3xl leading-none mb-1" style={{ color: "var(--color-ink)" }}>
        4,8 / 5,0
      </div>
      <div className="text-sm" style={{ color: "var(--color-muted)" }}>
        aus über 1.200 verifizierten Bewertungen
      </div>
    </div>
  );
}
