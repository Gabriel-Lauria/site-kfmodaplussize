import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { BRAND } from "@/config";

export const metadata: Metadata = {
  title: "Catálogo",
  description: BRAND.catalog.metaDescription,
  alternates: { canonical: "/catalogo" },
};

// O filtro vem da URL já no servidor: o HTML chega com as peças (bom para o Google e para o LCP).
export default async function CatalogoPage({ searchParams }: { searchParams: Promise<{ categoria?: string; peca?: string }> }) {
  const { categoria, peca } = await searchParams;
  return <Catalog initialCategory={categoria ?? null} initialPiece={peca ?? null} />;
}
