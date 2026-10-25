"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { CONTACT, STORES, waLink } from "@/lib/data";
import { FlowerMark } from "./FlowerMark";
import { Instagram, WhatsApp } from "./Icons";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 0]);

  return (
    <footer ref={ref} className="relative mt-24 overflow-hidden bg-wine-deep text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-10 pt-20 sm:px-8 md:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <FlowerMark className="h-10 w-10" />
            <span className="font-display text-2xl">Espaço Flor</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">
            Moda feminina com 10 lojas em Curitiba e São José dos Pinhais. Peças escolhidas a dedo para você florescer todos os dias.
          </p>
          <div className="mt-6 flex gap-2">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-paper/20 p-3 transition hover:border-rose hover:bg-rose" aria-label="Instagram">
              <Instagram />
            </a>
            <a href={waLink("Olá! Vim pelo site da Espaço Flor.")} target="_blank" rel="noopener noreferrer" className="rounded-full border border-paper/20 p-3 transition hover:border-rose hover:bg-rose" aria-label="WhatsApp">
              <WhatsApp />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-blush">Navegue</h3>
          <ul className="mt-5 space-y-2.5 text-sm text-paper/80">
            <li><Link className="transition hover:text-rose" href="/">Início</Link></li>
            <li><Link className="transition hover:text-rose" href="/catalogo">Catálogo</Link></li>
            <li><Link className="transition hover:text-rose" href="/lojas">Nossas lojas</Link></li>
            <li><a className="transition hover:text-rose" href={CONTACT.linktree} target="_blank" rel="noopener noreferrer">Links úteis</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-blush">Lojas</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-paper/80">
            {STORES.map((s) => (
              <li key={s.slug}>
                <Link className="transition hover:text-rose" href={`/lojas#${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-blush">Contato</h3>
          <ul className="mt-5 space-y-2.5 text-sm text-paper/80">
            <li>WhatsApp {CONTACT.whatsappLabel}</li>
            <li>{CONTACT.instagramHandle}</li>
            <li>Curitiba e São José dos Pinhais, PR</li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
        <motion.p style={{ y }} className="flex select-none items-center gap-[2vw] whitespace-nowrap font-display text-[17vw] leading-[0.8] tracking-tight text-paper/[0.07]">
          Espaço
          <motion.span style={{ rotate }} className="inline-block">
            <FlowerMark mono="#E2589B" className="h-[12vw] w-[12vw] opacity-60" />
          </motion.span>
          Flor
        </motion.p>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-2 border-t border-paper/10 px-4 py-6 text-xs text-paper/50 sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} Espaço Flor · Moda Feminina</p>
        <p>
          Sonhada por{" "}
          <a href={CONTACT.founderUrl} target="_blank" rel="noopener noreferrer" className="text-blush hover:text-rose">
            {CONTACT.founder}
          </a>
        </p>
      </div>
    </footer>
  );
}
