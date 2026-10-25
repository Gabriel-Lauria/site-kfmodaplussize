"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { BRAND, CONTACT, FEATURES, STORES, STORES_NAV, waLink } from "@/config";
import { BrandMark } from "./BrandMark";
import { Logo } from "./Logo";
import { Instagram, WhatsApp } from "./Icons";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 0]);

  return (
    <footer ref={ref} className="relative mt-24 overflow-hidden bg-primary-deep text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-10 pt-20 sm:px-8 md:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo markClassName="h-10 w-10" textClassName="font-display text-2xl" imageClassName="h-10 w-auto" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">{BRAND.footer.about}</p>
          <div className="mt-6 flex gap-2">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-paper/20 p-3 transition hover:border-accent hover:bg-accent" aria-label="Instagram">
              <Instagram />
            </a>
            <a href={waLink(BRAND.messages.default)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-paper/20 p-3 transition hover:border-accent hover:bg-accent" aria-label="WhatsApp">
              <WhatsApp />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-soft">Navegue</h3>
          <ul className="mt-5 space-y-2.5 text-sm text-paper/80">
            <li><Link className="transition hover:text-accent" href="/">Início</Link></li>
            <li><Link className="transition hover:text-accent" href="/catalogo">Catálogo</Link></li>
            <li><Link className="transition hover:text-accent" href="/lojas">{STORES_NAV}</Link></li>
            {CONTACT.linktree && (
              <li><a className="transition hover:text-accent" href={CONTACT.linktree} target="_blank" rel="noopener noreferrer">Links úteis</a></li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-soft">{FEATURES.showStores ? "Lojas" : "Endereço"}</h3>
          {FEATURES.showStores ? (
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-paper/80">
              {STORES.map((s) => (
                <li key={s.slug}>
                  <Link className="transition hover:text-accent" href={`/lojas#${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-5 space-y-2.5 text-sm text-paper/80">
              {STORES.map((s) => (
                <li key={s.slug}>
                  <Link className="transition hover:text-accent" href={`/lojas#${s.slug}`}>
                    {s.area}
                    <br />
                    {[s.city, s.state].filter(Boolean).join(" · ")}
                    {s.postalCode && <> · {s.postalCode}</>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-soft">Contato</h3>
          <ul className="mt-5 space-y-2.5 text-sm text-paper/80">
            <li>WhatsApp {CONTACT.whatsappLabel}</li>
            <li>{CONTACT.instagramHandle}</li>
            <li>{CONTACT.location}</li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
        <motion.p style={{ y }} className="flex select-none items-center gap-[2vw] whitespace-nowrap font-display text-[17vw] leading-[0.8] tracking-tight text-paper/[0.07]">
          {BRAND.wordmark[0]}
          <motion.span style={{ rotate }} className="inline-block">
            <BrandMark mono="var(--color-accent)" className="h-[12vw] w-[12vw] opacity-60" />
          </motion.span>
          {BRAND.wordmark[1]}
        </motion.p>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-2 border-t border-paper/10 px-4 py-6 text-xs text-paper/50 sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} {BRAND.name} · {BRAND.segment}</p>
        {BRAND.credit && (
          <p>
            {BRAND.credit.label}{" "}
            {BRAND.credit.url ? (
              <a href={BRAND.credit.url} target="_blank" rel="noopener noreferrer" className="text-accent-soft hover:text-accent">
                {BRAND.credit.name}
              </a>
            ) : (
              <span className="text-accent-soft">{BRAND.credit.name}</span>
            )}
          </p>
        )}
      </div>
    </footer>
  );
}
