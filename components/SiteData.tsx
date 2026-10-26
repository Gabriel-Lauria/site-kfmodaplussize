"use client";

import { createContext, useContext, useMemo } from "react";
import { instagramHandle, phoneLabel, whatsappLink } from "@/lib/catalog";
import type { Product, SiteData } from "@/lib/types";

type Ctx = SiteData & {
  wa: (message: string) => string;
  whatsappLabel: string;
  instagramHandle: string;
  find: (slug: string) => Product | undefined;
};

const SiteDataContext = createContext<Ctx | null>(null);

// Dados do site carregados no servidor (app/(site)/layout.tsx) e entregues aos componentes do cliente.
export function SiteDataProvider({ data, children }: { data: SiteData; children: React.ReactNode }) {
  const value = useMemo<Ctx>(() => {
    const phone = data.content.contact.whatsapp;
    return {
      ...data,
      wa: (message) => whatsappLink(phone, message),
      whatsappLabel: phoneLabel(phone),
      instagramHandle: instagramHandle(data.content.contact.instagram),
      find: (slug) => data.products.find((p) => p.slug === slug),
    };
  }, [data]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSite fora do SiteDataProvider");
  return ctx;
}
