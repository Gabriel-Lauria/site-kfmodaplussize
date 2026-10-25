import { Hero } from "@/components/home/Hero";
import { Categories, Featured, FinalCta, Manifesto, Perks } from "@/components/home/Sections";
import { Provador } from "@/components/home/Provador";
import { StoresShowcase } from "@/components/StoresShowcase";

export default function Home() {
  return (
    <>
      <Hero />
      <Perks />
      <Categories />
      <Featured />
      <StoresShowcase />
      <Manifesto />
      <Provador />
      <FinalCta />
    </>
  );
}
