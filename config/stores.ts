// Lojas físicas do cliente. Com uma loja só, o site troca a vitrine de lojas
// pelo bloco "Visite a loja" (ver features.ts).

export const REGIONS = ["Rua XV", "Centro", "Shoppings", "Bairros", "São José dos Pinhais"] as const;
export type Region = (typeof REGIONS)[number];

export type Store = {
  slug: string;
  name: string;
  region: Region;
  // TODO: substituir pela rua e número exatos de cada loja.
  area: string;
  city: string;
  state?: string;
  postalCode?: string;
  mapsQuery: string;
  // posição no mapa ilustrativo (0–100 x 0–80)
  pin: { x: number; y: number };
};

export const STORES: Store[] = [
  { slug: "rua-xv-palacio", name: "Rua XV · Palácio", region: "Rua XV", area: "Rua XV de Novembro, Centro", city: "Curitiba", mapsQuery: "Espaço Flor Rua XV de Novembro Palácio Curitiba", pin: { x: 39, y: 33 } },
  { slug: "rua-xv-marechal", name: "Rua XV · Marechal", region: "Rua XV", area: "Rua XV de Novembro, Centro", city: "Curitiba", mapsQuery: "Espaço Flor Rua XV de Novembro Marechal Curitiba", pin: { x: 44, y: 31.5 } },
  { slug: "rua-xv-chafariz", name: "Rua XV · Chafariz", region: "Rua XV", area: "Rua XV de Novembro, Centro", city: "Curitiba", mapsQuery: "Espaço Flor Rua XV de Novembro Chafariz Curitiba", pin: { x: 49, y: 30.5 } },
  { slug: "rua-xv-federal", name: "Rua XV · Federal", region: "Rua XV", area: "Rua XV de Novembro, Centro", city: "Curitiba", mapsQuery: "Espaço Flor Rua XV de Novembro Federal Curitiba", pin: { x: 54, y: 30 } },
  { slug: "joao-negrao", name: "Rua João Negrão", region: "Centro", area: "Rua João Negrão, Centro", city: "Curitiba", mapsQuery: "Espaço Flor Rua João Negrão Curitiba", pin: { x: 52, y: 38 } },
  { slug: "estacao", name: "Shopping Estação", region: "Shoppings", area: "Shopping Estação, Centro", city: "Curitiba", mapsQuery: "Espaço Flor Shopping Estação Curitiba", pin: { x: 45, y: 42 } },
  { slug: "palladium", name: "Shopping Palladium", region: "Shoppings", area: "Shopping Palladium, Portão", city: "Curitiba", mapsQuery: "Espaço Flor Shopping Palladium Curitiba", pin: { x: 27, y: 50 } },
  { slug: "jockey-plaza", name: "Jockey Plaza", region: "Shoppings", area: "Jockey Plaza Shopping, Tarumã", city: "Curitiba", mapsQuery: "Espaço Flor Jockey Plaza Shopping Curitiba", pin: { x: 70, y: 24 } },
  { slug: "jardim-das-americas", name: "Jardim das Américas", region: "Bairros", area: "Jardim das Américas", city: "Curitiba", mapsQuery: "Espaço Flor Jardim das Américas Curitiba", pin: { x: 67, y: 49 } },
  { slug: "sao-jose", name: "São José", region: "São José dos Pinhais", area: "Centro de São José dos Pinhais", city: "São José dos Pinhais", mapsQuery: "Espaço Flor São José dos Pinhais", pin: { x: 82, y: 63 } },
];

// Números de destaque na página /lojas, além do total de lojas.
export const STORE_STATS: { region: Region; label: string }[] = [
  { region: "Rua XV", label: "na Rua XV" },
  { region: "Shoppings", label: "shoppings" },
];

// Desenho do mapa ilustrativo (viewBox 0 0 100 80), na ordem em que é pintado.
// "area" = contorno de cidade, "line" = rio/estrada, "street" = rua em destaque,
// "label" = nome de cidade, "street-label" = nome da rua. Deixe vazio para mostrar só os pinos.
export type MapItem =
  | { kind: "area" | "line" | "street"; d: string }
  | { kind: "label" | "street-label"; x: number; y: number; text: string; size: number; spacing?: number };

export const STORE_MAP: MapItem[] = [
  { kind: "line", d: "M6 70 C26 58 46 74 66 64 S 92 58 99 46" },
  { kind: "area", d: "M14 30 C16 16 32 8 48 9 C64 8 80 14 84 26 C88 38 82 52 70 58 C58 66 40 66 28 62 C16 58 12 44 14 30 Z" },
  { kind: "area", d: "M72 58 C79 53 92 55 95 64 C97 72 90 78 80 77 C71 76 66 66 72 58 Z" },
  { kind: "label", x: 18, y: 20, text: "CURITIBA", size: 2.4, spacing: 0.6 },
  { kind: "label", x: 74, y: 76, text: "SÃO JOSÉ DOS PINHAIS", size: 2, spacing: 0.4 },
  { kind: "street", d: "M36 34.2 C42 32 50 30.6 57.5 29.6" },
  { kind: "street-label", x: 35, y: 28.2, text: "Rua XV", size: 1.9 },
];
