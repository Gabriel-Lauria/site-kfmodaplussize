"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { FEATURES } from "@/config";
import { setLenis } from "@/lib/lenis";
import { SelectionProvider } from "./Selection";
import { Cursor } from "./Cursor";
import { Intro } from "./Intro";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(lenis);
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SelectionProvider>
        <SmoothScroll />
        {FEATURES.showIntro && <Intro />}
        {FEATURES.showCursor && <Cursor />}
        {children}
        <FloatingWhatsApp />
      </SelectionProvider>
    </MotionConfig>
  );
}
