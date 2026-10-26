"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls, useMotionValueEvent, useScroll } from "motion/react";
import { BRAND, CONTACT, FEATURES, STORES_NAV, waLink } from "@/config";
import { lockScroll } from "@/lib/lenis";
import { BrandMark } from "./BrandMark";
import { Logo } from "./Logo";
import { useSelection } from "./Selection";
import { Heart, WhatsApp } from "./Icons";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/lojas", label: STORES_NAV },
];

const ANNOUNCEMENTS = BRAND.announcements;
const EDITORIAL = FEATURES.layout === "editorial";

// Layout editorial: um aviso por vez, centralizado, trocando a cada 4 s.
function AnnouncementFade() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-[2.1rem] overflow-hidden bg-ink text-center text-[11px] uppercase tracking-[0.22em] text-paper/85">
      <AnimatePresence initial={false}>
        <motion.p
          key={i}
          className="absolute inset-0 flex items-center justify-center px-4"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {ANNOUNCEMENTS[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const { items, setOpen, bump } = useSelection();
  const badge = useAnimationControls();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });

  useEffect(() => {
    if (bump) badge.start({ scale: [1, 1.45, 0.9, 1], rotate: [0, -12, 8, 0], transition: { duration: 0.5 } });
  }, [bump, badge]);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    lockScroll(menu);
  }, [menu]);

  return (
    <>
      <motion.header
        className="sticky top-0 z-[80]"
        animate={{ y: hidden && !menu ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
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
            <Link href="/" className="group flex items-center gap-2.5" aria-label={`${BRAND.name}, início`}>
              <Logo spin accent markClassName="h-9 w-9" textClassName="font-display text-xl tracking-tight" />
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {LINKS.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <li key={l.href} className="relative">
                    {EDITORIAL ? (
                      <>
                        <Link href={l.href} className={`block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors ${active ? "text-ink" : "text-ink/60 hover:text-ink"}`}>
                          {l.label}
                        </Link>
                        {active && (
                          <motion.span layoutId="nav-line" className="absolute inset-x-4 -bottom-0.5 h-px bg-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                        )}
                      </>
                    ) : (
                      <>
                        <Link href={l.href} className={`relative z-10 block px-4 py-2 text-sm transition-colors ${active ? "text-paper" : "text-ink/75 hover:text-ink"}`}>
                          {l.label}
                        </Link>
                        {active && (
                          <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                id="selection-target"
                onClick={() => setOpen(true)}
                className="relative rounded-full p-2.5 transition hover:bg-cream"
                aria-label={`Minha seleção, ${items.length} peças`}
              >
                <Heart />
                <AnimatePresence>
                  {items.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5"
                    >
                      <motion.span
                        animate={badge}
                        className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-paper"
                      >
                        {items.length}
                      </motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <a
                href={waLink(BRAND.messages.default)}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden items-center gap-2 bg-ink px-4 py-2.5 text-xs font-semibold uppercase text-paper transition hover:bg-primary sm:flex ${EDITORIAL ? "tracking-[0.18em]" : "rounded-full tracking-[0.12em]"}`}
              >
                <WhatsApp className="h-4 w-4" /> Fale com a gente
              </a>
              <button onClick={() => setMenu((m) => !m)} className="relative h-10 w-10 md:hidden" aria-label="Menu" aria-expanded={menu}>
                <motion.span className="absolute left-2.5 top-[15px] h-px w-5 bg-ink" animate={menu ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} />
                <motion.span className="absolute left-2.5 top-[25px] h-px w-5 bg-ink" animate={menu ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[75] flex flex-col justify-end bg-primary-deep px-6 pb-12 pt-32 text-paper md:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrandMark mono="#ffffff10" className="pointer-events-none absolute -right-24 top-24 h-80 w-80" />
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <Link href={l.href} className="font-display text-5xl">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 space-y-2 text-sm text-accent-soft">
              <a href={waLink(BRAND.messages.default)} className="block">WhatsApp {CONTACT.whatsappLabel}</a>
              <a href={CONTACT.instagram} className="block">Instagram {CONTACT.instagramHandle}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
