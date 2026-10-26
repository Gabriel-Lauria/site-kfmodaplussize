import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const { sb, user } = await requireAdmin();
  const { count } = await sb.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending");

  return (
    <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[220px_1fr] lg:gap-8 lg:px-6">
      <aside className="lg:sticky lg:top-0 lg:h-dvh lg:py-6">
        <div className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-2 lg:mb-6 lg:block lg:border-0 lg:bg-transparent lg:p-0">
          <Link href="/admin" className="flex min-h-11 items-center gap-2" aria-label="Início do painel">
            <Logo markClassName="h-8 w-8" textClassName="font-display text-lg" imageClassName="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-1 lg:mt-4 lg:flex-col lg:items-stretch lg:gap-1">
            <Link href="/" target="_blank" className="inline-flex min-h-11 items-center rounded-lg px-3 text-base text-muted hover:text-ink">
              Ver site ↗
            </Link>
            <form action={logout}>
              <button className="inline-flex min-h-11 items-center rounded-lg px-3 text-base text-muted hover:text-ink" title={user.email}>
                Sair
              </button>
            </form>
          </div>
        </div>
        <AdminNav pending={count ?? 0} />
      </aside>
      <main className="px-4 pb-28 pt-5 sm:px-6 lg:px-0 lg:pb-16 lg:pt-8">{children}</main>
    </div>
  );
}
