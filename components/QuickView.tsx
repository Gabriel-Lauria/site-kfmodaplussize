"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import type { Product } from "@/lib/types";
import { lockScroll } from "@/lib/lenis";
import { Gallery } from "./Gallery";
import { ProductDetails } from "./ProductDetails";
import { ArrowRight } from "./Icons";

// Janela rápida da peça. Celular: uma coluna que rola, foto mais baixa e o botão do WhatsApp fixo no rodapé.
// Computador: altura limitada à tela, foto à esquerda e os detalhes rolando à direita.
export function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal aria-label={product.name}>
      <motion.div className="absolute inset-0 bg-ink/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        data-lenis-prevent
        className="relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[28px] bg-paper sm:rounded-[28px] md:grid md:h-[min(92dvh,760px)] md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="relative h-[min(46dvh,460px)] overflow-hidden bg-cream md:h-full">
          <Gallery images={product.images} alt={product.name} sizes="(min-width:768px) 50vw, 100vw" className="absolute inset-0" />
          <Link
            href={`/catalogo/${product.slug}`}
            className="group absolute left-4 top-4 flex min-h-11 items-center gap-2 rounded-full bg-paper/90 px-4 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur transition hover:bg-paper"
          >
            Página da peça <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div data-lenis-prevent className="px-5 pt-6 sm:px-10 sm:pt-10 md:overflow-y-auto md:overscroll-contain">
          <ProductDetails product={product} onClose={onClose} sticky />
        </div>
      </motion.div>
    </div>
    </MotionConfig>
  );
}
