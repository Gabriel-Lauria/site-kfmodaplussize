"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, delay = 0, className, y = 28 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Cada palavra sobe de dentro de uma máscara.
export function SplitWords({
  text,
  className,
  delay = 0,
  wordClassName,
  onView = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  wordClassName?: (word: string, i: number) => string | undefined;
  onView?: boolean;
}) {
  const words = text.split(" ");
  const anim = { y: "0%", rotate: 0 };
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className={`inline-block ${wordClassName?.(w, i) ?? ""}`}
            initial={{ y: "110%", rotate: 6 }}
            {...(onView ? { whileInView: anim, viewport: { once: true } } : { animate: anim })}
            transition={{ duration: 1, delay: delay + i * 0.07, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export function Counter({ to, decimals = 0, suffix = "", className }: { to: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2, ease: EASE, onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
