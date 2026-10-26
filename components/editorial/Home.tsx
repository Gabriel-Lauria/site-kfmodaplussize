// Seções da home no layout editorial. Server Components: chegam prontas em HTML e não são
// hidratadas no navegador. Só as ilhas interativas (fotos do hero, coração, formulário,
// animações de entrada) são componentes de cliente.
import Image from "next/image";
import Link from "next/link";
import { BRAND, CTA, EDITORIAL, FEATURES } from "@/config";
import { instagramHandle, mapsUrl, phoneLabel, productBadge, whatsappLink } from "@/lib/catalog";
import type { Product, SiteData } from "@/lib/types";
import { HeartButton } from "../ProductCard";
import { Price } from "../Price";
import { ReviewForm } from "../ReviewForm";
import { Reveal, SplitWords } from "../motion-utils";
import { HeroMedia } from "./HeroMedia";
import { ArrowRight, Instagram, Pin, WhatsApp } from "../Icons";

type Props = { data: SiteData };
const wa = (data: SiteData, message: string) => whatsappLink(data.content.contact.whatsapp, message);
// espera a intro quando ela está ligada (no servidor não dá para saber se ela já rodou na sessão)
const START = FEATURES.showIntro ? 1.9 : 0.15;
const BTN = "inline-flex min-h-12 items-center justify-center gap-3 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition";

