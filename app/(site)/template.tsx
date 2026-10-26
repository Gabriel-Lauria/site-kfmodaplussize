"use client";

import { BrandMark } from "@/components/BrandMark";

// No primeiro carregamento o conteúdo aparece direto (a foto do hero é o LCP);
// a cortina com a marca (CSS .curtain em globals.css) só entra nas trocas de página seguintes.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  if (firstLoad) {
    if (typeof window !== "undefined") firstLoad = false;
    return <>{children}</>;
  }
  return (
    <>
      <div aria-hidden className="curtain pointer-events-none fixed inset-0 z-[105] flex items-center justify-center bg-primary-deep">
        <div className="curtain-mark">
          <BrandMark className="h-16 w-16" />
        </div>
      </div>
      <div className="page-in">{children}</div>
    </>
  );
}
