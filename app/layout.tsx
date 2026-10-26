import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { BRAND, FEATURES, SITE_URL, storageKey } from "@/config";

// ==== FONTES ==============================================================
// Troque as duas importações e chamadas abaixo para mudar a tipografia.
// display = títulos (precisa de itálico); sans = textos e botões.
// Mantenha as variáveis --font-brand-display e --font-brand-sans.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-brand-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Montserrat({
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
    siteName: BRAND.name,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fcf7f3",
};

// Sem a intro, o hero já começa sem esperar por ela.
const INTRO_SCRIPT = FEATURES.showIntro
  ? `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('${storageKey("intro")}'))document.documentElement.classList.add('intro-done')}catch(e){}`
  : `document.documentElement.classList.add('js','intro-done')`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: INTRO_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
