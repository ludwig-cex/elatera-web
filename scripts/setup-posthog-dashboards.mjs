// PostHog dashboard + insight setup (one-time / re-runnable).
// Run:
//   cd elatera-web
//   node --env-file=.env.local scripts/setup-posthog-dashboards.mjs
//
// Needs POSTHOG_PERSONAL_API_KEY in .env.local (Personal API Key with
// insight:write + dashboard:write scopes). Optional: POSTHOG_PROJECT_ID
// (auto-detected from /api/projects/ otherwise) and POSTHOG_API_HOST
// (defaults to https://eu.posthog.com).
//
// Idempotent: searches by exact name and skips existing dashboards/insights.
// To recreate after deletions just delete them in PostHog UI and re-run.

const KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const HOST = (process.env.POSTHOG_API_HOST || "https://eu.posthog.com").replace(/\/$/, "");

if (!KEY) {
  console.error(
    "POSTHOG_PERSONAL_API_KEY fehlt. Lege ihn in elatera-web/.env.local an:\n" +
      "  POSTHOG_PERSONAL_API_KEY=phx_…\n\n" +
      "Erstellen in PostHog: Settings → Personal API Keys → Create. Scopes:\n" +
      "  insight:read, insight:write, dashboard:read, dashboard:write, project:read",
  );
  process.exit(1);
}

const SHOP_HOST = "www.nutra-sana.com";
const AD_HOST = "www.mein-apothekenrat.de";

async function api(method, path, body) {
  const res = await fetch(`${HOST}/api${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${path} -> HTTP ${res.status}: ${txt.slice(0, 400)}`);
  }
  return txt ? JSON.parse(txt) : null;
}

let projectId = process.env.POSTHOG_PROJECT_ID;
if (!projectId) {
  const r = await api("GET", "/projects/");
  const p = r.results?.[0];
  if (!p) {
    console.error("Keine Projekte gefunden — prüfe den Personal API Key.");
    process.exit(1);
  }
  projectId = p.id;
  console.log(`→ Projekt: "${p.name}" (id ${projectId})`);
}

async function findDashboard(name) {
  const r = await api(
    "GET",
    `/projects/${projectId}/dashboards/?search=${encodeURIComponent(name)}`,
  );
  return r.results?.find((d) => d.name === name);
}

async function ensureDashboard(name, description) {
  const ex = await findDashboard(name);
  if (ex) {
    console.log(`= Dashboard existiert: ${name} (id ${ex.id})`);
    return ex.id;
  }
  const d = await api("POST", `/projects/${projectId}/dashboards/`, {
    name,
    description,
  });
  console.log(`+ Dashboard angelegt: ${name} (id ${d.id})`);
  return d.id;
}

async function findInsight(name) {
  const r = await api(
    "GET",
    `/projects/${projectId}/insights/?search=${encodeURIComponent(name)}`,
  );
  return r.results?.find((i) => i.name === name);
}

async function ensureInsight(name, query, dashboards, description = "") {
  const ex = await findInsight(name);
  if (ex) {
    console.log(`= Insight existiert: ${name}`);
    return ex.id;
  }
  const ins = await api("POST", `/projects/${projectId}/insights/`, {
    name,
    description,
    query,
    dashboards,
  });
  console.log(`+ Insight angelegt: ${name}`);
  return ins.id;
}

// ---- Helpers für Query-Bau ----

const hostFilter = (host) => ({
  type: "AND",
  values: [
    { key: "$host", value: host, operator: "exact", type: "event" },
  ],
});

const ev = (event, math = null, math_property = null) => {
  const node = { kind: "EventsNode", event };
  if (math) node.math = math;
  if (math_property) node.math_property = math_property;
  return node;
};

const dr = (days = 30) => ({ date_from: `-${days}d` });

const breakdown = (key, type = "event") => ({
  breakdownFilter: { breakdown_type: type, breakdown: key },
});

