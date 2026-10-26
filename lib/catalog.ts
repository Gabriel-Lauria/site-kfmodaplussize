// Ajudantes do catálogo usados no site e no painel (sem dependência de servidor).
import { SIZE_PRESETS } from "@/config";
import type { Product, Variant } from "./types";

const KNOWN_ORDER: string[] = Object.values(SIZE_PRESETS).flat();

export function sortSizes(sizes: string[]) {
  const rank = (s: string) => {
    const i = KNOWN_ORDER.indexOf(s);
    if (i >= 0) return i;
    const n = Number(s);
    return Number.isFinite(n) ? 1000 + n : 5000;
  };
  return [...new Set(sizes)].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

// Monta cores, tamanhos e estoque total a partir das variações.
export function summarizeVariants(variants: Variant[]) {
  const colors: Product["colors"] = [];
  for (const v of variants) if (!colors.some((c) => c.name === v.color)) colors.push({ name: v.color, hex: v.hex });
  return {
    colors,
    sizes: sortSizes(variants.map((v) => v.size)),
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
  };
}

export function stockFor(product: Product, color: string, size: string) {
  return product.variants.find((v) => v.color === color && v.size === size)?.stock ?? 0;
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number | null | undefined) {
  return value == null ? "" : BRL.format(value);
}

// Preço que vale agora (promocional, se houver).
export function currentPrice(p: Pick<Product, "price" | "salePrice">) {
  return p.salePrice ?? p.price;
}

// Enquanto a pessoa digita: mesma limpeza, mas sem cortar o hífen do fim (senão não dá para digitá-lo).
// Ao sair do campo, slugify() termina a limpeza.
export function slugTyping(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 80);
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// "5541995385799" -> "(41) 99538-5799"
export function phoneLabel(digits: string) {
  const m = digits.replace(/\D/g, "").match(/^(?:55)?(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits;
}

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function instagramHandle(url: string) {
  const m = url.match(/instagram\.com\/([^/?#]+)/i);
  return m ? `@${m[1]}` : url;
}

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Etiqueta do canto da foto: "Esgotado" tem prioridade sobre a etiqueta da peça.
export function productBadge(product: Pick<Product, "stock" | "salePrice" | "price" | "tag">) {
  if (product.stock <= 0) return "Esgotado";
  if (product.salePrice != null && product.price != null) return product.tag ?? "Promoção";
  return product.tag;
}
