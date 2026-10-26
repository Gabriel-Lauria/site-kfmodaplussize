// Textos iniciais do layout "editorial" (FEATURES.layout). Com o Supabase configurado, hero, banner e
// "sobre" passam a ser editados no painel (/admin/conteudo); estes valores viram o seed e o padrão.
// As fotos saem dos produtos por padrão; troque por caminhos de /public/brand quando quiser outra.
import { BRAND } from "./brand";
import { PRODUCTS } from "./products";

const photo = (slug: string) => PRODUCTS.find((p) => p.slug === slug)?.image ?? PRODUCTS[0].image;

export const EDITORIAL = {
  hero: {
    eyebrow: "Nova coleção · Curvy e plus size",
    // 1ª linha normal, 2ª em itálico na cor primária
    title: ["Elegância que veste", "do 42 ao 54."] as [string, string],
    text: "Alfaiataria, vestidos e conjuntos com modelagem pensada para o corpo real. Loja em Curitiba e envio para todo o Brasil.",
    // foto grande + foto menor sobreposta
    images: [photo("vestido-longo-pink-halter"), photo("camisa-linho-marinho")] as [string, string],
    imageAlt: "Vestido longo pink com gola halter da KF Moda Plus Size",
  },

  // 3 diferenciais abaixo do botão do hero (usa os 3 primeiros perks de brand.ts)
  values: BRAND.perks.slice(0, 3),

  // peças marcadas como destaque no seed (no painel: "Destaque na página inicial")
  products: {
    eyebrow: "Em destaque",
    title: "Queridinhas da semana",
    slugs: [
      "macaquinho-romantico-talita",
      "vestido-longo-pink-halter",
      "macacao-pantalona-verde",
      "vestido-longo-poa-verde",
      "calca-pantalona-onca",
      "macaquinho-transpassado-preto",
    ],
  },

  // faixa escura no meio da página
  promo: {
    eyebrow: "Grade completa",
    title: ["Do 42", "ao 54"] as [string, string],
    text: "Modelagem que valoriza o corpo real em todas as peças. Na dúvida do tamanho, a gente ajuda pelo WhatsApp.",
    button: "Falar com uma consultora",
    message: "Olá! Vim pelo site da KF Moda Plus Size e quero ajuda com o tamanho.",
    image: photo("vestido-longo-pink-decote-v"),
  },

  instagram: {
    title: ["Siga no", "Instagram"] as [string, string],
  },

  story: {
    title: "Nossa história",
    image: photo("conjunto-trico-chocolate"),
  },
};
