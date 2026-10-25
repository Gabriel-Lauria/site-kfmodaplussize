import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Vestidos, conjuntos, blusas, básicos e bolsas da Espaço Flor. Escolha suas peças e peça pelo WhatsApp.",
};

export default function CatalogoPage() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
