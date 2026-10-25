"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BRAND, CTA, waLink, type Product } from "@/config";
import { HeartButton } from "./ProductCard";
import { WhatsApp } from "./Icons";

// Cor, tamanho e ações de uma peça. Usado na janela rápida e na página da peça.
export function ProductDetails({ product, onClose, headingLevel = "h2" }: { product: Product; onClose?: () => void; headingLevel?: "h1" | "h2" }) {
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [copied, setCopied] = useState(false);
  const Heading = headingLevel;

  const message = CTA.detail(product.name, color, size);

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
        <button onClick={onClose} className="-mr-2 -mt-2 rounded-full p-2 transition hover:rotate-90 hover:bg-cream" aria-label="Fechar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      )}
    </div>,
    <Heading key="name" className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{product.name}</Heading>,
    <p key="desc" className="mt-4 leading-relaxed text-ink/70">{product.description}</p>,
    <div key="colors" className="mt-8">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        Cor · <span className="text-ink">{color}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {product.colors.map((c) => (
          <button key={c.name} onClick={() => setColor(c.name)} className="relative h-9 w-9 rounded-full" aria-label={c.name} aria-pressed={color === c.name}>
            <span className="absolute inset-1 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" style={{ backgroundColor: c.hex }} />
            {color === c.name && <motion.span layoutId={`color-ring-${product.slug}`} className="absolute inset-0 rounded-full border-2 border-wine" />}
          </button>
        ))}
      </div>
    </div>,
    <div key="sizes" className="mt-6">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Tamanho</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            aria-pressed={size === s}
            className={`relative min-w-12 rounded-full border px-4 py-2 text-sm transition ${size === s ? "border-wine text-paper" : "border-ink/15 hover:border-ink/40"}`}
          >
            {size === s && <motion.span layoutId={`size-pill-${product.slug}`} className="absolute inset-0 rounded-full bg-wine" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className="relative">{s}</span>
          </button>
        ))}
      </div>
    </div>,
    <div key="cta" className="flex items-center gap-3 pt-10">
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-wine px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-wine-deep"
      >
        <WhatsApp /> {CTA.button}
      </a>
      <HeartButton product={product} className="relative h-[52px] w-[52px] shrink-0 border border-ink/15" />
      <button onClick={share} className="relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-ink/15 transition hover:border-wine hover:text-wine" aria-label="Copiar link da peça">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute -top-10 right-0 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs text-paper"
              role="status"
            >
              Link copiado {BRAND.ornament}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>,
    <p key="note" className="mt-4 text-xs text-muted">
      {BRAND.product.note}
      <Link href="/lojas" className="text-wine underline underline-offset-4">{BRAND.product.noteLink}</Link>.
    </p>,
  ];

  return (
    <motion.div className="flex h-full flex-col" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}>
      {blocks.map((node, i) => (
        <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className={i === 5 ? "mt-auto" : undefined}>
          {node}
        </motion.div>
      ))}
    </motion.div>
  );
}
