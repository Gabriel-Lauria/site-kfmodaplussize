"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  pieces: "M8 3l4 3 4-3 3 4-3 2v12H8V9L5 7l3-4z",
  reviews: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z",
  content: "M4 5h16v14H4z M4 15l4-4 4 4 3-3 5 5",
  categories: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
};

const LINKS = [
  { href: "/admin", label: "Início", icon: ICONS.home },
  { href: "/admin/produtos", label: "Peças", icon: ICONS.pieces },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: ICONS.reviews },
  { href: "/admin/conteudo", label: "Site", icon: ICONS.content },
  { href: "/admin/categorias", label: "Categorias", icon: ICONS.categories },
];

export function AdminNav({ pending }: { pending: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const item = (l: (typeof LINKS)[number], mobile: boolean) => {
    const active = isActive(l.href);
    return (
      <Link
        key={l.href}
        href={l.href}
        aria-current={active ? "page" : undefined}
        className={
          mobile
            ? `relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[12px] font-medium ${active ? "text-primary" : "text-ink/60"}`
            : `flex min-h-11 items-center gap-3 rounded-xl px-3 text-base font-medium transition ${active ? "bg-primary/10 text-primary-deep" : "text-ink/70 hover:bg-ink/5"}`
        }
      >
        <span className="relative">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden>
            <path d={l.icon} />
          </svg>
          {l.href === "/admin/avaliacoes" && pending > 0 && (
            <span className="absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{pending}</span>
          )}
        </span>
        {l.label}
      </Link>
    );
  };

  return (
    <>
      <nav aria-label="Painel" className="hidden space-y-1 lg:block">
        {LINKS.map((l) => item(l, false))}
      </nav>
      <nav aria-label="Painel" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {LINKS.map((l) => item(l, true))}
      </nav>
    </>
  );
}
