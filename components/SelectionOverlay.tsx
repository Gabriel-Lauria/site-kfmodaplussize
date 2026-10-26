"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { BRAND, CTA } from "@/config";
import type { Product } from "@/lib/types";
import { useSelection, type Flight } from "./Selection";
import { useSite } from "./SiteData";

// Gaveta "Minha seleção" e a foto que voa até o coração. Fica num arquivo à parte (carregado
// sob demanda) porque usa a biblioteca motion, que não precisa pesar na primeira tela.
export function SelectionOverlay({ flights, onLanded }: { flights: Flight[]; onLanded: (id: number) => void }) {
  return (
    <MotionConfig reducedMotion="user">
        {flights.map((f) => (
          <motion.div
            key={f.id}
            className="pointer-events-none fixed left-0 top-0 z-[130] h-16 w-16 overflow-hidden rounded-full border-2 border-paper shadow-xl"
            initial={{ x: f.from.left + f.from.width / 2 - 32, y: f.from.top + f.from.height / 2 - 32, scale: 1 }}
            animate={{
              x: f.to.left + f.to.width / 2 - 32,
              y: [f.from.top + f.from.height / 2 - 32, f.from.top - 120, f.to.top + f.to.height / 2 - 32],
              scale: [1, 1.15, 0.25],
            }}
            transition={{ duration: 0.85, ease: [0.5, 0, 0.2, 1], y: { duration: 0.85, times: [0, 0.35, 1] } }}
            onAnimationComplete={() => onLanded(f.id)}
          >
            <Image src={f.image} alt="" fill sizes="64px" className="object-cover" />
          </motion.div>
        ))}
        <SelectionDrawer />
    </MotionConfig>
  );
}

function SelectionDrawer() {
  const { items, open, setOpen, toggle } = useSelection();
  const { find, wa } = useSite();
  const products = items.map(find).filter(Boolean) as Product[];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const message = CTA.selection(products.map((p) => p.name));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[95] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Minha seleção"
            data-lenis-prevent
            className="fixed right-0 top-0 z-[96] flex h-dvh w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Minha seleção</p>
                <h2 className="font-display text-2xl">{products.length} {products.length === 1 ? "peça" : "peças"}</h2>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full transition hover:rotate-90 hover:bg-cream" aria-label="Fechar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {products.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted">
                  <p className="font-display text-xl italic text-ink">Nada por aqui ainda</p>
                  <p className="mt-2 max-w-64">Toque no coração das peças que você amar. Depois é só mandar a lista pra gente no WhatsApp.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {products.map((p) => (
                      <motion.li
                        key={p.slug}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                        className="flex items-center gap-4 rounded-2xl bg-cream/70 p-3"
                      >
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl">
                          <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-widest text-muted">{p.category}</p>
                          <p className="font-display text-lg leading-tight">{p.name}</p>
                        </div>
                        <button onClick={() => toggle(p.slug)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition hover:bg-paper hover:text-primary" aria-label={`Remover ${p.name}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-ink/10 p-6">
              <a
                href={products.length ? wa(message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!products.length}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition ${
                  products.length ? "bg-primary text-paper hover:bg-primary-deep" : "pointer-events-none bg-ink/10 text-muted"
                }`}
              >
                {CTA.selectionButton}
              </a>
              <p className="mt-3 text-center text-sm text-muted">{BRAND.selection.footer}</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
