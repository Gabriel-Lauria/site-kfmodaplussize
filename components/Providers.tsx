"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { FEATURES } from "@/config";
import { setLenis } from "@/lib/lenis";
import { SelectionProvider } from "./Selection";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

// só no computador, carregado depois: não pesa na primeira tela do celular
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), { ssr: false });
const Intro = dynamic(() => import("./Intro").then((m) => m.Intro), { ssr: false });

function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // no celular (toque) a rolagem nativa já é suave; o Lenis só pesaria
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
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
    <SelectionProvider>
      <SmoothScroll />
      {FEATURES.showIntro && <Intro />}
      {FEATURES.showCursor && <Cursor />}
      {children}
      <FloatingWhatsApp />
    </SelectionProvider>
  );
}
