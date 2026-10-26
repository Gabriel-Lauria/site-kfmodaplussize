"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config";
import { mapsUrl } from "@/lib/catalog";
import { BrandMark } from "./BrandMark";
import { MirrorFrame } from "./MirrorFrame";
import { Reveal, SplitWords } from "./motion-utils";
import { useSite } from "./SiteData";
import { ArrowRight, Pin, WhatsApp } from "./Icons";

// Versão de loja única da vitrine de lojas: endereço, horário, rota e WhatsApp (dados do painel).
export function StoreVisit({ variant = "home" }: { variant?: "home" | "page" }) {
  const site = useSite();
  const c = site.content.contact;
  if (!c.street) return null;
  const city = [c.city, c.state].filter(Boolean).join(" · ");

  return (
    <section id="loja" className="px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-[28px] bg-primary-deep px-5 py-14 text-paper sm:rounded-[36px] sm:px-10 sm:py-20 lg:px-16">
        <BrandMark mono="#ffffff06" className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] animate-spin-slow" />

        <div className={`relative grid items-center gap-12 ${variant === "home" ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">{variant === "home" ? BRAND.stores.eyebrowHome : BRAND.stores.eyebrowPage}</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              <SplitWords text="Visite a loja." />
              {" "}<br />
              <SplitWords text={BRAND.stores.titleAccent} delay={0.15} className="italic text-accent" />
            </h2>
            <Reveal>
              <p className="mt-6 max-w-md text-paper/75">{BRAND.stores.text}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 max-w-lg rounded-[20px] bg-paper p-5 text-ink sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">{BRAND.name}</p>
                    <h3 className="mt-1 font-display text-3xl leading-tight">{c.street}</h3>
                    <p className="mt-1 flex items-start gap-1.5 text-muted">
                      <Pin className="mt-1 h-4 w-4 shrink-0" />
                      <span>
                        {[c.district, city].filter(Boolean).join(" · ")}
                        {c.postalCode && <> · CEP {c.postalCode}</>}
                      </span>
                    </p>
                  </div>
                  <BrandMark bloom className="h-10 w-10 shrink-0" />
                </div>
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Horário</p>
                  {c.hours.length ? (
                    <ul className="mt-1">
                      {c.hours.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1">Consulte pelo WhatsApp e já deixe suas peças separadas.</p>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={mapsUrl(`${BRAND.name} ${c.street} ${c.city}`)} target="_blank" rel="noopener noreferrer" className="flex min-h-12 grow basis-40 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-primary">
                    <Pin className="h-4 w-4" /> Como chegar
                  </a>
                  <a href={site.wa(BRAND.messages.store(BRAND.name))} target="_blank" rel="noopener noreferrer" className="flex min-h-12 grow basis-40 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink/15 px-5 text-xs font-semibold uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary">
                    <WhatsApp className="h-4 w-4" /> Falar com a loja
                  </a>
                </div>
              </div>
            </Reveal>

            {variant === "home" && (
              <Reveal delay={0.2}>
                <Link href="/lojas" className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-paper/25 px-7 text-sm font-semibold uppercase tracking-[0.14em] transition hover:border-paper hover:bg-paper hover:text-primary-deep">
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
