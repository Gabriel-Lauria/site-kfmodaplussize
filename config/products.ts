import { FEATURES } from "./features";

export const CATEGORIES = ["Conjuntos", "Vestidos", "Camisas", "Calças"] as const;
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
    slug: "conjunto-suede-marsala",
    name: "Conjunto Suede Marsala",
    category: "Conjuntos",
    image: "/brand/products/conjunto-suede-marsala.jpg",
    hoverImage: "/brand/products/vestido-midi-babado.jpg",
    colors: [{ name: "Marsala", hex: "#7a1f2e" }],
    sizes: GRADE,
    tag: "Look da semana",
    description: "Vestido curto e jaqueta em suede com cinto de fivela dourada. Juntos para o evento, separados para o dia a dia.",
  },
  {
    slug: "conjunto-trico-chocolate",
    name: "Conjunto Tricô Chocolate",
    category: "Conjuntos",
    image: "/brand/products/conjunto-trico-chocolate.jpg",
    colors: [{ name: "Chocolate", hex: "#4a2a22" }],
    sizes: GRADE,
    tag: "Mais pedido",
    description: "Cardigã com vivos off-white, regata e calça pantalona em tricô. Confortável o dia todo e elegante do mesmo jeito.",
  },
  {
    slug: "camisa-cetim",
    name: "Camisa de Cetim",
    category: "Camisas",
    image: "/brand/products/camisa-cetim-vinho.jpg",
    hoverImage: "/brand/products/calca-pantalona-vinho.jpg",
    colors: [
      { name: "Vinho", hex: "#6e1e2b" },
      { name: "Preto", hex: "#161314" },
    ],
    sizes: GRADE,
    tag: "Novidade",
    description: "Cetim com brilho suave, botões encapados e manga longa. Por dentro da pantalona ou solta com jeans.",
  },
  {
    slug: "calca-pantalona-cinto",
    name: "Calça Pantalona com Cinto",
    category: "Calças",
    image: "/brand/products/calca-pantalona-vinho.jpg",
    hoverImage: "/brand/products/camisa-cetim-vinho.jpg",
    colors: [
      { name: "Vinho", hex: "#5a1622" },
      { name: "Chocolate", hex: "#4a2a22" },
    ],
    sizes: GRADE,
    description: "Cintura alta com faixa e fivela, pernas amplas e caimento que alonga. A alfaiataria que veste do 42 ao 54.",
  },
  {
    slug: "vestido-midi-babado",
    name: "Vestido Midi com Babado",
    category: "Vestidos",
    image: "/brand/products/vestido-midi-babado.jpg",
    colors: [{ name: "Preto", hex: "#141213" }],
    sizes: GRADE,
    tag: "Festa",
    description: "Midi de alfaiataria com babado assimétrico na barra. Marca a cintura e deixa o movimento por conta da saia.",
  },
  {
    slug: "conjunto-poa-listras",
    name: "Conjunto Poá e Listras",
    category: "Conjuntos",
    image: "/brand/products/conjunto-poa-listras.jpg",
    colors: [{ name: "Azul serenity", hex: "#a9cbea" }],
    sizes: GRADE,
    tag: "Novidade",
    description: "Cropped de poá com decote quadrado e saia midi listrada. Use junto ou misture com básicos.",
  },
];

// Os 4 cards "Escolha por onde começar" da home (foto + foto do hover).
export const HOME_CATEGORIES: { name: Category; image: string; hover: string }[] = [
  { name: "Conjuntos", image: "/brand/products/conjunto-poa-listras.jpg", hover: "/brand/products/conjunto-trico-chocolate.jpg" },
  { name: "Vestidos", image: "/brand/products/vestido-midi-babado.jpg", hover: "/brand/products/conjunto-suede-marsala.jpg" },
  { name: "Camisas", image: "/brand/products/camisa-cetim-vinho.jpg", hover: "/brand/products/calca-pantalona-vinho.jpg" },
  { name: "Calças", image: "/brand/products/calca-pantalona-vinho.jpg", hover: "/brand/products/camisa-cetim-vinho.jpg" },
];

// Peças da seção "provador" (rolagem horizontal), na ordem em que aparecem.
export const LOOKS = [
  "conjunto-trico-chocolate",
  "camisa-cetim",
  "vestido-midi-babado",
  "calca-pantalona-cinto",
  "conjunto-suede-marsala",
  "conjunto-poa-listras",
];
