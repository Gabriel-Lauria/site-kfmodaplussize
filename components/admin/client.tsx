"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { discardImages, uploadImage } from "@/app/admin/actions";
import { imageUrl } from "@/lib/images";
import { toWebp } from "@/lib/webp";
import { btn } from "./ui";

export function SubmitButton({
  children,
  pending: pendingLabel = "Salvando...",
  className = btn.primary,
  disabled,
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}

// Botão de formulário que pede confirmação antes (excluir, ocultar...).
export function ConfirmButton({ children, message, className = btn.danger }: { children: React.ReactNode; message: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "Aguarde..." : children}
    </button>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white px-4 py-3">
      <span>
        <span className="block text-base font-medium">{label}</span>
        {description && <span className="block text-base text-muted">{description}</span>}
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-ink/20 transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" aria-hidden />
    </label>
  );
}

export type Uploaded = { path: string; url: string };

// Converte para WebP no navegador e envia. Devolve os enviados com sucesso.
export function useUploader(folder: "produtos" | "categorias" | "site") {
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  // enviados nesta tela e ainda não salvos (para apagar se a pessoa cancelar)
  const fresh = useRef<string[]>([]);

  async function upload(files: FileList | File[]) {
    setError("");
    const list = Array.from(files);
    setBusy((n) => n + list.length);
    const done: Uploaded[] = [];
    for (const file of list) {
      try {
        const blob = await toWebp(file);
        const form = new FormData();
        form.set("file", new File([blob], "foto.webp", { type: blob.type }));
        form.set("folder", folder);
        const res = await uploadImage(form);
        if (!res.ok) throw new Error(res.message);
        fresh.current.push(res.path);
        done.push({ path: res.path, url: res.url });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não deu para enviar a foto.");
      } finally {
        setBusy((n) => n - 1);
      }
    }
    return done;
  }

  return {
    upload,
    busy: busy > 0,
    error,
    // chamar ao salvar: os enviados passam a ser "do cadastro"
    commit: () => (fresh.current = []),
    // foto tirada da lista antes de salvar: se foi enviada agora, já apaga
    forget: (path: string) => {
      if (!fresh.current.includes(path)) return;
      fresh.current = fresh.current.filter((p) => p !== path);
      void discardImages([path]);
    },
    // chamar ao cancelar: apaga os que não foram salvos
    discard: () => {
      const paths = fresh.current;
      fresh.current = [];
      if (paths.length) void discardImages(paths);
    },
  };
}

// Campo de uma imagem só (hero, sobre, banner, categoria).
export function ImageField({
  label,
  value,
  onChange,
  folder,
  aspect = "aspect-[4/5]",
  hint,
}: {
  label: string;
  value: string;
  onChange: (path: string, url: string) => void;
  folder: "categorias" | "site";
  aspect?: string;
  hint?: string;
}) {
  const { upload, busy, error } = useUploader(folder);
  const [preview, setPreview] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const src = preview || imageUrl(value);

  return (
    <div>
      <p className="text-base font-medium">{label}</p>
      {hint && <p className="text-base text-muted">{hint}</p>}
      <div className="mt-2 flex items-end gap-4">
        <div className={`relative w-32 shrink-0 overflow-hidden rounded-xl bg-cream ${aspect}`}>
          {src ? <Image src={src} alt="" fill sizes="128px" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-base text-muted">Sem foto</span>}
          {busy && <span className="absolute inset-0 grid place-items-center bg-white/70 text-base">Enviando...</span>}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className={btn.small} onClick={() => input.current?.click()} disabled={busy}>
            {src ? "Trocar foto" : "Escolher foto"}
          </button>
          {value && (
            <button type="button" className={`${btn.small} text-red-700`} onClick={() => { setPreview(""); onChange("", ""); }}>
              Remover
            </button>
          )}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const [first] = await upload(e.target.files ?? []);
          e.target.value = "";
          if (first) {
            setPreview(first.url);
            onChange(first.path, first.url);
          }
        }}
      />
      {error && <p className="mt-2 text-base text-red-700">{error}</p>}
    </div>
  );
}