const trends = ({ series, properties, breakdown: bd, days = 30, displayType }) => ({
  kind: "InsightVizNode",
  source: {
    kind: "TrendsQuery",
    series,
    dateRange: dr(days),
    ...(properties ? { properties } : {}),
    ...(bd ? bd : {}),
    ...(displayType
      ? { trendsFilter: { display: displayType } }
      : {}),
  },
});

const funnel = ({ series, properties, days = 30 }) => ({
  kind: "InsightVizNode",
  source: {
    kind: "FunnelsQuery",
    series,
    dateRange: dr(days),
    ...(properties ? { properties } : {}),
    funnelsFilter: { funnelOrderType: "ordered" },
  },
});

// ============================================================================
// 1) Dashboards anlegen
// ============================================================================

const DASH_SHOP = await ensureDashboard(
  "Nutra-Sana Shop — Funnel & Cart",
  "Conversion-Funnel bis zur E-Mail-Eintragung, Warenkorb-Verhalten, Inhalte. Filter: $host = www.nutra-sana.com",
);
const DASH_AD = await ensureDashboard(
  "Mein Apothekenrat — Advertorial",
  "Advertorial-Reichweite, CTA-Klicks zum Shop, Quellen. Filter: $host = www.mein-apothekenrat.de",
);
const DASH_X = await ensureDashboard(
  "Cross-Site Funnel — Advertorial → Shop → Lead",
  "End-to-End-Funnel über beide Domains hinweg",
);

// ============================================================================
// 2) Shop-Insights (Nutra-Sana)
// ============================================================================

await ensureInsight(
  "Shop · Conversion-Funnel (Pageview → Email-Intent)",
  funnel({
    series: [
      ev("$pageview"),
      ev("product_viewed"),
      ev("add_to_cart"),
      ev("checkout_clicked"),
      ev("intent_email_submitted"),
    ],
    properties: hostFilter(SHOP_HOST),
  }),
  [DASH_SHOP, DASH_X],
  "Wer kommt wie weit. Drop-off pro Stufe.",
);

await ensureInsight(
  "Shop · Cart-Abandonment (Zur-Kasse → Email-Intent)",
  funnel({
    series: [ev("checkout_clicked"), ev("intent_email_submitted")],
    properties: hostFilter(SHOP_HOST),
  }),
  [DASH_SHOP],
  "Wieviele bleiben am Out-of-Stock-Formular hängen.",
);

await ensureInsight(
  "Shop · Tägliche Sessions",
  trends({
    series: [ev("$pageview", "unique_session")],
    properties: hostFilter(SHOP_HOST),
  }),
  [DASH_SHOP],
);

await ensureInsight(
  "Shop · add_to_cart pro Produkt",
  trends({
    series: [ev("add_to_cart")],
    properties: hostFilter(SHOP_HOST),
    breakdown: breakdown("product"),
  }),
  [DASH_SHOP],
);

await ensureInsight(
  "Shop · add_to_cart nach Bundle (Monate)",
  trends({
    series: [ev("add_to_cart")],
    properties: hostFilter(SHOP_HOST),
    breakdown: breakdown("months"),
  }),
  [DASH_SHOP],
);

await ensureInsight(
  "Shop · Spar-Abo-Anteil bei add_to_cart",
  trends({
    series: [ev("add_to_cart")],
    properties: hostFilter(SHOP_HOST),
    breakdown: breakdown("subscription"),
  }),
  [DASH_SHOP],
);

await ensureInsight(
  "Shop · Ø Warenkorbwert (€)",
  trends({
    series: [ev("add_to_cart", "avg", "value")],
    properties: hostFilter(SHOP_HOST),
    displayType: "ActionsLineGraph",
  }),
  [DASH_SHOP],
);

await ensureInsight(
  "Shop · intent_email_submitted (Leads/Tag)",
  trends({
    series: [ev("intent_email_submitted")],
    properties: hostFilter(SHOP_HOST),
  }),
  [DASH_SHOP, DASH_X],
  "Die Kern-KPI im Pre-Launch.",
);

