// Testa supabase/schema.sql e seed.sql num Postgres em memória (PGlite), com stubs de auth e storage.
// uso: npm run test:sql
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const read = (f: string) => readFileSync(new URL(`../supabase/${f}`, import.meta.url), "utf8");
const ADMIN = "00000000-0000-0000-0000-000000000001";
const OTHER = "00000000-0000-0000-0000-000000000002";

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? "ok  " : "FALHOU"} ${name}${ok || detail === undefined ? "" : ` -> ${JSON.stringify(detail)}`}`);
  if (!ok) failed++;
}

async function main() {
  const db = new PGlite();
  // o mínimo do Supabase que o schema usa
  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create schema storage;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
  `);

  await db.exec(read("schema.sql"));
  await db.exec(read("schema.sql")); // pode rodar de novo
  await db.exec(read("seed.sql"));
  await db.exec(read("seed.sql")); // e o seed também

  const one = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows[0];
  const count = async (sql: string) => Number((await one<{ n: number }>(sql))?.n);

  check("seed: 22 peças", (await count("select count(*) n from products")) === 22);
  check("seed: 5 categorias", (await count("select count(*) n from categories")) === 5);
  check("seed: variações sem duplicar", (await count("select count(*) n from product_variants")) === (await count("select count(*) n from (select distinct product_id, size, color from product_variants) x")));
  check("seed: conteúdo do site", (await count("select count(*) n from site_content")) === 5);

  // papel sem privilégios de dono, como o anon/authenticated do Supabase
  await db.exec(`
    create role tester;
    grant usage on schema public, storage to tester;
    grant select, insert, update, delete on all tables in schema public to tester;
    grant select, insert, update, delete on storage.objects to tester;
    grant usage on all sequences in schema public to tester;
    grant execute on all functions in schema public to tester;
    insert into auth.users values ('${ADMIN}', 'dona@loja.com'), ('${OTHER}', 'visitante@x.com');
    insert into admins values ('${ADMIN}');
    insert into reviews (name, rating, comment, status) values ('Ana', 5, 'Amei o atendimento e o caimento!', 'approved');
    update products set active = false where slug = 'conjunto-suede-marsala';
  `);

  const as = async (user: string | null) => {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${user ?? ""}', false); set role tester;`);
  };

  // --- público
  await as(null);
  check("público vê só peças ativas", (await count("select count(*) n from products")) === 21);
  check("público não vê fotos de peça oculta", (await count("select count(*) n from product_images i join products p on p.id = i.product_id where p.slug = 'conjunto-suede-marsala'")) === 0);
  check("público vê só avaliações aprovadas", (await count("select count(*) n from reviews")) === 1);
  check("público não vê histórico de estoque", (await count("select count(*) n from stock_movements")) === 0);
  const deny = async (name: string, sql: string) => {
    try {
      const r = await db.query(sql);
      check(name, (r.affectedRows ?? 0) === 0, `afetou ${r.affectedRows} linhas`);
    } catch (e) {
      // 42501 = barrado pela RLS (qualquer outro erro seria um teste quebrado)
      check(name, (e as { code?: string }).code === "42501", e);
    }
  };
  await deny("público não cria peça", "insert into products (slug, name) values ('x', 'X')");
  await deny("público não altera peça", "update products set name = 'hack'");
  await deny("público não cria avaliação direto", "insert into reviews (name, rating, comment) values ('Bot', 5, 'spam spam spam')");
  await deny("público não altera conteúdo", "update site_content set value = '{}'");
  try {
    await db.query("select adjust_stock((select id from product_variants limit 1), 5, 'entrada')");
    check("público não ajusta estoque", false);
  } catch (e) {
    check("público não ajusta estoque", (e as { code?: string }).code === "42501", e);
  }

  // --- usuário logado que não é admin
  await as(OTHER);
  await deny("logada sem ser admin não altera peça", "update products set name = 'hack'");
  check("logada sem ser admin não vê peça oculta", (await count("select count(*) n from products")) === 21);

  // --- admin
  await as(ADMIN);
  check("admin vê peça oculta", (await count("select count(*) n from products")) === 22);
  const cat = await one<{ id: string }>("select id from categories where slug = 'vestidos'");
  const created = await one<{ r: { id: string; removed: string[] } }>("select save_product($1::jsonb) r", [
    JSON.stringify({
      slug: "vestido-teste",
      name: "Vestido Teste",
      description: "d",
      category_id: cat.id,
      price: "199.90",
      sale_price: "159.90",
      featured: true,
      active: true,
      min_stock: 3,
      images: ["produtos/a.webp", "produtos/b.webp"],
      colors: [
        { name: "Preto", hex: "#111111" },
        { name: "Vinho", hex: "#6e1e2b" },
      ],
      sizes: ["46", "48"],
      initial_stock: { "46|Preto": 4, "48|Vinho": 1 },
    }),
  ]);
  const pid = created.r.id;
  check("save_product cria 4 variações", (await count(`select count(*) n from product_variants where product_id = '${pid}'`)) === 4);
  check("save_product registra estoque inicial", (await count(`select count(*) n from stock_movements where product_id = '${pid}' and reason = 'inicial'`)) === 2);

  const v = await one<{ id: string }>(`select id from product_variants where product_id = '${pid}' and size = '46' and color = 'Preto'`);
  const after = await one<{ s: number }>("select adjust_stock($1, -3, 'venda', 'loja física') s", [v.id]);
  check("adjust_stock baixa o estoque", after.s === 1);
  try {
    await db.query("select adjust_stock($1, -5, 'venda')", [v.id]);
    check("estoque não fica negativo", false);
  } catch (e) {
    check("estoque não fica negativo", (e as { code?: string }).code === "23514", e);
  }
  check("histórico com a venda", (await count(`select count(*) n from stock_movements where variant_id = '${v.id}' and reason = 'venda' and delta = -3 and stock_after = 1`)) === 1);

  const updated = await one<{ r: { id: string; removed: string[] } }>("select save_product($1::jsonb) r", [
    JSON.stringify({
      id: pid,
      slug: "vestido-teste",
      name: "Vestido Teste 2",
      category_id: cat.id,
      price: "199.90",
      images: ["produtos/b.webp", "produtos/c.webp"],
      colors: [{ name: "Preto", hex: "#000000" }],
      sizes: ["46", "48", "50"],
    }),
  ]);
  check("save_product devolve foto removida", JSON.stringify(updated.r.removed) === JSON.stringify(["produtos/a.webp"]), updated.r.removed);
  check("save_product mantém estoque das variações que ficaram", (await one<{ stock: number }>(`select stock from product_variants where id = '${v.id}'`)).stock === 1);
  check("save_product remove a cor que saiu", (await count(`select count(*) n from product_variants where product_id = '${pid}' and color = 'Vinho'`)) === 0);
  check("save_product cria o tamanho novo zerado", (await count(`select count(*) n from product_variants where product_id = '${pid}' and size = '50' and stock = 0`)) === 1);
  check("histórico continua depois de apagar variação", (await count(`select count(*) n from stock_movements where product_id = '${pid}' and label like '%Vinho'`)) === 1);
  const order = (await db.query<{ path: string }>(`select path from product_images where product_id = '${pid}' order by position`)).rows.map((r) => r.path);
  check("ordem das fotos", order.join(",") === "produtos/b.webp,produtos/c.webp", order);

  try {
    await db.query("select save_product($1::jsonb)", [JSON.stringify({ slug: "vestido-teste", name: "Dup", images: [], colors: [], sizes: [] })]);
    check("slug repetido é recusado", false);
  } catch (e) {
    check("slug repetido é recusado", String((e as { code?: string }).code) === "23505", e);
  }
  try {
    await db.query("select save_product($1::jsonb)", [JSON.stringify({ slug: "promo-errada", name: "X", price: "100", sale_price: "120", images: [], colors: [], sizes: [] })]);
    check("promoção maior que o preço é recusada", false);
  } catch (e) {
    check("promoção maior que o preço é recusada", (e as { code?: string }).code === "23514", e);
  }

  const paths = await one<{ p: string[] }>("select delete_product($1) p", [pid]);
  check("delete_product devolve as fotos", paths.p.join(",") === "produtos/b.webp,produtos/c.webp", paths.p);
  check("delete_product apaga variações em cascata", (await count(`select count(*) n from product_variants where product_id = '${pid}'`)) === 0);

  await db.exec("reset role;");
  console.log(failed ? `\n${failed} teste(s) falharam` : "\ntudo certo");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
