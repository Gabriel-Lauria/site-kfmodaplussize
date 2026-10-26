import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/client";
import { ProductForm } from "@/components/admin/ProductForm";
import { StockPanel } from "@/components/admin/StockPanel";
import { Card, CardTitle, Notice, PageHeader, StockBadge } from "@/components/admin/ui";
import { adminCategories, adminProduct } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Editar peça" };

const REASONS: Record<string, string> = { inicial: "Estoque inicial", entrada: "Entrada", venda: "Venda", troca: "Troca", ajuste: "Ajuste" };
const DATE = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ salvo?: string }> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { sb } = await requireAdmin();
  const [product, categories, history] = await Promise.all([
    adminProduct(sb, id),
    adminCategories(sb),
    sb.from("stock_movements").select("id, label, delta, stock_after, reason, note, created_at").eq("product_id", id).order("created_at", { ascending: false }).limit(30),
  ]);
  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={product.name}
        back={{ href: "/admin/produtos", label: "Peças" }}
        action={
          product.active && (
            <Link href={`/catalogo/${product.slug}`} target="_blank" className="inline-flex min-h-11 items-center text-base font-medium text-primary">
              Ver no site ↗
            </Link>
          )
        }
      />
      {sp.salvo && <div className="mb-5"><Notice tone="ok">Peça cadastrada. Você pode continuar editando aqui.</Notice></div>}

      <ProductForm product={product} categories={categories} />

      <div id="estoque" className="mt-8 scroll-mt-20 space-y-5">
        <Card>
          <CardTitle aside={<StockBadge stock={product.stock} min={product.minStock} />}>Estoque</CardTitle>
          {product.variants.length ? (
            <StockPanel variants={product.variants} />
          ) : (
            <p className="text-muted">Cadastre cores e tamanhos acima e salve para controlar o estoque.</p>
          )}
        </Card>

        <Card>
          <CardTitle>Histórico de estoque</CardTitle>
          {history.data?.length ? (
            <ul className="-mx-1 divide-y divide-ink/10">
              {history.data.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-3 px-1 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {REASONS[m.reason] ?? m.reason} · {m.label}
                    </p>
                    <p className="text-base text-muted">
                      {DATE.format(new Date(m.created_at))}
                      {m.note && <> · {m.note}</>}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-semibold tabular-nums ${m.delta > 0 ? "text-emerald-700" : "text-red-700"}`}>{m.delta > 0 ? `+${m.delta}` : m.delta}</p>
                    <p className="text-base tabular-nums text-muted">fica {m.stock_after}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Nenhuma movimentação ainda.</p>
          )}
        </Card>

        <Card className="border-red-200">
          <CardTitle>Excluir peça</CardTitle>
          <p className="text-muted">Apaga a peça, as variações e as fotos. Para só tirar do site, use “Mostrar no site” acima.</p>
          <form action={deleteProduct} className="mt-4">
            <input type="hidden" name="id" value={product.id} />
            <ConfirmButton message={`Excluir “${product.name}” e todas as fotos? Isso não pode ser desfeito.`}>Excluir peça</ConfirmButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
