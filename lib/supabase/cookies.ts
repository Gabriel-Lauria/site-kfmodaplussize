import type { CookieOptions } from "@supabase/ssr";

// A sessão só é usada no servidor (o painel não tem cliente Supabase no navegador),
// então os cookies podem ser httpOnly: o JavaScript da página não consegue lê-los.
export function secureCookie(options: CookieOptions): CookieOptions {
  return { ...options, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };
}
