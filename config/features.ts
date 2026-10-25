import type { SizePreset } from "./products";
import { STORES } from "./stores";

// "comprar": botões pedem a peça pelo WhatsApp.
// "agendar-prova": botões pedem um horário para provar na loja.
export type CtaMode = "comprar" | "agendar-prova";

export const FEATURES: {
  showStores: boolean;
  ctaMode: CtaMode;
  grade: SizePreset;
  showIntro: boolean;
  showCursor: boolean;
  showPetalTrail: boolean;
} = {
  // Vitrine com mapa e filtro por região. Com 1 loja vira o bloco "Visite a loja".
  showStores: STORES.length > 1,
  ctaMode: "comprar",
  // Grade padrão das peças (ver SIZE_PRESETS em products.ts).
  grade: "P-GG",
  // Abertura animada com a marca, uma vez por sessão.
  showIntro: true,
  // Bolha que segue o mouse no desktop.
  showCursor: true,
  // Partículas que caem do cursor no topo da home.
  showPetalTrail: true,
};
