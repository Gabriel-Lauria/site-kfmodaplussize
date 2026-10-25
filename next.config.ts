import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // permite gerar o build de produção numa pasta separada enquanto o `next dev` usa .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
