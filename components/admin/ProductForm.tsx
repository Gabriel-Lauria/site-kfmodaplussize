"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveProduct, type ActionState } from "@/app/admin/actions";
import { FEATURES, SIZE_PRESETS } from "@/config";
import type { AdminProduct } from "@/lib/admin-data";
import { slugTyping, slugify, sortSizes } from "@/lib/catalog";
import { productSchema } from "@/lib/validation";
import { SubmitButton, Toggle, useUploader, type Uploaded } from "./client";
import { Card, CardTitle, Notice, btn, hint, input, label } from "./ui";

type Category = { id: string; name: string };
type Color = { name: string; hex: string };

const SWATCHES = ["#161314", "#f4f1ec", "#6e1e2b", "#4a2a22", "#1f2a4d", "#2f6b45", "#d81b72", "#e4d8c6", "#a9c4e6"];
const PRESET = [...SIZE_PRESETS[FEATURES.grade]];
const key = (size: string, color: string) => `${size}|${color}`;

// "199.9" -> "199,90" para mostrar no campo
const money = (v: number | null) => (v == null ? "" : v.toFixed(2).replace(".", ","));

export function ProductForm({ product, categories }: { product?: AdminProduct; categories: Category[] }) {
  const router = useRouter();
  const [state, action] = useActionState<ActionState, FormData>(saveProduct, { ok: false, message: "" });
  const uploader = useUploader("produtos");
  const fileInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [price, setPrice] = useState(money(product?.price ?? null));
  const [salePrice, setSalePrice] = useState(money(product?.salePrice ?? null));
  const [tag, setTag] = useState(product?.tag ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [minStock, setMinStock] = useState(String(product?.minStock ?? 2));
  const [images, setImages] = useState<Uploaded[]>(product?.images ?? []);
  const [colors, setColors] = useState<Color[]>(product?.colors.length ? product.colors : [{ name: "", hex: "#161314" }]);
  const [sizes, setSizes] = useState<string[]>(product?.sizes.length ? product.sizes : PRESET);
  const [customSize, setCustomSize] = useState("");
  const [initial, setInitial] = useState<Record<string, string>>({});

  const existing = useMemo(() => new Map((product?.variants ?? []).map((v) => [key(v.size, v.color), v.stock])), [product]);
  const [local, setLocal] = useState<Record<string, string> | null>(null);
  const errors = local ?? state.errors ?? {};
  // combinações cor x tamanho que ainda não existem (pedem estoque inicial)
  const newCells = colors
    .filter((c) => c.name.trim())
    .map((color) => ({
      color,
      cells: sortSizes(sizes)
        .map((size) => ({ size, k: key(size, color.name.trim()) }))
        .filter(({ k }) => !existing.has(k)),
    }))
    .filter((g) => g.cells.length);
  const message = local ? Object.values(local)[0] : state.message;
  const allSizes = sortSizes([...PRESET, ...sizes]);

  useEffect(() => {
    if (!state.ok || !state.id) return;
    uploader.commit();
    if (!product) router.replace(`/admin/produtos/${state.id}?salvo=1`);
    else router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const payload = JSON.stringify({
    id: product?.id ?? "",
    name,
    slug,
    description,
    category_id: categoryId,
    price,
    sale_price: salePrice,
    tag,
    featured,
    active,
    min_stock: minStock,
    images: images.map((i) => i.path),
    colors: colors.map((c) => ({ name: c.name.trim(), hex: c.hex })),
    sizes: sortSizes(sizes),
    initial_stock: Object.fromEntries(Object.entries(initial).filter(([, v]) => v !== "")),
  });

  const move = (i: number, dir: -1 | 1) =>
    setImages((list) => {
      const next = [...list];
      const j = i + dir;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // erro do campo ou de algum item dele ("colors.0.name")
  const err = (k: string) => {
    const found = Object.entries(errors).find(([path]) => path === k || path.startsWith(`${k}.`));
    return found && <span className="mt-1 block text-base font-normal text-red-700">{found[1]}</span>;
  };

  // mesma validação do servidor, antes de enviar
  const validate = (e: React.FormEvent) => {
    const parsed = productSchema.safeParse(JSON.parse(payload));
    if (parsed.success) return setLocal(null);
    e.preventDefault();
    const found: Record<string, string> = {};
    for (const issue of parsed.error.issues) found[issue.path.join(".") || "form"] ??= issue.message;
    setLocal(found);
  };

  return (
    <form action={action} onSubmit={validate} className="space-y-5 pb-24 lg:pb-0">
      <input type="hidden" name="payload" value={payload} />

      {/* ---------------- Fotos */}
      <Card>
        <CardTitle aside={<span className="text-base text-muted">{images.length}/12</span>}>Fotos</CardTitle>
        <p className="-mt-2 mb-4 text-base text-muted">A primeira é a capa. As fotos são reduzidas e convertidas para WebP antes de enviar.</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((img, i) => (
            <li key={img.path} className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream">
                <Image src={img.url} alt={`Foto ${i + 1}`} fill sizes="160px" className="object-cover" />
                {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">Capa</span>}
              </div>
              <div className="mt-1 grid grid-cols-3 gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid min-h-11 place-items-center rounded-lg border border-ink/10 bg-white disabled:opacity-30" aria-label={`Mover foto ${i + 1} para a esquerda`}>
                  ←
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="grid min-h-11 place-items-center rounded-lg border border-ink/10 bg-white disabled:opacity-30" aria-label={`Mover foto ${i + 1} para a direita`}>
                  →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    uploader.forget(img.path);
                    setImages((list) => list.filter((x) => x.path !== img.path));
                  }}
                  className="grid min-h-11 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-700"
                  aria-label={`Remover foto ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
          {images.length < 12 && (
            <li>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploader.busy}
                className="grid aspect-[3/4] w-full place-items-center rounded-xl border-2 border-dashed border-ink/20 bg-white text-center text-base text-muted transition hover:border-primary hover:text-primary"
              >
                {uploader.busy ? "Enviando..." : <span><span className="block text-3xl leading-none">+</span>Adicionar fotos</span>}
              </button>
            </li>
          )}
        </ul>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []).slice(0, 12 - images.length);
            e.target.value = "";
            const done = await uploader.upload(files);
            setImages((list) => [...list, ...done].slice(0, 12));
          }}
        />
        {uploader.error && <p className="mt-3 text-base text-red-700">{uploader.error}</p>}
        {err("images")}
      </Card>

      {/* ---------------- Informações */}
      <Card>
        <CardTitle>Informações</CardTitle>
        <div className="space-y-4">
          <label className={label}>
            Nome da peça
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              required
              maxLength={120}
              className={input}
              aria-invalid={Boolean(errors.name)}
              placeholder="Ex.: Vestido Longo Pink"
            />
            {err("name")}
          </label>
          <label className={label}>
            Endereço da página
            <span className={hint}>Aparece no link: /catalogo/{slug || "nome-da-peca"}</span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugTyping(e.target.value));
              }}
              onBlur={() => setSlug((s) => slugify(s))}
              required
              className={input}
              aria-invalid={Boolean(errors.slug)}
              autoCapitalize="none"
              autoCorrect="off"
            />
            {err("slug")}
          </label>
          <label className={label}>
            Descrição
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={2000} className={`${input} resize-y`} placeholder="Tecido, caimento, como usar..." />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Categoria
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={input}>
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              Etiqueta <span className="font-normal text-muted">(opcional)</span>
              <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={30} className={input} placeholder="Novidade, Mais pedido..." list="tag-ideas" />
              <datalist id="tag-ideas">
                <option value="Novidade" />
                <option value="Mais pedido" />
                <option value="Últimas peças" />
                <option value="Festa" />
              </datalist>
            </label>
          </div>
        </div>
      </Card>

      {/* ---------------- Preço */}
      <Card>
        <CardTitle>Preço</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <label className={label}>
            Preço (R$)
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="199,90" className={input} aria-invalid={Boolean(errors.price)} />
            {err("price")}
          </label>
          <label className={label}>
            Promocional (R$)
            <input value={salePrice} onChange={(e) => setSalePrice(e.target.value)} inputMode="decimal" placeholder="opcional" className={input} aria-invalid={Boolean(errors.sale_price)} />
            {err("sale_price")}
          </label>
        </div>
        <p className="mt-2 text-base text-muted">Sem preço, o site mostra “Consulte o valor”.</p>
      </Card>

      {/* ---------------- Cores e tamanhos */}
      <Card>
        <CardTitle>Cores</CardTitle>
        <ul className="space-y-3">
          {colors.map((c, i) => (
            <li key={i} className="rounded-xl border border-ink/10 p-3">
              <div className="flex items-center gap-2">
                <label className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-full border border-ink/15" style={{ backgroundColor: c.hex }}>
                  <span className="sr-only">Tom da cor {c.name || i + 1}</span>
                  <input type="color" value={c.hex} onChange={(e) => setColors((l) => l.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                </label>
                <input
                  value={c.name}
                  onChange={(e) => setColors((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  placeholder="Nome da cor (ex.: Preto)"
                  maxLength={40}
                  aria-label={`Nome da cor ${i + 1}`}
                  className={`${input} mt-0`}
                />
                {colors.length > 1 && (
                  <button type="button" onClick={() => setColors((l) => l.filter((_, j) => j !== i))} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-700" aria-label={`Remover cor ${c.name || i + 1}`}>
                    ✕
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Tons sugeridos">
                {SWATCHES.map((s) => (
                  <button key={s} type="button" onClick={() => setColors((l) => l.map((x, j) => (j === i ? { ...x, hex: s } : x)))} className="grid h-11 w-11 place-items-center" aria-label={`Usar o tom ${s}`}>
                    <span className={`h-7 w-7 rounded-full border ${c.hex.toLowerCase() === s ? "border-primary ring-2 ring-primary/40" : "border-ink/15"}`} style={{ backgroundColor: s }} />
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
        {colors.length < 12 && (
          <button type="button" onClick={() => setColors((l) => [...l, { name: "", hex: "#6e1e2b" }])} className={`${btn.ghost} mt-3 w-full sm:w-auto`}>
            + Adicionar cor
          </button>
        )}
        {err("colors")}
      </Card>

      <Card>
        <CardTitle>Tamanhos</CardTitle>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => {
            const on = sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => setSizes((l) => (on ? l.filter((x) => x !== s) : [...l, s]))}
                className={`min-h-12 min-w-14 rounded-xl border px-3 text-base font-medium transition ${on ? "border-primary bg-primary text-white" : "border-ink/15 bg-white text-ink/70"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={customSize} onChange={(e) => setCustomSize(e.target.value.toUpperCase())} maxLength={10} placeholder="Outro tamanho (ex.: G6, Único)" aria-label="Outro tamanho" className={`${input} mt-0`} />
          <button
            type="button"
            className={btn.ghost}
            onClick={() => {
              const s = customSize.trim();
              if (s && !sizes.includes(s)) setSizes((l) => [...l, s]);
              setCustomSize("");
            }}
          >
            Incluir
          </button>
        </div>
        {err("sizes")}
      </Card>

      {newCells.length > 0 && (
        <Card>
          <CardTitle>{product ? "Estoque das variações novas" : "Estoque inicial"}</CardTitle>
          <p className="-mt-2 mb-4 text-base text-muted">
            {product ? "Só as combinações novas de cor e tamanho. As que já existem mudam pelo quadro “Estoque” mais abaixo, com histórico." : "Quantas unidades você tem de cada cor e tamanho. Deixe em branco o que não tem."}
          </p>
          <div className="space-y-4">
            {newCells.map(({ color, cells }) => (
              <fieldset key={color.name}>
                <legend className="mb-2 flex items-center gap-2 font-medium">
                  <span className="h-4 w-4 rounded-full border border-ink/15" style={{ backgroundColor: color.hex }} /> {color.name}
                </legend>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {cells.map(({ size, k }) => (
                    <label key={k} className="text-center text-base text-muted">
                      {size}
                      <input
                        value={initial[k] ?? ""}
                        onChange={(e) => setInitial((m) => ({ ...m, [k]: e.target.value.replace(/\D/g, "") }))}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        aria-label={`${color.name} tamanho ${size}`}
                        className={`${input} mt-1 px-2 text-center`}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Card>
      )}

      {/* ---------------- Visibilidade */}
      <Card>
        <CardTitle>Na loja</CardTitle>
        <div className="space-y-2">
          <Toggle checked={active} onChange={setActive} label="Mostrar no site" description="Desligado, a peça fica oculta (mas não é apagada)." />
          <Toggle checked={featured} onChange={setFeatured} label="Destaque na página inicial" description="Aparece em “Queridinhas da semana” enquanto tiver estoque." />
          <label className={`${label} pt-2`}>
            Avisar quando o estoque total chegar a
            <input value={minStock} onChange={(e) => setMinStock(e.target.value.replace(/\D/g, ""))} inputMode="numeric" pattern="[0-9]*" className={`${input} max-w-32`} />
            <span className={hint}>A peça aparece nos alertas do painel ao chegar nesse número.</span>
          </label>
        </div>
      </Card>

      {message && <Notice tone={!local && state.ok ? "ok" : "error"}>{message}</Notice>}

      {/* barra fixa no celular, com o botão ao alcance do polegar */}
      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 flex gap-2 border-t border-ink/10 bg-white/95 p-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <Link href="/admin/produtos" onClick={uploader.discard} className={`${btn.ghost} flex-1 lg:flex-none`}>
          Cancelar
        </Link>
        <SubmitButton disabled={uploader.busy} className={`${btn.primary} flex-[2] lg:flex-none lg:px-10`}>{product ? "Salvar alterações" : "Cadastrar peça"}</SubmitButton>
      </div>
    </form>
  );
}
