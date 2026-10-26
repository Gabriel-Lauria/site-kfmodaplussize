"use client";

import dynamic from "next/dynamic";
import { FEATURES } from "@/config";

// Moldura das fotos grandes (FEATURES.frame). "arch": arco no topo; "straight": cantos levemente
// arredondados; "mirror": ondulada como o espelho do provador (components/MirrorWave.tsx, com animação).
// É componente de cliente de propósito: assim o import abaixo só baixa a animação quando a moldura
// "mirror" é usada (num Server Component o Next incluiria o chunk em toda página).
const MirrorWave = dynamic(() => import("./MirrorWave").then((m) => m.MirrorWave));

type Props = { children: React.ReactNode; className?: string; flip?: boolean; active?: boolean };

export function MirrorFrame({ children, className, flip, active }: Props) {
  if (FEATURES.frame === "mirror") {
    return (
      <MirrorWave className={className} flip={flip} active={active}>
        {children}
      </MirrorWave>
    );
  }
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: FEATURES.frame === "arch" ? "9999px 9999px 6px 6px" : "6px" }}>
        {children}
      </div>
    </div>
  );
}
