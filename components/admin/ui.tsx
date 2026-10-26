// Peças visuais do painel. Tudo com área de toque de 44px e texto de 16px (o iPhone não dá zoom em campos).
import Link from "next/link";

export const input =
  "mt-1.5 block w-full min-h-12 rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-primary focus:ring-2 focus:ring-primary/15 aria-[invalid=true]:border-accent";
export const label = "block text-base font-medium text-ink";
export const hint = "mt-1 block text-base font-normal text-muted";

const BTN = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition disabled:opacity-50";
export const btn = {
  primary: `${BTN} bg-primary text-white hover:bg-primary-deep`,
  dark: `${BTN} bg-ink text-white hover:bg-ink/85`,
  ghost: `${BTN} border border-ink/15 bg-white text-ink hover:border-ink/40`,
  danger: `${BTN} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`,
  small: "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-ink/15 bg-white px-3 text-base font-medium text-ink transition hover:border-ink/40 disabled:opacity-50",
};

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6 ${className}`}>{children}</section>;
}

export function CardTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">{children}</h2>
      {aside}
    </div>
  );
}

export function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: { href: string; label: string }; action?: React.ReactNode }) {
  return (
    <header className="mb-5 sm:mb-8">
      {back && (
        <Link href={back.href} className="-ml-2 mb-1 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-base text-muted hover:text-ink">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl leading-none sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

const BADGE = {
  green: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/15",
  gray: "bg-ink/5 text-ink/70 ring-ink/10",
  brand: "bg-primary/10 text-primary-deep ring-primary/20",
};

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: keyof typeof BADGE }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[13px] font-medium ring-1 ring-inset ${BADGE[tone]}`}>{children}</span>;
}

export function StockBadge({ stock, min }: { stock: number; min: number }) {
  if (stock <= 0) return <Badge tone="red">Esgotada</Badge>;
  if (stock <= min) return <Badge tone="amber">Estoque baixo · {stock}</Badge>;
  return <Badge tone="green">{stock} em estoque</Badge>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "ok" | "error"; children: React.ReactNode }) {
  const styles = { info: "border-ink/10 bg-cream text-ink", ok: "border-emerald-200 bg-emerald-50 text-emerald-900", error: "border-red-200 bg-red-50 text-red-800" };
  return (
    <p className={`rounded-xl border px-4 py-3 text-base ${styles[tone]}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 bg-white/50 px-6 py-12 text-center">
      <p className="font-display text-2xl">{title}</p>
      {children && <div className="mt-2 text-muted">{children}</div>}
    </div>
  );
}
