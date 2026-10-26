import "server-only";
import { cookies } from "next/headers";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { secureCookie } from "./cookies";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./env";

// Cliente com a sessão da pessoa logada (cookies). Usado no /admin: as políticas RLS valem.
export async function createClient() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, secureCookie(options)));
        } catch {
          // chamado de um Server Component: o middleware renova a sessão
        }
      },
    },
  });
}

// Cliente anônimo, sem cookies: leitura pública do site (pode ficar em cache).
export function createPublicClient() {
  return createJsClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Cliente com a chave secreta: ignora a RLS. Só para o formulário de avaliação.
export function createServiceClient() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createJsClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
