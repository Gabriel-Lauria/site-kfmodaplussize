"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { themeColor } from "@/lib/theme";

// Bolha que segue o mouse e vira etiqueta ("Ver", "Explorar"...) sobre elementos com data-cursor.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  const [colors, setColors] = useState({ dot: "transparent", label: "transparent" });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    if (!mq.matches) return;
    setColors({ dot: themeColor("accent", 0.85), label: themeColor("primary", 0.92) });

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: label ? 88 : 14,
          height: label ? 88 : 14,
          backgroundColor: label ? colors.label : colors.dot,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
