"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { SITE_TAG } from "@/lib/data";
import { imageUrl, isStoragePath, storagePathsIn } from "@/lib/images";
import { BUCKET, hasSupabase } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { categorySchema, contentSchemas, productSchema, stockSchema } from "@/lib/validation";
import type { ContentKey } from "@/lib/types";

export type ActionState = { ok: boolean; message: string; errors?: Record<string, string>; id?: string };

type Sb = Awaited<ReturnType<typeof requireAdmin>>["sb"];

function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) errors[issue.path.join(".") || "form"] ??= issue.message;
  return { ok: false, message: Object.values(errors)[0] ?? "Confira os campos.", errors } satisfies ActionState;
}

// Mensagens do Postgres em português simples.
function dbError(error: { code?: string; message?: string } | null, fallback = "Não deu para salvar. Tente de novo.") {
  if (!error) return fallback;
  if (error.code === "23505") return "Já existe um cadastro com esse endereço de página. Mude o campo \"endereço\".";
  if (error.code === "23514") return error.message?.includes("stock") ? "O estoque não pode ficar negativo." : "Algum valor está fora do permitido (confira preços e quantidades).";
  if (error.code === "42501") return "Sua conta não tem permissão para isso.";
  if (error.code === "P0002") return "Esse cadastro não existe mais. Atualize a página.";
  return fallback;
}

function refresh() {
  revalidateTag(SITE_TAG);
  revalidatePath("/admin", "layout");
}

// Apaga do Storage só caminhos do bucket (fotos de exemplo em /public ficam).
async function removeFiles(sb: Sb, paths: (string | null | undefined)[]) {
  const list = [...new Set(paths.filter(isStoragePath))];
  if (list.length) await sb.storage.from(BUCKET).remove(list);
}

function parseJson(form: FormData, key = "payload") {
  try {
    return JSON.parse(String(form.get(key) ?? "null"));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Login
const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

export async function login(_prev: ActionState, form: FormData): Promise<ActionState> {
  if (!hasSupabase) return { ok: false, message: "O Supabase ainda não foi configurado (veja o README)." };
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return fieldErrors(parsed.error);

  const sb = await createClient();
  const { data, error } = await sb.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { ok: false, message: "E-mail ou senha incorretos." };

  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await sb.auth.signOut();
    return { ok: false, message: "Esta conta não tem acesso ao painel." };
  }
  redirect("/admin");
}

export async function logout() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Imagens (já chegam em WebP, convertidas no navegador)
const FOLDERS = ["produtos", "categorias", "site"] as const;
const MAX_BYTES = 3 * 1024 * 1024;

export async function uploadImage(form: FormData): Promise<{ ok: true; path: string; url: string } | { ok: false; message: string }> {
  const { sb } = await requireAdmin();
  const file = form.get("file");
  const folder = String(form.get("folder"));
  if (!(file instanceof Blob) || !FOLDERS.includes(folder as (typeof FOLDERS)[number])) return { ok: false, message: "Arquivo inválido." };
  if (!["image/webp", "image/jpeg", "image/png"].includes(file.type)) return { ok: false, message: "Formato não aceito." };
  if (file.size > MAX_BYTES) return { ok: false, message: "A foto ficou grande demais (máx. 3 MB)." };

  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${randomUUID()}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) return { ok: false, message: "Não deu para enviar a foto. Tente de novo." };
  return { ok: true, path, url: imageUrl(path) };
}

// Fotos enviadas num formulário que foi cancelado: apaga se nada usa.
export async function discardImages(paths: string[]) {
  const { sb } = await requireAdmin();
  const candidates = paths.filter((p) => isStoragePath(p) && FOLDERS.some((f) => p.startsWith(`${f}/`)));
  if (!candidates.length) return;
  const used = await referencedPaths(sb);
  await removeFiles(sb, candidates.filter((p) => !used.has(p)));
}

async function referencedPaths(sb: Sb) {
  const [images, categories, content] = await Promise.all([
    sb.from("product_images").select("path"),
    sb.from("categories").select("image_path"),
    sb.from("site_content").select("value"),
  ]);
  if (images.error || categories.error || content.error) throw new Error("Não deu para conferir as fotos em uso.");
  return new Set<string>([
    ...(images.data ?? []).map((i) => i.path),
    ...(categories.data ?? []).map((c) => c.image_path).filter(Boolean),
    ...(content.data ?? []).flatMap((c) => storagePathsIn(c.value)),
  ]);
}

// Manutenção: apaga do Storage arquivos que nenhum cadastro usa (com mais de 1 hora, para não pegar envios em andamento).
export async function cleanOrphanImages(): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const used = await referencedPaths(sb);
  const cutoff = Date.now() - 60 * 60 * 1000;
  const orphans: string[] = [];
  for (const folder of FOLDERS) {
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await sb.storage.from(BUCKET).list(folder, { limit: 1000, offset });
      if (error) return { ok: false, message: "Não deu para listar as fotos." };
      for (const f of data ?? []) {
        const path = `${folder}/${f.name}`;
        if (f.id && f.created_at && !used.has(path) && new Date(f.created_at).getTime() < cutoff) orphans.push(path);
      }
      if (!data || data.length < 1000) break;
    }
  }
  await removeFiles(sb, orphans);
  return { ok: true, message: orphans.length ? `${orphans.length} foto(s) sem uso apagada(s).` : "Nenhuma foto sem uso encontrada." };
}

