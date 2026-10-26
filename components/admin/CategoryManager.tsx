"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { deleteCategory, moveCategory, saveCategory, type ActionState } from "@/app/admin/actions";
import { slugTyping, slugify } from "@/lib/catalog";
import { ConfirmButton, ImageField, SubmitButton, Toggle } from "./client";
import { Badge, Card, Notice, btn, input, label } from "./ui";

type Cat = { id: string; name: string; slug: string; image_path: string; image_url: string; active: boolean; show_on_home: boolean; count: number };

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {categories.map((c, i) => (
          <li key={c.id} className="rounded-2xl border border-ink/10 bg-white">
            <div className="flex items-center gap-3 p-2.5">
              <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                {c.image_url && <Image src={c.image_url} alt="" fill sizes="48px" className="object-cover" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge>{c.count} {c.count === 1 ? "peça" : "peças"}</Badge>
                  {!c.active && <Badge tone="amber">Oculta</Badge>}
                  {c.active && c.show_on_home && <Badge tone="brand">Na página inicial</Badge>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button className={`${btn.small} w-11 px-0`} disabled={i === 0} aria-label={`Subir ${c.name}`}>↑</button>
                </form>
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button className={`${btn.small} w-11 px-0`} disabled={i === categories.length - 1} aria-label={`Descer ${c.name}`}>↓</button>
                </form>
                <button type="button" className={btn.small} onClick={() => setEditing(editing === c.id ? null : c.id)} aria-expanded={editing === c.id}>
                  {editing === c.id ? "Fechar" : "Editar"}
                </button>
              </div>
            </div>
            {editing === c.id && (
              <div className="border-t border-ink/10 p-4">
                <CategoryForm category={c} onSaved={() => setEditing(null)} />
                <form action={deleteCategory} className="mt-4 border-t border-ink/10 pt-4">
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={`Excluir a categoria “${c.name}”? As ${c.count} peças dela continuam cadastradas, sem categoria.`} className={btn.danger}>
                    Excluir categoria
                  </ConfirmButton>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Nova categoria</h2>
        <CategoryForm key={categories.length} />
      </Card>
    </div>
  );
}

function CategoryForm({ category, onSaved }: { category?: Cat; onSaved?: () => void }) {
  const [state, action] = useActionState<ActionState, FormData>(saveCategory, { ok: false, message: "" });
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [image, setImage] = useState(category?.image_path ?? "");
  const [active, setActive] = useState(category?.active ?? true);
  const [home, setHome] = useState(category?.show_on_home ?? true);

  useEffect(() => {
    if (state.ok) onSaved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const payload = JSON.stringify({ id: category?.id ?? "", name, slug, image_path: image, active, show_on_home: home });

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="payload" value={payload} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Nome
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!category) setSlug(slugify(e.target.value));
            }}
            required
            maxLength={60}
            placeholder="Ex.: Moda praia"
            className={input}
          />
        </label>
        <label className={label}>
          Endereço
          <input value={slug} onChange={(e) => setSlug(slugTyping(e.target.value))} onBlur={() => setSlug((s) => slugify(s))} required className={input} autoCapitalize="none" />
        </label>
      </div>
      <ImageField label="Foto do card" hint="Aparece no bloco da categoria na página inicial." value={image} onChange={(path) => setImage(path)} folder="categorias" aspect="aspect-[3/4]" />
      <Toggle checked={active} onChange={setActive} label="Mostrar no site" />
      <Toggle checked={home} onChange={setHome} label="Mostrar na página inicial" />
      {state.message && !state.ok && <Notice tone="error">{state.message}</Notice>}
      {state.ok && !category && <Notice tone="ok">{state.message}</Notice>}
      <SubmitButton className={`${btn.primary} w-full sm:w-auto`}>{category ? "Salvar categoria" : "Criar categoria"}</SubmitButton>
    </form>
  );
}
