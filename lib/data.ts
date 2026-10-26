import "server-only";
import { unstable_cache } from "next/cache";
import { CATEGORIES, EDITORIAL, HOME_CATEGORIES, PRODUCTS } from "@/config";
import { DEFAULT_CONTENT } from "./content";
import { slugify, summarizeVariants } from "./catalog";
import { imageUrl } from "./images";
import { createPublicClient } from "./supabase/server";
import { hasSupabase } from "./supabase/env";
import type { Category, ContentKey, Product, Review, SiteContent, SiteData, Variant } from "./types";

// Tag de cache: o painel chama revalidateTag(SITE_TAG) depois de salvar qualquer coisa.
export const SITE_TAG = "site";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | string | null;
  sale_price: number | string | null;
  tag: string | null;
  featured: boolean;
  category: { name: string; slug: string } | null;
  images: { path: string; position: number }[];
  variants: { id: string; size: string; color: string; color_hex: string; stock: number; position: number }[];
};

const num = (v: number | string | null) => (v == null ? null : Number(v));

export function toProduct(row: ProductRow): Product {
  const images = [...row.images].sort((a, b) => a.position - b.position).map((i) => imageUrl(i.path));
  const variants: Variant[] = [...row.variants]
    .sort((a, b) => a.position - b.position)
    .map((v) => ({ id: v.id, size: v.size, color: v.color, hex: v.color_hex, stock: v.stock }));
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category?.name ?? "",
    categorySlug: row.category?.slug ?? "",
    price: num(row.price),
    salePrice: num(row.sale_price),
    images,
    image: images[0] ?? "",
    hoverImage: images[1],
    tag: row.tag ?? undefined,
    featured: row.featured,
    variants,
    ...summarizeVariants(variants),
  };
}

export const PRODUCT_SELECT =
  "id, slug, name, description, price, sale_price, tag, featured, category:categories(name, slug), images:product_images(path, position), variants:product_variants(id, size, color, color_hex, stock, position)";

async function loadFromSupabase(): Promise<SiteData> {
  const sb = createPublicClient();
  const [products, categories, reviews, content] = await Promise.all([
    sb.from("products").select(PRODUCT_SELECT).eq("active", true).order("created_at", { ascending: false }),
    sb.from("categories").select("id, name, slug, image_path, show_on_home").eq("active", true).order("position"),
    sb
      .from("reviews")
      .select("id, name, city, rating, comment, featured, created_at")
      .eq("status", "approved")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(24),
    sb.from("site_content").select("key, value"),
  ]);
  const error = products.error || categories.error || reviews.error || content.error;
  if (error) throw new Error(`Supabase: ${error.message}`);

  const saved = Object.fromEntries((content.data ?? []).map((c) => [c.key, c.value])) as Partial<SiteContent>;
  const merged = Object.fromEntries(
    (Object.keys(DEFAULT_CONTENT) as ContentKey[]).map((k) => [k, { ...DEFAULT_CONTENT[k], ...(saved[k] ?? {}) }]),
  ) as unknown as SiteContent;
  // imagens do conteúdo também podem ser caminhos do Storage
  merged.hero = { ...merged.hero, image: imageUrl(merged.hero.image), imageSecondary: imageUrl(merged.hero.imageSecondary) };
  merged.about = { ...merged.about, image: imageUrl(merged.about.image) };
  merged.promo = { ...merged.promo, image: imageUrl(merged.promo.image) };

  return {
    products: (products.data as unknown as ProductRow[]).map(toProduct),
    categories: (categories.data ?? []).map(
      (c): Category => ({ id: c.id, name: c.name, slug: c.slug, image: imageUrl(c.image_path) || undefined, showOnHome: c.show_on_home }),
    ),
    reviews: (reviews.data ?? []).map(
      (r): Review => ({ id: r.id, name: r.name, city: r.city ?? undefined, rating: r.rating, comment: r.comment, featured: r.featured, createdAt: r.created_at }),
    ),
    content: merged,
    source: "supabase",
  };
}

// Sem Supabase: as peças de config/products.ts, com 2 unidades por variação.
export function staticSiteData(): SiteData {
  const featured = new Set<string>(EDITORIAL.products.slugs);
  const products = PRODUCTS.map((p): Product => {
    const variants = p.colors.flatMap((c) =>
      p.sizes.map((s) => ({ id: `${p.slug}-${c.name}-${s}`, size: s, color: c.name, hex: c.hex, stock: 2 })),
    );
    const images = [p.image, p.hoverImage].filter(Boolean) as string[];
    return {
      id: p.slug,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      categorySlug: slugify(p.category),
      price: null,
      salePrice: null,
      images,
      image: p.image,
      hoverImage: p.hoverImage,
      tag: p.tag,
      featured: featured.has(p.slug),
      variants,
      ...summarizeVariants(variants),
    };
  });
  const categories = CATEGORIES.map(
    (name): Category => ({
      id: slugify(name),
      name,
      slug: slugify(name),
      image: HOME_CATEGORIES.find((c) => c.name === name)?.image ?? PRODUCTS.find((p) => p.category === name)?.image,
      showOnHome: HOME_CATEGORIES.some((c) => c.name === name),
    }),
  );
  return { products, categories, reviews: [], content: DEFAULT_CONTENT, source: "static" };
}

const cachedSupabase = unstable_cache(loadFromSupabase, ["site-data"], { tags: [SITE_TAG], revalidate: 600 });

export async function getSiteData(): Promise<SiteData> {
  return hasSupabase ? cachedSupabase() : staticSiteData();
}
