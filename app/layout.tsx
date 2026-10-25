import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CONTACT } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Espaço Flor | Moda Feminina em Curitiba e SJP",
    template: "%s | Espaço Flor",
  },
  description:
    "Moda feminina com 10 lojas em Curitiba e São José dos Pinhais. Vestidos, conjuntos, básicos e bolsas. Veja o catálogo e compre pelo WhatsApp.",
  openGraph: {
    title: "Espaço Flor | Moda Feminina",
    description: "10 lojas em Curitiba e SJP. Veja o catálogo e encontre a loja mais perto de você.",
    images: ["/images/vestido-caramelo.png"],
    locale: "pt_BR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Espaço Flor",
  description: "Moda feminina com 10 lojas em Curitiba e São José dos Pinhais.",
  telephone: "+55 41 99681-7936",
  sameAs: [CONTACT.instagram, CONTACT.linktree],
  areaServed: ["Curitiba", "São José dos Pinhais"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('ef-intro'))document.documentElement.classList.add('intro-done')}catch(e){}`,
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
