"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND, STORES, mapsLink, storeWhatsapp } from "@/config";
import { FlowerMark } from "./FlowerMark";
import { MirrorFrame } from "./MirrorFrame";
import { Reveal, SplitWords } from "./motion-utils";
import { ArrowRight, Pin, WhatsApp } from "./Icons";

// Versão de loja única da vitrine de lojas: endereço, rota e WhatsApp.
export function StoreVisit({ variant = "home" }: { variant?: "home" | "page" }) {
  const store = STORES[0];
  if (!store) return null;
  const address = [store.area, [store.city, store.state].filter(Boolean).join(" · ")].join(" · ");

  return (
    <section id="lojas" className="px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-[28px] bg-primary-deep px-5 py-16 text-paper sm:rounded-[36px] sm:px-10 sm:py-20 lg:px-16">
        <FlowerMark mono="#ffffff06" className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] animate-spin-slow" />

        <div className={`relative grid items-center gap-12 ${variant === "home" ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">{variant === "home" ? BRAND.stores.eyebrowHome : BRAND.stores.eyebrowPage}</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              <SplitWords text="Visite a loja." />
              <br />
              <SplitWords text={BRAND.stores.titleAccent} delay={0.15} className="italic text-accent" />
            </h2>
            <Reveal>
              <p className="mt-6 max-w-md text-paper/70">{BRAND.stores.text}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div id={variant === "page" ? store.slug : undefined} className="mt-10 max-w-lg scroll-mt-32 rounded-[20px] bg-paper p-5 text-ink sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-accent">{store.name}</p>
                    <h3 className="mt-1 font-display text-3xl leading-tight">{store.area}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <Pin className="h-4 w-4" /> {address}
                      {store.postalCode && <> · CEP {store.postalCode}</>}
                    </p>
                  </div>
                  <FlowerMark bloom className="h-10 w-10 shrink-0" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={mapsLink(store.mapsQuery)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-primary">
                    <Pin className="h-4 w-4" /> Como chegar
                  </a>
                  <a href={storeWhatsapp(store)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary">
                    <WhatsApp className="h-4 w-4" /> Falar com a loja
                  </a>
                </div>
              </div>
            </Reveal>

            {variant === "home" && (
              <Reveal delay={0.2}>
                <Link href="/lojas" className="group mt-8 inline-flex items-center gap-3 rounded-full border border-paper/25 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition hover:border-paper hover:bg-paper hover:text-primary-deep">
                  Conhecer a loja <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            )}
          </div>

          {variant === "home" && (
            <Reveal delay={0.2}>
              <MirrorFrame className="mx-auto h-[460px] w-full max-w-[400px] sm:h-[540px]">
                <Image src={BRAND.storesPage.image} alt={BRAND.storesPage.imageAlt} fill sizes="400px" className="object-cover" />
              </MirrorFrame>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
