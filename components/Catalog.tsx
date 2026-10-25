"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { BRAND, CATEGORIES, PRODUCTS, type Category } from "@/config";
import { ProductCard } from "./ProductCard";
import { QuickView } from "./QuickView";
import { SplitWords } from "./motion-utils";
import { useSelection } from "./Selection";
import { Heart } from "./Icons";

type Filter = "Todas" | Category;

export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { items, setOpen } = useSelection();

  const rawCat = params.get("categoria");
  const filter: Filter = CATEGORIES.includes(rawCat as Category) ? (rawCat as Category) : "Todas";
  const openSlug = params.get("peca");
  const openProduct = PRODUCTS.find((p) => p.slug === openSlug);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const list = useMemo(() => PRODUCTS.filter((p) => filter === "Todas" || p.category === filter), [filter]);
  const close = useCallback(() => setParam("peca", null), [setParam]);

  return (
    <LayoutGroup>
      <section className="mx-auto max-w-[1400px] px-4 pb-10 pt-14 sm:px-8 sm:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">Coleção atual</p>
            <h1 className="mt-3 font-display text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.9] tracking-tight">
              <SplitWords text="Catálogo" onView={false} delay={0.4} />
            </h1>
          </div>
          <p className="max-w-sm text-ink/70">{BRAND.catalog.intro}</p>
        </div>
      </section>

      <div className="sticky top-[6.1rem] z-30 border-y border-ink/5 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Categorias">
            {(["Todas", ...CATEGORIES] as Filter[]).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                onClick={() => setParam("categoria", c === "Todas" ? null : c)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${filter === c ? "text-paper" : "text-ink/70 hover:text-ink"}`}
              >
                {filter === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setOpen(true)} className="hidden shrink-0 items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm transition hover:border-primary hover:text-primary sm:flex">
            <Heart className="h-4 w-4" /> Minha seleção ({items.length})
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8">
        <p className="mb-6 text-sm text-muted">
          <motion.span key={list.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block font-semibold text-ink">
            {list.length}
          </motion.span>{" "}
          {list.length === 1 ? "peça" : "peças"}
          {filter !== "Todas" && <> em {filter.toLowerCase()}</>}
        </p>
        <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} onOpen={(slug) => setParam("peca", slug)} priority={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>{openProduct && <QuickView key={openProduct.slug} product={openProduct} onClose={close} />}</AnimatePresence>
    </LayoutGroup>
  );
}
