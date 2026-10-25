"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FlowerMark } from "./FlowerMark";

// Abertura: a flor desabrocha e "mergulhamos" nela para revelar o site. Uma vez por sessão.
export function Intro() {
  const [show, setShow] = useState(true);
  const [dive, setDive] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-done")) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem("ef-intro", "1");
    } catch {}
    const t1 = setTimeout(() => setDive(true), 1350);
    const t2 = setTimeout(() => setShow(false), 2050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-wine-deep"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-5"
            animate={dive ? { scale: 28, rotate: 90 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.84, 0] }}
          >
            <motion.div animate={{ rotate: 60 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
              <FlowerMark bloom className="h-24 w-24" />
            </motion.div>
          </motion.div>
          <motion.p
            className="absolute bottom-[38%] translate-y-24 font-display text-3xl italic text-blush"
            initial={{ opacity: 0, y: 12 }}
            animate={dive ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ delay: dive ? 0 : 0.6, duration: 0.5 }}
          >
            Espaço Flor
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