// ---------------------------------------------------------------------------
// Peças
export async function saveProduct(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const parsed = productSchema.safeParse(parseJson(form));
  if (!parsed.success) return fieldErrors(parsed.error);

  const { data, error } = await sb.rpc("save_product", { p: parsed.data });
  if (error) return { ok: false, message: dbError(error) };
  const result = data as { id: string; removed: string[] };
  await removeFiles(sb, result.removed);
  refresh();
  return { ok: true, message: "Peça salva.", id: result.id };
}

export async function deleteProduct(form: FormData) {
  const { sb } = await requireAdmin();
  const id = z.string().uuid().parse(form.get("id"));
  const { data, error } = await sb.rpc("delete_product", { p_id: id });
  if (error) throw new Error(dbError(error, "Não deu para excluir."));
  await removeFiles(sb, data as string[]);
  refresh();
  redirect("/admin/produtos?aviso=excluida");
}

const toggleSchema = z.object({ id: z.string().uuid(), field: z.enum(["active", "featured"]), value: z.enum(["true", "false"]) });

export async function toggleProduct(form: FormData) {
  const { sb } = await requireAdmin();
  const { id, field, value } = toggleSchema.parse(Object.fromEntries(form));
  await sb.from("products").update({ [field]: value === "true" }).eq("id", id);
  refresh();
}

export async function adjustStock(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const raw = Object.fromEntries(form);
  // a tela manda quantidade positiva + sentido (entrada/saída)
  const qty = Math.abs(Number(raw.qty));
  const parsed = stockSchema.safeParse({ ...raw, delta: raw.direction === "out" ? -qty : qty });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { variantId, delta, reason, note } = parsed.data;
  const { data, error } = await sb.rpc("adjust_stock", { p_variant: variantId, p_delta: delta, p_reason: reason, p_note: note ?? null });
  if (error) return { ok: false, message: dbError(error, "Não deu para ajustar o estoque.") };
  refresh();
  return { ok: true, message: `Estoque atualizado: ${data} ${data === 1 ? "unidade" : "unidades"}.` };
}

// ---------------------------------------------------------------------------
// Categorias
export async function saveCategory(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const parsed = categorySchema.safeParse(parseJson(form));
  if (!parsed.success) return fieldErrors(parsed.error);
  const { id, ...row } = parsed.data;

  if (id) {
    const { data: old } = await sb.from("categories").select("image_path").eq("id", id).maybeSingle();
    const { error } = await sb.from("categories").update(row).eq("id", id);
    if (error) return { ok: false, message: dbError(error) };
    if (old?.image_path && old.image_path !== row.image_path) await removeFiles(sb, [old.image_path]);
  } else {
    const { data: last } = await sb.from("categories").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
    const { error } = await sb.from("categories").insert({ ...row, position: (last?.position ?? -1) + 1 });
    if (error) return { ok: false, message: dbError(error) };
  }
  refresh();
  return { ok: true, message: "Categoria salva." };
}

export async function moveCategory(form: FormData) {
  const { sb } = await requireAdmin();
  const id = z.string().uuid().parse(form.get("id"));
  const dir = form.get("dir") === "up" ? -1 : 1;
  const { data } = await sb.from("categories").select("id, position").order("position");
  const list = data ?? [];
  const i = list.findIndex((c) => c.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  // regrava as posições em sequência para não haver empate
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((c, pos) => sb.from("categories").update({ position: pos }).eq("id", c.id)));
  refresh();
}

export async function deleteCategory(form: FormData) {
  const { sb } = await requireAdmin();
  const id = z.string().uuid().parse(form.get("id"));
  const { data: old } = await sb.from("categories").select("image_path").eq("id", id).maybeSingle();
  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) throw new Error(dbError(error, "Não deu para excluir."));
  await removeFiles(sb, [old?.image_path]);
  refresh();
}

// ---------------------------------------------------------------------------
// Conteúdo do site
export async function saveContent(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const key = String(form.get("key")) as ContentKey;
  const schema = contentSchemas[key];
  if (!schema) return { ok: false, message: "Seção inválida." };
  const parsed = schema.safeParse(parseJson(form));
  if (!parsed.success) return fieldErrors(parsed.error);

  const { data: old } = await sb.from("site_content").select("value").eq("key", key).maybeSingle();
  const { error } = await sb.from("site_content").upsert({ key, value: parsed.data });
  if (error) return { ok: false, message: dbError(error) };

  const kept = new Set(storagePathsIn(parsed.data));
  await removeFiles(sb, storagePathsIn(old?.value).filter((p) => !kept.has(p)));
  refresh();
  return { ok: true, message: "Alterações publicadas no site." };
}

// ---------------------------------------------------------------------------
// Avaliações
const reviewOp = z.object({ id: z.string().uuid(), op: z.enum(["approve", "reject", "pending", "feature", "unfeature", "delete"]) });

export async function moderateReview(form: FormData) {
  const { sb } = await requireAdmin();
  const { id, op } = reviewOp.parse(Object.fromEntries(form));
  const reviews = sb.from("reviews");
  if (op === "delete") await reviews.delete().eq("id", id);
  else if (op === "feature" || op === "unfeature") await reviews.update({ featured: op === "feature" }).eq("id", id);
  else await reviews.update({ status: op === "approve" ? "approved" : op === "reject" ? "rejected" : "pending", ...(op !== "approve" && { featured: false }) }).eq("id", id);
  refresh();
}

