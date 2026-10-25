"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls, useMotionValueEvent, useScroll } from "motion/react";
import { CONTACT, waLink } from "@/lib/data";
import { lockScroll } from "@/lib/lenis";
import { FlowerMark } from "./FlowerMark";
import { useSelection } from "./Selection";
import { Heart, WhatsApp } from "./Icons";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/lojas", label: "Nossas lojas" },
];

const ANNOUNCEMENTS = [
  "10 lojas em Curitiba e São José dos Pinhais",
  `Compre pelo WhatsApp ${CONTACT.whatsappLabel}`,
  `Novidades toda semana no ${CONTACT.instagramHandle}`,
];

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
        <div className="overflow-hidden bg-wine-deep py-2 text-[11px] uppercase tracking-[0.18em] text-blush">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
                {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
                  <span key={i} className="flex items-center gap-6 px-6">
                    {a}
                    <FlowerMark mono="#E2589B" className="h-2.5 w-2.5" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <nav className="border-b border-ink/5 bg-paper/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-8">
            <Link href="/" className="group flex items-center gap-2.5" aria-label="Espaço Flor, início">
              <motion.span whileHover={{ rotate: 120 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="block">
                <FlowerMark className="h-9 w-9" />
              </motion.span>
              <span className="font-display text-xl tracking-tight">
                Espaço <em className="text-wine">Flor</em>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {LINKS.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <li key={l.href} className="relative">
                    <Link href={l.href} className={`relative z-10 block px-4 py-2 text-sm transition-colors ${active ? "text-paper" : "text-ink/75 hover:text-ink"}`}>
                      {l.label}
                    </Link>
                    {active && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-wine" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
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
                        className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-paper"
                      >
                        {items.length}
                      </motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <a
                href={waLink("Olá! Vim pelo site da Espaço Flor.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-wine sm:flex"
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
            className="fixed inset-0 z-[75] flex flex-col justify-end bg-wine-deep px-6 pb-12 pt-32 text-paper md:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <FlowerMark mono="#ffffff10" className="pointer-events-none absolute -right-24 top-24 h-80 w-80" />
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <Link href={l.href} className="font-display text-5xl">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 space-y-2 text-sm text-blush">
              <a href={waLink("Olá! Vim pelo site da Espaço Flor.")} className="block">WhatsApp {CONTACT.whatsappLabel}</a>
              <a href={CONTACT.instagram} className="block">Instagram {CONTACT.instagramHandle}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
