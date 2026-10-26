import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { hasSupabase } from "./supabase/env";

// Pessoa logada e cadastrada em public.admins, ou null.
export async function getAdmin() {
  if (!hasSupabase) return null;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? { sb, user } : null;
}

// Para páginas e Server Actions do painel: sem permissão, volta para o login.
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
