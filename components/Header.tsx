"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, FEATURES, STORES_NAV } from "@/config";
import { lockScroll } from "@/lib/lenis";
import { BrandMark } from "./BrandMark";
import { Logo } from "./Logo";
import { useSelection } from "./Selection";
import { useSite } from "./SiteData";
import { Heart, WhatsApp } from "./Icons";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/lojas", label: STORES_NAV },
];

const ANNOUNCEMENTS = BRAND.announcements;
const EDITORIAL = FEATURES.layout === "editorial";
const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

// Layout editorial: um aviso por vez, centralizado, trocando a cada 4 s (transição em CSS).
function AnnouncementFade() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-[2.1rem] overflow-hidden bg-ink text-center text-[11px] uppercase tracking-[0.22em] text-paper/85">
      {ANNOUNCEMENTS.map((a, k) => (
        <p
          key={a}
          aria-hidden={k !== i}
          className={`absolute inset-0 flex items-center justify-center px-4 transition duration-500 ${EASE} ${k === i ? "translate-y-0 opacity-100" : k === (i - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"}`}
        >
          {a}
        </p>
      ))}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const { items, setOpen, bump } = useSelection();
  const site = useSite();

  // some ao rolar para baixo, volta ao rolar para cima
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > last && y > 160);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    lockScroll(menu);
  }, [menu]);

  // barras "sticky" abaixo do header (ex.: filtros do catálogo) sobem junto quando ele some
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", hidden && !menu);
  }, [hidden, menu]);

  return (
    <>
      <header className={`sticky top-0 z-[80] transition-transform duration-[450ms] ${EASE} ${hidden && !menu ? "-translate-y-full" : ""}`}>
        {EDITORIAL ? (
          <AnnouncementFade />
        ) : (
          <div className="overflow-hidden bg-primary-deep py-2 text-[11px] uppercase tracking-[0.18em] text-accent-soft">
            <div className="flex w-max animate-marquee">
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
                  {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
                    <span key={i} className="flex items-center gap-6 px-6">
                      {a}
                      <BrandMark mono="var(--color-accent)" className="h-2.5 w-2.5" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <nav className="border-b border-ink/5 bg-paper/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-8">
            <Link href="/" className="group flex min-h-11 items-center gap-2.5" aria-label={`${BRAND.name}, início`}>
              <Logo spin accent markClassName="h-9 w-9" textClassName="font-display text-xl tracking-tight" />
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {LINKS.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <li key={l.href} className="relative">
                    {EDITORIAL ? (
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors after:absolute after:inset-x-4 after:-bottom-0.5 after:h-px after:origin-left after:bg-primary after:transition-transform after:duration-500 ${active ? "text-ink after:scale-x-100" : "text-ink/60 after:scale-x-0 hover:text-ink"}`}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative block rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-primary text-paper" : "text-ink/75 hover:text-ink"}`}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                id="selection-target"
                onClick={() => setOpen(true)}
                className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-cream"
                aria-label={`Minha seleção, ${items.length} peças`}
              >
                <Heart />
                {items.length > 0 && (
                  <span key={bump} className="pop absolute -right-0.5 -top-0.5">
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-paper">{items.length}</span>
                  </span>
                )}
              </button>
              <a
                href={site.wa(BRAND.messages.default)}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden items-center gap-2 bg-ink px-4 py-2.5 text-xs font-semibold uppercase text-paper transition hover:bg-primary sm:flex ${EDITORIAL ? "tracking-[0.18em]" : "rounded-full tracking-[0.12em]"}`}
              >
                <WhatsApp className="h-4 w-4" /> Fale com a gente
              </a>
              <button onClick={() => setMenu((m) => !m)} className="relative h-11 w-11 md:hidden" aria-label="Menu" aria-expanded={menu} aria-controls="menu-celular">
                <span className={`absolute left-3 top-[17px] h-px w-5 bg-ink transition-transform duration-300 ${menu ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute left-3 top-[27px] h-px w-5 bg-ink transition-transform duration-300 ${menu ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* menu do celular: abre em círculo a partir do botão (clip-path em CSS) */}
      <div
        id="menu-celular"
        inert={!menu}
        className={`fixed inset-0 z-[75] flex flex-col justify-end bg-primary-deep px-6 pb-12 pt-32 text-paper transition-[clip-path] duration-700 ${EASE} md:hidden ${menu ? "[clip-path:circle(150%_at_92%_6%)]" : "pointer-events-none [clip-path:circle(0%_at_92%_6%)]"}`}
      >
        <BrandMark mono="#ffffff10" className="pointer-events-none absolute -right-24 top-24 h-80 w-80" />
        <ul className="space-y-2">
          {LINKS.map((l, i) => (
            <li key={l.href} className={`transition duration-500 ${EASE} ${menu ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`} style={{ transitionDelay: menu ? `${200 + i * 70}ms` : "0ms" }}>
              <Link href={l.href} className="inline-flex min-h-14 items-center font-display text-5xl">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={`mt-10 space-y-1 text-accent-soft transition-opacity duration-500 ${menu ? "opacity-100 delay-500" : "opacity-0"}`}>
          <a href={site.wa(BRAND.messages.default)} className="flex min-h-11 items-center">WhatsApp {site.whatsappLabel}</a>
          <a href={site.content.contact.instagram} className="flex min-h-11 items-center">Instagram {site.instagramHandle}</a>
        </div>
      </div>
    </>
  );
}