await ensureInsight(
  "Shop · Top-Pfade ($pageview)",
  trends({
    series: [ev("$pageview")],
    properties: hostFilter(SHOP_HOST),
    breakdown: breakdown("$pathname"),
    displayType: "ActionsBarValue",
  }),
  [DASH_SHOP],
);

await ensureInsight(
  "Shop · Traffic nach utm_source",
  trends({
    series: [ev("$pageview", "unique_session")],
    properties: hostFilter(SHOP_HOST),
    breakdown: breakdown("utm_source"),
  }),
  [DASH_SHOP, DASH_X],
);

await ensureInsight(
  "Shop · cart_opened (Drawer-Öffnungen)",
  trends({
    series: [ev("cart_opened")],
    properties: hostFilter(SHOP_HOST),
  }),
  [DASH_SHOP],
);

// ============================================================================
// 3) Advertorial-Insights (Mein Apothekenrat)
// ============================================================================

await ensureInsight(
  "Advertorial · Tägliche Sessions",
  trends({
    series: [ev("$pageview", "unique_session")],
    properties: hostFilter(AD_HOST),
  }),
  [DASH_AD],
);

await ensureInsight(
  "Advertorial · Pageviews je Artikel",
  trends({
    series: [ev("$pageview")],
    properties: hostFilter(AD_HOST),
    breakdown: breakdown("$pathname"),
    displayType: "ActionsBarValue",
  }),
  [DASH_AD],
);

await ensureInsight(
  "Advertorial · advertorial_cta_click (gesamt)",
  trends({
    series: [ev("advertorial_cta_click")],
    properties: hostFilter(AD_HOST),
  }),
  [DASH_AD, DASH_X],
);

await ensureInsight(
  "Advertorial · CTA-Klicks je Artikel",
  trends({
    series: [ev("advertorial_cta_click")],
    properties: hostFilter(AD_HOST),
    breakdown: breakdown("article"),
  }),
  [DASH_AD],
);

await ensureInsight(
  "Advertorial · CTA-Rate (Pageview → CTA-Klick)",
  funnel({
    series: [ev("$pageview"), ev("advertorial_cta_click")],
    properties: hostFilter(AD_HOST),
  }),
  [DASH_AD, DASH_X],
);

await ensureInsight(
  "Advertorial · Traffic nach utm_source",
  trends({
    series: [ev("$pageview", "unique_session")],
    properties: hostFilter(AD_HOST),
    breakdown: breakdown("utm_source"),
  }),
  [DASH_AD, DASH_X],
);

// ============================================================================
// 4) Cross-Site Funnel (Advertorial → Shop → Lead)
// ============================================================================

await ensureInsight(
  "Cross-Site · Advertorial-Pageview → CTA → Shop-Pageview → Add-to-Cart → Email-Intent",
  {
    kind: "InsightVizNode",
    source: {
      kind: "FunnelsQuery",
      series: [
        {
          kind: "EventsNode",
          event: "$pageview",
          properties: [
            { key: "$host", value: AD_HOST, operator: "exact", type: "event" },
          ],
        },
        { kind: "EventsNode", event: "advertorial_cta_click" },
        {
          kind: "EventsNode",
          event: "$pageview",
          properties: [
            { key: "$host", value: SHOP_HOST, operator: "exact", type: "event" },
          ],
        },
        { kind: "EventsNode", event: "add_to_cart" },
        { kind: "EventsNode", event: "intent_email_submitted" },
      ],
      dateRange: dr(30),
      funnelsFilter: { funnelOrderType: "ordered" },
    },
  },
  [DASH_X],
  "Der gesamte bezahlte Funnel über beide Domains hinweg.",
);

console.log("\nFertig — Dashboards stehen in PostHog unter:");
console.log(`  ${HOST.replace("/api", "")}/project/${projectId}/dashboard`);
