import { About, CategoryTiles, ContactBlock, EditorialHero, ProductGrid, PromoBand, Reviews, SizeGuide } from "@/components/editorial/Home";
import { ClassicHome, LazyStoresShowcase } from "@/components/home/ClassicHome";
import { FEATURES } from "@/config";
import { getSiteData } from "@/lib/data";

export default async function Home() {
  const data = await getSiteData();
  if (FEATURES.layout === "classic") {
    return <ClassicHome sizeGuide={<SizeGuide data={data} />} reviews={<Reviews data={data} />} />;
  }
  return (
    <>
      <EditorialHero data={data} />
      <ProductGrid data={data} />
      <CategoryTiles data={data} />
      <PromoBand data={data} />
      <About data={data} />
      <SizeGuide data={data} />
      <Reviews data={data} />
      {FEATURES.showStores && <LazyStoresShowcase />}
      <ContactBlock data={data} />
    </>
  );
}
