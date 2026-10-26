"use client";

import { Fragment, useEffect, useRef } from "react";

// As entradas ao rolar são CSS puro (.reveal / .words em globals.css): um IntersectionObserver
// só acrescenta a classe "is-in". Nada de re-render nem de um componente animado por bloco,
// o que mantém o celular leve. Sem JS ou com "reduzir movimento", tudo aparece direto.

let observer: IntersectionObserver | null = null;

function watch(el: Element) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        observer?.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -60px 0px" },
  );
  observer.observe(el);
  return () => observer?.unobserve(el);
}

function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => (ref.current ? watch(ref.current) : undefined), []);
  return ref;
}

export function Reveal({ children, delay = 0, className = "", y = 28 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as React.CSSProperties}>
      {children}
    </div>
  );
}

// Cada palavra sobe de dentro de uma máscara. onView=false anima já no carregamento (hero).
export function SplitWords({
  text,
  className = "",
  delay = 0,
  wordClassName,
  onView = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  wordClassName?: (word: string, i: number) => string | undefined;
  onView?: boolean;
}) {
  const ref = useReveal<HTMLSpanElement>();
  const words = text.split(" ");
  return (
    <span ref={onView ? ref : undefined} className={`${onView ? "words" : "words-now"} ${className}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-top">
            <span className={`word inline-block ${wordClassName?.(w, i) ?? ""}`} style={{ "--word-delay": `${delay + i * 0.07}s` } as React.CSSProperties}>
              {w}
            </span>
          </span>
          {/* o espaço fica fora da caixa inline-block: dentro dela o navegador o descarta e as palavras grudam */}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
