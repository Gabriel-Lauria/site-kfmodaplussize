"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { BRAND, FEATURES, STORES, STORES_NAV } from "@/config";
import { Logo } from "./Logo";
import { useSite } from "./SiteData";
import { Instagram, WhatsApp } from "./Icons";

// nome gigante com parallax, só no layout "classic" (carregado à parte)
const FooterWordmark = dynamic(() => import("./FooterWordmark").then((m) => m.FooterWordmark));
const LINK = "inline-flex min-h-11 min-w-11 items-center transition hover:text-accent";

export function Footer() {
  const site = useSite();
  const c = site.content.contact;

  return (
    <footer className={`cv-auto relative mt-24 overflow-hidden pb-20 text-paper sm:pb-0 ${FEATURES.layout === "editorial" ? "bg-ink" : "bg-primary-deep"}`}>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-10 pt-16 sm:grid-cols-2 sm:px-8 sm:pt-20 lg:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo markClassName="h-10 w-10" textClassName="font-display text-2xl" imageClassName="h-10 w-auto" />
          </div>
          <p className="mt-5 max-w-xs leading-relaxed text-paper/70">{BRAND.footer.about}</p>
          <div className="mt-6 flex gap-2">
            <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-full border border-paper/20 transition hover:border-accent hover:bg-accent" aria-label="Instagram">
              <Instagram />
            </a>
            <a href={site.wa(BRAND.messages.default)} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-full border border-paper/20 transition hover:border-accent hover:bg-accent" aria-label="WhatsApp">
              <WhatsApp />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-soft">Navegue</h3>
          <ul className="mt-4 text-paper/80">
            <li><Link className={LINK} href="/">Início</Link></li>
            <li><Link className={LINK} href="/catalogo">Catálogo</Link></li>
            <li><Link className={LINK} href="/#medidas">Guia de medidas</Link></li>
            <li><Link className={LINK} href="/#avaliacoes">Avaliações</Link></li>
            <li><Link className={LINK} href="/lojas">{STORES_NAV}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-soft">{FEATURES.showStores ? "Lojas" : "Endereço"}</h3>
          {FEATURES.showStores ? (
            <ul className="mt-4 grid grid-cols-2 gap-x-4 text-paper/80">
              {STORES.map((s) => (
                <li key={s.slug}>
                  <Link className={LINK} href={`/lojas#${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 space-y-4 text-paper/80">
              {c.street && (
                <Link className="block leading-relaxed transition hover:text-accent" href="/lojas">
                  {c.street}
                  {c.district && <> · {c.district}</>}
                  {" "}<br />
                  {[c.city, c.state].filter(Boolean).join(" · ")}
                  {c.postalCode && <> · {c.postalCode}</>}
                </Link>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-soft">Horário</p>
                {c.hours.length ? (
                  <ul className="mt-2 space-y-1">
                    {c.hours.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2">Consulte pelo WhatsApp</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-soft">Contato</h3>
          <ul className="mt-4 text-paper/80">
            <li><a className={LINK} href={site.wa(BRAND.messages.default)} target="_blank" rel="noopener noreferrer">WhatsApp {site.whatsappLabel}</a></li>
            <li><a className={LINK} href={c.instagram} target="_blank" rel="noopener noreferrer">{site.instagramHandle}</a></li>
            {c.city && <li className="py-2.5">{[c.city, c.state].filter(Boolean).join(", ")}</li>}
          </ul>
        </div>
      </div>

      {FEATURES.layout === "classic" && <FooterWordmark />}

      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-2 border-t border-paper/10 px-4 py-6 text-base text-paper/50 sm:flex-row sm:px-8 sm:text-sm">
        <p>© {new Date().getFullYear()} {BRAND.name} · {BRAND.segment}</p>
        {BRAND.credit && (
          <p>
            {BRAND.credit.label}{" "}
            {BRAND.credit.url ? (
              <a href={BRAND.credit.url} target="_blank" rel="noopener noreferrer" className="text-accent-soft hover:text-accent">
                {BRAND.credit.name}
              </a>
            ) : (
              <span className="text-accent-soft">{BRAND.credit.name}</span>
            )}
          </p>
        )}
      </div>
    </footer>
  );
}
