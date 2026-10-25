"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { type Product } from "@/config";
import { lockScroll } from "@/lib/lenis";
import { ProductDetails } from "./ProductDetails";
import { ArrowRight } from "./Icons";

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
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal aria-label={product.name}>
      <motion.div className="absolute inset-0 bg-ink/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        data-lenis-prevent
        className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-y-auto rounded-t-[28px] bg-paper sm:rounded-[28px] md:grid-cols-2 md:overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <motion.div layoutId={`img-${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-cream md:aspect-auto md:min-h-[600px]">
          <Image src={product.image} alt={product.name} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          <Link
            href={`/catalogo/${product.slug}`}
            className="group absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-paper/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur transition hover:bg-paper"
          >
            Página da peça <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <div className="p-6 sm:p-10">
          <ProductDetails product={product} onClose={onClose} />
        </div>
      </motion.div>
    </div>
  );
}
