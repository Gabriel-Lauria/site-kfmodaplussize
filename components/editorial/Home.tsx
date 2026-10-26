"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { BRAND, CONTACT, CTA, EDITORIAL, FEATURES, HOME_CATEGORIES, PRODUCTS, STORES, STORES_CTA, mapsLink, storeWhatsapp, waLink, type Product } from "@/config";
import { HeartButton } from "../ProductCard";
import { MirrorFrame } from "../MirrorFrame";
import { Reveal, SplitWords } from "../motion-utils";
import { useStartDelay } from "../home/Hero";
import { ArrowRight, Instagram, Pin, WhatsApp } from "../Icons";

const EASE = [0.16, 1, 0.3, 1] as const;
const BTN = "inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition";

function Eyebrow({ children, className = "text-primary" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[11px] uppercase tracking-[0.28em] ${className}`}>{children}</p>;
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d={d} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Hero claro dividido: texto + diferenciais à esquerda, foto em arco à direita.
export function EditorialHero() {
  const d = useStartDelay();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const H = EDITORIAL.hero;

  return (
    <section ref={ref} className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-8 sm:pt-6">
      <div className="relative grid overflow-hidden rounded-sm bg-cream lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-12 lg:py-20 lg:pl-16 lg:pr-4">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d, duration: 0.8 }}>
            <Eyebrow>{H.eyebrow}</Eyebrow>
          </motion.div>
          <h1 className="mt-6 font-display text-[clamp(3rem,6.4vw,5.9rem)] font-light leading-[0.95] tracking-[-0.01em]">
            <SplitWords text={H.title[0]} onView={false} delay={d + 0.1} />
            <br />
            <SplitWords text={H.title[1]} onView={false} delay={d + 0.35} className="italic text-primary" />
          </h1>
          <motion.p
            className="mt-6 max-w-md leading-relaxed text-ink/70"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 0.7, duration: 0.8 }}
          >
            {H.text}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 0.85, duration: 0.8 }}
          >
            <Link href="/catalogo" className={`${BTN} group bg-ink text-paper hover:bg-primary`}>
              Ver catálogo <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link href="/lojas" className="group relative py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              {STORES_CTA}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-500 group-hover:scale-x-50" />
            </Link>
          </motion.div>

          <motion.ul
            className="mt-14 grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: d + 1 } } }}
          >
            {EDITORIAL.values.map((v) => (
              <motion.li key={v.title} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">
                  <Icon d={v.icon} />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em]">{v.title}</span>
                  <span className="mt-1 block text-xs text-muted">{v.text}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="relative min-h-[540px] lg:min-h-[700px]">
          <motion.div
            className="absolute inset-x-6 bottom-0 top-8 sm:inset-x-16 lg:left-10 lg:right-10 lg:top-10"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ delay: d + 0.2, duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
          >
            <MirrorFrame className="h-full w-full">
              <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y: imgY }}>
                <Image src={H.images[0]} alt={H.imageAlt} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-[50%_25%]" />
              </motion.div>
            </MirrorFrame>
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-2 z-10 hidden h-56 w-40 overflow-hidden border-[6px] border-paper shadow-2xl sm:block lg:-left-10"
            style={{ y: smallY }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: d + 1.1, duration: 0.9, ease: EASE }}
          >
            <Image src={H.images[1]} alt="" fill sizes="160px" className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Categorias em blocos escuros com o nome em caixa alta.
export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
          <SplitWords text={BRAND.categories.title[0]} /> <SplitWords text={BRAND.categories.title[1]} delay={0.12} className="italic text-primary" />
        </h2>
        <Link href="/catalogo" className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
          Ver tudo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {HOME_CATEGORIES.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.08}>
            <Link href={`/catalogo?categoria=${encodeURIComponent(c.name)}`} data-cursor="Explorar" className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-ink">
              <Image src={c.image} alt={c.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover opacity-85 transition duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105 group-hover:opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-paper sm:inset-x-6 sm:bottom-6">
                <p className="font-display text-2xl uppercase tracking-[0.08em] sm:text-3xl">{c.name}</p>
                <p className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-paper/80">
                  Explorar
                  <span className="h-px w-6 bg-paper/70 transition-all duration-500 group-hover:w-12" />
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function ProductTile({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  return (
    <article className="group" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <div className="relative">
        <Link href={`/catalogo/${product.slug}`} data-cursor="Ver" className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-cream" aria-label={`Ver ${product.name}`}>
          <Image src={product.image} alt={product.name} fill sizes="(min-width:1024px) 16vw, (min-width:768px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
          {product.hoverImage && (
            <motion.div className="absolute inset-0" initial={false} animate={{ opacity: hover ? 1 : 0 }} transition={{ duration: 0.5 }}>
              <Image src={product.hoverImage} alt="" fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover" />
            </motion.div>
          )}
          {product.tag && (
            <span className="absolute left-2 top-2 max-w-[calc(100%-3.5rem)] truncate bg-ink px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-paper">
              {product.tag}
            </span>
          )}
        </Link>
        <HeartButton product={product} className="absolute right-2 top-2 h-8 w-8" />
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-muted">{product.category}</p>
      <h3 className="mt-1 text-sm font-medium leading-snug">{product.name}</h3>
      <div className="mt-2 flex items-center justify-between gap-2">
        <a href={waLink(CTA.quick(product.name))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary hover:text-ink">
          <WhatsApp className="h-3.5 w-3.5" /> {CTA.card}
        </a>
        <span className="flex -space-x-1">
          {product.colors.slice(0, 3).map((c) => (
            <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border-2 border-paper shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" style={{ backgroundColor: c.hex }} />
          ))}
        </span>
      </div>
    </article>
  );
}

export function ProductGrid() {
  const products = PRODUCTS.filter((p) => p.tag).concat(PRODUCTS.filter((p) => !p.tag)).slice(0, 6);
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-8 sm:pb-20">
      <div className="mb-10 text-center">
        <Reveal>
          <Eyebrow>{EDITORIAL.products.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
          <SplitWords text={EDITORIAL.products.title} />
        </h2>
        <motion.span
          className="mx-auto mt-5 block h-px w-16 bg-primary"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-6">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i, 5) * 0.06}>
            <ProductTile product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function Lookbook() {
  const L = EDITORIAL.lookbook;
  const looks = L.slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean) as Product[];
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="grid gap-3 lg:grid-cols-[0.75fr_2.25fr]">
        <Reveal className="h-full">
          <div className="flex h-full flex-col justify-center rounded-sm bg-cream p-8 sm:p-10">
            <h2 className="font-display text-5xl uppercase tracking-[0.06em]">{L.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">{L.text}</p>
            <Link href="/catalogo" className={`${BTN} mt-8 self-start border border-ink px-6 py-3 hover:bg-ink hover:text-paper`}>
              {L.button}
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {looks.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link href={`/catalogo/${p.slug}`} data-cursor="Ver" className="group relative block aspect-[3/4] overflow-hidden rounded-sm">
                <Image src={p.image} alt={p.name} fill sizes="(min-width:1024px) 18vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-paper/95 px-4 py-3 text-xs font-medium transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0">
                  {p.name}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Faixa escura com chamada curta e foto à direita.
export function PromoBand() {
  const P = EDITORIAL.promo;
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 sm:py-20">
      <div className="relative grid items-center overflow-hidden rounded-sm bg-ink text-paper md:grid-cols-[1fr_1.1fr_240px] lg:grid-cols-[1fr_1fr_320px]">
        <div className="px-8 pt-12 md:py-14 lg:px-14">
          <Eyebrow className="text-accent-soft">{P.eyebrow}</Eyebrow>
          <p className="mt-4 font-display text-6xl uppercase leading-[0.88] tracking-[0.02em] sm:text-7xl">
            <SplitWords text={P.title[0]} />
            <br />
            <SplitWords text={P.title[1]} delay={0.15} className="italic text-highlight" />
          </p>
        </div>
        <Reveal delay={0.2} className="px-8 pb-12 pt-6 md:py-14 md:pl-0">
          <p className="max-w-sm text-sm leading-relaxed text-paper/70">{P.text}</p>
          <a href={waLink(P.message)} target="_blank" rel="noopener noreferrer" className={`${BTN} mt-7 border border-paper/40 px-6 py-3 hover:border-paper hover:bg-paper hover:text-ink`}>
            <WhatsApp className="h-4 w-4" /> {P.button}
          </a>
        </Reveal>
        <div className="relative hidden h-full min-h-[300px] md:block">
          <Image src={P.image} alt="" fill sizes="320px" className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function Testimonials() {
  const list = EDITORIAL.testimonials;
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-8 sm:pb-20">
      <h2 className="mb-10 text-center font-display text-4xl tracking-tight sm:text-5xl">
        <SplitWords text="O que dizem as clientes" />
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {list.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <figure className="h-full rounded-sm border border-ink/10 bg-paper p-8 text-center">
              <p className="tracking-[0.3em] text-highlight" aria-label="5 estrelas">★★★★★</p>
              <blockquote className="mt-4 font-display text-xl italic leading-snug">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-[11px] uppercase tracking-[0.2em] text-muted">{t.name}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function InstagramStrip() {
  const I = EDITORIAL.instagram;
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-8 sm:pb-20">
      <div className="grid items-center gap-8 lg:grid-cols-[260px_1fr]">
        <div>
          <h2 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
            {I.title[0]}
            <br />
            <em className="text-primary">{I.title[1]}</em>
          </h2>
          <p className="mt-3 text-sm text-muted">{CONTACT.instagramHandle}</p>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className={`${BTN} mt-6 border border-ink px-6 py-3 hover:bg-ink hover:text-paper`}>
            <Instagram className="h-4 w-4" /> Seguir
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {I.images.map((src, i) => (
            <Reveal key={src + i} delay={i * 0.05} y={16}>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-sm" aria-label={`Instagram ${CONTACT.instagramHandle}`}>
                <Image src={src} alt="" fill sizes="(min-width:640px) 16vw, 33vw" className="object-cover object-top transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 grid place-items-center bg-primary-deep/0 text-paper opacity-0 transition duration-500 group-hover:bg-primary-deep/50 group-hover:opacity-100">
                  <Instagram />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Nossa história + lista VIP no WhatsApp com o endereço da loja.
export function StoryVip() {
  const S = EDITORIAL.story;
  const V = EDITORIAL.vip;
  const store = STORES[0];
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="grid gap-3 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="grid h-full overflow-hidden rounded-sm bg-cream sm:grid-cols-[1fr_220px]">
            <div className="p-8 sm:p-10">
              <Eyebrow>{S.title}</Eyebrow>
              <p className="mt-5 font-display text-2xl leading-snug">{S.text}</p>
              <Link href="/lojas" className="group mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                Conhecer a loja <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative min-h-[280px]">
              <Image src={S.image} alt="" fill sizes="220px" className="object-cover object-top grayscale-[35%]" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <div className="flex h-full flex-col justify-between gap-10 rounded-sm border border-ink/10 p-8 sm:p-10">
            <div>
              <Eyebrow>{V.title}</Eyebrow>
              <p className="mt-5 max-w-md text-ink/70">{V.text}</p>
              <a href={waLink(V.message)} target="_blank" rel="noopener noreferrer" className={`${BTN} mt-7 bg-primary text-paper hover:bg-primary-deep`}>
                <WhatsApp className="h-4 w-4" /> {V.button}
              </a>
            </div>
            {store && !FEATURES.showStores && (
              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-ink/10 pt-6">
                <p className="flex items-start gap-2 text-sm">
                  <Pin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-semibold">{store.area}</span>
                    <br />
                    <span className="text-muted">
                      {[store.city, store.state].filter(Boolean).join(" · ")}
                      {store.postalCode && <> · {store.postalCode}</>}
                    </span>
                  </span>
                </p>
                <span className="flex gap-4 text-[11px] font-semibold uppercase tracking-[0.16em]">
                  <a href={mapsLink(store.mapsQuery)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Como chegar</a>
                  <a href={storeWhatsapp(store)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp</a>
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
