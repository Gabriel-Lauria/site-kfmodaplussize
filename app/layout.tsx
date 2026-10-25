import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BRAND, CONTACT, FEATURES, SITE_URL, STORES, formatPhone, storageKey } from "@/config";

// ==== FONTES ==============================================================
// Troque as duas importações e chamadas abaixo para mudar a tipografia.
// display = títulos (precisa de itálico); sans = textos e botões.
// Mantenha as variáveis --font-brand-display e --font-brand-sans.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-brand-display",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-brand-sans",
});
// ==========================================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND.seo.title,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.seo.description,
  openGraph: {
    title: BRAND.seo.ogTitle,
    description: BRAND.seo.ogDescription,
    images: [BRAND.seo.ogImage],
    locale: "pt_BR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: BRAND.name,
  description: BRAND.seo.schemaDescription,
  telephone: formatPhone(CONTACT.whatsapp),
  sameAs: [CONTACT.instagram, CONTACT.linktree].filter(Boolean),
  areaServed: BRAND.seo.areaServed,
  ...(STORES.length === 1 && {
    address: {
      "@type": "PostalAddress",
      streetAddress: STORES[0].area,
      addressLocality: STORES[0].city,
      addressRegion: STORES[0].state,
      postalCode: STORES[0].postalCode,
      addressCountry: "BR",
    },
  }),
};

// Sem a intro, o hero já começa sem esperar por ela.
const INTRO_SCRIPT = FEATURES.showIntro
  ? `try{if(sessionStorage.getItem('${storageKey("intro")}'))document.documentElement.classList.add('intro-done')}catch(e){}`
  : `document.documentElement.classList.add('intro-done')`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: INTRO_SCRIPT,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
