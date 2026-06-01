import type { Metadata } from "next";

// Legal pages (Impressum/AGB/Datenschutz/Widerruf) stay reachable for users
// but are kept out of the search index while texts are still placeholders.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PoliciesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
