"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { FlowerMark } from "../FlowerMark";
import { Magnetic } from "../Magnetic";
import { MirrorFrame } from "../MirrorFrame";
import { Counter, SplitWords } from "../motion-utils";
import { ArrowRight, Pin } from "../Icons";
import { PetalTrail } from "./PetalTrail";

const AVATARS = ["/images/tule-noir.png", "/images/vestido-boho.png", "/images/blusa-assimetrica.png"];

function useStartDelay() {
  const [delay] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("intro-done") ? 0.15 : 1.9,
  );
  return delay;
}

export function Hero() {
  const d = useStartDelay();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const imgX = useTransform(sx, (v) => v * -24);
  const imgY = useTransform(sy, (v) => v * -24);
  const frameX = useTransform(sx, (v) => v * 14);
  const frameY = useTransform(sy, (v) => v * 10);
  const badgeX = useTransform(sx, (v) => v * 36);

  return (
    <section className="px-2 pt-2 sm:px-4 sm:pt-4">
      <div
        className="relative overflow-hidden rounded-[28px] bg-wine-deep text-paper sm:rounded-[36px]"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-rose/25 blur-[120px]" />
          <div className="absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full bg-caramel/30 blur-[120px]" />
          <FlowerMark mono="#ffffff08" className="absolute -left-32 top-1/3 h-[560px] w-[560px] animate-spin-slow" />
        </div>
        <PetalTrail />

        <div className="relative grid min-h-[calc(100svh-7.5rem)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 pb-10 pt-14 sm:px-12 lg:px-16 lg:py-16">
            <motion.p
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-blush sm:text-xs sm:tracking-[0.28em]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: d, duration: 0.8 }}
            >
              <span className="hidden h-px w-10 bg-blush/60 sm:block" /> Nova estação · Curitiba e SJP
            </motion.p>

            <h1 className="mt-6 font-display text-[clamp(3.2rem,8.5vw,7.5rem)] font-light leading-[0.92] tracking-[-0.02em]">
              <SplitWords text="Vista o que" onView={false} delay={d + 0.1} />
              <br />
              <SplitWords text="te faz" onView={false} delay={d + 0.3} />
              <br />
              <SplitWords text="florescer." onView={false} delay={d + 0.45} className="italic text-rose" />
            </h1>

            <motion.p
              className="mt-7 max-w-md text-base leading-relaxed text-paper/75 sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d + 0.8, duration: 0.8 }}
            >
              Vestidos, conjuntos, básicos e bolsas escolhidos a dedo. Dez lojas em Curitiba e São José dos Pinhais esperando por você.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d + 0.95, duration: 0.8 }}
            >
              <Magnetic>
                <Link
                  href="/catalogo"
                  className="group flex items-center gap-3 rounded-full bg-paper py-4 pl-7 pr-5 text-sm font-semibold uppercase tracking-[0.14em] text-wine-deep transition hover:bg-blush"
                >
                  Ver catálogo
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-wine text-paper transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/lojas" className="group flex items-center gap-3 px-2 py-3 text-sm font-medium">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 transition group-hover:border-rose group-hover:bg-rose">
                    <Pin className="h-4 w-4" />
                  </span>
                  Encontrar uma loja
                </Link>
              </Magnetic>
            </motion.div>

            <motion.div
              className="mt-12 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: d + 1.15, duration: 0.8 }}
            >
              <div className="flex -space-x-3">
                {AVATARS.map((src, i) => (
                  <motion.div
                    key={src}
                    className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-wine-deep"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: d + 1.2 + i * 0.1, type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Image src={src} alt="" fill sizes="44px" className="object-cover object-top" />
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="font-display text-2xl leading-none">
                  <Counter to={57.6} decimals={1} suffix=" mil" />
                </p>
                <p className="mt-1 text-xs text-blush">seguidoras no Instagram</p>
              </div>
            </motion.div>
          </div>

          <div className="relative min-h-[560px] lg:min-h-0">
            <motion.div
              className="absolute inset-x-6 bottom-0 top-4 sm:inset-x-12 lg:inset-x-6 lg:bottom-10 lg:right-12 lg:top-10"
              style={{ x: frameX, y: frameY }}
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ delay: d + 0.2, duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
            >
              <MirrorFrame className="h-full w-full">
                <motion.div className="absolute -inset-8" style={{ x: imgX, y: imgY }}>
                  <Image src="/images/vestido-caramelo.png" alt="Modelo com vestido longo caramelo no centro de Curitiba" fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover object-[50%_20%]" />
                </motion.div>
              </MirrorFrame>
            </motion.div>

            <motion.p
              aria-hidden
              className="pointer-events-none absolute bottom-28 right-8 z-10 font-display text-4xl italic text-paper [text-shadow:0_4px_30px_rgba(74,15,36,0.85)] sm:right-16 sm:text-6xl lg:bottom-40"
              initial={{ opacity: 0, rotate: -14, y: 20 }}
              animate={{ opacity: 1, rotate: -8, y: 0 }}
              transition={{ delay: d + 1.1, duration: 1 }}
            >
              do seu jeito
            </motion.p>

            <motion.div className="absolute -left-2 top-1/3 z-10 hidden lg:block" style={{ x: badgeX }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d + 1, type: "spring", stiffness: 160, damping: 14 }} className="relative h-36 w-36">
                <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow">
                  <defs>
                    <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <circle cx="100" cy="100" r="98" fill="#FBF7F2" />
                  <text fill="#4A0F24" fontSize="14.5" letterSpacing="3.2" fontWeight="600">
                    <textPath href="#badge-circle">ESPAÇO FLOR • 10 LOJAS • CURITIBA E SJP •</textPath>
                  </text>
                </svg>
                <FlowerMark className="absolute inset-[34%]" />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-6 left-10 z-10 flex items-center gap-3 rounded-2xl bg-paper/15 p-2.5 pr-5 backdrop-blur-xl sm:left-16 lg:bottom-16 lg:left-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d + 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative h-14 w-12 overflow-hidden rounded-xl">
                <Image src="/images/vestidos-cabide.png" alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-blush">Look da semana</p>
                <Link href="/catalogo/vestido-longo-caramelo" className="font-display text-lg leading-tight hover:text-blush">
                  Vestido Longo Caramelo
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
