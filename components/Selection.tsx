"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BRAND, CTA, PRODUCTS, storageKey, waLink, type Product } from "@/config";
import { lockScroll } from "@/lib/lenis";

type Flight = { id: number; image: string; from: DOMRect; to: DOMRect };

type Ctx = {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string, origin?: HTMLElement | null) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  bump: number;
};

const SelectionContext = createContext<Ctx | null>(null);

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection fora do SelectionProvider");
  return ctx;
}

const KEY = storageKey("selecao");

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setItems(saved.filter((s) => PRODUCTS.some((p) => p.slug === s)));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    lockScroll(open);
  }, [open]);

  const toggle = useCallback((slug: string, origin?: HTMLElement | null) => {
    setItems((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      const target = document.getElementById("selection-target");
      const product = PRODUCTS.find((p) => p.slug === slug);
      if (origin && target && product && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setFlights((f) => [...f, { id: Date.now(), image: product.image, from: origin.getBoundingClientRect(), to: target.getBoundingClientRect() }]);
      } else {
        setBump((b) => b + 1);
      }
      return [...prev, slug];
    });
  }, []);

  const has = useCallback((slug: string) => items.includes(slug), [items]);

  return (
    <SelectionContext.Provider value={{ items, has, toggle, open, setOpen, bump }}>
      {children}
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
          onAnimationComplete={() => {
            setFlights((all) => all.filter((x) => x.id !== f.id));
            setBump((b) => b + 1);
          }}
        >
          <Image src={f.image} alt="" fill sizes="64px" className="object-cover" />
        </motion.div>
      ))}
      <SelectionDrawer />
    </SelectionContext.Provider>
  );
}

function SelectionDrawer() {
  const { items, open, setOpen, toggle } = useSelection();
  const products = items.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean) as Product[];

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
              <button onClick={() => setOpen(false)} className="rounded-full p-2 transition hover:rotate-90 hover:bg-cream" aria-label="Fechar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {products.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted">
                  <p className="font-display text-xl italic text-ink">Nada por aqui ainda</p>
                  <p className="mt-2 max-w-60 text-sm">Toque no coração das peças que você amar. Depois é só mandar a lista pra gente no WhatsApp.</p>
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
                        <button onClick={() => toggle(p.slug)} className="rounded-full p-2 text-muted transition hover:bg-paper hover:text-primary" aria-label={`Remover ${p.name}`}>
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
                href={products.length ? waLink(message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!products.length}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition ${
                  products.length ? "bg-primary text-paper hover:bg-primary-deep" : "pointer-events-none bg-ink/10 text-muted"
                }`}
              >
                {CTA.selectionButton}
              </a>
              <p className="mt-3 text-center text-xs text-muted">{BRAND.selection.footer}</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
