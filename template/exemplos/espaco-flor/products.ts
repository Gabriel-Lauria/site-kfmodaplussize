import { FEATURES } from "./features";

export const CATEGORIES = ["Vestidos", "Conjuntos", "Blusas", "Básicos", "Bolsas"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Color = { name: string; hex: string };

export type Product = {
  slug: string;
  name: string;
  category: Category;
  image: string;
  hoverImage?: string;
  colors: Color[];
  sizes: string[];
  tag?: string;
  description: string;
};

// Grades prontas. A usada por padrão é escolhida em features.ts (FEATURES.grade).
export const SIZE_PRESETS = {
  "P-GG": ["P", "M", "G", "GG"],
  "PP-GG": ["PP", "P", "M", "G", "GG"],
  "G1-G5": ["G1", "G2", "G3", "G4", "G5"],
  "42-54": ["42", "44", "46", "48", "50", "52", "54"],
  "36-46": ["36", "38", "40", "42", "44", "46"],
} as const satisfies Record<string, readonly string[]>;
export type SizePreset = keyof typeof SIZE_PRESETS;

const GRADE = [...SIZE_PRESETS[FEATURES.grade]];

export const PRODUCTS: Product[] = [
  {
    slug: "vestido-longo-caramelo",
    name: "Vestido Longo Caramelo",
    category: "Vestidos",
    image: "/brand/products/vestido-caramelo.png",
    hoverImage: "/brand/products/vestidos-cabide.png",
    colors: [
      { name: "Caramelo", hex: "#7B3B1C" },
      { name: "Off-white", hex: "#EFE8DC" },
      { name: "Menta", hex: "#CFE3D6" },
    ],
    sizes: GRADE,
    tag: "Look da semana",
    description: "Tomara que caia de corte acinturado e saia ampla com bolsos. Fluido, elegante e pronto para o centro de Curitiba.",
  },
  {
    slug: "vestido-plissado-floral",
    name: "Vestido Plissado Floral",
    category: "Vestidos",
    image: "/brand/products/vestido-plissado.png",
    colors: [{ name: "Creme floral", hex: "#F1DCCB" }],
    sizes: GRADE,
    tag: "Novidade",
    description: "Plissado leve com estampa de flores em aquarela. Um vestido que pede sol, salto alto e bolsa clara.",
  },
  {
    slug: "vestido-boho-esmeralda",
    name: "Vestido Boho Esmeralda",
    category: "Vestidos",
    image: "/brand/products/vestido-boho.png",
    colors: [{ name: "Esmeralda", hex: "#4D9AA0" }],
    sizes: GRADE,
    description: "Maxi vestido com mangas sino, decote com amarração e camadas que dançam a cada passo.",
  },
  {
    slug: "vestido-tule-cacau",
    name: "Vestido Tule Cacau",
    category: "Vestidos",
    image: "/brand/products/vestido-cacau.png",
    colors: [{ name: "Cacau", hex: "#3A2620" }],
    sizes: GRADE,
    tag: "Festa",
    description: "Tule com transparência na medida, franzido lateral e fenda. Sensual sem esforço.",
  },
  {
    slug: "vestido-midi-alcas",
    name: "Vestido Midi de Alças",
    category: "Vestidos",
    image: "/brand/products/vestidos-cabide.png",
    colors: [
      { name: "Off-white", hex: "#EFE8DC" },
      { name: "Menta", hex: "#CFE3D6" },
      { name: "Caramelo", hex: "#9A4E1F" },
      { name: "Preto", hex: "#1C1A1A" },
    ],
    sizes: GRADE,
    description: "Recortes que desenham a silhueta e alças largas. O curinga que funciona do trabalho ao happy hour.",
  },
  {
    slug: "conjunto-azul-lenco",
    name: "Conjunto Azul com Lenço",
    category: "Conjuntos",
    image: "/brand/products/conjunto-azul.png",
    colors: [{ name: "Azul royal", hex: "#2F4F8F" }],
    sizes: GRADE,
    tag: "Mais pedido",
    description: "Top reto e calça pantalona em azul profundo, finalizados com lenço de seda na cintura.",
  },
  {
    slug: "conjunto-tule-noir",
    name: "Conjunto Tule Noir",
    category: "Conjuntos",
    image: "/brand/products/tule-noir.png",
    colors: [{ name: "Preto", hex: "#141213" }],
    sizes: GRADE,
    description: "Blusa gola alta com mangas de tule e calça de alfaiataria. Combine com cinto dourado e pronto.",
  },
  {
    slug: "blusa-assimetrica-floral",
    name: "Blusa Assimétrica Floral",
    category: "Blusas",
    image: "/brand/products/blusa-assimetrica.png",
    hoverImage: "/brand/products/estampas.png",
    colors: [
      { name: "Terracota", hex: "#C0702E" },
      { name: "Azul porcelana", hex: "#2F55A4" },
      { name: "Preto floral", hex: "#2A2220" },
    ],
    sizes: GRADE,
    tag: "Novidade",
    description: "Frente única com babado assimétrico e estampas exclusivas. Fica linda com calça de linho clara.",
  },
  {
    slug: "regata-basica-alcinha",
    name: "Regata Básica Alcinha",
    category: "Básicos",
    image: "/brand/products/regatas-modelo.png",
    hoverImage: "/brand/products/regatas-cores.png",
    colors: [
      { name: "Preto", hex: "#151314" },
      { name: "Branco", hex: "#F4F2EE" },
      { name: "Nude", hex: "#CFAE93" },
      { name: "Chocolate", hex: "#4B2618" },
      { name: "Vermelho", hex: "#9E1B22" },
    ],
    sizes: GRADE,
    tag: "Básico essencial",
    description: "Alcinha dupla, toque macio e caimento que não marca. Tenha em todas as cores.",
  },
  {
    slug: "bolsa-saco-petroleo",
    name: "Bolsa Saco Petróleo",
    category: "Bolsas",
    image: "/brand/products/bolsa-petroleo.png",
    colors: [{ name: "Petróleo", hex: "#1F4652" }],
    sizes: ["Único"],
    description: "Bolsa franzida com alça amarrada em lenço estampado. Cabe tudo e ainda vira o assunto do look.",
  },
  {
    slug: "bolsa-corrente-nude",
    name: "Bolsa Corrente Nude",
    category: "Bolsas",
    image: "/brand/products/bolsa-nude.png",
    colors: [{ name: "Nude", hex: "#D2A88E" }],
    sizes: ["Único"],
    description: "Textura granulada, aba estruturada e alça de corrente entrelaçada. Clássica de verdade.",
  },
  {
    slug: "kimono-estampado",
    name: "Kimono Estampado",
    category: "Blusas",
    image: "/brand/products/estampas.png",
    hoverImage: "/brand/products/blusa-assimetrica.png",
    colors: [
      { name: "Terracota", hex: "#C0702E" },
      { name: "Azul porcelana", hex: "#2F55A4" },
      { name: "Preto floral", hex: "#2A2220" },
    ],
    sizes: ["P/M", "G/GG"],
    description: "Mangas amplas e pontas que caem em movimento. Joga por cima de qualquer básico.",
  },
];

// Os 4 cards "Escolha por onde começar" da home (foto + foto do hover).
export const HOME_CATEGORIES: { name: Category; image: string; hover: string }[] = [
  { name: "Vestidos", image: "/brand/products/vestido-plissado.png", hover: "/brand/products/vestido-boho.png" },
  { name: "Conjuntos", image: "/brand/products/conjunto-azul.png", hover: "/brand/products/tule-noir.png" },
  { name: "Básicos", image: "/brand/products/regatas-modelo.png", hover: "/brand/products/regatas-cores.png" },
  { name: "Bolsas", image: "/brand/products/bolsa-petroleo.png", hover: "/brand/products/bolsa-nude.png" },
];

// Peças da seção "provador" (rolagem horizontal), na ordem em que aparecem.
export const LOOKS = [
  "conjunto-tule-noir",
  "vestido-tule-cacau",
  "vestido-boho-esmeralda",
  "vestido-plissado-floral",
  "blusa-assimetrica-floral",
  "conjunto-azul-lenco",
];
