import type { Metadata } from "next";
import Image from "next/image";
import { StoresShowcase } from "@/components/StoresShowcase";
import { MirrorFrame } from "@/components/MirrorFrame";
import { Reveal, SplitWords } from "@/components/motion-utils";
import { CONTACT, STORES, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nossas lojas",
  description: "As 10 lojas Espaço Flor em Curitiba e São José dos Pinhais: Rua XV, João Negrão, Shopping Estação, Palladium, Jockey Plaza, Jardim das Américas e São José.",
};

const FAQ = [
  { q: "Qual o horário das lojas?", a: "Cada loja tem o seu horário, principalmente as de shopping. Chame no WhatsApp que a gente informa o horário da loja que você quer visitar." },
  { q: "A peça que vi no site está na loja perto de mim?", a: "O estoque muda rápido. Envie sua seleção pelo WhatsApp e confirmamos em qual loja a peça está no tamanho e na cor que você quer." },
  { q: "Posso reservar uma peça para provar?", a: `Fale com a nossa equipe pelo WhatsApp ${CONTACT.whatsappLabel} e combinamos a melhor forma de te atender.` },
];

export default function LojasPage() {
  const ruaXv = STORES.filter((s) => s.region === "Rua XV").length;
  return (
    <>
      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-rose">Curitiba · São José dos Pinhais</p>
          <h1 className="mt-4 font-display text-[clamp(3.2rem,8vw,7rem)] font-light leading-[0.92] tracking-tight">
            <SplitWords text="Sempre tem uma" onView={false} delay={0.4} />
            <br />
            <SplitWords text="Espaço Flor" onView={false} delay={0.6} className="italic text-wine" />
            <br />
            <SplitWords text="perto de você." onView={false} delay={0.75} />
          </h1>
          <Reveal delay={0.9}>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-8">
              <div>
                <p className="font-display text-4xl text-wine">{STORES.length}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">lojas</p>
              </div>
              <div>
                <p className="font-display text-4xl text-wine">{ruaXv}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">na Rua XV</p>
              </div>
              <div>
                <p className="font-display text-4xl text-wine">3</p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">shoppings</p>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.5}>
          <MirrorFrame className="mx-auto h-[520px] w-full max-w-[420px]">
            <Image src="/images/vitrine-loja.png" alt="Vitrine de uma loja Espaço Flor" fill priority sizes="420px" className="object-cover" />
          </MirrorFrame>
        </Reveal>
      </section>

      <StoresShowcase variant="page" />

      <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-5xl leading-[0.95] tracking-tight">
            <SplitWords text="Antes de" />
            <br />
            <SplitWords text="sair de casa" delay={0.15} className="italic text-wine" />
          </h2>
          <Reveal>
            <a href={waLink("Olá! Vim pelo site e quero saber sobre as lojas Espaço Flor.")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full bg-wine px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-wine-deep">
              Tirar dúvida no WhatsApp
            </a>
          </Reveal>
        </div>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {FAQ.map((f, i) => (
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
