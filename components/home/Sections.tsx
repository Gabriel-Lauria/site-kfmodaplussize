"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CONTACT, PRODUCTS, waLink } from "@/lib/data";
import { FlowerMark } from "../FlowerMark";
import { Magnetic } from "../Magnetic";
import { ProductCard } from "../ProductCard";
import { Reveal, SplitWords } from "../motion-utils";
import { ArrowRight, Instagram, WhatsApp } from "../Icons";

const PERKS = [
  { title: "10 lojas físicas", text: "Curitiba e São José dos Pinhais", icon: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 7v5" },
  { title: "Compre pelo WhatsApp", text: "Atendimento de consultora", icon: "M4 5h16v11H8l-4 4V5z M8 10h8" },
  { title: "Novidades toda semana", text: `No ${CONTACT.instagramHandle}`, icon: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" },
  { title: "Do básico à festa", text: "Looks para todos os momentos", icon: "M8 3l4 3 4-3 3 4-3 2v12H8V9L5 7l3-4z" },
];

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
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush/60 text-wine"
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

const CATS = [
  { name: "Vestidos", image: "/images/vestido-plissado.png", hover: "/images/vestido-boho.png" },
  { name: "Conjuntos", image: "/images/conjunto-azul.png", hover: "/images/tule-noir.png" },
  { name: "Básicos", image: "/images/regatas-modelo.png", hover: "/images/regatas-cores.png" },
  { name: "Bolsas", image: "/images/bolsa-petroleo.png", hover: "/images/bolsa-nude.png" },
];

export function Categories() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          <SplitWords text="Escolha por" />
          <br />
          <SplitWords text="onde começar" delay={0.15} className="italic text-wine" />
        </h2>
        <Reveal>
          <p className="max-w-xs text-sm text-muted">Passe o mouse para ver mais. Toque para abrir a categoria no catálogo.</p>
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
            <p className="text-xs uppercase tracking-[0.24em] text-rose">Em destaque</p>
          </Reveal>
          <h2 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
            <SplitWords text="Queridinhas da semana" />
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 transition hover:border-wine hover:bg-wine hover:text-paper"
              aria-label={dir < 0 ? "Anteriores" : "Próximas"}
            >
              <ArrowRight className={dir < 0 ? "rotate-180" : undefined} />
            </button>
          ))}
          <Link href="/catalogo" className="ml-2 hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-wine sm:flex">
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

const MANIFESTO =
  "De Curitiba para o seu guarda-roupa. Dez lojas, um mesmo cuidado: peças escolhidas a dedo para mulheres reais vestirem o que as faz florescer, todos os dias.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const highlight = /florescer|cuidado/.test(word);
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${highlight ? "italic text-rose" : ""}`}>
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
        <FlowerMark />
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
      <div className="relative overflow-hidden rounded-[32px] bg-blush/50 px-6 py-20 text-center sm:px-12 sm:py-28">
        <motion.div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 opacity-60" animate={{ rotate: hover ? 180 : 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <FlowerMark />
        </motion.div>
        <motion.div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 opacity-60" animate={{ rotate: hover ? -180 : 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <FlowerMark />
        </motion.div>
        <p className="relative text-xs uppercase tracking-[0.24em] text-wine">Atendimento de verdade</p>
        <h2 className="relative mx-auto mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
          <SplitWords text="Achou a sua peça?" />
          <br />
          <SplitWords text="A gente separa." delay={0.2} className="italic text-wine" />
        </h2>
        <p className="relative mx-auto mt-6 max-w-md text-ink/70">Mande uma mensagem com a foto ou o nome da peça. Nossa equipe confirma tamanho, cor e em qual loja ela está.</p>
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
          <Magnetic strength={0.5}>
            <a
              href={waLink("Olá! Vim pelo site da Espaço Flor e quero ajuda para escolher uma peça.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full bg-wine px-8 py-5 text-sm font-semibold uppercase tracking-[0.14em] text-paper shadow-[0_20px_50px_-15px_rgba(122,29,59,0.7)] transition hover:bg-wine-deep"
            >
              <WhatsApp /> Chamar no WhatsApp
            </a>
          </Magnetic>
          <Magnetic>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full border border-ink/20 px-7 py-5 text-sm font-semibold uppercase tracking-[0.14em] transition hover:border-wine hover:text-wine">
              <Instagram /> {CONTACT.instagramHandle}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
