"use client";

import { motion } from "motion/react";

const PETALS = ["#F7B8D2", "#EE8DB8", "#E2589B", "#F29AC2", "#F9C9DC", "#E86FA8"];

type Props = {
  className?: string;
  bloom?: boolean;
  delay?: number;
  mono?: string;
  title?: string;
};

// A flor de 6 pétalas do logo, redesenhada em SVG.
export function FlowerMark({ className, bloom = false, delay = 0, mono, title }: Props) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {PETALS.map((fill, i) => (
        <g key={i} transform={`rotate(${i * 60})`}>
          <motion.ellipse
            cx={0}
            cy={-50}
            rx={30}
            ry={44}
            fill={mono ?? fill}
            stroke={mono ? "none" : "#3b1424"}
            strokeWidth={5}
            initial={bloom ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + i * 0.08, type: "spring", stiffness: 260, damping: 16 }}
          />
        </g>
      ))}
      <motion.circle
        r={28}
        fill={mono ? "transparent" : "#FCE4EE"}
        stroke={mono ?? "#3b1424"}
        strokeWidth={mono ? 0 : 5}
        initial={bloom ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.5, type: "spring", stiffness: 300, damping: 14 }}
      />
    </svg>
  );
}
