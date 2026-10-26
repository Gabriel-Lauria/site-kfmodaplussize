"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { storageKey } from "@/config";
import { useSite } from "./SiteData";
import { lockScroll } from "@/lib/lenis";

export type Flight = { id: number; image: string; from: DOMRect; to: DOMRect };

// gaveta + foto voando até o coração: com animação, baixados só na primeira interação
const SelectionOverlay = dynamic(() => import("./SelectionOverlay").then((m) => m.SelectionOverlay), { ssr: false });

type Ctx = {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string, origin?: HTMLElement | null) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  bump: number;
};

const SelectionContext = createContext<Ctx | null>(null);

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection fora do SelectionProvider");
  return ctx;
}

const KEY = storageKey("selecao");

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bump, setBump] = useState(0);
  const { products: PRODUCTS } = useSite();
  // a gaveta só é montada depois do primeiro uso
  const [used, setUsed] = useState(false);
  useEffect(() => {
    if (open || flights.length) setUsed(true);
  }, [open, flights.length]);
  const landed = useCallback((id: number) => {
    setFlights((all) => all.filter((x) => x.id !== id));
    setBump((b) => b + 1);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setItems(saved.filter((s) => PRODUCTS.some((p) => p.slug === s)));
    } catch {}
  }, [PRODUCTS]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    lockScroll(open);
  }, [open]);

  const toggle = useCallback((slug: string, origin?: HTMLElement | null) => {
    setItems((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      const target = document.getElementById("selection-target");
      const product = PRODUCTS.find((p) => p.slug === slug);
      if (origin && target && product && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setFlights((f) => [...f, { id: Date.now(), image: product.image, from: origin.getBoundingClientRect(), to: target.getBoundingClientRect() }]);
      } else {
        setBump((b) => b + 1);
      }
      return [...prev, slug];
    });
  }, [PRODUCTS]);

  const has = useCallback((slug: string) => items.includes(slug), [items]);

  return (
    <SelectionContext.Provider value={{ items, has, toggle, open, setOpen, bump }}>
      {children}
      {used && <SelectionOverlay flights={flights} onLanded={landed} />}
    </SelectionContext.Provider>
  );
}
