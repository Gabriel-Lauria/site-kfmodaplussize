// Gera supabase/seed.sql a partir de config/products.ts e do conteúdo padrão (lib/content.ts).
// uso: npm run seed:sql
// O seed pode rodar mais de uma vez: não duplica nem sobrescreve o que já foi editado no painel.
import { writeFileSync } from "node:fs";
import { CATEGORIES, EDITORIAL, HOME_CATEGORIES, PRODUCTS } from "@/config";
import { DEFAULT_CONTENT } from "@/lib/content";
import { slugify } from "@/lib/catalog";

// estoque de exemplo de cada variação (ajuste no painel)
const SAMPLE_STOCK = 2;

const q = (v: string | null | undefined) => (v == null ? "null" : `'${v.replace(/'/g, "''")}'`);
const featured = new Set<string>(EDITORIAL.products.slugs);

const out: string[] = [
  "-- Gerado por scripts/gerar-seed.ts (npm run seed:sql). Rode depois do schema.sql.",
  "-- As fotos apontam para /public/brand/products do próprio site; troque pelo painel quando quiser.",
  `-- Preços ficam em branco (o site mostra "Consulte") e cada variação começa com ${SAMPLE_STOCK} unidades.`,
  "",
  "-- Categorias",
];

CATEGORIES.forEach((name, i) => {
  const home = HOME_CATEGORIES.find((c) => c.name === name);
  const image = home?.image ?? PRODUCTS.find((p) => p.category === name)?.image ?? null;
  out.push(
    `insert into public.categories (name, slug, image_path, position, show_on_home) values (${q(name)}, ${q(slugify(name))}, ${q(image)}, ${i}, ${Boolean(home)}) on conflict (slug) do nothing;`,
  );
});

out.push("", "-- Peças");
// a primeira da lista fica como a mais recente
PRODUCTS.forEach((p, i) => {
  const created = `now() - interval '${i} minutes'`;
  out.push(
    "",
    `-- ${p.name}`,
    `insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)`,
    `select ${q(p.slug)}, ${q(p.name)}, ${q(p.description)}, (select id from public.categories where slug = ${q(slugify(p.category))}), ${q(p.tag ?? null)}, ${featured.has(p.slug)}, 2, ${created}`,
    `on conflict (slug) do nothing;`,
  );
  const images = [p.image, p.hoverImage].filter(Boolean) as string[];
  out.push(
    `insert into public.product_images (product_id, path, position)`,
    `select p.id, v.path, v.pos from public.products p, (values ${images.map((src, j) => `(${q(src)}, ${j})`).join(", ")}) as v (path, pos)`,
    `where p.slug = ${q(p.slug)} and not exists (select 1 from public.product_images i where i.product_id = p.id);`,
  );
  const variants = p.colors.flatMap((c, ci) => p.sizes.map((s, si) => `(${q(s)}, ${q(c.name)}, ${q(c.hex)}, ${(ci + 1) * 100 + si + 1})`));
  out.push(
    `insert into public.product_variants (product_id, size, color, color_hex, stock, position)`,
    `select p.id, v.size, v.color, v.hex, ${SAMPLE_STOCK}, v.pos from public.products p, (values ${variants.join(", ")}) as v (size, color, hex, pos)`,
    `where p.slug = ${q(p.slug)}`,
    `on conflict (product_id, size, color) do nothing;`,
  );
});

out.push("", "-- Conteúdo do site");
for (const [key, value] of Object.entries(DEFAULT_CONTENT)) {
  out.push(`insert into public.site_content (key, value) values (${q(key)}, ${q(JSON.stringify(value))}::jsonb) on conflict (key) do nothing;`);
}

out.push(
  "",
  "-- Uma avaliação pendente de exemplo, só para testar a moderação (pode excluir no painel)",
  `insert into public.reviews (name, city, rating, comment, status)`,
  `select 'Exemplo', 'Curitiba', 5, 'Avaliação de teste: aprove, recuse ou exclua no painel para ver como funciona.', 'pending'`,
  `where not exists (select 1 from public.reviews);`,
  "",
);

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), out.join("\n"));
console.log(`supabase/seed.sql: ${CATEGORIES.length} categorias, ${PRODUCTS.length} peças`);
