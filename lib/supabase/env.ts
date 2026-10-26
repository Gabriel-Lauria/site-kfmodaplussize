// Variáveis do Supabase (ver .env.example). Sem elas o site usa os dados de config/.
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
// chave pública: "publishable" (sb_publishable_...) ou a "anon" antiga
export const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_PUBLIC_KEY);

export const BUCKET = "imagens";
