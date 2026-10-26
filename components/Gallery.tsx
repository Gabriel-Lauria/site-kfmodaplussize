"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Fotos da peça: desliza com o dedo (scroll-snap nativo), setas no computador e bolinhas de posição.
export function Gallery({ images, alt, priority, sizes, className }: { images: string[]; alt: string; priority?: boolean; sizes: string; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  // className define a posição (ex.: "absolute inset-0"); sem ela, relative
  const box = className || "relative";
  if (!images.length) return <div className={`bg-cream ${box}`} />;

  return (
    <div className={`group ${box}`} role="region" aria-roledescription="galeria" aria-label={`Fotos de ${alt}`}>
      <div ref={track} data-lenis-prevent className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
        {images.map((src, i) => (
          <div key={src + i} className="relative h-full w-full shrink-0 snap-center" aria-label={`Foto ${i + 1} de ${images.length}`}>
            <Image src={src} alt={i === 0 ? alt : `${alt}, foto ${i + 1}`} fill priority={priority && i === 0} sizes={sizes} className="object-cover" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(Math.max(0, index - 1))}
            disabled={index === 0}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 opacity-0 shadow transition group-hover:opacity-100 disabled:hidden md:grid"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button
            type="button"
            onClick={() => go(Math.min(images.length - 1, index + 1))}
            disabled={index === images.length - 1}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 opacity-0 shadow transition group-hover:opacity-100 disabled:hidden md:grid"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => go(i)} aria-label={`Ver foto ${i + 1}`} aria-current={i === index} className="grid h-11 w-11 place-items-center">
                <span className={`h-2 rounded-full bg-paper shadow transition-all ${i === index ? "w-5" : "w-2 opacity-60"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
