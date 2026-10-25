"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { BRAND, CONTACT, LOOKS as LOOK_SLUGS, PRODUCTS, type Product } from "@/config";
import { MirrorFrame } from "../MirrorFrame";
import { Counter } from "../motion-utils";
import { Instagram } from "../Icons";

const LOOKS = LOOK_SLUGS.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(Boolean) as Product[];
const TEXT = BRAND.provador;

// No desktop a rolagem vertical vira um passeio horizontal pelo "provador".
export function Provador() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setDesktop(mq.matches);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={section} className="relative py-16 md:py-0" style={desktop ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={desktop ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "no-scrollbar overflow-x-auto"}>
        <motion.div ref={track} style={desktop ? { x } : undefined} className="flex w-max items-center gap-6 px-4 sm:px-8 md:gap-10 md:px-[6vw]">
          <div className="w-[78vw] shrink-0 sm:w-[420px]">
            <p className="text-xs uppercase tracking-[0.24em] text-rose">{TEXT.eyebrow}</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              {TEXT.title[0]}
              <br />
              <em className="text-wine">{TEXT.title[1]}</em>
            </h2>
            <p className="mt-6 max-w-sm text-ink/70">{TEXT.text}</p>
          </div>

          {LOOKS.map((l, i) => (
            <Link key={l.slug} href={`/catalogo/${l.slug}`} data-cursor="Ver" className={`group block shrink-0 ${i % 2 ? "md:mt-24" : "md:-mt-16"}`}>
              <MirrorFrame flip={i % 2 === 1} className="h-[440px] w-[300px] sm:h-[520px] sm:w-[360px]">
                <Image src={l.image} alt={l.name} fill sizes="360px" className="object-cover transition duration-700 group-hover:scale-105" />
              </MirrorFrame>
              <div className="mt-4 flex items-center justify-between px-[6%]">
                <p className="font-display text-xl">{l.name}</p>
                <span className="text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </Link>
          ))}

          <div className="flex w-[78vw] shrink-0 flex-col justify-center rounded-[32px] bg-cream p-8 sm:w-[420px] sm:p-10">
            <div className="grid grid-cols-2 gap-6">
              {TEXT.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-5xl text-wine"><Counter to={s.to} decimals={s.decimals} /></p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-wine via-rose to-caramel px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:brightness-110"
            >
              <Instagram /> Seguir {CONTACT.instagramHandle}
            </a>
          </div>
        </motion.div>

        {desktop && (
          <div className="mx-auto mt-10 h-px w-[min(400px,60vw)] bg-ink/10">
            <motion.div className="h-full bg-wine" style={{ width: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}
