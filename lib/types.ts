// Formas dos dados que o site lê (do Supabase ou, sem ele, da config).

export type Color = { name: string; hex: string };

export type Variant = { id: string; size: string; color: string; hex: string; stock: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  price: number | null;
  salePrice: number | null;
  // URLs prontas para o next/image, na ordem definida no painel
  images: string[];
  image: string;
  hoverImage?: string;
  tag?: string;
  featured: boolean;
  colors: Color[];
  sizes: string[];
  variants: Variant[];
  // soma do estoque das variações
  stock: number;
};

export type Category = { id: string; name: string; slug: string; image?: string; showOnHome: boolean };

export type Review = { id: string; name: string; city?: string; rating: number; comment: string; featured: boolean; createdAt: string };

export type HeroContent = {
  eyebrow: string;
  title: [string, string];
  text: string;
  image: string;
  imageSecondary: string;
  imageAlt: string;
  whatsappButton: string;
  whatsappMessage: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  values: { title: string; text: string }[];
};

export type PromoContent = {
  eyebrow: string;
  title: [string, string];
  text: string;
  button: string;
  message: string;
  image: string;
};

export type ContactContent = {
  // só dígitos, com DDI e DDD: 5541995385799
  whatsapp: string;
  instagram: string;
  street: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  // linhas livres: "Seg a sex · 9h às 18h"
  hours: string[];
};

export type SizeRow = { size: string; bust: string; waist: string; hip: string };
export type SizeGuideContent = { note: string; rows: SizeRow[] };

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  promo: PromoContent;
  contact: ContactContent;
  size_guide: SizeGuideContent;
};

export type ContentKey = keyof SiteContent;

export type SiteData = {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  content: SiteContent;
  // "static" = sem Supabase configurado, usando config/products.ts
  source: "supabase" | "static";
};
