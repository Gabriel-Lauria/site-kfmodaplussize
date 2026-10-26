import { FEATURES } from "./features";

export const CATEGORIES = ["Conjuntos", "Vestidos", "Macacões", "Camisas", "Calças"] as const;
export type CategoryName = (typeof CATEGORIES)[number];

export type Color = { name: string; hex: string };

export type ProductSeed = {
  slug: string;
  name: string;
  category: CategoryName;
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

export const PRODUCTS: ProductSeed[] = [
  {
    slug: "conjunto-suede-marsala",
    name: "Conjunto Suede Marsala",
    category: "Conjuntos",
    image: "/brand/products/conjunto-suede-marsala.jpg",
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
    hoverImage: "/brand/products/calca-pantalona-vinho.jpg", // a mesma camisa em preto
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
    hoverImage: "/brand/products/camisa-linho-marinho.jpg",
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
  // Peças tiradas do @kfmodaplussize (out/2026). Nomes e descrições a partir das legendas; revisar com a loja.
  {
    slug: "macaquinho-romantico-talita",
    name: "Macaquinho Romântico Talita",
    category: "Macacões",
    image: "/brand/products/macaquinho-talita-branco.jpg",
    hoverImage: "/brand/products/macaquinho-talita-preto.jpg",
    colors: [
      { name: "Branco", hex: "#f4f1ec" },
      { name: "Preto", hex: "#161314" },
    ],
    sizes: GRADE,
    tag: "Novidade",
    description: "Decote quadrado franzido, alças com babado e cintura em lastex. Parece vestido e tem o conforto do shortinho por baixo.",
  },
  {
    slug: "vestido-longo-pink-halter",
    name: "Vestido Longo Pink Halter",
    category: "Vestidos",
    image: "/brand/products/vestido-longo-pink-halter.jpg",
    hoverImage: "/brand/products/vestido-longo-pink-decote-v.jpg",
    colors: [{ name: "Pink", hex: "#d81b72" }],
    sizes: GRADE,
    tag: "Novidade",
    description: "Gola halter, caimento soltinho e saia com babado na barra. Leve e fluido para os dias quentes.",
  },
  {
    slug: "camisa-linho-marinho",
    name: "Camisa de Linho Azul-Marinho",
    category: "Camisas",
    image: "/brand/products/camisa-linho-marinho.jpg",
    colors: [{ name: "Azul-marinho", hex: "#1f2a4d" }],
    sizes: GRADE,
    description: "Modelagem clássica, manga longa e botões frontais. Por dentro da pantalona, fica pronta para o trabalho.",
  },
  {
    slug: "camisa-branca-manga-longa",
    name: "Camisa Branca Manga Longa",
    category: "Camisas",
    image: "/brand/products/camisa-branca-manga-longa.jpg",
    colors: [{ name: "Branco", hex: "#f4f1ec" }],
    sizes: GRADE,
    description: "A camisa branca que combina com tudo. Com a pantalona vinho vira uma produção clássica e elegante.",
  },
  {
    slug: "calca-pantalona-onca",
    name: "Calça Pantalona Onça",
    category: "Calças",
    image: "/brand/products/calca-pantalona-onca.jpg",
    colors: [{ name: "Onça", hex: "#a8743a" }],
    sizes: GRADE,
    description: "Pantalona de cintura alta com estampa de onça e bolsos laterais. Com um body liso, vira o look da noite.",
  },
  {
    slug: "macacao-pantalona-verde",
    name: "Macacão Pantalona Verde",
    category: "Macacões",
    image: "/brand/products/macacao-pantalona-verde.jpg",
    colors: [{ name: "Verde", hex: "#2f6b45" }],
    sizes: GRADE,
    description: "Decote em V com franzido no busto, cintura marcada e pernas amplas. Uma peça só e o look está pronto.",
  },
  {
    slug: "vestido-longo-poa-verde",
    name: "Vestido Longo Poá Verde",
    category: "Vestidos",
    image: "/brand/products/vestido-longo-poa-verde.jpg",
    colors: [{ name: "Verde", hex: "#2f5a3a" }],
    sizes: GRADE,
    description: "Ombro a ombro com babados, lastex no busto e saia em camadas. Romântico do jeito certo.",
  },
  {
    slug: "vestido-longo-floral-amarracao",
    name: "Vestido Longo Floral com Amarração",
    category: "Vestidos",
    image: "/brand/products/vestido-longo-floral-amarracao.jpg",
    colors: [{ name: "Floral", hex: "#e9a35a" }],
    sizes: GRADE,
    description: "Estampa floral com amarração no busto e alças finas. Fresquinho para o calor.",
  },
  {
    slug: "vestido-midi-floral",
    name: "Vestido Midi Floral",
    category: "Vestidos",
    image: "/brand/products/vestido-midi-floral.jpg",
    colors: [{ name: "Floral", hex: "#f0c48a" }],
    sizes: GRADE,
    description: "Decote em V com franzido, alças largas e barra com babado. Vai do almoço ao evento.",
  },
  {
    slug: "vestido-curto-pink-lastex",
    name: "Vestido Curto Pink com Lastex",
    category: "Vestidos",
    image: "/brand/products/vestido-curto-pink-lastex.jpg",
    colors: [{ name: "Pink", hex: "#d81b72" }],
    sizes: GRADE,
    description: "Lastex no busto e na cintura, mangas bufantes e detalhes em poá. Delicado e confortável.",
  },
  {
    slug: "vestido-longo-pink-decote-v",
    name: "Vestido Longo Pink Decote V",
    category: "Vestidos",
    image: "/brand/products/vestido-longo-pink-decote-v.jpg",
    colors: [{ name: "Pink", hex: "#d81b72" }],
    sizes: GRADE,
    description: "Decote em V, mangas amplas e cintura marcada com lastex, valorizando a silhueta.",
  },
  {
    slug: "macaquinho-transpassado-preto",
    name: "Macaquinho Transpassado Preto",
    category: "Macacões",
    image: "/brand/products/macaquinho-transpassado-preto.jpg",
    colors: [{ name: "Preto", hex: "#161314" }],
    sizes: GRADE,
    description: "Decote drapeado, cintura marcada por faixa com laço e frente transpassada. Elegante e atemporal.",
  },
  {
    slug: "macaquinho-azul-bufante",
    name: "Macaquinho Azul Manga Bufante",
    category: "Macacões",
    image: "/brand/products/macaquinho-azul-bufante.jpg",
    colors: [{ name: "Azul claro", hex: "#a9c4e6" }],
    sizes: GRADE,
    description: "Mangas bufantes, busto franzido, cintura marcada e shorts soltinho com bolsos.",
  },
  {
    slug: "vestido-longo-caveira-marinho",
    name: "Vestido Longo Caveira",
    category: "Vestidos",
    image: "/brand/products/vestido-longo-caveira-marinho.jpg",
    colors: [{ name: "Azul-marinho", hex: "#1c2442" }],
    sizes: GRADE,
    description: "Malha azul-marinho com caveira em brilho colorido e fenda lateral. Para quem ama looks com atitude.",
  },
  {
    slug: "conjunto-caveira-cargo",
    name: "Conjunto Blusa Caveira e Calça Cargo",
    category: "Conjuntos",
    image: "/brand/products/conjunto-caveira-cargo.jpg",
    colors: [{ name: "Preto", hex: "#161314" }],
    sizes: GRADE,
    description: "Blusa preta com caveira em brilho e calça cargo com zíper e bolsos laterais.",
  },
  {
    slug: "conjunto-colete-bermuda-linho",
    name: "Conjunto Colete e Bermuda de Linho",
    category: "Conjuntos",
    image: "/brand/products/conjunto-colete-bermuda-linho.jpg",
    colors: [{ name: "Areia", hex: "#e4d8c6" }],
    sizes: GRADE,
    description: "Colete transpassado e bermuda de alfaiataria em linho. Chique para os convites dos dias quentes.",
  },
];

// Os 4 cards "Escolha por onde começar" da home (foto + foto do hover).
export const HOME_CATEGORIES: { name: CategoryName; image: string; hover: string }[] = [
  { name: "Vestidos", image: "/brand/products/vestido-longo-pink-halter.jpg", hover: "/brand/products/vestido-longo-poa-verde.jpg" },
  { name: "Macacões", image: "/brand/products/macaquinho-talita-branco.jpg", hover: "/brand/products/macacao-pantalona-verde.jpg" },
  { name: "Conjuntos", image: "/brand/products/conjunto-colete-bermuda-linho.jpg", hover: "/brand/products/conjunto-trico-chocolate.jpg" },
  { name: "Camisas", image: "/brand/products/camisa-branca-manga-longa.jpg", hover: "/brand/products/camisa-linho-marinho.jpg" },
];

// Peças da seção "provador" (rolagem horizontal), na ordem em que aparecem.
// No layout editorial, as 4 primeiras viram o lookbook da home.
export const LOOKS = [
  "camisa-branca-manga-longa",
  "camisa-linho-marinho",
  "calca-pantalona-onca",
  "conjunto-trico-chocolate",
  "camisa-cetim",
  "calca-pantalona-cinto",
];
