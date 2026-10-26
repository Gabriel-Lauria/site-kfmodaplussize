"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { reviewSchema } from "@/lib/validation";
import { createServiceClient } from "@/lib/supabase/server";

export type ReviewState = { ok: boolean; message: string; errors?: Record<string, string> };

// limite por IP em 24 h
const MAX_PER_DAY = 3;
// formulário preenchido mais rápido que isso é robô
const MIN_FILL_MS = 3000;

async function ipHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconhecido";
  const salt = process.env.REVIEW_IP_SALT || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function submitReview(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  // honeypot: campo escondido que só robô preenche. Responde "ok" para não ensinar o robô.
  if (String(form.get("site") ?? "").trim()) return { ok: true, message: "Obrigada! Sua avaliação vai aparecer depois de revisada." };
  const started = Number(form.get("started") ?? 0);
  if (!started || Date.now() - started < MIN_FILL_MS) {
    return { ok: false, message: "Opa, foi rápido demais. Confira os campos e envie de novo." };
  }

  const parsed = reviewSchema.safeParse({
    name: form.get("name"),
    city: form.get("city"),
    rating: form.get("rating"),
    comment: form.get("comment"),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { ok: false, message: "Confira os campos destacados.", errors };
  }

  const sb = createServiceClient();
  if (!sb) return { ok: false, message: "As avaliações ainda não estão ativas. Conte pra gente pelo WhatsApp!" };

  const hash = await ipHash();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await sb.from("reviews").select("id", { count: "exact", head: true }).eq("ip_hash", hash).gte("created_at", since);
  if (countError) return { ok: false, message: "Não deu para enviar agora. Tente de novo em instantes." };
  if ((count ?? 0) >= MAX_PER_DAY) return { ok: false, message: "Recebemos suas avaliações de hoje. Obrigada! Amanhã você pode mandar outra." };

  const { error } = await sb.from("reviews").insert({ ...parsed.data, status: "pending", ip_hash: hash });
  if (error) return { ok: false, message: "Não deu para enviar agora. Tente de novo em instantes." };

  return { ok: true, message: "Obrigada! Sua avaliação vai aparecer no site depois de revisada pela nossa equipe." };
}
