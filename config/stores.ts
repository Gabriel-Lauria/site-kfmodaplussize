// Lojas físicas do cliente. Com uma loja só, o site troca a vitrine de lojas
// pelo bloco "Visite a loja" (ver features.ts).

export const REGIONS = ["Centro"] as const;
export type Region = (typeof REGIONS)[number];

export type Store = {
  slug: string;
  name: string;
  region: Region;
  area: string;
  city: string;
  state?: string;
  postalCode?: string;
  mapsQuery: string;
  // posição no mapa ilustrativo (0–100 x 0–80)
  pin: { x: number; y: number };
};

export const STORES: Store[] = [
  { slug: "loja", name: "KF Moda Plus Size", region: "Centro", area: "Rua Mauá, 905", city: "Curitiba", state: "PR", postalCode: "80030-200", mapsQuery: "KF Moda Plus Size Rua Mauá, 905 Curitiba", pin: { x: 20, y: 25 } },
];

// Números de destaque na página /lojas, além do total de lojas.
export const STORE_STATS: { region: Region; label: string }[] = [];

// Desenho do mapa ilustrativo (viewBox 0 0 100 80), na ordem em que é pintado.
// "area" = contorno de cidade, "line" = rio/estrada, "street" = rua em destaque,
// "label" = nome de cidade, "street-label" = nome da rua. Deixe vazio para mostrar só os pinos.
export type MapItem =
  | { kind: "area" | "line" | "street"; d: string }
  | { kind: "label" | "street-label"; x: number; y: number; text: string; size: number; spacing?: number };

export const STORE_MAP: MapItem[] = [
  { kind: "area", d: "M14 30 C16 16 32 8 48 9 C64 8 80 14 84 26 C88 38 82 52 70 58 C58 66 40 66 28 62 C16 58 12 44 14 30 Z" },
  { kind: "label", x: 18, y: 20, text: "CURITIBA", size: 2.4, spacing: 0.6 },
];
