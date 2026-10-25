"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { BRAND, waLink } from "@/config";
import { WhatsApp } from "./Icons";

// Aparece depois da primeira dobra. A dica "Posso ajudar?" surge uma vez e some sozinha.
export function FloatingWhatsApp() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [hint, setHint] = useState(false);
  const [hinted, setHinted] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 700));

  useEffect(() => {
    if (!visible || hinted) return;
    setHinted(true);
    const show = setTimeout(() => setHint(true), 1200);
    const hide = setTimeout(() => setHint(false), 6500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [visible, hinted]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 sm:bottom-8 sm:right-8"
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatePresence>
            {hint && (
              <motion.span
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="rounded-full bg-paper px-4 py-2 text-sm shadow-lg"
                role="status"
              >
                {BRAND.floatingHint}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.a
            href={waLink(BRAND.messages.help)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp"
            className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)]"
            whileHover={{ scale: 1.1, rotate: -8 }}
            whileTap={{ scale: 0.92 }}
            onPointerEnter={() => setHint(true)}
            onPointerLeave={() => setHint(false)}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.4s]" />
            <WhatsApp className="relative h-7 w-7" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
