// Esquemas Zod usados no front (mensagens) e nas Server Actions (validação de verdade).
import { z } from "zod";
import { REVIEW, REVIEW_MESSAGES } from "./review-rules";

const text = (max: number, label: string) => z.string().trim().max(max, `${label}: até ${max} caracteres`);
const optional = (max: number, label: string) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? null : v), text(max, label).nullable().optional());

// "129,90", "1.299,90", "129.90" ou vazio -> número ou null
const money = z.preprocess((v) => {
  if (v == null) return null;
  const s = String(v).trim().replace(/\s|R\$/g, "");
  if (!s) return null;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  return Number(normalized);
}, z.number({ error: "Valor inválido" }).min(0, "Valor inválido").max(100000, "Valor muito alto").nullable());

// mesmos limites de lib/review-rules.ts (validação leve do navegador)
export const reviewSchema = z.object({
  name: text(REVIEW.name[1], "Nome").min(REVIEW.name[0], REVIEW_MESSAGES.name),
  city: optional(REVIEW.city, "Cidade"),
  rating: z.coerce.number({ error: REVIEW_MESSAGES.rating }).int().min(1, REVIEW_MESSAGES.rating).max(5, REVIEW_MESSAGES.rating),
  comment: text(REVIEW.comment[1], "Comentário").min(REVIEW.comment[0], REVIEW_MESSAGES.comment),
});

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Informe o endereço da página")
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use só letras minúsculas, números e hífen");

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida");

export const productSchema = z
  .object({
    id: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
    name: text(120, "Nome").min(2, "Dê um nome para a peça"),
    slug: slugSchema,
    description: text(2000, "Descrição").default(""),
    category_id: z.string().uuid().nullable().or(z.literal("").transform(() => null)),
    price: money,
    sale_price: money,
    tag: optional(30, "Etiqueta"),
    featured: z.boolean(),
    active: z.boolean(),
    min_stock: z.coerce.number().int().min(0, "Mínimo 0").max(999),
    images: z.array(z.string().min(1).max(300)).max(12, "Até 12 fotos por peça"),
    colors: z
      .array(z.object({ name: text(40, "Cor").min(1, "Dê um nome para a cor"), hex }))
      .min(1, "Cadastre pelo menos uma cor")
      .max(12)
      .refine((list) => new Set(list.map((c) => c.name.toLowerCase())).size === list.length, "Há cores com o mesmo nome"),
    sizes: z.array(text(10, "Tamanho").min(1)).min(1, "Escolha pelo menos um tamanho").max(20),
    initial_stock: z.record(z.string(), z.coerce.number().int().min(0).max(9999)).default({}),
  })
  .refine((p) => p.sale_price == null || p.price == null || p.sale_price < p.price, {
    message: "O preço promocional precisa ser menor que o preço normal",
    path: ["sale_price"],
  })
  .refine((p) => p.sale_price == null || p.price != null, {
    message: "Informe o preço normal para usar o promocional",
    path: ["price"],
  });

export type ProductInput = z.infer<typeof productSchema>;

export const stockSchema = z.object({
  variantId: z.string().uuid(),
  delta: z.coerce.number().int().min(-9999).max(9999).refine((n) => n !== 0, "Quantidade diferente de zero"),
  reason: z.enum(["entrada", "venda", "troca", "ajuste"]),
  note: optional(200, "Observação"),
});

export const categorySchema = z.object({
  id: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
  name: text(60, "Nome").min(1, "Dê um nome"),
  slug: slugSchema,
  image_path: optional(300, "Imagem"),
  show_on_home: z.boolean(),
  active: z.boolean(),
});

const line = (max: number) => z.string().trim().max(max);

export const contentSchemas = {
  hero: z.object({
    eyebrow: line(80),
    title: z.tuple([line(60).min(1, "Obrigatório"), line(60)]),
    text: line(400),
    image: line(300).min(1, "Escolha uma foto"),
    imageSecondary: line(300),
    imageAlt: line(160),
    whatsappButton: line(40).min(1, "Obrigatório"),
    whatsappMessage: line(300).min(1, "Obrigatório"),
  }),
  about: z.object({
    eyebrow: line(60),
    title: line(80).min(1, "Obrigatório"),
    text: line(1200).min(1, "Obrigatório"),
    image: line(300),
    values: z.array(z.object({ title: line(40).min(1, "Obrigatório"), text: line(200) })).max(6),
  }),
  promo: z.object({
    eyebrow: line(60),
    title: z.tuple([line(30), line(30)]),
    text: line(300),
    button: line(40),
    message: line(300),
    image: line(300),
  }),
  contact: z.object({
    whatsapp: z.string().trim().transform((v) => v.replace(/\D/g, "")).pipe(z.string().regex(/^55\d{10,11}$/, "Use 55 + DDD + número, ex.: 5541995385799")),
    instagram: z.string().trim().url("Cole o link completo do perfil").max(200),
    street: line(120),
    district: line(80),
    city: line(80),
    state: line(2).transform((v) => v.toUpperCase()),
    postalCode: line(9),
    hours: z.array(line(80)).max(10),
  }),
  size_guide: z.object({
    note: line(400),
    rows: z.array(z.object({ size: line(10).min(1, "Obrigatório"), bust: line(10), waist: line(10), hip: line(10) })).max(20),
  }),
};
