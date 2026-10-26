"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { FEATURES } from "@/config";

// Moldura das fotos grandes (FEATURES.frame). "mirror": ondulada como o espelho do provador,
// a onda se inverte no hover; "arch": arco no topo; "straight": cantos levemente arredondados.
const WAVE_A = "M0.05 0 H0.95 C0.87 0.33 1.03 0.66 0.95 1 H0.05 C-0.03 0.66 0.13 0.33 0.05 0 Z";
const WAVE_B = "M0.05 0 H0.95 C1.03 0.33 0.87 0.66 0.95 1 H0.05 C0.13 0.66 -0.03 0.33 0.05 0 Z";

export function MirrorFrame({
  children,
  className,
  flip = false,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  flip?: boolean;
  active?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState(false);
  const on = active ?? hover;
  const [from, to] = flip ? [WAVE_B, WAVE_A] : [WAVE_A, WAVE_B];

  if (FEATURES.frame !== "mirror") {
    return (
      <div className={`relative ${className ?? ""}`}>
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ borderRadius: FEATURES.frame === "arch" ? "9999px 9999px 6px 6px" : "6px" }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className ?? ""}`}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={`mirror-${id}`} clipPathUnits="objectBoundingBox">
            <motion.path
              initial={false}
              animate={{ d: on ? to : from }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </clipPath>
        </defs>
      </svg>
      <div className="relative h-full w-full overflow-hidden" style={{ clipPath: `url(#mirror-${id})` }}>
        {children}
      </div>
    </div>
  );
}
