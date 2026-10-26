// Configura o template para um novo cliente.
//   npm run novo-cliente                      -> perguntas no terminal
//   npm run novo-cliente -- --from cliente.json -> respostas de um arquivo (mesmas chaves de ANSWERS abaixo)
//
// Escreve: config/brand.ts, features.ts, stores.ts, editorial.ts e a paleta em app/globals.css.
// Opcional: troca fotos, marca e produtos pelos placeholders neutros de template/placeholders.
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = (p) => join(root, p);

// ---------- cores ----------
const hexToRgb = (hex) => {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Cor inválida: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
// mistura a cor `a` com `b`; t = quanto de `b` (0..1)
const mix = (a, b, t) => rgbToHex(hexToRgb(a).map((v, i) => v + (hexToRgb(b)[i] - v) * t));

function palette({ primary, accent, highlight }) {
  const ink = mix(primary, "#000000", 0.78);
  const paper = mix("#fbf8f4", primary, 0.025);
  return {
    primary: mix(primary, "#000000", 0),
    "primary-deep": mix(primary, "#000000", 0.45),
    accent: mix(accent, "#000000", 0),
    "accent-soft": mix(accent, "#ffffff", 0.75),
    highlight: highlight ? mix(highlight, "#000000", 0) : mix(primary, accent, 0.5),
    paper,
    cream: mix(paper, primary, 0.06),
    sand: mix(paper, primary, 0.18),
    ink,
    muted: mix(ink, paper, 0.45),
    "particle-1": mix(accent, "#ffffff", 0.6),
    "particle-2": mix(accent, "#ffffff", 0.35),
    "particle-3": mix(accent, "#000000", 0),
    "particle-4": mix(accent, "#ffffff", 0.8),
  };
}

// ---------- perguntas ----------
const ANSWERS = [
  ["name", "Nome da loja", "Minha Loja"],
  ["slug", "Slug curto (chaves do navegador, sem espaços)", (a) => a.name.toLowerCase().normalize("NFD").replace(/[^a-z0-9 ]/g, "").split(" ").filter(Boolean).map((w) => w[0]).join("") || "loja"],
  ["wordmark1", "Logo em texto: primeira parte", (a) => a.name.split(" ").slice(0, -1).join(" ") || a.name],
  ["wordmark2", "Logo em texto: parte em itálico", (a) => (a.name.split(" ").length > 1 ? a.name.split(" ").at(-1) : "")],
  ["segment", "Segmento", "Moda Feminina"],
  ["primary", "Cor primária (hex)", "#7a1d3b"],
  ["accent", "Cor de acento (hex)", "#e2589b"],
  ["highlight", "Terceira cor (hex, Enter = mistura das duas)", ""],
  ["whatsapp", "WhatsApp com DDI e DDD (ex.: 5541999999999)", "5541999999999"],
  ["instagram", "Instagram (@usuario)", "@minhaloja"],
  ["city", "Cidade", "Curitiba"],
  ["state", "UF", "PR"],
  ["stores", "Número de lojas físicas", "1"],
  ["address", "Endereço da loja (rua e número; só se for 1 loja)", "Rua Exemplo, 100"],
  ["postalCode", "CEP (só se for 1 loja)", ""],
  ["ctaMode", "Botões de pedido: comprar | agendar-prova", "comprar"],
  ["grade", "Grade: P-GG | PP-GG | G1-G5 | 42-54 | 36-46", "P-GG"],
  ["layout", "Layout da home: classic | editorial", "classic"],
  ["frame", "Moldura das fotos: mirror | arch | straight", (a) => (a.layout === "editorial" ? "arch" : "mirror")],
  ["placeholders", "Trocar fotos, marca e produtos pelos placeholders neutros? (s/n)", "s"],
];

async function ask() {
  const fromIdx = process.argv.indexOf("--from");
  if (fromIdx > -1) {
    const given = JSON.parse(readFileSync(process.argv[fromIdx + 1], "utf8"));
    const a = {};
    for (const [key, , def] of ANSWERS) a[key] = given[key] ?? (typeof def === "function" ? def(a) : def);
    return a;
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const a = {};
  console.log("\nNovo cliente: responda ou aperte Enter para aceitar o valor entre colchetes.\n");
  for (const [key, label, def] of ANSWERS) {
    if ((key === "address" || key === "postalCode") && Number(a.stores) !== 1) continue;
    const d = typeof def === "function" ? def(a) : def;
    const v = (await rl.question(`${label} [${d}]: `)).trim();
    a[key] = v || d;
  }
  rl.close();
  return a;
}

// ---------- geradores ----------
const js = (v) => (Array.isArray(v) ? `[${v.map((x) => JSON.stringify(x)).join(", ")}]` : JSON.stringify(v));

function phoneLabel(digits) {
  const m = digits.match(/^55(\d{2})(\d+)(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits;
}

function brandTs(a, img) {
  const handle = a.instagram.startsWith("@") ? a.instagram : `@${a.instagram}`;
  const name = a.name;
  return `// Identidade, contatos e textos do cliente. Os componentes não têm texto da marca:
// tudo que muda de uma loja para outra está aqui.
// Gerado por \`npm run novo-cliente\`. Revise os textos marcados com TODO.
import { countWords, plural } from "./format";
import { STORES } from "./stores";

const N = STORES.length;
const CITIES = new Set(STORES.map((s) => s.city)).size;
const LOJAS = \`\${N} \${plural(N, "loja", "lojas")}\`;
const CITY = ${js(a.city)};

const CONTACT = {
  whatsapp: ${js(a.whatsapp)},
  whatsappLabel: ${js(phoneLabel(a.whatsapp))},
  instagram: ${js(`https://www.instagram.com/${handle.slice(1)}/`)},
  instagramHandle: ${js(handle)},
  linktree: undefined as string | undefined,
  location: ${js(`${a.city}, ${a.state}`)},
};

// números do Instagram (seguidores em milhares) — TODO: atualizar
const SOCIAL = { followers: 10, followersSuffix: " mil", followersLabel: "seguidoras no Instagram", posts: 1000 };

export const BRAND = {
  name: ${js(name)},
  // prefixo das chaves de sessionStorage/localStorage (ex.: "${a.slug}-intro")
  slug: ${js(a.slug)},
  // logo em texto ao lado da marca; a 2ª parte fica em itálico na cor primária
  wordmark: ${js([a.wordmark1, a.wordmark2])} as [string, string],
  // true = usa /public/brand/logo.svg no lugar de marca + wordmark
  logoImage: false,
  segment: ${js(a.segment)},
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || ${js(`https://${a.slug}.vercel.app`)}).replace(/\\/$/, ""),
  // enfeite usado em mensagens curtas ("Link copiado ✦")
  ornament: "✦",

  seo: {
    title: \`${name} | ${a.segment} em \${CITY}\`,
    description: \`${a.segment} em \${CITY}\${N > 1 ? \` com \${LOJAS}\` : ""}. Veja o catálogo e compre pelo WhatsApp.\`,
    ogTitle: ${js(`${name} | ${a.segment}`)},
    ogDescription: \`Veja o catálogo da ${name} e fale com a gente pelo WhatsApp.\`,
    ogImage: ${js(img.hero)},
    schemaDescription: \`${a.segment} em \${CITY}.\`,
    areaServed: [CITY],
  },

  contact: CONTACT,

  // assinatura no rodapé; use null para esconder
  credit: null as { label: string; name: string; url?: string } | null,

  // mostrados no hero e na seção do provador
  social: SOCIAL,

  announcements: [
    N > 1 ? \`\${LOJAS} em \${CITY}\` : \`Loja em \${CITY}\`,
    \`Compre pelo WhatsApp \${CONTACT.whatsappLabel}\`,
    \`Novidades toda semana no \${CONTACT.instagramHandle}\`,
  ],

  hero: {
    eyebrow: \`Nova coleção · \${CITY}\`,
    // 3 linhas; a última fica em itálico na cor de acento — TODO: frase da marca
    title: ["Vista o que", "combina com", "você."] as [string, string, string],
    text: \`Peças escolhidas a dedo para o seu dia a dia. \${N > 1 ? countWords(N, "loja", "lojas") : "Uma loja"} em \${CITY} esperando por você.\`,
    script: "do seu jeito",
    badge: ${js(`${name.toUpperCase()} • ${a.city.toUpperCase()} •`)},
    image: ${js(img.hero)},
    imageAlt: "Modelo vestindo um look da coleção",
    avatars: ${js(img.avatars)},
    // peça do cartão "Look da semana" (usa a foto de hover dela, se houver)
    featuredLabel: "Look da semana",
    featuredSlug: ${js(img.featured)},
  },

  // ícones: atributo "d" de um path 24x24 com traço
  perks: [
    { title: N > 1 ? \`\${LOJAS} físicas\` : "Loja física", text: CONTACT.location, icon: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 7v5" },
    { title: "Compre pelo WhatsApp", text: "Atendimento de consultora", icon: "M4 5h16v11H8l-4 4V5z M8 10h8" },
    { title: "Novidades toda semana", text: \`No \${CONTACT.instagramHandle}\`, icon: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" },
    { title: "Do básico à festa", text: "Looks para todos os momentos", icon: "M8 3l4 3 4-3 3 4-3 2v12H8V9L5 7l3-4z" },
  ],

  categories: {
    title: ["Escolha por", "onde começar"] as [string, string],
    hint: "Passe o mouse para ver mais. Toque para abrir a categoria no catálogo.",
  },

  featured: { eyebrow: "Em destaque", title: "Queridinhas da semana" },

  manifesto: {
    // TODO: texto da marca
    text: \`De \${CITY} para o seu guarda-roupa. Peças escolhidas com cuidado para mulheres reais vestirem o que gostam, todos os dias.\`,
    // palavras destacadas em itálico
    highlight: ["cuidado", "reais"],
  },

  provador: {
    eyebrow: "Direto do provador",
    title: ["Mulheres reais,", "looks reais."] as [string, string],
    text: "Nossas fotos são feitas no provador, do jeito que você vai se ver. Role para passear pelos looks da semana.",
    stats: [
      { to: SOCIAL.followers, decimals: 1, label: "mil seguidoras" },
      { to: SOCIAL.posts, label: "publicações" },
      { to: N, label: plural(N, "loja", "lojas") },
      { to: CITIES, label: plural(CITIES, "cidade", "cidades") },
    ] as { to: number; decimals?: number; label: string }[],
  },

  finalCta: {
    eyebrow: "Atendimento de verdade",
    title: ["Achou a sua peça?", "A gente separa."] as [string, string],
    text: "Mande uma mensagem com a foto ou o nome da peça. Nossa equipe confirma tamanho e cor para você.",
    message: \`Olá! Vim pelo site da ${name} e quero ajuda para escolher uma peça.\`,
  },

  // vitrine de lojas (home e /lojas) ou bloco "Visite a loja" quando há 1 loja
  stores: {
    eyebrowHome: "Visite a gente",
    eyebrowPage: "Endereços",
    titleAccent: N > 1 ? "Um só jeito de atender." : "Prove com calma.",
    text: N > 1 ? "Escolha a loja mais perto e fale direto com a nossa equipe." : \`Venha provar na nossa loja em \${CITY}, com atendimento de quem entende de caimento.\`,
  },

  storesPage: {
    metaDescription: N > 1 ? \`As \${LOJAS} ${name} em \${CITY}.\` : \`Endereço da ${name} em \${CITY}.\`,
    eyebrow: ${js(`${a.city} · ${a.state}`)},
    // a linha do meio fica em itálico na cor primária
    title: (N > 1 ? ["Sempre tem uma", ${js(name)}, "perto de você."] : ["A gente te espera", "na nossa loja", \`em \${CITY}.\`]) as [string, string, string],
    image: ${js(img.store)},
    imageAlt: ${js(`Loja ${name}`)},
    faqTitle: ["Antes de", "sair de casa"] as [string, string],
    faq: [
      { q: N > 1 ? "Qual o horário das lojas?" : "Qual o horário da loja?", a: "Chame no WhatsApp que a gente informa o horário e já deixa as peças separadas para você." },
      { q: "A peça que vi no site está disponível?", a: "O estoque muda rápido. Envie sua seleção pelo WhatsApp e confirmamos tamanho e cor." },
      { q: "Posso reservar uma peça para provar?", a: \`Fale com a nossa equipe pelo WhatsApp \${CONTACT.whatsappLabel} e combinamos a melhor forma de te atender.\` },
    ],
    message: \`Olá! Vim pelo site e quero saber sobre \${N > 1 ? "as lojas" : "a loja"} ${name}.\`,
  },

  catalog: {
    metaDescription: \`Catálogo da ${name}. Escolha suas peças e peça pelo WhatsApp.\`,
    intro: "Salve no coração o que você amar e envie sua seleção pelo WhatsApp. A gente confirma tamanho e cor.",
  },

  product: {
    note: N > 1 ? "Disponível nas lojas físicas. Confirme estoque pelo WhatsApp ou " : "Disponível na loja física. Confirme estoque pelo WhatsApp ou ",
    noteLink: N > 1 ? "encontre a loja mais perto" : "veja como chegar",
  },

  selection: {
    footer: "A gente confirma tamanho, cor e disponibilidade para você.",
  },

  notFound: {
    title: ["Essa página", "não está", "na arara."] as [string, string, string],
    text: "A página que você procurou não existe ou mudou de lugar. Que tal dar uma olhada nas novidades?",
  },

  footer: {
    about: \`${a.segment} em \${CITY}. Peças escolhidas a dedo para você.\`,
  },

  floatingHint: "Posso te ajudar a escolher? ✦",

  messages: {
    default: "Olá! Vim pelo site da ${name}.",
    help: "Olá! Vim pelo site da ${name} e quero ajuda.",
    store: (store: string) =>
      N > 1 ? \`Olá! Vim pelo site e quero falar com a loja \${store} da ${name}.\` : \`Olá! Vim pelo site da \${store} e quero visitar a loja.\`,
  },

  // Textos dos botões de WhatsApp para cada ctaMode (features.ts).
  cta: {
    comprar: {
      button: "Pedir pelo WhatsApp",
      card: "Quero essa",
      quick: (name: string) => \`Olá! Vim pelo site e quero a peça: \${name}. Tem disponível?\`,
      detail: (name: string, color: string, size: string | null) =>
        \`Olá! Vim pelo site e quero: \${name} · cor \${color}\${size ? \` · tamanho \${size}\` : ""}. Tem disponível?\`,
      selectionButton: "Enviar seleção no WhatsApp",
      selection: (names: string[]) =>
        "Olá! Vim pelo site da ${name} e separei estas peças:\\n" + names.map((n) => \`• \${n}\`).join("\\n") + "\\nTem disponível?",
    },
    "agendar-prova": {
      button: "Agendar prova",
      card: "Quero provar",
      quick: (name: string) => \`Olá! Vim pelo site e quero agendar uma prova da peça: \${name}.\`,
      detail: (name: string, color: string, size: string | null) =>
        \`Olá! Vim pelo site e quero agendar uma prova de: \${name} · cor \${color}\${size ? \` · tamanho \${size}\` : ""}. Qual o melhor horário?\`,
      selectionButton: "Agendar prova no WhatsApp",
      selection: (names: string[]) =>
        "Olá! Vim pelo site da ${name} e quero provar estas peças:\\n" + names.map((n) => \`• \${n}\`).join("\\n") + "\\nQual o melhor horário?",
    },
  },
};
`;
}

function featuresTs(a) {
  return `import type { SizePreset } from "./products";
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
  layout: ${js(a.layout)},
  frame: ${js(a.frame)},
  // Vitrine com mapa e filtro por região. Com 1 loja vira o bloco "Visite a loja".
  showStores: STORES.length > 1,
  ctaMode: ${js(a.ctaMode)},
  // Grade padrão das peças (ver SIZE_PRESETS em products.ts).
  grade: ${js(a.grade)},
  // Abertura animada com a marca, uma vez por sessão.
  showIntro: true,
  // Bolha que segue o mouse no desktop.
  showCursor: true,
  // Partículas que caem do cursor no topo da home.
  showPetalTrail: true,
};
`;
}

function storesTs(a) {
  const n = Math.max(1, Number(a.stores) || 1);
  const stores = Array.from({ length: n }, (_, i) => {
    const single = n === 1;
    const area = single ? a.address : `TODO: endereço da loja ${i + 1}`;
    return `  { slug: ${js(single ? "loja" : `loja-${i + 1}`)}, name: ${js(single ? a.name : `Loja ${i + 1}`)}, region: "Centro", area: ${js(area)}, city: ${js(a.city)}, state: ${js(a.state)},${
      single && a.postalCode ? ` postalCode: ${js(a.postalCode)},` : ""
    } mapsQuery: ${js(`${a.name} ${single ? a.address : ""} ${a.city}`.replace(/\s+/g, " ").trim())}, pin: { x: ${20 + ((i * 17) % 60)}, y: ${25 + ((i * 11) % 40)} } },`;
  });
  return `// Lojas físicas do cliente. Com uma loja só, o site troca a vitrine de lojas
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
${stores.join("\n")}
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
  { kind: "label", x: 18, y: 20, text: ${js(a.city.toUpperCase())}, size: 2.4, spacing: 0.6 },
];
`;
}

function productsTs() {
  const items = [
    ["vestido-midi", "Vestido Midi", "Vestidos", 1, 2, "Novidade"],
    ["vestido-longo", "Vestido Longo", "Vestidos", 2, null, "Look da semana"],
    ["conjunto-alfaiataria", "Conjunto Alfaiataria", "Conjuntos", 3, 4, "Mais pedido"],
    ["conjunto-tricot", "Conjunto Tricô", "Conjuntos", 4, null, null],
    ["camisa-cetim", "Camisa de Cetim", "Blusas", 5, 6, null],
    ["blusa-basica", "Blusa Básica", "Blusas", 6, null, null],
    ["calca-pantalona", "Calça Pantalona", "Calças", 7, 8, "Novidade"],
    ["calca-reta", "Calça Reta", "Calças", 8, null, null],
  ];
  const p = (n) => `/brand/products/foto-${n}.svg`;
  return `import { FEATURES } from "./features";

export const CATEGORIES = ["Vestidos", "Conjuntos", "Blusas", "Calças"] as const;
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

// TODO: trocar pelos produtos reais (fotos em public/brand/products).
export const PRODUCTS: Product[] = [
${items
  .map(
    ([slug, name, cat, img, hover, tag]) => `  {
    slug: ${js(slug)},
    name: ${js(name)},
    category: ${js(cat)},
    image: ${js(p(img))},${hover ? `\n    hoverImage: ${js(p(hover))},` : ""}
    colors: [{ name: "Preto", hex: "#1c1a1a" }, { name: "Off-white", hex: "#efe8dc" }],
    sizes: GRADE,${tag ? `\n    tag: ${js(tag)},` : ""}
    description: "Descrição curta da peça: tecido, caimento e com o que combinar.",
  },`,
  )
  .join("\n")}
];

// Os 4 cards "Escolha por onde começar" da home (foto + foto do hover).
export const HOME_CATEGORIES: { name: Category; image: string; hover: string }[] = [
  { name: "Vestidos", image: ${js(p(1))}, hover: ${js(p(2))} },
  { name: "Conjuntos", image: ${js(p(3))}, hover: ${js(p(4))} },
  { name: "Blusas", image: ${js(p(5))}, hover: ${js(p(6))} },
  { name: "Calças", image: ${js(p(7))}, hover: ${js(p(8))} },
];

// Peças da seção "provador" (rolagem horizontal), na ordem em que aparecem.
export const LOOKS = ["vestido-longo", "conjunto-alfaiataria", "camisa-cetim", "calca-pantalona", "vestido-midi", "conjunto-tricot"];
`;
}

function editorialTs(a) {
  return `// Conteúdo das seções do layout "editorial" (FEATURES.layout). O layout "classic" não usa este arquivo.
// As fotos saem dos produtos por padrão; troque por caminhos de /public/brand quando quiser outra.
import { BRAND } from "./brand";
import { LOOKS, PRODUCTS } from "./products";

const photo = (slug: string) => PRODUCTS.find((p) => p.slug === slug)?.image ?? PRODUCTS[0].image;

export const EDITORIAL = {
  hero: {
    eyebrow: BRAND.hero.eyebrow,
    // 1ª linha normal, 2ª em itálico na cor primária — TODO: frase da marca
    title: ["Estilo que fica,", "elegância que veste."] as [string, string],
    text: BRAND.hero.text,
    // foto grande + foto menor sobreposta
    images: [BRAND.hero.image, PRODUCTS[1]?.image ?? PRODUCTS[0].image] as [string, string],
    imageAlt: BRAND.hero.imageAlt,
  },

  // 3 diferenciais abaixo do botão do hero (usa os 3 primeiros perks de brand.ts)
  values: BRAND.perks.slice(0, 3),

  products: BRAND.featured,

  lookbook: {
    title: "Lookbook",
    text: "Combinações montadas na loja, do jeito que a gente veste. Escolha a sua e peça pelo WhatsApp.",
    button: "Ver os looks",
    slugs: LOOKS.slice(0, 4),
  },

  // faixa escura no meio da página — TODO: chamada da marca
  promo: {
    eyebrow: "Novidades toda semana",
    title: ["Nova", "coleção"] as [string, string],
    text: "Peças novas chegando toda semana. Fale com a gente para saber o que acabou de chegar no seu tamanho.",
    button: "Falar com uma consultora",
    message: ${js(`Olá! Vim pelo site da ${a.name} e quero ver as novidades.`)},
    image: photo(LOOKS[0] ?? PRODUCTS[0].slug),
  },

  // Use só depoimentos reais, com autorização da cliente. Lista vazia = seção escondida.
  testimonials: [] as { quote: string; name: string }[],

  instagram: {
    title: ["Siga no", "Instagram"] as [string, string],
    images: PRODUCTS.slice(0, 6).map((p) => p.image),
  },

  story: {
    title: "Nossa história",
    text: BRAND.manifesto.text,
    image: BRAND.storesPage.image,
  },

  // cartão ao lado da história: lista VIP pelo WhatsApp (sem formulário nem servidor)
  vip: {
    title: "Lista VIP",
    text: "Receba os lançamentos da semana antes de todo mundo, direto no seu WhatsApp.",
    button: "Quero entrar",
    message: ${js(`Olá! Quero entrar na lista VIP da ${a.name} e receber as novidades.`)},
  },
};
`;
}

function writePalette(colors) {
  const css = readFileSync(file("app/globals.css"), "utf8");
  const start = css.indexOf("/* palette:start */");
  const end = css.indexOf("/* palette:end */");
  if (start < 0 || end < 0) throw new Error("Marcadores palette:start/end não encontrados em app/globals.css");
  // troca só os valores, mantendo os comentários de cada linha
  let block = css.slice(start, end);
  for (const [k, v] of Object.entries(colors)) {
    const re = new RegExp(`(--color-${k}:\\s*)[^;]+;`);
    block = re.test(block) ? block.replace(re, `$1${v};`) : block.replace(/\n\s*$/, `\n  --color-${k}: ${v};\n  `);
  }
  writeFileSync(file("app/globals.css"), css.slice(0, start) + block + css.slice(end));
}

// ---------- main ----------
const a = await ask();
a.whatsapp = a.whatsapp.replace(/\D/g, "");
if (!a.whatsapp.startsWith("55")) a.whatsapp = `55${a.whatsapp}`;
a.slug = a.slug.toLowerCase().replace(/[^a-z0-9-]/g, "") || "loja";
if (!["comprar", "agendar-prova"].includes(a.ctaMode)) throw new Error(`ctaMode inválido: ${a.ctaMode}`);
if (!["classic", "editorial"].includes(a.layout)) throw new Error(`Layout inválido: ${a.layout}`);
if (!["mirror", "arch", "straight"].includes(a.frame)) throw new Error(`Moldura inválida: ${a.frame}`);
if (!["P-GG", "PP-GG", "G1-G5", "42-54", "36-46"].includes(a.grade)) throw new Error(`Grade inválida: ${a.grade}`);
const usePlaceholders = /^s/i.test(String(a.placeholders));

const img = usePlaceholders
  ? {
      hero: "/brand/hero/hero.svg",
      store: "/brand/hero/loja.svg",
      avatars: ["/brand/products/foto-1.svg", "/brand/products/foto-3.svg", "/brand/products/foto-5.svg"],
      featured: "vestido-longo",
    }
  : {
      hero: "/brand/hero/hero.png",
      store: "/brand/hero/loja.png",
      avatars: ["/brand/products/TODO-1.png", "/brand/products/TODO-2.png", "/brand/products/TODO-3.png"],
      featured: "TODO-slug-da-peca",
    };

if (usePlaceholders) {
  cpSync(file("template/placeholders/brand"), file("public/brand"), { recursive: true });
  writeFileSync(file("config/products.ts"), productsTs());
}
writeFileSync(file("config/brand.ts"), brandTs(a, img));
writeFileSync(file("config/features.ts"), featuresTs(a));
writeFileSync(file("config/stores.ts"), storesTs(a));
writeFileSync(file("config/editorial.ts"), editorialTs(a));
writePalette(palette(a));

console.log(`
Pronto: ${a.name} configurado.
  config/brand.ts, features.ts, stores.ts, editorial.ts${usePlaceholders ? ", products.ts" : ""} e a paleta em app/globals.css
${usePlaceholders ? "  public/brand: marca, logo e fotos trocadas pelos placeholders\n" : ""}
Próximos passos (TEMPLATE.md):
  1. troque public/brand/mark.svg e logo.svg pela marca do cliente
  2. coloque as fotos em public/brand/products e public/brand/hero e edite config/products.ts
  3. revise os textos marcados com TODO em config/brand.ts
  4. ajuste as fontes no bloco FONTES de app/layout.tsx, se quiser
  5. npm run dev  (e depois npm run build)
`);
if (!existsSync(file("public/brand/mark.svg"))) console.warn("Atenção: public/brand/mark.svg não existe.");
