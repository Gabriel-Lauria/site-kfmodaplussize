"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/config";
import { useSite } from "./SiteData";
import { WhatsApp } from "./Icons";

// Sempre visível, no canto do polegar. A dica "Posso ajudar?" surge uma vez e some sozinha.
export function FloatingWhatsApp() {
  const { wa } = useSite();
  // na página da peça o botão do WhatsApp já fica preso no rodapé (celular)
  const onProduct = /^\/catalogo\/.+/.test(usePathname());
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setHint(true), 4000);
    const hide = setTimeout(() => setHint(false), 9000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div
      className={`fade-up fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[70] items-center gap-3 sm:bottom-8 sm:right-8 ${onProduct ? "hidden lg:flex" : "flex"}`}
      style={{ animationDelay: "1.2s" }}
    >
      <span
        className={`hidden rounded-full bg-paper px-4 py-2 text-sm shadow-lg transition duration-300 sm:block ${hint ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-3 opacity-0"}`}
        role="status"
      >
        {hint && BRAND.floatingHint}
      </span>
      <a
        href={wa(BRAND.messages.help)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition duration-300 hover:-rotate-6 hover:scale-110 active:scale-90"
        onPointerEnter={() => setHint(true)}
        onPointerLeave={() => setHint(false)}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.4s]" />
        <WhatsApp className="relative h-7 w-7" />
      </a>
    </div>
  );
}
