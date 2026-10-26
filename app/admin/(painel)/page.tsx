import Image from "next/image";
import Link from "next/link";
import { MaintenanceCard } from "@/components/admin/MaintenanceCard";
import { Badge, Card, CardTitle, PageHeader, StockBadge, btn } from "@/components/admin/ui";
import { adminProducts, stockState } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export default async function Dashboard() {
  const { sb } = await requireAdmin();
  const [products, pending] = await Promise.all([
    adminProducts(sb),
    sb.from("reviews").select("id, name, rating, comment, created_at", { count: "exact" }).eq("status", "pending").order("created_at", { ascending: false }).limit(3),
  ]);

  const active = products.filter((p) => p.active);
  const alerts = active.filter((p) => stockState(p) !== "ok").sort((a, b) => a.stock - b.stock);
  const out = alerts.filter((p) => p.stock <= 0).length;
  const pendingList = pending.data ?? [];
  const pendingCount = pending.count ?? pendingList.length;

  const stats = [
    { label: "Peças no site", value: active.length, sub: `${products.length - active.length} ocultas`, href: "/admin/produtos" },
    { label: "Estoque baixo", value: alerts.length - out, sub: "no mínimo ou abaixo", href: "/admin/produtos?estoque=baixo", tone: alerts.length - out ? "text-amber-700" : "" },
    { label: "Esgotadas", value: out, sub: "sem nenhuma unidade", href: "/admin/produtos?estoque=esgotado", tone: out ? "text-red-700" : "" },
    { label: "Avaliações", value: pendingCount, sub: "esperando aprovação", href: "/admin/avaliacoes", tone: pendingCount ? "text-primary" : "" },
  ];

  return (
    <>
      <PageHeader title="Olá!" subtitle="Um resumo da loja hoje." action={<Link href="/admin/produtos/nova" className={btn.primary}>+ Nova peça</Link>} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-ink/10 bg-white p-4 transition hover:border-primary/40 sm:p-5">
            <p className="text-base text-muted">{s.label}</p>
            <p className={`mt-1 font-display text-5xl leading-none ${s.tone ?? ""}`}>{s.value}</p>
            <p className="mt-2 text-base text-muted">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardTitle aside={alerts.length > 0 && <Badge tone={out ? "red" : "amber"}>{alerts.length}</Badge>}>Alertas de estoque</CardTitle>
          {alerts.length ? (
            <ul className="-mx-2 divide-y divide-ink/10">
              {alerts.slice(0, 12).map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/produtos/${p.id}#estoque`} className="flex min-h-16 items-center gap-3 rounded-xl px-2 py-2 hover:bg-ink/[0.03]">
                    <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-cream">
                      {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{p.name}</span>
                      <span className="text-base text-muted">Mínimo: {p.minStock}</span>
                    </span>
                    <StockBadge stock={p.stock} min={p.minStock} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Tudo em ordem: nenhuma peça abaixo do estoque mínimo.</p>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardTitle aside={<Link href="/admin/avaliacoes" className="text-base font-medium text-primary">Ver todas</Link>}>Avaliações novas</CardTitle>
            {pendingList.length ? (
              <ul className="space-y-3">
                {pendingList.map((r) => (
                  <li key={r.id} className="rounded-xl bg-cream/60 p-3">
                    <p className="text-highlight" aria-label={`${r.rating} estrelas`}>{"★".repeat(r.rating)}</p>
                    <p className="mt-1 line-clamp-2">{r.comment}</p>
                    <p className="mt-1 text-base text-muted">{r.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Nenhuma avaliação esperando.</p>
            )}
          </Card>
          <MaintenanceCard />
        </div>
      </div>
    </>
  );
}
