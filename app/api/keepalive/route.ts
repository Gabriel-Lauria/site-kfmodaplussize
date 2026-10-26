import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

// O plano gratuito do Supabase pausa o projeto depois de 7 dias sem uso. O cron da Vercel
// (vercel.json) chama esta rota uma vez por dia e faz uma leitura pequena para manter o banco ativo.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!hasSupabase) return NextResponse.json({ ok: true, supabase: false });
  const { error } = await createPublicClient().from("categories").select("id").limit(1);
  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200 });
}
