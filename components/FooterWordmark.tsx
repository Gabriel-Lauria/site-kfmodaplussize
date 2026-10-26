"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BRAND } from "@/config";
import { BrandMark } from "./BrandMark";

// nome gigante no fim da página (layout "classic"); use footer.wordmark para uma versão curta
const FOOTER_WORDMARK = (BRAND.footer as { wordmark?: [string, string] }).wordmark ?? BRAND.wordmark;

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 0]);
  return (
    <div ref={ref} className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
      <motion.p style={{ y }} className="flex select-none items-center gap-[2vw] whitespace-nowrap font-display text-[17vw] leading-[0.8] tracking-tight text-paper/[0.07]">
        {FOOTER_WORDMARK[0]}
        <motion.span style={{ rotate }} className="inline-block">
          <BrandMark mono="var(--color-accent)" className="h-[12vw] w-[12vw] opacity-60" />
        </motion.span>
        {FOOTER_WORDMARK[1]}
      </motion.p>
    </div>
  );
}
