import { BRAND, FEATURES, STORES } from "@/config";
import { getSiteData } from "@/lib/data";
import { Providers } from "./Providers";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SiteDataProvider } from "./SiteData";

// JSON dentro de <script>: escapa "<" para um texto do painel não fechar a tag.
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

// Cabeçalho, rodapé, dados do banco e dados estruturados da loja. Usado pelas páginas públicas e pelo 404.
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const data = await getSiteData();
  const c = data.content.contact;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: BRAND.name,
    description: BRAND.seo.schemaDescription,
    url: BRAND.siteUrl,
    image: `${BRAND.siteUrl}${BRAND.seo.ogImage}`,
    telephone: `+${c.whatsapp}`,
    sameAs: [c.instagram].filter(Boolean),
    areaServed: BRAND.seo.areaServed,
    ...(!FEATURES.showStores &&
      c.street && {
        address: {
          "@type": "PostalAddress",
          streetAddress: c.street,
          addressLocality: c.city,
          addressRegion: c.state,
          postalCode: c.postalCode,
          addressCountry: "BR",
        },
      }),
    ...(FEATURES.showStores && {
      location: STORES.map((s) => ({ "@type": "Place", name: s.name, address: [s.area, s.city, s.state].filter(Boolean).join(", ") })),
    }),
  };

  return (
    <SiteDataProvider data={data}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <Providers>
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </SiteDataProvider>
  );
}
