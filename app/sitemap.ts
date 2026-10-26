import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config";
import { getSiteData } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getSiteData();
  const pages = ["", "/catalogo", "/lojas"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...products.map((p) => ({
      url: `${SITE_URL}/catalogo/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      images: p.images.slice(0, 1).map((src) => (src.startsWith("/") ? `${SITE_URL}${src}` : src)),
    })),
  ];
}
