import type { Metadata } from "next";
import Image from "next/image";
import { StoresShowcase } from "@/components/StoresShowcase";
import { StoreVisit } from "@/components/StoreVisit";
import { MirrorFrame } from "@/components/MirrorFrame";
import { Reveal, SplitWords } from "@/components/motion-utils";
import { BRAND, FEATURES, STORES, STORES_NAV, STORE_STATS, plural, waLink } from "@/config";

const PAGE = BRAND.storesPage;

export const metadata: Metadata = {
  title: STORES_NAV,
  description: PAGE.metaDescription,
};

export default function LojasPage() {
  const stats = [
    { value: STORES.length, label: plural(STORES.length, "loja", "lojas") },
    ...STORE_STATS.map((s) => ({ value: STORES.filter((st) => st.region === s.region).length, label: s.label })),
  ];
  return (
    <>
      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-rose">{PAGE.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(3.2rem,8vw,7rem)] font-light leading-[0.92] tracking-tight">
            <SplitWords text={PAGE.title[0]} onView={false} delay={0.4} />
            <br />
            <SplitWords text={PAGE.title[1]} onView={false} delay={0.6} className="italic text-wine" />
            <br />
            <SplitWords text={PAGE.title[2]} onView={false} delay={0.75} />
          </h1>
          {FEATURES.showStores && (
            <Reveal delay={0.9}>
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-4xl text-wine">{s.value}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
        <Reveal delay={0.5}>
          <MirrorFrame className="mx-auto h-[520px] w-full max-w-[420px]">
            <Image src={PAGE.image} alt={PAGE.imageAlt} fill priority sizes="420px" className="object-cover" />
          </MirrorFrame>
        </Reveal>
      </section>

      {FEATURES.showStores ? <StoresShowcase variant="page" /> : <StoreVisit variant="page" />}

      <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-5xl leading-[0.95] tracking-tight">
            <SplitWords text={PAGE.faqTitle[0]} />
            <br />
            <SplitWords text={PAGE.faqTitle[1]} delay={0.15} className="italic text-wine" />
          </h2>
          <Reveal>
            <a href={waLink(PAGE.message)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full bg-wine px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-wine-deep">
              Tirar dúvida no WhatsApp
            </a>
          </Reveal>
        </div>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {PAGE.faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.08}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 text-lg transition duration-500 group-open:rotate-45 group-open:bg-wine group-open:text-paper">+</span>
                </summary>
                <p className="mt-4 max-w-xl text-ink/70">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
