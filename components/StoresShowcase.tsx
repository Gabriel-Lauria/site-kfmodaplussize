"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BRAND, REGIONS, STORES, STORE_MAP, mapsLink, storeWhatsapp, type MapItem, type Region } from "@/config";
import { FlowerMark } from "./FlowerMark";
import { SplitWords } from "./motion-utils";
import { ArrowRight, Pin, WhatsApp } from "./Icons";

type Filter = "Todas" | Region;

function MapShape({ item }: { item: MapItem }) {
  switch (item.kind) {
    case "line":
      return <path d={item.d} fill="none" stroke="#ffffff14" strokeWidth="0.6" />;
    case "area":
      return <path d={item.d} fill="#ffffff0a" stroke="#ffffff26" strokeWidth="0.3" strokeDasharray="1 1" />;
    case "street":
      return <path d={item.d} fill="none" stroke="#F6CFDF" strokeOpacity="0.45" strokeWidth="0.5" strokeDasharray="0.8 0.8" />;
    case "label":
      return <text x={item.x} y={item.y} fill="#ffffff55" fontSize={item.size} letterSpacing={item.spacing}>{item.text}</text>;
    case "street-label":
      return <text x={item.x} y={item.y} fill="#F6CFDF99" fontSize={item.size} fontStyle="italic">{item.text}</text>;
  }
}

export function StoresShowcase({ variant = "home" }: { variant?: "home" | "page" }) {
  const [filter, setFilter] = useState<Filter>("Todas");
  const [active, setActive] = useState(STORES[0].slug);
  const visible = STORES.filter((s) => filter === "Todas" || s.region === filter);
  const store = STORES.find((s) => s.slug === active) ?? STORES[0];

  const choose = (f: Filter) => {
    setFilter(f);
    const first = STORES.find((s) => f === "Todas" || s.region === f);
    if (first) setActive(first.slug);
  };

  return (
    <section id="lojas" className="px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-[28px] bg-wine-deep px-5 py-16 text-paper sm:rounded-[36px] sm:px-10 sm:py-20 lg:px-16">
        <FlowerMark mono="#ffffff06" className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] animate-spin-slow" />

        <div className="relative flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-blush">{variant === "home" ? BRAND.stores.eyebrowHome : BRAND.stores.eyebrowPage}</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              <SplitWords text={`${STORES.length} lojas.`} />
              <br />
              <SplitWords text={BRAND.stores.titleAccent} delay={0.15} className="italic text-rose" />
            </h2>
          </div>
          <p className="max-w-sm text-paper/70">{BRAND.stores.text}</p>
        </div>

        <div className="no-scrollbar relative -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filtrar lojas por região">
          {(["Todas", ...REGIONS] as Filter[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => choose(f)}
              className={`relative shrink-0 rounded-full border px-5 py-2.5 text-sm transition-colors ${filter === f ? "border-transparent text-wine-deep" : "border-paper/20 text-paper/80 hover:border-paper/50"}`}
            >
              {filter === f && <motion.span layoutId={`region-pill-${variant}`} className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">
                {f}
                <span className="ml-1.5 text-xs opacity-60">{f === "Todas" ? STORES.length : STORES.filter((s) => s.region === f).length}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="relative mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ol className="space-y-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((s) => {
                const i = STORES.indexOf(s);
                const on = s.slug === active;
                return (
                  <motion.li
                    key={s.slug}
                    id={variant === "page" ? s.slug : undefined}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="scroll-mt-32"
                  >
                    <button
                      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(s.slug)}
                      onClick={() => setActive(s.slug)}
                      className={`group relative flex w-full items-center gap-5 rounded-2xl px-4 py-4 text-left transition-colors ${on ? "bg-paper/10" : "hover:bg-paper/5"}`}
                      aria-pressed={on}
                    >
                      <span className={`w-6 text-xs tabular-nums transition-colors ${on ? "text-rose" : "text-paper/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1">
                        <span className="block font-display text-2xl leading-tight sm:text-[1.7rem]">{s.name}</span>
                        <span className="text-xs text-paper/55">{s.area}</span>
                      </span>
                      <motion.span animate={{ x: on ? 0 : -8, opacity: on ? 1 : 0 }} className="text-rose">
                        <ArrowRight />
                      </motion.span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[28px] bg-wine p-3 sm:p-4">
              <svg viewBox="0 0 100 80" className="w-full" role="img" aria-label={`Mapa ilustrativo das lojas ${BRAND.name}`}>
                {STORE_MAP.map((item, i) => (
                  <MapShape key={i} item={item} />
                ))}

                {STORES.map((s) => {
                  const on = s.slug === active;
                  const dim = !visible.includes(s);
                  return (
                    <g
                      key={s.slug}
                      transform={`translate(${s.pin.x} ${s.pin.y})`}
                      className="cursor-pointer"
                      onClick={() => setActive(s.slug)}
                      onPointerEnter={() => setActive(s.slug)}
                      opacity={dim ? 0.25 : 1}
                      style={{ transition: "opacity .4s" }}
                    >
                      {on && (
                        <motion.circle r={1.6} fill="none" stroke="#E2589B" strokeWidth={0.4} initial={{ scale: 1, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }} />
                      )}
                      <circle r={3} fill="transparent" />
                      <motion.circle r={1.4} animate={{ scale: on ? 1.5 : 1, fill: on ? "#E2589B" : "#F6CFDF" }} transition={{ type: "spring", stiffness: 300, damping: 15 }} />
                      {on && <motion.circle r={0.6} fill="#4A0F24" initial={{ scale: 0 }} animate={{ scale: 1 }} />}
                    </g>
                  );
                })}
              </svg>

              <AnimatePresence mode="wait">
                <motion.div
                  key={store.slug}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 rounded-[20px] bg-paper p-5 text-ink sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-rose">{store.region}</p>
                      <h3 className="mt-1 font-display text-3xl leading-tight">{store.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                        <Pin className="h-4 w-4" /> {store.area} · {store.city}
                      </p>
                    </div>
                    <FlowerMark bloom className="h-10 w-10 shrink-0" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={mapsLink(store.mapsQuery)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-wine">
                      <Pin className="h-4 w-4" /> Como chegar
                    </a>
                    <a href={storeWhatsapp(store)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:border-wine hover:text-wine">
                      <WhatsApp className="h-4 w-4" /> Falar com a loja
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-3 text-center text-[11px] text-paper/40">Mapa ilustrativo. Toque em “Como chegar” para abrir a rota no Google Maps.</p>
          </div>
        </div>

        {variant === "home" && (
          <div className="relative mt-12 flex justify-center">
            <Link href="/lojas" className="group flex items-center gap-3 rounded-full border border-paper/25 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition hover:border-paper hover:bg-paper hover:text-wine-deep">
              Ver todas as lojas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
