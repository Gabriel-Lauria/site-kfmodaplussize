import type { MetadataRoute } from "next";
import { PRODUCTS, SITE_URL } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/catalogo", "/lojas"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const products = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/catalogo/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [...pages, ...products];
}
