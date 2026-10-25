// Identidade, contatos e textos do cliente. Os componentes não têm texto da marca:
// tudo que muda de uma loja para outra está aqui.
import { countWords, plural } from "./format";
import { STORES } from "./stores";

const N = STORES.length;
const CITIES = new Set(STORES.map((s) => s.city)).size;
const LOJAS = `${N} ${plural(N, "loja", "lojas")}`;

const CONTACT = {
  whatsapp: "5541996817936",
  whatsappLabel: "(41) 99681-7936",
  instagram: "https://www.instagram.com/mundoespacoflor/",
  instagramHandle: "@mundoespacoflor",
  linktree: "https://linktr.ee/espacoflormundo" as string | undefined,
  location: "Curitiba e São José dos Pinhais, PR",
};

// números do Instagram (seguidores em milhares)
const SOCIAL = { followers: 57.6, followersSuffix: " mil", followersLabel: "seguidoras no Instagram", posts: 6691 };

export const BRAND = {
  name: "Espaço Flor",
  // prefixo das chaves de sessionStorage/localStorage (ex.: "ef-intro")
  slug: "ef",
  // logo em texto ao lado da marca; a 2ª parte fica em itálico na cor primária
  wordmark: ["Espaço", "Flor"] as [string, string],
  // true = usa /public/brand/logo.svg no lugar de marca + wordmark
  logoImage: false,
  segment: "Moda Feminina",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://espacoflor.com.br").replace(/\/$/, ""),
  // enfeite usado em mensagens curtas ("Link copiado ✿")
  ornament: "✿",

  seo: {
    title: "Espaço Flor | Moda Feminina em Curitiba e SJP",
    description: `Moda feminina com ${LOJAS} em Curitiba e São José dos Pinhais. Vestidos, conjuntos, básicos e bolsas. Veja o catálogo e compre pelo WhatsApp.`,
    ogTitle: "Espaço Flor | Moda Feminina",
    ogDescription: `${LOJAS} em Curitiba e SJP. Veja o catálogo e encontre a loja mais perto de você.`,
    ogImage: "/brand/hero/hero.png",
    schemaDescription: `Moda feminina com ${LOJAS} em Curitiba e São José dos Pinhais.`,
    areaServed: ["Curitiba", "São José dos Pinhais"],
  },

  contact: CONTACT,

  // assinatura no rodapé; use null para esconder
  credit: { label: "Sonhada por", name: "@anapaulathomazi", url: "https://www.instagram.com/anapaulathomazi/" } as { label: string; name: string; url?: string } | null,

  // mostrados no hero e na seção do provador
  social: SOCIAL,

  announcements: [
    `${LOJAS} em Curitiba e São José dos Pinhais`,
    `Compre pelo WhatsApp ${CONTACT.whatsappLabel}`,
    `Novidades toda semana no ${CONTACT.instagramHandle}`,
  ],

  hero: {
    eyebrow: "Nova estação · Curitiba e SJP",
    // 3 linhas; a última fica em itálico na cor de acento
    title: ["Vista o que", "te faz", "florescer."] as [string, string, string],
    text: `Vestidos, conjuntos, básicos e bolsas escolhidos a dedo. ${countWords(N, "loja", "lojas")} em Curitiba e São José dos Pinhais esperando por você.`,
    script: "do seu jeito",
    badge: `ESPAÇO FLOR • ${LOJAS.toUpperCase()} • CURITIBA E SJP •`,
    image: "/brand/hero/hero.png",
    imageAlt: "Modelo com vestido longo caramelo no centro de Curitiba",
    avatars: ["/brand/products/tule-noir.png", "/brand/products/vestido-boho.png", "/brand/products/blusa-assimetrica.png"],
    // peça do cartão "Look da semana" (usa a foto de hover dela, se houver)
    featuredLabel: "Look da semana",
    featuredSlug: "vestido-longo-caramelo",
  },

  // ícones: atributo "d" de um path 24x24 com traço
  perks: [
    { title: `${LOJAS} físicas`, text: "Curitiba e São José dos Pinhais", icon: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 7v5" },
    { title: "Compre pelo WhatsApp", text: "Atendimento de consultora", icon: "M4 5h16v11H8l-4 4V5z M8 10h8" },
    { title: "Novidades toda semana", text: `No ${CONTACT.instagramHandle}`, icon: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" },
    { title: "Do básico à festa", text: "Looks para todos os momentos", icon: "M8 3l4 3 4-3 3 4-3 2v12H8V9L5 7l3-4z" },
  ],

  categories: {
    title: ["Escolha por", "onde começar"] as [string, string],
    hint: "Passe o mouse para ver mais. Toque para abrir a categoria no catálogo.",
  },

  featured: { eyebrow: "Em destaque", title: "Queridinhas da semana" },

  manifesto: {
    text: `De Curitiba para o seu guarda-roupa. ${countWords(N, "loja", "lojas")}, um mesmo cuidado: peças escolhidas a dedo para mulheres reais vestirem o que as faz florescer, todos os dias.`,
    // palavras destacadas em itálico
    highlight: ["florescer", "cuidado"],
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
    text: "Mande uma mensagem com a foto ou o nome da peça. Nossa equipe confirma tamanho, cor e em qual loja ela está.",
    message: "Olá! Vim pelo site da Espaço Flor e quero ajuda para escolher uma peça.",
  },

  // vitrine de lojas (home e /lojas) ou bloco "Visite a loja" quando há 1 loja
  stores: {
    eyebrowHome: "Visite a gente",
    eyebrowPage: "Endereços",
    titleAccent: "Uma só flor.",
    text: "Do calçadão da Rua XV aos shoppings, e também em São José dos Pinhais. Escolha a loja mais perto e fale direto com a nossa equipe.",
  },

  storesPage: {
    metaDescription: `As ${LOJAS} Espaço Flor em Curitiba e São José dos Pinhais: Rua XV, João Negrão, Shopping Estação, Palladium, Jockey Plaza, Jardim das Américas e São José.`,
    eyebrow: "Curitiba · São José dos Pinhais",
    // a linha do meio fica em itálico na cor primária
    title: ["Sempre tem uma", "Espaço Flor", "perto de você."] as [string, string, string],
    image: "/brand/hero/loja.png",
    imageAlt: "Vitrine de uma loja Espaço Flor",
    faqTitle: ["Antes de", "sair de casa"] as [string, string],
    faq: [
      { q: "Qual o horário das lojas?", a: "Cada loja tem o seu horário, principalmente as de shopping. Chame no WhatsApp que a gente informa o horário da loja que você quer visitar." },
      { q: "A peça que vi no site está na loja perto de mim?", a: "O estoque muda rápido. Envie sua seleção pelo WhatsApp e confirmamos em qual loja a peça está no tamanho e na cor que você quer." },
      { q: "Posso reservar uma peça para provar?", a: `Fale com a nossa equipe pelo WhatsApp ${CONTACT.whatsappLabel} e combinamos a melhor forma de te atender.` },
    ],
    message: "Olá! Vim pelo site e quero saber sobre as lojas Espaço Flor.",
  },

  catalog: {
    metaDescription: "Vestidos, conjuntos, blusas, básicos e bolsas da Espaço Flor. Escolha suas peças e peça pelo WhatsApp.",
    intro: "Salve no coração o que você amar e envie sua seleção pelo WhatsApp. A gente confirma tamanho, cor e a loja mais perto.",
  },

  product: {
    // "Disponível nas lojas físicas. Confirme estoque pelo WhatsApp ou [encontre a loja mais perto]."
    note: "Disponível nas lojas físicas. Confirme estoque pelo WhatsApp ou ",
    noteLink: "encontre a loja mais perto",
  },

  selection: {
    footer: "A gente confirma tamanho, cor e a loja mais perto de você.",
  },

  notFound: {
    // "Essa flor *não brotou* aqui."
    title: ["Essa flor", "não brotou", "aqui."] as [string, string, string],
    text: "A página que você procurou não existe ou mudou de lugar. Que tal dar uma olhada nas novidades?",
  },

  footer: {
    about: `Moda feminina com ${LOJAS} em Curitiba e São José dos Pinhais. Peças escolhidas a dedo para você florescer todos os dias.`,
  },

  floatingHint: "Posso te ajudar a escolher? ✿",

  messages: {
    default: "Olá! Vim pelo site da Espaço Flor.",
    help: "Olá! Vim pelo site da Espaço Flor e quero ajuda.",
    store: (store: string) => `Olá! Vim pelo site e quero falar com a loja ${store} da Espaço Flor.`,
  },

  // Textos dos botões de WhatsApp para cada ctaMode (features.ts).
  cta: {
    comprar: {
      button: "Pedir pelo WhatsApp",
      card: "Quero essa",
      quick: (name: string) => `Olá! Vim pelo site e quero a peça: ${name}. Tem disponível?`,
      detail: (name: string, color: string, size: string | null) =>
        `Olá! Vim pelo site e quero: ${name} · cor ${color}${size ? ` · tamanho ${size}` : ""}. Tem disponível?`,
      selectionButton: "Enviar seleção no WhatsApp",
      selection: (names: string[]) =>
        "Olá! Vim pelo site da Espaço Flor e separei estas peças:\n" + names.map((n) => `• ${n}`).join("\n") + "\nQual loja tem disponível?",
    },
    "agendar-prova": {
      button: "Agendar prova",
      card: "Quero provar",
      quick: (name: string) => `Olá! Vim pelo site e quero agendar uma prova da peça: ${name}.`,
      detail: (name: string, color: string, size: string | null) =>
        `Olá! Vim pelo site e quero agendar uma prova de: ${name} · cor ${color}${size ? ` · tamanho ${size}` : ""}. Qual o melhor horário?`,
      selectionButton: "Agendar prova no WhatsApp",
      selection: (names: string[]) =>
        "Olá! Vim pelo site da Espaço Flor e quero provar estas peças:\n" + names.map((n) => `• ${n}`).join("\n") + "\nQual o melhor horário?",
    },
  },
};
