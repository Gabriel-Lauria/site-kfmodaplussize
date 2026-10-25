import { Hero } from "@/components/home/Hero";
import { Categories, Featured, FinalCta, Manifesto, Perks } from "@/components/home/Sections";
import { Provador } from "@/components/home/Provador";
import { StoresShowcase } from "@/components/StoresShowcase";
import { StoreVisit } from "@/components/StoreVisit";
import { FEATURES } from "@/config";

export default function Home() {
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
