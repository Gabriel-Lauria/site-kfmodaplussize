"use client";

import { motion } from "motion/react";
import { BrandMark } from "@/components/BrandMark";

// Cortina com a marca a cada troca de página.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[105] flex items-center justify-center bg-primary-deep"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div initial={{ rotate: 0, scale: 1 }} animate={{ rotate: 120, scale: 0.4, opacity: 0 }} transition={{ duration: 0.6 }}>
          <BrandMark className="h-16 w-16" />
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>
    </>
  );
}
