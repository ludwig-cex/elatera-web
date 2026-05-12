/**
 * Nutrasana Logo — Variant 10 from design system
 * "Outlined Circle" with Cormorant N inside.
 */

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "horizontal" | "stacked" | "mark-only";
  color?: "forest" | "ivory" | "ink";
};

export function NutrasanaLogo({ className, variant = "horizontal", color = "forest" }: LogoProps) {
  const colorMap = {
    forest: "var(--color-forest)",
    ivory: "var(--color-ivory)",
    ink: "var(--color-ink)",
  };
  const c = colorMap[color];

  if (variant === "mark-only") {
    return (
      <svg
        className={cn("inline-block", className)}
        width="40"
        height="40"
        viewBox="0 0 120 120"
        fill="none"
        aria-label="Nutrasana"
      >
        <circle cx="60" cy="60" r="56" fill="none" stroke={c} strokeWidth="3" />
        <text
          x="60"
          y="85"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontWeight="500"
          fontSize="86"
          fill={c}
        >
          N
        </text>
      </svg>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={cn("inline-flex flex-col items-center gap-2", className)}>
        <svg width="56" height="56" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={c} strokeWidth="3" />
          <text
            x="60"
            y="85"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontWeight="500"
            fontSize="86"
            fill={c}
          >
            N
          </text>
        </svg>
        <span
          className="serif text-2xl leading-none tracking-tight"
          style={{ color: c }}
        >
          Nutrasana
        </span>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-3", className)} aria-label="Nutrasana">
      <svg width="36" height="36" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill="none" stroke={c} strokeWidth="3.5" />
        <text
          x="60"
          y="85"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontWeight="500"
          fontSize="86"
          fill={c}
        >
          N
        </text>
      </svg>
      <span
        className="serif text-2xl leading-none tracking-tight"
        style={{ color: c }}
      >
        Nutrasana
      </span>
    </div>
  );
}

