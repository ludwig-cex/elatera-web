/**
 * SVG-Mockup of the Elatera product box.
 * Pure SVG — no actual photography needed.
 * Adapted from the packaging.jsx design system file.
 */

import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  className?: string;
  width?: number;
  height?: number;
};

export function ProductMockup({ product, className, width = 520, height = 320 }: Props) {
  const p = product.palette;

  return (
    <div
      className={className}
      style={{
        width,
        maxWidth: "100%",
        aspectRatio: `${width} / ${height}`,
        background: p.bg,
        borderRadius: 8,
        boxShadow: "0 14px 40px -16px rgba(40,30,20,.28), inset 0 1px 0 rgba(255,255,255,.5)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        color: p.ink,
      }}
    >
      {/* Spine */}
      <div
        style={{
          width: 38,
          flex: "none",
          borderRight: `1px solid ${p.spineLine}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: p.spine,
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: ".46em",
            textTransform: "uppercase",
            fontSize: 11,
            color: p.spineInk,
            fontWeight: 500,
            fontFamily: "var(--font-sans)",
          }}
        >
          ELATERA
        </div>
      </div>

      {/* Main face */}
      <div style={{ flex: 1, padding: "22px 22px 18px 26px", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 40,
              lineHeight: 1,
              fontWeight: 500,
              color: p.ink,
            }}
          >
            Elatera
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontStyle: "italic",
              lineHeight: 1,
              color: p.subInk,
              fontWeight: 500,
            }}
          >
            {product.variant.toLowerCase()}
          </span>
          <sup style={{ fontFamily: "var(--font-serif)", fontSize: 12, color: p.subInk }}>®</sup>
        </div>

        <div
          style={{
            marginTop: 12,
            alignSelf: "flex-start",
            background: p.badge,
            color: p.badgeText,
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 500,
            letterSpacing: ".01em",
          }}
        >
          {product.tagline}*
        </div>

        <div style={{ marginTop: 14, maxWidth: "58%", display: "flex", flexDirection: "column", gap: 7 }}>
          {product.ingredients.slice(0, 2).map((ing, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, lineHeight: 1.35 }}>
              <svg width={13} height={13} viewBox="0 0 16 16" style={{ flex: "none", marginTop: 1 }}>
                <circle cx="8" cy="8" r="7.2" fill="none" stroke={p.badge} strokeWidth="1.1" opacity=".5" />
                <path d="M4.6 8.2 L7 10.6 L11.4 5.6" stroke={p.badge} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{ing.name}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,.55)",
              border: `1px solid ${p.spineLine}`,
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 10.5,
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.badge, display: "inline-block" }} />
            30 Kapseln
          </div>
          <span style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: p.subInk }}>
            1 × täglich
          </span>
        </div>

        {/* Capsule visual */}
        <div style={{ position: "absolute", right: -10, bottom: 4, width: 220, height: 160, pointerEvents: "none" }}>
          <svg viewBox="0 0 220 160" width="100%" height="100%">
            <defs>
              <radialGradient id={`halo-${product.slug}`} cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#fff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="110" cy="80" r="78" fill={`url(#halo-${product.slug})`} />
            {[0, 1, 2].map((i) => {
              const x = 40 + i * 50;
              return (
                <g key={i} transform={`translate(${x},48) rotate(8 30 32)`}>
                  <rect x="0" y="0" width="60" height="64" rx="30" fill="#fafafa" stroke="#cfc9bb" strokeWidth=".7" />
                  <line x1="0" y1="32" x2="60" y2="32" stroke="#cfc9bb" strokeWidth=".7" />
                  <path d="M0 32 L60 32 L60 34 A30 30 0 0 1 0 34 Z" fill={p.capsule} opacity=".88" />
                  <ellipse cx="20" cy="14" rx="10" ry="4" fill="#fff" opacity=".55" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
