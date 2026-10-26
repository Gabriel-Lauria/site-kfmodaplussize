// Identidade, contatos e textos do cliente. Os componentes não têm texto da marca:
// tudo que muda de uma loja para outra está aqui.
// Gerado por `npm run novo-cliente` e revisado para a KF.
const CITY = "Curitiba";

const CONTACT = {
  whatsapp: "554195385799",
  whatsappLabel: "(41) 9538-5799",
  instagram: "https://www.instagram.com/kfmodaplussize/",
  instagramHandle: "@kfmodaplussize",
  linktree: undefined as string | undefined,
  location: "Curitiba, PR",
};

// números do Instagram (seguidores em milhares) — out/2026
const SOCIAL = { followers: 14.8, followersSuffix: " mil", followersLabel: "seguidoras no Instagram", posts: 3158 };

export const BRAND = {
  name: "KF Moda Plus Size",
  // prefixo das chaves de sessionStorage/localStorage (ex.: "kf-intro")
  slug: "kf",
  // logo em texto ao lado da marca; a 2ª parte fica em itálico na cor primária
  wordmark: ["Moda", "Plus Size"] as [string, string],
  // true = usa /public/brand/logo.svg no lugar de marca + wordmark
  logoImage: false,
  segment: "Moda Curvy e Plus Size",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://kfmodaplussize.vercel.app").replace(/\/$/, ""),
  // enfeite usado em mensagens curtas ("Link copiado ✦")
  ornament: "✦",

  seo: {
    title: `KF Moda Plus Size | Moda Curvy e Plus Size em ${CITY}`,
    description: `Moda curvy e plus size do 42 ao 54 em ${CITY}, com envio para todo o Brasil. Vestidos, macacões, conjuntos, camisas e calças. Veja o catálogo e compre pelo WhatsApp.`,
    ogTitle: "KF Moda Plus Size | Do 42 ao 54",
    ogDescription: "Modelagem que valoriza o corpo real. Loja em Curitiba e envio para todo o Brasil.",
    ogImage: "/brand/hero/hero.jpg",
    schemaDescription: `Moda curvy e plus size do 42 ao 54 em ${CITY}, com envio para todo o Brasil.`,
    areaServed: [CITY, "Brasil"],
  },

  contact: CONTACT,

  // assinatura no rodapé; use null para esconder
  credit: { label: "Por", name: "Ketlhen Felisbino" } as { label: string; name: string; url?: string } | null,

  // mostrados no hero e na seção do provador
  social: SOCIAL,

  announcements: [
    "Moda curvy e plus size do 42 ao 54",
    `Compre pelo WhatsApp ${CONTACT.whatsappLabel}`,
    "Enviamos para todo o Brasil",
    `Loja na Rua Mauá, ${CITY}`,
  ],

  hero: {
    eyebrow: `Curvy e plus size · ${CITY}`,
    // 3 linhas; a última fica em itálico na cor de acento
    title: ["Elegância", "que veste", "do 42 ao 54."] as [string, string, string],
    text: `Alfaiataria, vestidos e conjuntos com modelagem pensada para o corpo real. Loja em ${CITY} e envio para todo o Brasil.`,
    script: "corpo real",
    badge: "KF PLUS SIZE • DO 42 AO 54 • CURITIBA •",
    image: "/brand/hero/hero.jpg",
    imageAlt: "Conjunto de suede marsala com cinto dourado, na loja KF",
    avatars: ["/brand/products/conjunto-trico-chocolate.jpg", "/brand/products/conjunto-poa-listras.jpg", "/brand/products/camisa-cetim-vinho.jpg"],
    // peça do cartão "Look da semana" (usa a foto de hover dela, se houver)
    featuredLabel: "Look da semana",
    featuredSlug: "conjunto-suede-marsala",
  },

  // ícones: atributo "d" de um path 24x24 com traço
  perks: [
    { title: "Do 42 ao 54", text: "Modelagem para o corpo real", icon: "M8 3l4 3 4-3 3 4-3 2v12H8V9L5 7l3-4z" },
    { title: "Compre pelo WhatsApp", text: "Atendimento com consultora", icon: "M4 5h16v11H8l-4 4V5z M8 10h8" },
    { title: "Enviamos para todo o Brasil", text: `Ou prove na loja em ${CITY}`, icon: "M3 7l9-4 9 4v10l-9 4-9-4V7z M3 7l9 4 9-4 M12 11v10" },
    { title: "Novidades toda semana", text: `No ${CONTACT.instagramHandle}`, icon: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" },
  ],

  categories: {
    title: ["Escolha por", "onde começar"] as [string, string],
    hint: "Passe o mouse para ver mais. Toque para abrir a categoria no catálogo.",
  },

  featured: { eyebrow: "Em destaque", title: "Queridinhas da semana" },

  manifesto: {
    text: "Moda plus size feita em Curitiba para mulheres que não querem se esconder. Modelagem que valoriza o corpo real, tecido que cai bem e o cuidado de quem prova cada peça antes de mostrar para você.",
    // palavras destacadas em itálico
    highlight: ["real", "cuidado"],
  },

  provador: {
    eyebrow: "Direto da loja",
    title: ["Corpo real,", "looks reais."] as [string, string],
    text: "As fotos são feitas por nós, na loja, do jeito que a peça veste de verdade. Role para passear pelos looks da semana.",
    stats: [
      { to: SOCIAL.followers, decimals: 1, label: "mil seguidoras" },
      { to: SOCIAL.posts, label: "publicações" },
      { to: 7, label: "tamanhos, do 42 ao 54" },
      { to: 27, label: "estados com entrega" },
    ] as { to: number; decimals?: number; label: string }[],
  },

  finalCta: {
    eyebrow: "Atendimento de verdade",
    title: ["Achou a sua peça?", "A gente separa."] as [string, string],
    text: "Mande a foto ou o nome da peça. A gente confirma tamanho e cor e envia para todo o Brasil.",
    message: `Olá! Vim pelo site da KF Moda Plus Size e quero ajuda para escolher uma peça.`,
  },

  // vitrine de lojas (home e /lojas) ou bloco "Visite a loja" quando há 1 loja
  stores: {
    eyebrowHome: "Rua Mauá · Curitiba",
    eyebrowPage: "Endereço",
    titleAccent: "Prove com calma.",
    text: "Na loja você prova tudo com atendimento de quem entende de modelagem plus size. Não está em Curitiba? A gente envia para todo o Brasil.",
  },

  storesPage: {
    metaDescription: `Loja KF Moda Plus Size na Rua Mauá, 905, em ${CITY}. Moda curvy e plus size do 42 ao 54.`,
    eyebrow: "Curitiba · PR",
    // a linha do meio fica em itálico na cor primária
    title: ["A gente te espera", "na Rua Mauá,", `em ${CITY}.`] as [string, string, string],
    image: "/brand/hero/loja.jpg",
    imageAlt: "Interior da loja KF Moda Plus Size, com araras e lustre",
    faqTitle: ["Antes de", "sair de casa"] as [string, string],
    faq: [
      { q: "Qual é o horário da loja?", a: "Chame no WhatsApp que a gente informa o horário e já deixa as peças separadas para você provar." },
      { q: "Vocês enviam para fora de Curitiba?", a: "Sim, enviamos para todo o Brasil. Mande sua seleção pelo WhatsApp e a gente informa o frete e o prazo." },
      { q: "Qual a numeração das peças?", a: "Trabalhamos do 42 ao 54. Na dúvida entre dois tamanhos, mande suas medidas pelo WhatsApp que a gente ajuda." },
      { q: "Posso reservar uma peça para provar?", a: `Fale com a nossa equipe pelo WhatsApp ${CONTACT.whatsappLabel} e combinamos a melhor forma de te atender.` },
    ],
    message: "Olá! Vim pelo site e quero saber sobre a loja KF Moda Plus Size.",
  },

  catalog: {
    metaDescription: "Vestidos, macacões, conjuntos, camisas e calças plus size do 42 ao 54. Escolha suas peças e faça o pedido pelo WhatsApp.",
    intro: "Salve no coração o que você amar e envie sua seleção pelo WhatsApp. A gente confirma o tamanho e a cor e envia para todo o Brasil.",
  },

  product: {
    note: "Prove na loja em Curitiba ou receba em todo o Brasil. Confirme o estoque pelo WhatsApp ou ",
    noteLink: "veja como chegar",
  },

  selection: {
    footer: "A gente confirma tamanho, cor e o frete para a sua cidade.",
  },

  notFound: {
    title: ["Essa página", "não está", "na arara."] as [string, string, string],
    text: "A página que você procurou não existe ou mudou de lugar. Que tal dar uma olhada nas novidades?",
  },

  footer: {
    // versão curta do nome gigante no fim da página (padrão: wordmark)
    wordmark: ["Plus", "Size"] as [string, string],
    about: `Moda curvy e plus size do 42 ao 54, com modelagem que valoriza o corpo real. Loja em ${CITY} e envio para todo o Brasil.`,
  },

  floatingHint: "Posso te ajudar a escolher? ✦",

  messages: {
    default: "Olá! Vim pelo site da KF Moda Plus Size.",
    help: "Olá! Vim pelo site da KF Moda Plus Size e quero ajuda.",
    store: (store: string) => `Olá! Vim pelo site da ${store} e quero visitar a loja.`,
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
        "Olá! Vim pelo site da KF Moda Plus Size e separei estas peças:\n" + names.map((n) => `• ${n}`).join("\n") + "\nTem disponível?",
    },
    "agendar-prova": {
      button: "Agendar prova",
      card: "Quero provar",
      quick: (name: string) => `Olá! Vim pelo site e quero agendar uma prova da peça: ${name}.`,
      detail: (name: string, color: string, size: string | null) =>
        `Olá! Vim pelo site e quero agendar uma prova de: ${name} · cor ${color}${size ? ` · tamanho ${size}` : ""}. Qual o melhor horário?`,
      selectionButton: "Agendar prova no WhatsApp",
      selection: (names: string[]) =>
        "Olá! Vim pelo site da KF Moda Plus Size e quero provar estas peças:\n" + names.map((n) => `• ${n}`).join("\n") + "\nQual o melhor horário?",
    },
  },
};
