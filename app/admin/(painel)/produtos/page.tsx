import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { toggleProduct } from "@/app/admin/actions";
import { Badge, Empty, Notice, PageHeader, StockBadge, btn, input } from "@/components/admin/ui";
import { adminCategories, adminProducts, stockState } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/catalog";

export const metadata: Metadata = { title: "Peças" };

type Search = { q?: string; categoria?: string; status?: string; estoque?: string; aviso?: string };

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { sb } = await requireAdmin();
  const [products, categories] = await Promise.all([adminProducts(sb), adminCategories(sb)]);

  const q = norm(sp.q ?? "");
  const list = products.filter((p) => {
    if (q && !norm(`${p.name} ${p.slug} ${p.tag}`).includes(q)) return false;
    if (sp.categoria && p.categoryId !== sp.categoria) return false;
    if (sp.status === "ativas" && !p.active) return false;
    if (sp.status === "ocultas" && p.active) return false;
    if (sp.status === "destaque" && !p.featured) return false;
    if (sp.estoque === "baixo" && stockState(p) !== "low") return false;
    if (sp.estoque === "esgotado" && stockState(p) !== "out") return false;
    return true;
  });
  const filtered = Boolean(q || sp.categoria || sp.status || sp.estoque);

  return (
    <>
      <PageHeader title="Peças" subtitle={`${products.length} cadastradas`} action={<Link href="/admin/produtos/nova" className={btn.primary}>+ Nova peça</Link>} />
      {sp.aviso === "excluida" && <div className="mb-4"><Notice tone="ok">Peça excluída, com as fotos.</Notice></div>}

      <form className="mb-5 grid gap-2 rounded-2xl border border-ink/10 bg-white p-3 sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto] sm:items-end" role="search">
        <label className="sr-only" htmlFor="q">Buscar</label>
        <input id="q" name="q" type="search" defaultValue={sp.q} placeholder="Buscar por nome" className={`${input} mt-0`} enterKeyHint="search" />
        <select name="categoria" defaultValue={sp.categoria ?? ""} className={`${input} mt-0`} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className={`${input} mt-0`} aria-label="Status">
          <option value="">Qualquer status</option>
          <option value="ativas">No site</option>
          <option value="ocultas">Ocultas</option>
          <option value="destaque">Em destaque</option>
        </select>
        <select name="estoque" defaultValue={sp.estoque ?? ""} className={`${input} mt-0`} aria-label="Estoque">
          <option value="">Qualquer estoque</option>
          <option value="baixo">Estoque baixo</option>
          <option value="esgotado">Esgotadas</option>
        </select>
        <div className="flex gap-2">
          <button className={`${btn.dark} flex-1 sm:flex-none`}>Filtrar</button>
          {filtered && <Link href="/admin/produtos" className={btn.ghost}>Limpar</Link>}
        </div>
      </form>

      {list.length ? (
        <ul className="space-y-2">
          {list.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-2.5 sm:gap-4 sm:p-3">
              <Link href={`/admin/produtos/${p.id}`} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="64px" className={`object-cover ${p.active ? "" : "opacity-50 grayscale"}`} />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/produtos/${p.id}`} className="block truncate font-medium hover:text-primary">{p.name}</Link>
                <p className="text-base text-muted">
                  {p.category} · {p.salePrice != null ? <><span className="text-primary">{formatPrice(p.salePrice)}</span> <s>{formatPrice(p.price)}</s></> : p.price != null ? formatPrice(p.price) : "sem preço"}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <StockBadge stock={p.stock} min={p.minStock} />
                  {!p.active && <Badge>Oculta</Badge>}
                  {p.featured && <Badge tone="brand">Destaque</Badge>}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                <form action={toggleProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="field" value="active" />
                  <input type="hidden" name="value" value={String(!p.active)} />
                  <button className={`${btn.small} w-full`} aria-label={p.active ? `Ocultar ${p.name} do site` : `Mostrar ${p.name} no site`}>
                    {p.active ? "Ocultar" : "Mostrar"}
                  </button>
                </form>
                <Link href={`/admin/produtos/${p.id}`} className={btn.small}>Editar</Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title={filtered ? "Nenhuma peça com esses filtros" : "Nenhuma peça ainda"}>
          {filtered ? <Link href="/admin/produtos" className="text-primary underline">Limpar filtros</Link> : <Link href="/admin/produtos/nova" className="text-primary underline">Cadastrar a primeira</Link>}
        </Empty>
      )}
    </>
  );
}
