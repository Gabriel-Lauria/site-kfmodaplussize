"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { BRAND, CONTACT, HOME_CATEGORIES, PRODUCTS, waLink } from "@/config";
import { BrandMark } from "../BrandMark";
import { Magnetic } from "../Magnetic";
import { ProductCard } from "../ProductCard";
import { Reveal, SplitWords } from "../motion-utils";
import { ArrowRight, Instagram, WhatsApp } from "../Icons";

const PERKS = BRAND.perks;

export function Perks() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/5 bg-ink/5 lg:grid-cols-4">
        {PERKS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08} y={16} className="h-full">
            <motion.div whileHover="hover" className="flex h-full items-center gap-4 bg-paper p-5 sm:p-6">
              <motion.span
                variants={{ hover: { rotate: [0, -14, 10, 0], scale: 1.1 } }}
                transition={{ duration: 0.5 }}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft/60 text-primary"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d={p.icon} />
                </svg>
              </motion.span>
              <div>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-muted">{p.text}</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const CATS = HOME_CATEGORIES;

export function Categories() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          <SplitWords text={BRAND.categories.title[0]} />
          <br />
          <SplitWords text={BRAND.categories.title[1]} delay={0.15} className="italic text-primary" />
        </h2>
        <Reveal>
          <p className="max-w-xs text-sm text-muted">{BRAND.categories.hint}</p>
        </Reveal>
      </div>
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        {CATS.map((c, i) => (
          <motion.div
            key={c.name}
            variants={{
              hidden: { clipPath: "inset(100% 0% 0% 0%)" },
              show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } },
            }}
            className={i % 2 === 1 ? "lg:mt-16" : undefined}
          >
            <Link href={`/catalogo?categoria=${encodeURIComponent(c.name)}`} data-cursor="Explorar" className="group relative block aspect-[3/4] overflow-hidden rounded-[24px]">
              <Image src={c.image} alt={c.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-110 group-hover:opacity-0" />
              <Image src={c.hover} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="scale-110 object-cover opacity-0 transition duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
              <div className="absolute inset-x-4 bottom-4 text-paper sm:inset-x-6 sm:bottom-6">
                <p className="font-display text-3xl sm:text-4xl">{c.name}</p>
                <p className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-paper/80">
                  Explorar
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-2" />
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function Featured() {
  const track = useRef<HTMLDivElement>(null);
  const featured = PRODUCTS.filter((p) => p.tag).concat(PRODUCTS.filter((p) => !p.tag)).slice(0, 8);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="py-16">
      <div className="mx-auto mb-10 flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">{BRAND.featured.eyebrow}</p>
          </Reveal>
          <h2 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
            <SplitWords text={BRAND.featured.title} />
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 transition hover:border-primary hover:bg-primary hover:text-paper"
              aria-label={dir < 0 ? "Anteriores" : "Próximas"}
            >
              <ArrowRight className={dir < 0 ? "rotate-180" : undefined} />
            </button>
          ))}
          <Link href="/catalogo" className="ml-2 hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary sm:flex">
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-8 sm:px-8 xl:px-[max(2rem,calc((100vw-1400px)/2+2rem))]"
      >
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i, 4) * 0.08} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23vw] xl:w-[300px]">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const MANIFESTO = BRAND.manifesto.text;

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const highlight = BRAND.manifesto.highlight.some((h) => word.includes(h));
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${highlight ? "italic text-accent" : ""}`}>
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const words = MANIFESTO.split(" ");

  return (
    <section ref={ref} className="mx-auto max-w-[1200px] px-4 py-24 text-center sm:px-8 sm:py-32">
      <motion.div style={{ rotate }} className="mx-auto mb-10 h-14 w-14">
        <BrandMark />
      </motion.div>
      <p className="font-display text-[clamp(1.9rem,4.4vw,3.8rem)] font-light leading-[1.15] tracking-tight">
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </p>
    </section>
  );
}

export function FinalCta() {
  const [hover, setHover] = useState(false);
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="relative overflow-hidden rounded-[32px] bg-accent-soft/50 px-6 py-20 text-center sm:px-12 sm:py-28">
        <motion.div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 opacity-60" animate={{ rotate: hover ? 180 : 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <BrandMark />
        </motion.div>
        <motion.div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 opacity-60" animate={{ rotate: hover ? -180 : 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <BrandMark />
        </motion.div>
        <p className="relative text-xs uppercase tracking-[0.24em] text-primary">{BRAND.finalCta.eyebrow}</p>
        <h2 className="relative mx-auto mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
          <SplitWords text={BRAND.finalCta.title[0]} />
          <br />
          <SplitWords text={BRAND.finalCta.title[1]} delay={0.2} className="italic text-primary" />
        </h2>
        <p className="relative mx-auto mt-6 max-w-md text-ink/70">{BRAND.finalCta.text}</p>
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
          <Magnetic strength={0.5}>
            <a
              href={waLink(BRAND.finalCta.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full bg-primary px-8 py-5 text-sm font-semibold uppercase tracking-[0.14em] text-paper shadow-[0_20px_50px_-15px_color-mix(in_srgb,var(--color-primary)_70%,transparent)] transition hover:bg-primary-deep"
            >
              <WhatsApp /> Chamar no WhatsApp
            </a>
          </Magnetic>
          <Magnetic>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full border border-ink/20 px-7 py-5 text-sm font-semibold uppercase tracking-[0.14em] transition hover:border-primary hover:text-primary">
              <Instagram /> {CONTACT.instagramHandle}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
