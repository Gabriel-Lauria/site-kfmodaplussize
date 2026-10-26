import type { Metadata } from "next";
import Link from "next/link";
import { moderateReview } from "@/app/admin/actions";
import { ConfirmButton, SubmitButton } from "@/components/admin/client";
import { Badge, Empty, PageHeader, btn } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Avaliações" };

const TABS = [
  { status: "pending", label: "Pendentes" },
  { status: "approved", label: "Aprovadas" },
  { status: "rejected", label: "Recusadas" },
] as const;
type Status = (typeof TABS)[number]["status"];

const DATE = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" });

function Op({ id, op, children, className = btn.small }: { id: string; op: string; children: React.ReactNode; className?: string }) {
  return (
    <form action={moderateReview}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="op" value={op} />
      <SubmitButton pending="..." className={className}>{children}</SubmitButton>
    </form>
  );
}

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const status: Status = TABS.some((t) => t.status === sp.status) ? (sp.status as Status) : "pending";
  const { sb } = await requireAdmin();
  const [list, counts] = await Promise.all([
    sb.from("reviews").select("id, name, city, rating, comment, status, featured, created_at").eq("status", status).order("featured", { ascending: false }).order("created_at", { ascending: false }).limit(100),
    Promise.all(TABS.map((t) => sb.from("reviews").select("id", { count: "exact", head: true }).eq("status", t.status))),
  ]);
  const reviews = list.data ?? [];

  return (
    <div className="max-w-3xl">
      <PageHeader title="Avaliações" subtitle="Só as aprovadas aparecem no site. As destacadas vêm primeiro." />

      <nav className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4" aria-label="Filtrar por status">
        {TABS.map((t, i) => (
          <Link
            key={t.status}
            href={`/admin/avaliacoes?status=${t.status}`}
            aria-current={status === t.status ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-base font-medium ${status === t.status ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70"}`}
          >
            {t.label} <span className="tabular-nums opacity-70">{counts[i].count ?? 0}</span>
          </Link>
        ))}
      </nav>

      {reviews.length ? (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg text-highlight" aria-label={`${r.rating} de 5 estrelas`}>
                  {"★".repeat(r.rating)}
                  <span className="text-ink/15">{"★".repeat(5 - r.rating)}</span>
                </p>
                <div className="flex gap-1.5">
                  {r.featured && <Badge tone="brand">Destaque</Badge>}
                  <span className="text-base text-muted">{DATE.format(new Date(r.created_at))}</span>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-line leading-relaxed">{r.comment}</p>
              <p className="mt-2 text-base text-muted">
                {r.name}
                {r.city && <> · {r.city}</>}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.status !== "approved" && <Op id={r.id} op="approve" className={`${btn.small} border-emerald-300 bg-emerald-50 text-emerald-800`}>Aprovar</Op>}
                {r.status !== "rejected" && <Op id={r.id} op="reject">Recusar</Op>}
                {r.status === "approved" && <Op id={r.id} op={r.featured ? "unfeature" : "feature"}>{r.featured ? "Tirar destaque" : "Destacar na página inicial"}</Op>}
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="op" value="delete" />
                  <ConfirmButton message="Excluir esta avaliação de vez?" className={`${btn.small} text-red-700`}>Excluir</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title={status === "pending" ? "Nenhuma avaliação esperando" : "Nada por aqui"}>
          {status === "pending" && "Quando uma cliente avaliar pelo site, ela aparece aqui para você aprovar."}
        </Empty>
      )}
    </div>
  );
}
