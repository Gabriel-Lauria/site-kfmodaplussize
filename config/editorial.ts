// Conteúdo das seções do layout "editorial" (FEATURES.layout). O layout "classic" não usa este arquivo.
// As fotos saem dos produtos por padrão; troque por caminhos de /public/brand quando quiser outra.
import { BRAND } from "./brand";
import { LOOKS, PRODUCTS } from "./products";

const photo = (slug: string) => PRODUCTS.find((p) => p.slug === slug)?.image ?? PRODUCTS[0].image;

export const EDITORIAL = {
  hero: {
    eyebrow: "Nova coleção · Curvy e plus size",
    // 1ª linha normal, 2ª em itálico na cor primária
    title: ["Elegância que veste", "do 42 ao 54."] as [string, string],
    text: "Alfaiataria, vestidos e conjuntos com modelagem pensada para o corpo real. Loja em Curitiba e envio para todo o Brasil.",
    // foto grande + foto menor sobreposta
    images: [BRAND.hero.image, photo("conjunto-trico-chocolate")] as [string, string],
    imageAlt: BRAND.hero.imageAlt,
  },

  // 3 diferenciais abaixo do botão do hero (usa os 3 primeiros perks de brand.ts)
  values: BRAND.perks.slice(0, 3),

  products: { eyebrow: "Em destaque", title: "Queridinhas da semana" },

  lookbook: {
    title: "Lookbook",
    text: "Combinações montadas na loja, do jeito que a gente veste. Escolha a sua e peça pelo WhatsApp.",
    button: "Ver os looks",
    slugs: LOOKS.slice(0, 4),
  },

  // faixa escura no meio da página
  promo: {
    eyebrow: "Grade completa",
    title: ["Do 42", "ao 54"] as [string, string],
    text: "Modelagem que valoriza o corpo real em todas as peças. Na dúvida do tamanho, a gente ajuda pelo WhatsApp.",
    button: "Falar com uma consultora",
    message: "Olá! Vim pelo site da KF Moda Plus Size e quero ajuda com o tamanho.",
    image: photo("calca-pantalona-cinto"),
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
    image: photo("vestido-midi-babado"),
  },

  // cartão ao lado da história: lista VIP pelo WhatsApp (sem formulário nem servidor)
  vip: {
    title: "Lista VIP",
    text: "Receba os lançamentos da semana e as reposições de tamanho antes de todo mundo, direto no seu WhatsApp.",
    button: "Quero entrar",
    message: "Olá! Quero entrar na lista VIP da KF Moda Plus Size e receber as novidades.",
  },
};
