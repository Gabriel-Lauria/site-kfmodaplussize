export const CONTACT = {
  whatsapp: "5541996817936",
  whatsappLabel: "(41) 99681-7936",
  instagram: "https://www.instagram.com/mundoespacoflor/",
  instagramHandle: "@mundoespacoflor",
  linktree: "https://linktr.ee/espacoflormundo",
  founder: "@anapaulathomazi",
  founderUrl: "https://www.instagram.com/anapaulathomazi/",
};

export function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

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

const GRADE = ["P", "M", "G", "GG"];

export const PRODUCTS: Product[] = [
  {
    slug: "vestido-longo-caramelo",
    name: "Vestido Longo Caramelo",
    category: "Vestidos",
    image: "/images/vestido-caramelo.png",
    hoverImage: "/images/vestidos-cabide.png",
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
    image: "/images/vestido-plissado.png",
    colors: [{ name: "Creme floral", hex: "#F1DCCB" }],
    sizes: GRADE,
    tag: "Novidade",
    description: "Plissado leve com estampa de flores em aquarela. Um vestido que pede sol, salto alto e bolsa clara.",
  },
  {
    slug: "vestido-boho-esmeralda",
    name: "Vestido Boho Esmeralda",
    category: "Vestidos",
    image: "/images/vestido-boho.png",
    colors: [{ name: "Esmeralda", hex: "#4D9AA0" }],
    sizes: GRADE,
    description: "Maxi vestido com mangas sino, decote com amarração e camadas que dançam a cada passo.",
  },
  {
    slug: "vestido-tule-cacau",
    name: "Vestido Tule Cacau",
    category: "Vestidos",
    image: "/images/vestido-cacau.png",
    colors: [{ name: "Cacau", hex: "#3A2620" }],
    sizes: GRADE,
    tag: "Festa",
    description: "Tule com transparência na medida, franzido lateral e fenda. Sensual sem esforço.",
  },
  {
    slug: "vestido-midi-alcas",
    name: "Vestido Midi de Alças",
    category: "Vestidos",
    image: "/images/vestidos-cabide.png",
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
    image: "/images/conjunto-azul.png",
    colors: [{ name: "Azul royal", hex: "#2F4F8F" }],
    sizes: GRADE,
    tag: "Mais pedido",
    description: "Top reto e calça pantalona em azul profundo, finalizados com lenço de seda na cintura.",
  },
  {
    slug: "conjunto-tule-noir",
    name: "Conjunto Tule Noir",
    category: "Conjuntos",
    image: "/images/tule-noir.png",
    colors: [{ name: "Preto", hex: "#141213" }],
    sizes: GRADE,
    description: "Blusa gola alta com mangas de tule e calça de alfaiataria. Combine com cinto dourado e pronto.",
  },
  {
    slug: "blusa-assimetrica-floral",
    name: "Blusa Assimétrica Floral",
    category: "Blusas",
    image: "/images/blusa-assimetrica.png",
    hoverImage: "/images/estampas.png",
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
    image: "/images/regatas-modelo.png",
    hoverImage: "/images/regatas-cores.png",
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
    image: "/images/bolsa-petroleo.png",
    colors: [{ name: "Petróleo", hex: "#1F4652" }],
    sizes: ["Único"],
    description: "Bolsa franzida com alça amarrada em lenço estampado. Cabe tudo e ainda vira o assunto do look.",
  },
  {
    slug: "bolsa-corrente-nude",
    name: "Bolsa Corrente Nude",
    category: "Bolsas",
    image: "/images/bolsa-nude.png",
    colors: [{ name: "Nude", hex: "#D2A88E" }],
    sizes: ["Único"],
    description: "Textura granulada, aba estruturada e alça de corrente entrelaçada. Clássica de verdade.",
  },
  {
    slug: "kimono-estampado",
    name: "Kimono Estampado",
    category: "Blusas",
    image: "/images/estampas.png",
    hoverImage: "/images/blusa-assimetrica.png",
    colors: [
      { name: "Terracota", hex: "#C0702E" },
      { name: "Azul porcelana", hex: "#2F55A4" },
      { name: "Preto floral", hex: "#2A2220" },
    ],
    sizes: ["P/M", "G/GG"],
    description: "Mangas amplas e pontas que caem em movimento. Joga por cima de qualquer básico.",
  },
];

export const REGIONS = ["Rua XV", "Centro", "Shoppings", "Bairros", "São José dos Pinhais"] as const;
export type Region = (typeof REGIONS)[number];

export type Store = {
  slug: string;
  name: string;
  region: Region;
  // TODO: substituir pela rua e número exatos de cada loja.
  area: string;
  city: "Curitiba" | "São José dos Pinhais";
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

export function storeWhatsapp(store: Store) {
  return waLink(`Olá! Vim pelo site e quero falar com a loja ${store.name} da Espaço Flor.`);
}
