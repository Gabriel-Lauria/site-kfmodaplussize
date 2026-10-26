"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { BRAND } from "@/config";
import { ProductCard } from "./ProductCard";
import { SplitWords } from "./motion-utils";
import { useSelection } from "./Selection";
import { useSite } from "./SiteData";
import { Heart } from "./Icons";

// a janela rápida só é baixada quando alguém abre uma peça
const QuickView = dynamic(() => import("./QuickView").then((m) => m.QuickView), { ssr: false });

// O filtro inicial vem do servidor (a página já chega filtrada); depois tudo muda no navegador,
// atualizando a URL sem recarregar, para o link continuar compartilhável.
export function Catalog({ initialCategory, initialPiece }: { initialCategory: string | null; initialPiece: string | null }) {
  const { items, setOpen } = useSelection();
  const { products, categories, find } = useSite();
  const [params, setParams] = useState({ categoria: initialCategory, peca: initialPiece });

  // voltar/avançar do navegador
  useEffect(() => {
    const onPop = () => {
      const sp = new URLSearchParams(window.location.search);
      setParams({ categoria: sp.get("categoria"), peca: sp.get("peca") });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // só as categorias que têm peça; aceita o slug ou o nome antigo na URL
  const tabs = useMemo(() => categories.filter((c) => products.some((p) => p.categorySlug === c.slug)), [categories, products]);
  const active = tabs.find((c) => c.slug === params.categoria || c.name === params.categoria) ?? null;
  const openProduct = find(params.peca ?? "");

  const setParam = useCallback((key: "categoria" | "peca", value: string | null) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value };
      const sp = new URLSearchParams();
      if (next.categoria) sp.set("categoria", next.categoria);
      if (next.peca) sp.set("peca", next.peca);
      const qs = sp.toString();
      window.history.replaceState(window.history.state, "", qs ? `/catalogo?${qs}` : "/catalogo");
      return next;
    });
  }, []);

  // disponíveis primeiro, esgotadas no fim
  const list = useMemo(
    () => products.filter((p) => !active || p.categorySlug === active.slug).sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0)),
    [products, active],
  );
  const close = useCallback(() => setParam("peca", null), [setParam]);

  const pill = (selected: boolean) =>
    `relative min-h-11 shrink-0 rounded-full px-4 text-[15px] transition-colors ${selected ? "text-paper" : "text-ink/70 hover:text-ink"}`;

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-4 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Coleção atual</p>
            <h1 className="mt-3 font-display text-[clamp(3.25rem,10vw,8rem)] font-light leading-[0.9] tracking-tight">
              <SplitWords text="Catálogo" onView={false} delay={0.4} />
            </h1>
          </div>
          <p className="max-w-sm text-ink/75">{BRAND.catalog.intro}</p>
        </div>
      </section>

      <div className="sticky top-[6.1rem] z-30 border-y border-ink/5 bg-paper/85 backdrop-blur-xl transition-[top] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] [html[data-header-hidden]_&]:top-0">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-2 sm:px-8">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Categorias">
            {[{ slug: "", name: "Todas" }, ...tabs].map((c) => {
              const selected = (active?.slug ?? "") === c.slug;
              return (
                <button key={c.slug || "todas"} role="tab" aria-selected={selected} onClick={() => setParam("categoria", c.slug || null)} className={pill(selected)}>
                  {selected && <span className="pop absolute inset-0 rounded-full bg-primary" />}
                  <span className="relative">{c.name}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => setOpen(true)} className="hidden min-h-11 shrink-0 items-center gap-2 rounded-full border border-ink/10 px-4 text-sm transition hover:border-primary hover:text-primary sm:flex">
            <Heart className="h-4 w-4" /> Minha seleção ({items.length})
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10">
        <p className="mb-6 text-muted" aria-live="polite">
          <span className="font-semibold text-ink">{list.length}</span> {list.length === 1 ? "peça" : "peças"}
          {active && <> em {active.name.toLowerCase()}</>}
        </p>
        <h2 className="sr-only">Peças{active && <> de {active.name.toLowerCase()}</>}</h2>
        {/* a key troca com o filtro: os cards entram de novo com um fade em CSS */}
        <div key={active?.slug ?? "todas"} className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => (
            <div key={p.slug} className={i < 4 ? "fade-up" : "fade-up cv-card"} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <ProductCard product={p} onOpen={(slug) => setParam("peca", slug)} priority={i < 2} />
            </div>
          ))}
        </div>
        {!list.length && <p className="py-20 text-center text-muted">Nenhuma peça por aqui ainda. Que tal ver todas?</p>}
      </section>

      {openProduct && <QuickView key={openProduct.slug} product={openProduct} onClose={close} />}
    </>
  );
}
