import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Optimierte Varianten 31 Tage cachen statt 4 h — verhindert den
    // wiederkehrenden Cold-Encode beim Erstbesuch. Achtung: Cache ist nicht
    // invalidierbar; beim Austausch eines Bildes die Datei umbenennen.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
