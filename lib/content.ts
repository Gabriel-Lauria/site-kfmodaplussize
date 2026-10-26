// Valores iniciais do conteúdo editável. Viram o seed do Supabase e são usados
// quando o banco não está configurado ou uma chave ainda não foi salva no painel.
import { BRAND, EDITORIAL, STORES } from "@/config";
import type { SiteContent } from "./types";

const store = STORES[0];

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: EDITORIAL.hero.eyebrow,
    title: EDITORIAL.hero.title,
    text: EDITORIAL.hero.text,
    image: EDITORIAL.hero.images[0],
    imageSecondary: EDITORIAL.hero.images[1],
    imageAlt: EDITORIAL.hero.imageAlt,
    whatsappButton: "Comprar pelo WhatsApp",
    whatsappMessage: BRAND.messages.help,
  },
  about: {
    eyebrow: "Sobre a marca",
    title: EDITORIAL.story.title,
    text: BRAND.manifesto.text,
    image: EDITORIAL.story.image,
    values: [
      { title: "Corpo real", text: "Modelagem do 42 ao 54 pensada para vestir bem, não para esconder." },
      { title: "Conforto", text: "Tecidos que caem bem e acompanham o seu dia inteiro." },
      { title: "Atendimento", text: "A gente prova cada peça antes de mostrar e ajuda você a escolher o tamanho certo." },
    ],
  },
  promo: {
    eyebrow: EDITORIAL.promo.eyebrow,
    title: EDITORIAL.promo.title,
    text: EDITORIAL.promo.text,
    button: EDITORIAL.promo.button,
    message: EDITORIAL.promo.message,
    image: EDITORIAL.promo.image,
  },
  contact: {
    whatsapp: BRAND.contact.whatsapp,
    instagram: BRAND.contact.instagram,
    street: store?.area ?? "",
    district: "",
    city: store?.city ?? "",
    state: store?.state ?? "",
    postalCode: store?.postalCode ?? "",
    // vazio = o site pede para consultar pelo WhatsApp
    hours: [],
  },
  size_guide: {
    note: "Medidas de referência do corpo, em centímetros. Na dúvida entre dois tamanhos, chame a gente no WhatsApp.",
    rows: [
      { size: "42", bust: "96", waist: "80", hip: "104" },
      { size: "44", bust: "100", waist: "84", hip: "108" },
      { size: "46", bust: "104", waist: "88", hip: "112" },
      { size: "48", bust: "110", waist: "94", hip: "118" },
      { size: "50", bust: "116", waist: "100", hip: "124" },
      { size: "52", bust: "122", waist: "106", hip: "130" },
      { size: "54", bust: "128", waist: "112", hip: "136" },
    ],
  },
};
