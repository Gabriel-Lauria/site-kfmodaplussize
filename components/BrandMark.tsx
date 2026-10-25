"use client";

import { createElement, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
import { MARK } from "@/config/brand-mark.generated";

export type MarkNode =
  | string
  | { tag: string; props: Record<string, unknown>; children?: MarkNode[]; monoHide?: boolean; delay?: number };
export type MarkData = { viewBox: string; props: Record<string, unknown>; children: MarkNode[] };

type Props = {
  className?: string;
  // os elementos de primeiro nível do SVG surgem em sequência, com mola
  bloom?: boolean;
  delay?: number;
  // pinta a marca inteira de uma cor só (aceita var(--color-...))
  mono?: string;
  title?: string;
};

function render(node: MarkNode, key: number, mono?: string): ReactNode {
  if (typeof node === "string") return node;
  if (mono && node.monoHide) return null;
  const props: Record<string, unknown> = { ...node.props, key };
  if (mono) {
    // formas preenchidas herdam a cor única do <svg> (sem contorno);
    // formas só de contorno (fill="none") mantêm o traço, na cor única
    const outline = props.fill === "none" && props.stroke !== undefined && props.stroke !== "none";
    const style = { ...(props.style as CSSProperties | undefined) };
    delete style.fill;
    delete style.stroke;
    if (props.fill !== "none") delete props.fill;
    delete props.stroke;
    props.style = outline ? { ...style, stroke: mono } : style;
  }
  return createElement(node.tag, props, node.children?.map((c, i) => render(c, i, mono)));
}

// A marca do cliente (public/brand/mark.svg), desenhada inline para poder animar e mudar de cor.
export function BrandMark({ className, bloom = false, delay = 0, mono, title }: Props) {
  const nodes = MARK.children.filter((n) => typeof n !== "string");
  return (
    <svg
      viewBox={MARK.viewBox}
      {...MARK.props}
      className={className}
      style={mono ? { fill: mono, stroke: "none" } : undefined}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {nodes.map((node, i) => {
        const el = render(node, i, mono);
        if (!bloom || !el) return el;
        const own = typeof node === "string" ? undefined : node.delay;
        return (
          <motion.g
            key={i}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + (own ?? i * 0.08), type: "spring", stiffness: 260, damping: 16 }}
          >
            {el}
          </motion.g>
        );
      })}
    </svg>
  );
}