function Eyebrow({ children, className = "text-primary" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs uppercase tracking-[0.26em] ${className}`}>{children}</p>;
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <p className={`tracking-[0.2em] text-highlight ${className}`} aria-label={`${value} de 5 estrelas`}>
      {"★".repeat(value)}
      <span className="text-ink/15">{"★".repeat(5 - value)}</span>
    </p>
  );
}

function SectionTitle({ eyebrow, title, accent, center }: { eyebrow?: string; title: string; accent?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <h2 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
        <SplitWords text={title} />
        {accent && (
          <>
            {" "}
            <SplitWords text={accent} delay={0.12} className="italic text-primary" />
          </>
        )}
      </h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Hero: foto em arco, frase, WhatsApp e diferenciais.
export function EditorialHero({ data }: Props) {
  const d = START;
  const H = data.content.hero;

  return (
    <section className="mx-auto max-w-[1400px] px-3 pt-3 sm:px-8 sm:pt-6">
      <div className="relative grid overflow-hidden rounded-sm bg-cream lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 order-2 flex flex-col justify-center px-5 pb-10 pt-8 sm:px-12 sm:py-14 lg:order-1 lg:py-20 lg:pl-16 lg:pr-14">
          <div className="fade-up" style={{ animationDelay: `${d}s` }}>
            <Eyebrow>{H.eyebrow}</Eyebrow>
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,5vw,4.6rem)] font-light leading-[0.95] tracking-[-0.01em]">
            <SplitWords text={H.title[0]} onView={false} delay={d + 0.1} />
            {" "}<br />
            <SplitWords text={H.title[1]} onView={false} delay={d + 0.3} className="italic text-primary" />
          </h1>
          <p className="fade-up mt-5 max-w-md text-[17px] leading-relaxed text-ink/75" style={{ animationDelay: `${d + 0.4}s` }}>
            {H.text}
          </p>
          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5" style={{ animationDelay: `${d + 0.5}s` }}>
            <a href={wa(data, H.whatsappMessage)} target="_blank" rel="noopener noreferrer" className={`${BTN} bg-primary text-paper hover:bg-primary-deep`}>
              <WhatsApp className="h-5 w-5" /> {H.whatsappButton}
            </a>
            <Link href="/catalogo" className={`${BTN} group border border-ink/80 hover:bg-ink hover:text-paper`}>
              Ver catálogo <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>

          <ul
            className="mt-10 grid gap-5 border-t border-ink/10 pt-7 sm:grid-cols-3 lg:mt-14"
          >
            {EDITORIAL.values.map((v, i) => (
              <li key={v.title} className="fade-up flex items-start gap-3" style={{ animationDelay: `${d + 0.6 + i * 0.1}s` }}>
                <span className="mt-0.5 text-primary">
                  <Icon d={v.icon} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em]">{v.title}</span>
                  <span className="mt-1 block text-sm text-muted">{v.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <HeroMedia image={H.image} imageSecondary={H.imageSecondary} alt={H.imageAlt} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. Vitrine: só as peças marcadas como destaque e com estoque.
function ProductTile({ product, data }: { product: Product; data: SiteData }) {
  const badge = productBadge(product);
  return (
    <article className="group">
      <div className="relative">
        <Link href={`/catalogo/${product.slug}`} data-cursor="Ver" className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-cream" aria-label={`${badge ? `${badge}: ` : ""}Ver ${product.name}`}>
          <Image src={product.image} alt={product.name} fill sizes="(min-width:1024px) 16vw, (min-width:768px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
          {product.hoverImage && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <Image src={product.hoverImage} alt="" fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover" />
            </div>
          )}
          {badge && <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate bg-ink px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-paper">{badge}</span>}
        </Link>
        <HeartButton product={product} className="absolute right-1.5 top-1.5" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">{product.category}</p>
      <h3 className="mt-1 font-medium leading-snug">{product.name}</h3>
      <Price product={product} className="mt-1" />
      <a href={wa(data, CTA.quick(product.name))} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:text-ink">
        <WhatsApp className="h-4 w-4" /> {CTA.card}
      </a>
    </article>
  );
}

export function ProductGrid({ data }: Props) {
  const list = data.products.filter((p) => p.featured && p.stock > 0).slice(0, 12);
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8 sm:py-20">
      <div className="mb-10">
        <SectionTitle eyebrow={EDITORIAL.products.eyebrow} title={EDITORIAL.products.title} center />
        <Reveal delay={0.3} y={0}>
          <span className="mx-auto mt-5 block h-px w-16 bg-primary" />
        </Reveal>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-6">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i, 5) * 0.06}>
            <ProductTile product={p} data={data} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/catalogo" className={`${BTN} group border border-ink hover:bg-ink hover:text-paper`}>
          Ver todas as peças <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. Categorias em blocos escuros.
export function CategoryTiles({ data }: Props) {
  const { categories, products } = data;
  const list = categories.filter((c) => c.showOnHome && products.some((p) => p.categorySlug === c.slug));
  if (!list.length) return null;
  return (
    <section className="cv-auto mx-auto max-w-[1400px] px-4 pb-14 sm:px-8 sm:pb-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title={BRAND.categories.title[0]} accent={BRAND.categories.title[1]} />
        <Link href="/catalogo" className="group flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
          Ver tudo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${list.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {list.map((c, i) => {
          const image = c.image || products.find((p) => p.categorySlug === c.slug)?.image;
          return (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link href={`/catalogo?categoria=${c.slug}`} data-cursor="Explorar" className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-ink">
                {image && <Image src={image} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover opacity-85 transition duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105 group-hover:opacity-60" />}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 text-paper sm:inset-x-6 sm:bottom-6">
                  <p className="font-display text-2xl uppercase tracking-[0.06em] sm:text-3xl">{c.name}</p>
                  <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-paper/85">
                    Explorar
                    <span className="h-px w-6 bg-paper/70 transition-all duration-500 group-hover:w-12" />
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Banner escuro (editável no painel).
export function PromoBand({ data }: Props) {
  const P = data.content.promo;
  if (!P.title[0] && !P.text) return null;
  return (
    <section className="cv-auto mx-auto max-w-[1400px] px-4 pb-14 sm:px-8 sm:pb-20">
      <div className="relative grid items-center overflow-hidden rounded-sm bg-ink text-paper md:grid-cols-[1fr_1.1fr_240px] lg:grid-cols-[1fr_1fr_320px]">
        <div className="px-6 pt-10 sm:px-8 md:py-14 lg:px-14">
          <Eyebrow className="text-accent-soft">{P.eyebrow}</Eyebrow>
          <p className="mt-4 font-display text-6xl uppercase leading-[0.88] tracking-[0.02em] sm:text-7xl">
            <SplitWords text={P.title[0]} />
            {" "}<br />
            <SplitWords text={P.title[1]} delay={0.15} className="italic text-highlight" />
          </p>
        </div>
        <Reveal delay={0.2} className="px-6 pb-10 pt-6 sm:px-8 md:py-14 md:pl-0">
          <p className="max-w-sm leading-relaxed text-paper/75">{P.text}</p>
          {P.button && (
            <a href={wa(data, P.message)} target="_blank" rel="noopener noreferrer" className={`${BTN} mt-7 border border-paper/40 hover:border-paper hover:bg-paper hover:text-ink`}>
              <WhatsApp className="h-4 w-4" /> {P.button}
            </a>
          )}
        </Reveal>
        {P.image && (
          <div className="relative hidden h-full min-h-[300px] md:block">
            <Image src={P.image} alt="" fill sizes="320px" className="object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. Sobre a marca: história e valores.
export function About({ data }: Props) {
  const A = data.content.about;
  return (
    <section id="sobre" className="cv-auto mx-auto max-w-[1400px] scroll-mt-28 px-4 pb-14 sm:px-8 sm:pb-20">
      <div className="grid overflow-hidden rounded-sm bg-cream md:grid-cols-[0.9fr_1.1fr]">
        {A.image && (
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[520px]">
            <Image src={A.image} alt="" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover object-top" />
          </div>
        )}
        <div className="px-6 py-10 sm:p-12 lg:p-16">
          <Eyebrow>{A.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
            <SplitWords text={A.title} />
          </h2>
          <Reveal>
            <p className="mt-6 font-display text-2xl leading-snug sm:text-[1.7rem]">{A.text}</p>
          </Reveal>
          {A.values.length > 0 && (
            <ul className="mt-10 grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-3">
              {A.values.map((v, i) => (
                <li key={v.title + i}>
                  <Reveal delay={i * 0.08}>
                    <p className="font-display text-2xl italic text-primary">{v.title}</p>
                    <p className="mt-2 text-ink/75">{v.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5. Guia de medidas.
export function SizeGuide({ data }: Props) {
  const G = data.content.size_guide;
  if (!G.rows.length) return null;
  const first = G.rows[0].size;
  const last = G.rows[G.rows.length - 1].size;
  return (
    <section id="medidas" className="cv-auto mx-auto max-w-[1400px] scroll-mt-28 px-4 pb-14 sm:px-8 sm:pb-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 [&>*]:min-w-0">
        <div>
          <SectionTitle eyebrow="Guia de medidas" title={`Do ${first}`} accent={`ao ${last}`} />
          <Reveal>
            <p className="mt-5 max-w-md text-ink/75">{G.note}</p>
            <p className="mt-4 max-w-md text-muted">Meça com fita métrica, sem apertar: busto na parte mais cheia, cintura na parte mais fina e quadril na parte mais larga.</p>
            <a href={wa(data, "Olá! Vim pelo site e quero ajuda para descobrir o meu tamanho.")} target="_blank" rel="noopener noreferrer" className={`${BTN} mt-7 bg-ink text-paper hover:bg-primary`}>
              <WhatsApp className="h-4 w-4" /> Ajuda com o tamanho
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="overflow-x-auto rounded-sm border border-ink/10">
            <table className="w-full min-w-[320px] text-left">
              <caption className="sr-only">Medidas do corpo em centímetros por tamanho</caption>
              <thead className="bg-cream text-xs uppercase tracking-[0.04em] text-muted sm:tracking-[0.14em]">
                <tr>
                  <th scope="col" className="px-2.5 py-3 font-semibold sm:px-4">Tamanho</th>
                  <th scope="col" className="px-2.5 py-3 font-semibold sm:px-4">Busto</th>
                  <th scope="col" className="px-2.5 py-3 font-semibold sm:px-4">Cintura</th>
                  <th scope="col" className="px-2.5 py-3 font-semibold sm:px-4">Quadril</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {G.rows.map((r) => (
                  <tr key={r.size} className="transition-colors hover:bg-cream/60">
                    <th scope="row" className="px-3 py-3 font-display sm:px-4 text-2xl font-normal text-primary">{r.size}</th>
                    <td className="whitespace-nowrap px-2.5 py-3 sm:px-4">{r.bust} cm</td>
                    <td className="whitespace-nowrap px-2.5 py-3 sm:px-4">{r.waist} cm</td>
                    <td className="whitespace-nowrap px-2.5 py-3 sm:px-4">{r.hip} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6 e 7. Avaliações aprovadas + formulário (entra como pendente).
export function Reviews({ data }: Props) {
  const { reviews } = data;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return (
    <section id="avaliacoes" className="cv-auto mx-auto max-w-[1400px] scroll-mt-28 px-4 pb-14 sm:px-8 sm:pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Avaliações" title="O que dizem" accent="as clientes" />
        {reviews.length > 0 && (
          <p className="flex items-center gap-3 text-muted">
            <Stars value={Math.round(avg)} />
            <span>
              <span className="font-semibold text-ink">{avg.toFixed(1).replace(".", ",")}</span> de 5 · {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
            </span>
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 [&>*]:min-w-0">
        {reviews.length ? (
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0" data-lenis-prevent>
            {reviews.slice(0, 6).map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i, 3) * 0.06} className="w-[85%] shrink-0 snap-center sm:w-auto">
                <figure className={`flex h-full flex-col rounded-sm border p-6 ${r.featured ? "border-primary/30 bg-cream" : "border-ink/10 bg-paper"}`}>
                  <Stars value={r.rating} />
                  <blockquote className="mt-3 flex-1 font-display text-xl leading-snug">“{r.comment}”</blockquote>
                  <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">
                    {r.name}
                    {r.city && <> · {r.city}</>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-sm border border-dashed border-ink/15 p-10 text-center">
            <p className="font-display text-2xl italic">Seja a primeira a contar como foi.</p>
            <p className="mt-2 max-w-xs text-muted">Sua opinião ajuda outras mulheres a escolher com confiança.</p>
          </div>
        )}
        <Reveal delay={0.1}>
          <ReviewForm />
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8. Instagram, endereço, horário e contato.
export function ContactBlock({ data }: Props) {
  const c = data.content.contact;
  const photos = data.products.filter((p) => p.image).slice(0, 6);
  const city = [c.city, c.state].filter(Boolean).join(" · ");
  return (
    <section id="contato" className="cv-auto mx-auto max-w-[1400px] scroll-mt-28 px-4 sm:px-8">
      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-sm bg-cream p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
              {EDITORIAL.instagram.title[0]} <em className="text-primary">{EDITORIAL.instagram.title[1]}</em>
            </h2>
            <a href={c.instagram} target="_blank" rel="noopener noreferrer" className={`${BTN} border border-ink px-5 py-3 hover:bg-ink hover:text-paper`}>
              <Instagram className="h-4 w-4" /> {instagramHandle(c.instagram)}
            </a>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05} y={16}>
                <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-sm" aria-label={`Ver ${p.name} no Instagram`}>
                  <Image src={p.image} alt="" fill sizes="(min-width:1024px) 15vw, 33vw" className="object-cover object-top transition duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 grid place-items-center bg-primary-deep/0 text-paper opacity-0 transition duration-500 group-hover:bg-primary-deep/50 group-hover:opacity-100">
                    <Instagram />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 rounded-sm border border-ink/10 p-6 sm:p-10">
          <div>
            <Eyebrow>Fale com a gente</Eyebrow>
            <p className="mt-4 font-display text-3xl leading-tight">Atendimento de verdade, do provador ao WhatsApp.</p>
            <a href={wa(data, BRAND.messages.default)} target="_blank" rel="noopener noreferrer" className={`${BTN} mt-6 w-full bg-primary text-paper hover:bg-primary-deep sm:w-auto`}>
              <WhatsApp className="h-5 w-5" /> {phoneLabel(c.whatsapp)}
            </a>
          </div>
          {!FEATURES.showStores && (
            <dl className="grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-2">
              {c.street && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">Endereço</dt>
                  <dd className="mt-2">
                    {c.street}
                    {c.district && <> · {c.district}</>}
                    {" "}<br />
                    {city}
                    {c.postalCode && <> · {c.postalCode}</>}
                    {" "}<br />
                    <a href={mapsUrl(`${BRAND.name} ${c.street} ${c.city}`)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:text-ink">
                      <Pin className="h-4 w-4" /> Como chegar
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted">Horário</dt>
                <dd className="mt-2">
                  {c.hours.length ? (
                    <ul>
                      {c.hours.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : (
                    "Consulte pelo WhatsApp"
                  )}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
