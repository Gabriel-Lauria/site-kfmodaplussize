"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND, CTA } from "@/config";
import { stockFor } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { HeartButton } from "./ProductCard";
import { Price } from "./Price";
import { useSite } from "./SiteData";
import { WhatsApp } from "./Icons";

// Cor, tamanho e ações de uma peça. Usado na janela rápida (sticky) e na página da peça.
// O botão do WhatsApp fica preso no rodapé enquanto a pessoa lê, sempre ao alcance do polegar.
export function ProductDetails({
  product,
  onClose,
  headingLevel = "h2",
  sticky = false,
}: {
  product: Product;
  onClose?: () => void;
  headingLevel?: "h1" | "h2";
  // true = dentro da janela rápida (preso também no computador); false = página da peça (só no celular)
  sticky?: boolean;
}) {
  const { wa } = useSite();
  // começa na primeira cor que tem estoque
  const firstColor = product.colors.find((c) => product.variants.some((v) => v.color === c.name && v.stock > 0)) ?? product.colors[0];
  const [color, setColor] = useState(firstColor?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const Heading = headingLevel;

  const soldOut = product.stock <= 0;
  const available = (s: string) => stockFor(product, color, s) > 0;
  const chosen = size && available(size) ? size : null;
  const message = soldOut
    ? `Olá! Vim pelo site e queria saber se a peça ${product.name} vai voltar ao estoque.`
    : CTA.detail(product.name, color, chosen);

  const share = async () => {
    const url = `${window.location.origin}/catalogo/${product.slug}`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `${product.name} · ${BRAND.name}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const blocks = [
    <div key="top" className="flex items-start justify-between">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{product.category}</p>
      {onClose && (
        <button onClick={onClose} className="-mr-2 -mt-2 grid h-11 w-11 place-items-center rounded-full transition hover:rotate-90 hover:bg-cream" aria-label="Fechar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      )}
    </div>,
    <Heading key="name" className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{product.name}</Heading>,
    <Price key="price" product={product} className="mt-3 text-xl" />,
    <p key="desc" className="mt-4 leading-relaxed text-ink/75">{product.description}</p>,
    product.colors.length > 0 && (
      <div key="colors" className="mt-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          Cor · <span className="text-ink">{color}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button key={c.name} onClick={() => setColor(c.name)} className="relative h-11 w-11 rounded-full" aria-label={c.name} aria-pressed={color === c.name}>
              <span className="absolute inset-1.5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" style={{ backgroundColor: c.hex }} />
              {color === c.name && <span className="absolute inset-0 rounded-full border-2 border-primary" />}
            </button>
          ))}
        </div>
      </div>
    ),
    product.sizes.length > 0 && (
      <div key="sizes" className="mt-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Tamanho</p>
          <Link href="/#medidas" onClick={onClose} className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">
            Guia de medidas
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const ok = available(s);
            return (
              <button
                key={s}
                onClick={() => setSize(s)}
                disabled={!ok}
                aria-pressed={chosen === s}
                aria-label={ok ? `Tamanho ${s}` : `Tamanho ${s}, esgotado nesta cor`}
                className={`relative min-h-11 min-w-12 rounded-full border px-4 text-base transition ${
                  chosen === s ? "border-primary text-paper" : ok ? "border-ink/20 hover:border-ink/50" : "cursor-not-allowed border-ink/10 text-ink/30 line-through"
                }`}
              >
                {chosen === s && <span className="pop absolute inset-0 rounded-full bg-primary" />}
                <span className="relative">{s}</span>
              </button>
            );
          })}
        </div>
      </div>
    ),
    <div
      key="cta"
      className={`sticky bottom-0 z-10 mt-8 flex items-center gap-3 border-t border-ink/10 bg-paper/95 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur ${
        sticky ? "-mx-5 px-5 sm:-mx-10 sm:px-10" : "-mx-4 px-4 sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none"
      }`}
    >
      <a
        href={wa(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-paper sm:px-6 sm:tracking-[0.12em] transition hover:bg-primary-deep"
      >
        <WhatsApp /> {soldOut ? "Avise-me quando voltar" : CTA.button}
      </a>
      <HeartButton product={product} className="relative h-[52px] w-[52px] shrink-0 border border-ink/15" />
      <button onClick={share} className="relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-ink/15 transition hover:border-primary hover:text-primary" aria-label="Copiar link da peça">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
        {copied && (
          <span className="fade-up absolute -top-10 right-0 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs text-paper" role="status">
            Link copiado {BRAND.ornament}
          </span>
        )}
      </button>
    </div>,
    <p key="note" className="mt-4 text-muted">
      {!soldOut && !chosen && product.sizes.length > 1 && <>Escolha o tamanho para a mensagem já ir completa. </>}
      {BRAND.product.note}
      <Link href="/lojas" className="text-primary underline underline-offset-4">{BRAND.product.noteLink}</Link>.
    </p>,
  ].filter(Boolean);

  return (
    // sem wrapper por bloco: o botão "sticky" precisa ter a coluna inteira como pai para ficar preso
    <div className="fade-up flex flex-col">{blocks}</div>
  );
}
