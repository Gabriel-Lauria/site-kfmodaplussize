import { Hero } from "@/components/home/Hero";
import { Categories, Featured, FinalCta, Manifesto, Perks } from "@/components/home/Sections";
import { Provador } from "@/components/home/Provador";
import { CategoryTiles, EditorialHero, InstagramStrip, Lookbook, ProductGrid, PromoBand, StoryVip, Testimonials } from "@/components/editorial/Home";
import { StoresShowcase } from "@/components/StoresShowcase";
import { StoreVisit } from "@/components/StoreVisit";
import { FEATURES } from "@/config";

export default function Home() {
  if (FEATURES.layout === "editorial") {
    return (
      <>
        <EditorialHero />
        <CategoryTiles />
        <ProductGrid />
        <Lookbook />
        <PromoBand />
        {FEATURES.showStores && <StoresShowcase />}
        <Testimonials />
        <InstagramStrip />
        <StoryVip />
      </>
    );
  }
  return (
    <>
      <Hero />
      <Perks />
      <Categories />
      <Featured />
      {FEATURES.showStores ? <StoresShowcase /> : <StoreVisit />}
      <Manifesto />
      <Provador />
      <FinalCta />
    </>
  );
}
