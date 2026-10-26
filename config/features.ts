import type { SizePreset } from "./products";
import { STORES } from "./stores";

// "comprar": botões pedem a peça pelo WhatsApp.
// "agendar-prova": botões pedem um horário para provar na loja.
export type CtaMode = "comprar" | "agendar-prova";
// "classic": hero escuro com moldura de espelho, vitrine em carrossel, provador horizontal.
// "editorial": hero claro dividido, categorias em blocos, grade de produtos, lookbook e faixa promocional.
export type Layout = "classic" | "editorial";
// Moldura das fotos grandes: "mirror" (ondulada), "arch" (arco no topo) ou "straight" (cantos retos).
export type Frame = "mirror" | "arch" | "straight";

export const FEATURES: {
  layout: Layout;
  frame: Frame;
  showStores: boolean;
  ctaMode: CtaMode;
  grade: SizePreset;
  showIntro: boolean;
  showCursor: boolean;
  showPetalTrail: boolean;
} = {
  layout: "editorial",
  frame: "arch",
  // Vitrine com mapa e filtro por região. Com 1 loja vira o bloco "Visite a loja".
  showStores: STORES.length > 1,
  ctaMode: "comprar",
  // Grade padrão das peças (ver SIZE_PRESETS em products.ts).
  grade: "42-54",
  // Abertura animada com a marca, uma vez por sessão.
  showIntro: false,
  // Bolha que segue o mouse no desktop.
  showCursor: true,
  // Partículas que caem do cursor no topo da home.
  showPetalTrail: true,
};
