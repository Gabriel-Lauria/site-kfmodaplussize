"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CTA, waLink, type Product } from "@/config";
import { useSelection } from "./Selection";
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
      className={`grid h-10 w-10 place-items-center rounded-full bg-paper/90 backdrop-blur transition hover:bg-paper ${liked ? "text-accent" : "text-ink"} ${className ?? ""}`}
      aria-pressed={liked}
      aria-label={liked ? `Tirar ${product.name} da seleção` : `Salvar ${product.name} na seleção`}
    >
      <motion.span key={liked ? "on" : "off"} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
        <Heart filled={liked} className="h-[18px] w-[18px]" />
      </motion.span>
      <AnimatePresence>
        {burst > 0 && (
          <span key={burst} className="pointer-events-none absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-2.5 w-1.5 rounded-full bg-accent"
                  style={{ rotate: (a * 180) / Math.PI + 90 }}
                  initial={{ x: -3, y: -5, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(a) * 28 - 3, y: Math.sin(a) * 28 - 5, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              );
            })}
          </span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function ProductCard({ product, onOpen, priority }: { product: Product; onOpen?: (slug: string) => void; priority?: boolean }) {
  const [hover, setHover] = useState(false);

  const media = (
    <motion.div layoutId={`img-${product.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-cream">
      <motion.div className="absolute inset-0" animate={{ scale: hover ? 1.06 : 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        <Image src={product.image} alt={product.name} fill priority={priority} sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 80vw" className="object-cover" />
        {product.hoverImage && (
          <motion.div className="absolute inset-0" initial={false} animate={{ opacity: hover ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <Image src={product.hoverImage} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 80vw" className="object-cover" />
          </motion.div>
        )}
      </motion.div>
      {product.tag && (
        <span className="absolute left-3 top-3 max-w-[calc(100%-4.75rem)] truncate rounded-full bg-paper/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur">
          {product.tag}
        </span>
      )}
    </motion.div>
  );

  return (
    <article className="group" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <div className="relative">
        {onOpen ? (
          <button onClick={() => onOpen(product.slug)} className="block w-full text-left" data-cursor="Ver" aria-label={`Ver detalhes de ${product.name}`}>
            {media}
          </button>
        ) : (
          <Link href={`/catalogo/${product.slug}`} className="block" data-cursor="Ver" aria-label={`Ver ${product.name} no catálogo`}>
            {media}
          </Link>
        )}

        <HeartButton product={product} className="absolute right-3 top-3" />

        <motion.a
          href={waLink(CTA.quick(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 rounded-full bg-ink/90 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-paper backdrop-blur transition-colors hover:bg-primary md:flex"
          initial={false}
          animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <WhatsApp className="h-4 w-4" /> {CTA.card}
        </motion.a>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{product.category}</p>
          <h3 className="mt-1 font-display text-lg leading-snug">{product.name}</h3>
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
