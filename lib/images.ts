import { BUCKET, SUPABASE_URL } from "./supabase/env";

// Imagens são guardadas como caminho no Storage ("produtos/abc.webp") ou como URL
// ("/brand/products/x.jpg", "https://..."). Só os caminhos do Storage são apagados pelo painel.
export function isStoragePath(path: string | null | undefined): path is string {
  return Boolean(path) && !/^(https?:)?\//.test(path as string);
}

export function imageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (!isStoragePath(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

// Todos os caminhos do Storage citados num valor qualquer (usado no conteúdo do site).
export function storagePathsIn(value: unknown): string[] {
  if (typeof value === "string") return isStoragePath(value) && /^(produtos|categorias|site)\//.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(storagePathsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(storagePathsIn);
  return [];
}
