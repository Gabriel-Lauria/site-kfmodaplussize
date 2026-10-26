import "server-only";
import { summarizeVariants } from "./catalog";
import { imageUrl } from "./images";
import type { requireAdmin } from "./auth";
import type { Variant } from "./types";

type Sb = Awaited<ReturnType<typeof requireAdmin>>["sb"];

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string | null;
  category: string;
  price: number | null;
  salePrice: number | null;
  tag: string;
  featured: boolean;
  active: boolean;
  minStock: number;
  images: { path: string; url: string }[];
  variants: Variant[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  updatedAt: string;
};

const SELECT =
  "id, slug, name, description, category_id, price, sale_price, tag, featured, active, min_stock, updated_at, category:categories(name), images:product_images(path, position), variants:product_variants(id, size, color, color_hex, stock, position)";

type Row = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string | null;
  price: string | number | null;
  sale_price: string | number | null;
  tag: string | null;
  featured: boolean;
  active: boolean;
  min_stock: number;
  updated_at: string;
  category: { name: string } | null;
  images: { path: string; position: number }[];
  variants: { id: string; size: string; color: string; color_hex: string; stock: number; position: number }[];
};

function map(r: Row): AdminProduct {
  const variants = [...r.variants].sort((a, b) => a.position - b.position).map((v) => ({ id: v.id, size: v.size, color: v.color, hex: v.color_hex, stock: v.stock }));
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    categoryId: r.category_id,
    category: r.category?.name ?? "Sem categoria",
    price: r.price == null ? null : Number(r.price),
    salePrice: r.sale_price == null ? null : Number(r.sale_price),
    tag: r.tag ?? "",
    featured: r.featured,
    active: r.active,
    minStock: r.min_stock,
    images: [...r.images].sort((a, b) => a.position - b.position).map((i) => ({ path: i.path, url: imageUrl(i.path) })),
    variants,
    ...summarizeVariants(variants),
    updatedAt: r.updated_at,
  };
}

export async function adminProducts(sb: Sb) {
  const { data, error } = await sb.from("products").select(SELECT).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as unknown as Row[]).map(map);
}

export async function adminProduct(sb: Sb, id: string) {
  const { data } = await sb.from("products").select(SELECT).eq("id", id).maybeSingle();
  return data ? map(data as unknown as Row) : null;
}

export async function adminCategories(sb: Sb) {
  const { data, error } = await sb.from("categories").select("id, name, slug, image_path, position, active, show_on_home").order("position");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export function stockState(p: Pick<AdminProduct, "stock" | "minStock">) {
  return p.stock <= 0 ? "out" : p.stock <= p.minStock ? "low" : "ok";
}
