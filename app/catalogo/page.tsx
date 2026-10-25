import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { BRAND } from "@/config";

export const metadata: Metadata = {
  title: "Catálogo",
  description: BRAND.catalog.metaDescription,
};

export default function CatalogoPage() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
