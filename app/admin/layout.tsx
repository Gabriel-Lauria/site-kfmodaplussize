import type { Metadata } from "next";
import { BRAND } from "@/config";
import { hasSupabase } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: { default: "Painel", template: `%s · Painel ${BRAND.name}` },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabase) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-display text-4xl">Painel ainda não configurado</h1>
        <p className="mt-4 leading-relaxed text-ink/75">
          Para usar o painel, crie o projeto no Supabase, rode <code>supabase/schema.sql</code> e <code>supabase/seed.sql</code> e preencha as variáveis do arquivo{" "}
          <code>.env.example</code> (localmente em <code>.env.local</code>, na Vercel em Settings → Environment Variables). O passo a passo está no README.
        </p>
      </main>
    );
  }
  return <div className="admin-shell min-h-dvh bg-[#f7f2ee]">{children}</div>;
}
