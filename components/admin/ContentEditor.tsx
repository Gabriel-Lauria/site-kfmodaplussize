"use client";

import { useActionState, useState } from "react";
import { saveContent, type ActionState } from "@/app/admin/actions";
import { phoneLabel } from "@/lib/catalog";
import type { ContentKey, SiteContent } from "@/lib/types";
import { ImageField, SubmitButton } from "./client";
import { Notice, btn, hint, input, label } from "./ui";

const SECTIONS: { key: ContentKey; title: string; description: string }[] = [
  { key: "hero", title: "Topo da página inicial", description: "Foto grande, frase e botão do WhatsApp." },
  { key: "about", title: "Sobre a marca", description: "História e valores." },
  { key: "promo", title: "Banner", description: "Faixa escura no meio da página inicial." },
  { key: "contact", title: "Contato, endereço e horário", description: "WhatsApp, Instagram e onde fica a loja." },
  { key: "size_guide", title: "Guia de medidas", description: "Tabela de busto, cintura e quadril." },
];

export function ContentEditor({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState<ContentKey | null>(null);
  return (
    <div className="space-y-3">
      {SECTIONS.map((s) => (
        <section key={s.key} className="rounded-2xl border border-ink/10 bg-white">
          <button type="button" onClick={() => setOpen(open === s.key ? null : s.key)} aria-expanded={open === s.key} className="flex min-h-16 w-full items-center justify-between gap-4 px-4 py-3 text-left sm:px-6">
            <span>
              <span className="block text-lg font-semibold">{s.title}</span>
              <span className="block text-base text-muted">{s.description}</span>
            </span>
            <span className={`text-2xl text-primary transition ${open === s.key ? "rotate-45" : ""}`} aria-hidden>+</span>
          </button>
          {open === s.key && (
            <div className="border-t border-ink/10 p-4 sm:p-6">
              <SectionForm section={s.key} initial={content[s.key]} />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function SectionForm<K extends ContentKey>({ section, initial }: { section: K; initial: SiteContent[K] }) {
  const [state, action] = useActionState<ActionState, FormData>(saveContent, { ok: false, message: "" });
  const [value, setValue] = useState<SiteContent[K]>(initial);
  const set = (patch: Partial<SiteContent[K]>) => setValue((v) => ({ ...v, ...patch }));
  const v = value as never as Record<string, unknown>;
  const text = (field: string, name: string, opts: { area?: boolean; hint?: string; max?: number; mode?: "tel" | "url" | "numeric" } = {}) => {
    const Tag = opts.area ? "textarea" : "input";
    return (
      <label className={label}>
        {name}
        {opts.hint && <span className={hint}>{opts.hint}</span>}
        <Tag
          value={String(v[field] ?? "")}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ [field]: e.target.value } as Partial<SiteContent[K]>)}
          maxLength={opts.max}
          rows={opts.area ? 4 : undefined}
          inputMode={opts.mode}
          type={opts.mode === "url" ? "url" : opts.mode === "tel" ? "tel" : undefined}
          className={`${input} ${opts.area ? "resize-y" : ""}`}
        />
      </label>
    );
  };

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="key" value={section} />
      <input type="hidden" name="payload" value={JSON.stringify(value)} />

      {section === "hero" && <HeroFields value={value as SiteContent["hero"]} set={set as (p: Partial<SiteContent["hero"]>) => void} text={text} />}
      {section === "about" && <AboutFields value={value as SiteContent["about"]} set={set as (p: Partial<SiteContent["about"]>) => void} text={text} />}
      {section === "promo" && <PromoFields value={value as SiteContent["promo"]} set={set as (p: Partial<SiteContent["promo"]>) => void} text={text} />}
      {section === "contact" && <ContactFields value={value as SiteContent["contact"]} set={set as (p: Partial<SiteContent["contact"]>) => void} text={text} />}
      {section === "size_guide" && <SizeFields value={value as SiteContent["size_guide"]} set={set as (p: Partial<SiteContent["size_guide"]>) => void} text={text} />}

      {state.message && <Notice tone={state.ok ? "ok" : "error"}>{state.message}</Notice>}
      <SubmitButton className={`${btn.primary} w-full sm:w-auto`}>Publicar alterações</SubmitButton>
    </form>
  );
}

type TextFn = (field: string, name: string, opts?: { area?: boolean; hint?: string; max?: number; mode?: "tel" | "url" | "numeric" }) => React.ReactNode;

function Pair({ value, onChange, labels }: { value: [string, string]; onChange: (v: [string, string]) => void; labels: [string, string] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <label key={i} className={label}>
          {labels[i]}
          <input value={value[i]} onChange={(e) => onChange((i === 0 ? [e.target.value, value[1]] : [value[0], e.target.value]) as [string, string])} className={input} maxLength={60} />
        </label>
      ))}
    </div>
  );
}

function HeroFields({ value, set, text }: { value: SiteContent["hero"]; set: (p: Partial<SiteContent["hero"]>) => void; text: TextFn }) {
  return (
    <>
      <ImageField label="Foto grande" value={value.image} onChange={(path) => set({ image: path })} folder="site" />
      <ImageField label="Foto menor (computador)" hint="Aparece sobreposta à grande em telas maiores." value={value.imageSecondary} onChange={(path) => set({ imageSecondary: path })} folder="site" />
      {text("imageAlt", "Descrição da foto", { hint: "Para quem usa leitor de tela e para o Google.", max: 160 })}
      {text("eyebrow", "Texto pequeno acima do título", { max: 80 })}
      <Pair value={value.title} onChange={(title) => set({ title })} labels={["Título (1ª linha)", "Título (2ª linha, em itálico)"]} />
      {text("text", "Texto", { area: true, max: 400 })}
      <div className="grid gap-4 sm:grid-cols-2">
        {text("whatsappButton", "Texto do botão", { max: 40 })}
        {text("whatsappMessage", "Mensagem que já vai escrita", { max: 300 })}
      </div>
    </>
  );
}

function AboutFields({ value, set, text }: { value: SiteContent["about"]; set: (p: Partial<SiteContent["about"]>) => void; text: TextFn }) {
  return (
    <>
      <ImageField label="Foto" value={value.image} onChange={(path) => set({ image: path })} folder="site" aspect="aspect-[4/3]" />
      <div className="grid gap-4 sm:grid-cols-2">
        {text("eyebrow", "Texto pequeno", { max: 60 })}
        {text("title", "Título", { max: 80 })}
      </div>
      {text("text", "História", { area: true, max: 1200 })}
      <fieldset className="space-y-3">
        <legend className="text-base font-medium">Valores</legend>
        {value.values.map((item, i) => (
          <div key={i} className="rounded-xl border border-ink/10 p-3">
            <div className="flex gap-2">
              <input value={item.title} onChange={(e) => set({ values: value.values.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} placeholder="Título" maxLength={40} aria-label={`Título do valor ${i + 1}`} className={`${input} mt-0`} />
              <button type="button" onClick={() => set({ values: value.values.filter((_, j) => j !== i) })} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-700" aria-label={`Remover valor ${i + 1}`}>
                ✕
              </button>
            </div>
            <input value={item.text} onChange={(e) => set({ values: value.values.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} placeholder="Texto curto" maxLength={200} aria-label={`Texto do valor ${i + 1}`} className={input} />
          </div>
        ))}
        {value.values.length < 6 && (
          <button type="button" onClick={() => set({ values: [...value.values, { title: "", text: "" }] })} className={btn.ghost}>
            + Adicionar valor
          </button>
        )}
      </fieldset>
    </>
  );
}

function PromoFields({ value, set, text }: { value: SiteContent["promo"]; set: (p: Partial<SiteContent["promo"]>) => void; text: TextFn }) {
  return (
    <>
      <p className="text-base text-muted">Deixe o título e o texto em branco para esconder o banner.</p>
      <ImageField label="Foto (computador)" value={value.image} onChange={(path) => set({ image: path })} folder="site" />
      {text("eyebrow", "Texto pequeno", { max: 60 })}
      <Pair value={value.title} onChange={(title) => set({ title })} labels={["Título (1ª linha)", "Título (2ª linha, em destaque)"]} />
      {text("text", "Texto", { area: true, max: 300 })}
      <div className="grid gap-4 sm:grid-cols-2">
        {text("button", "Texto do botão", { max: 40, hint: "Em branco = sem botão" })}
        {text("message", "Mensagem do WhatsApp", { max: 300 })}
      </div>
    </>
  );
}

function ContactFields({ value, set, text }: { value: SiteContent["contact"]; set: (p: Partial<SiteContent["contact"]>) => void; text: TextFn }) {
  const digits = value.whatsapp.replace(/\D/g, "");
  return (
    <>
      {text("whatsapp", "WhatsApp", { mode: "tel", hint: `Com 55 e DDD, só números. Aparece no site como ${phoneLabel(digits) || "—"}.` })}
      {text("instagram", "Link do Instagram", { mode: "url", hint: "Ex.: https://www.instagram.com/sualoja/" })}
      {text("street", "Rua e número", { max: 120 })}
      <div className="grid gap-4 sm:grid-cols-2">
        {text("district", "Bairro", { max: 80 })}
        {text("postalCode", "CEP", { mode: "numeric", max: 9 })}
      </div>
      <div className="grid grid-cols-[1fr_6rem] gap-4">
        {text("city", "Cidade", { max: 80 })}
        {text("state", "UF", { max: 2 })}
      </div>
      <fieldset className="space-y-2">
        <legend className="text-base font-medium">Horário de funcionamento</legend>
        <p className="text-base text-muted">Uma linha por período, ex.: “Seg a sex · 9h às 18h”. Em branco, o site pede para consultar no WhatsApp.</p>
        {value.hours.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input value={h} onChange={(e) => set({ hours: value.hours.map((x, j) => (j === i ? e.target.value : x)) })} maxLength={80} aria-label={`Horário ${i + 1}`} className={`${input} mt-0`} />
            <button type="button" onClick={() => set({ hours: value.hours.filter((_, j) => j !== i) })} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-700" aria-label={`Remover horário ${i + 1}`}>
              ✕
            </button>
          </div>
        ))}
        {value.hours.length < 10 && (
          <button type="button" onClick={() => set({ hours: [...value.hours, ""] })} className={btn.ghost}>
            + Adicionar horário
          </button>
        )}
      </fieldset>
    </>
  );
}

function SizeFields({ value, set, text }: { value: SiteContent["size_guide"]; set: (p: Partial<SiteContent["size_guide"]>) => void; text: TextFn }) {
  const cell = (i: number, field: "size" | "bust" | "waist" | "hip", name: string) => (
    <input
      value={value.rows[i][field]}
      onChange={(e) => set({ rows: value.rows.map((r, j) => (j === i ? { ...r, [field]: e.target.value } : r)) })}
      inputMode={field === "size" ? "text" : "decimal"}
      maxLength={10}
      aria-label={`${name}, linha ${i + 1}`}
      className={`${input} mt-0 px-2 text-center`}
    />
  );
  return (
    <>
      {text("note", "Observação", { area: true, max: 400 })}
      <div>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_3rem] gap-1.5 px-0.5 text-center text-base text-muted">
          <span>Tam.</span>
          <span>Busto</span>
          <span>Cintura</span>
          <span>Quadril</span>
          <span />
        </div>
        <div className="mt-1 space-y-1.5">
          {value.rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_3rem] gap-1.5">
              {cell(i, "size", "Tamanho")}
              {cell(i, "bust", "Busto")}
              {cell(i, "waist", "Cintura")}
              {cell(i, "hip", "Quadril")}
              <button type="button" onClick={() => set({ rows: value.rows.filter((_, j) => j !== i) })} className="grid h-12 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-700" aria-label={`Remover linha ${r.size || i + 1}`}>
                ✕
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-base text-muted">Medidas em centímetros.</p>
        {value.rows.length < 20 && (
          <button type="button" onClick={() => set({ rows: [...value.rows, { size: "", bust: "", waist: "", hip: "" }] })} className={`${btn.ghost} mt-2`}>
            + Adicionar tamanho
          </button>
        )}
      </div>
    </>
  );
}
