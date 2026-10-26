import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SiteShell } from "@/components/SiteShell";
import { BRAND } from "@/config";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
        <BrandMark bloom className="h-24 w-24" />
        <p className="mt-8 text-xs uppercase tracking-[0.24em] text-primary">Erro 404</p>
        <h1 className="mt-3 font-display text-5xl leading-tight tracking-tight sm:text-6xl">
          {BRAND.notFound.title[0]} <em className="text-primary">{BRAND.notFound.title[1]}</em> {BRAND.notFound.title[2]}
        </h1>
        <p className="mt-5 text-ink/70">{BRAND.notFound.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/catalogo" className="rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-primary-deep">
            Ver catálogo
          </Link>
          <Link href="/" className="rounded-full border border-ink/15 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary">
            Voltar ao início
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
