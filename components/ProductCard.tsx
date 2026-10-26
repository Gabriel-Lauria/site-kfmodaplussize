"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CTA, FEATURES } from "@/config";
import { productBadge } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { useSelection } from "./Selection";
import { useSite } from "./SiteData";
import { Price } from "./Price";
import { Heart, WhatsApp } from "./Icons";

export function HeartButton({ product, className }: { product: Product; className?: string }) {
  const { has, toggle } = useSelection();
  const ref = useRef<HTMLButtonElement>(null);
  const [burst, setBurst] = useState(0);
  const liked = has(product.slug);

  return (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!liked) setBurst((b) => b + 1);
        toggle(product.slug, ref.current);
      }}
      className={`grid h-11 w-11 place-items-center rounded-full bg-paper/90 backdrop-blur transition hover:bg-paper ${liked ? "text-accent" : "text-ink"} ${className ?? ""}`}
      aria-pressed={liked}
      aria-label={liked ? `Tirar ${product.name} da seleção` : `Salvar ${product.name} na seleção`}
    >
      <span key={liked ? "on" : "off"} className={burst ? "pop" : undefined}>
        <Heart filled={liked} className="h-[18px] w-[18px]" />
      </span>
      {burst > 0 && (
        <span key={burst} className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const vars = { "--x": `${Math.cos(a) * 28 - 3}px`, "--y": `${Math.sin(a) * 28 - 5}px`, "--r": `${(a * 180) / Math.PI + 90}deg` };
            return <span key={i} className="burst-dot absolute left-1/2 top-1/2 h-2.5 w-1.5 rounded-full bg-accent" style={vars as React.CSSProperties} />;
          })}
        </span>
      )}
    </button>
  );
}

const EDITORIAL = FEATURES.layout === "editorial";

// Hover (zoom, segunda foto, botão do WhatsApp) em CSS puro: nada roda até a pessoa interagir.
export function ProductCard({ product, onOpen, priority }: { product: Product; onOpen?: (slug: string) => void; priority?: boolean }) {
  const { wa } = useSite();
  const badge = productBadge(product);
  // o nome acessível começa pelo texto visível (a etiqueta), como pede a WCAG 2.5.3
  const label = (action: string) => `${badge ? `${badge}: ` : ""}${action} ${product.name}`;

  const media = (
    <div className={`relative aspect-[3/4] overflow-hidden bg-cream ${EDITORIAL ? "rounded-sm" : "rounded-[22px]"}`}>
      <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]">
        {product.image && <Image src={product.image} alt={product.name} fill priority={priority} sizes="(min-width:1024px) 25vw, 50vw" className={`object-cover ${product.stock <= 0 ? "opacity-70 grayscale-[40%]" : ""}`} />}
        {product.hoverImage && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <Image src={product.hoverImage} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
          </div>
        )}
      </div>
      {badge && (
        <span className={`absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur sm:bottom-3 sm:left-3 ${EDITORIAL ? "bg-ink text-paper" : "rounded-full bg-paper/90 text-primary"}`}>
          {badge}
        </span>
      )}
    </div>
  );

  return (
    <article className="group">
      <div className="relative">
        {onOpen ? (
          <button onClick={() => onOpen(product.slug)} className="block w-full text-left" data-cursor="Ver" aria-label={label("Ver detalhes de")}>
            {media}
          </button>
        ) : (
          <Link href={`/catalogo/${product.slug}`} className="block" data-cursor="Ver" aria-label={label("Ver")}>
            {media}
          </Link>
        )}

        <HeartButton product={product} className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2" />

        <a
          href={wa(CTA.quick(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute inset-x-3 bottom-3 hidden translate-y-3 items-center justify-center gap-2 bg-ink/90 py-2.5 opacity-0 ${EDITORIAL ? "" : "rounded-full"} text-xs font-semibold uppercase tracking-[0.12em] text-paper backdrop-blur transition duration-300 ease-[var(--ease-expo)] hover:bg-primary focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:flex`}
        >
          <WhatsApp className="h-4 w-4" /> {CTA.card}
        </a>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2 sm:mt-4 sm:gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">{product.category}</p>
          <h3 className="mt-1 font-display text-lg leading-snug sm:text-xl">{product.name}</h3>
          <Price product={product} className="mt-1 text-base" />
        </div>
        <div className="flex shrink-0 -space-x-1 pt-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border-2 border-paper shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition group-hover:-translate-y-0.5" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>
    </article>
  );
}
