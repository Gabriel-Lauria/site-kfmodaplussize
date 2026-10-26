"use client";

import dynamic from "next/dynamic";
import { FEATURES } from "@/config";

// Home do layout "classic". Carregada à parte: no layout editorial nenhum destes componentes
// (nem a biblioteca de animação que eles usam) entra no JavaScript da página.
const Hero = dynamic(() => import("./Hero").then((m) => m.Hero));
const Perks = dynamic(() => import("./Sections").then((m) => m.Perks));
const Categories = dynamic(() => import("./Sections").then((m) => m.Categories));
const Featured = dynamic(() => import("./Sections").then((m) => m.Featured));
const Manifesto = dynamic(() => import("./Sections").then((m) => m.Manifesto));
const FinalCta = dynamic(() => import("./Sections").then((m) => m.FinalCta));
const Provador = dynamic(() => import("./Provador").then((m) => m.Provador));
const StoresShowcase = dynamic(() => import("../StoresShowcase").then((m) => m.StoresShowcase));
const StoreVisit = dynamic(() => import("../StoreVisit").then((m) => m.StoreVisit));

// sizeGuide e reviews são Server Components (com os dados do banco) passados prontos pela página
export function ClassicHome({ sizeGuide, reviews }: { sizeGuide: React.ReactNode; reviews: React.ReactNode }) {
  return (
    <>
      <Hero />
      <Perks />
      <Categories />
      <Featured />
      {sizeGuide}
      {FEATURES.showStores ? <StoresShowcase /> : <StoreVisit />}
      <Manifesto />
      <Provador />
      {reviews}
      <FinalCta />
    </>
  );
}

// vitrine de várias lojas (FEATURES.showStores), também carregada à parte
export function LazyStoresShowcase({ variant }: { variant?: "home" | "page" }) {
  return <StoresShowcase variant={variant} />;
}
