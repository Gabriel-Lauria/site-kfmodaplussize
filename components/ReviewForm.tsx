"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { submitReview, type ReviewState } from "@/app/(site)/actions";
import { checkReview } from "@/lib/review-rules";

const INPUT = "mt-1.5 block w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-base outline-none transition focus:border-primary aria-[invalid=true]:border-accent";

export function ReviewForm() {
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, { ok: false, message: "" });
  const [started, setStarted] = useState(0);
  const [rating, setRating] = useState(0);
  const [local, setLocal] = useState<Record<string, string> | null>(null);
  const e = local ?? state.errors ?? {};

  useEffect(() => setStarted(Date.now()), []);

  // mesmas regras do servidor (lib/review-rules.ts), antes de enviar
  const validate = (ev: React.FormEvent<HTMLFormElement>) => {
    // envio pelo onSubmit (e não <form action>): se o servidor recusar, o texto da cliente não é apagado
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const errors = checkReview(Object.fromEntries(data));
    if (Object.keys(errors).length) return setLocal(errors);
    setLocal(null);
    startTransition(() => action(data));
  };

  if (state.ok) {
    return (
      <div className="grid h-full place-items-center rounded-sm bg-cream p-8 text-center" role="status">
        <div>
          <p className="font-display text-3xl italic text-primary">Obrigada!</p>
          <p className="mt-3 text-ink/75">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={validate} className="relative rounded-sm bg-cream p-6 sm:p-8" noValidate>
      <h3 className="font-display text-3xl">Deixe sua avaliação</h3>
      <p className="mt-1 text-muted">Ela aparece aqui depois de ser revisada pela equipe.</p>

      <input type="hidden" name="started" value={started} />
      {/* campo-isca: escondido de pessoas, robôs preenchem */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site <input type="text" name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="font-medium">Sua nota</legend>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="rating" value={n} className="peer sr-only" checked={rating === n} onChange={() => setRating(n)} required />
              <span className={`grid h-11 w-11 place-items-center text-3xl leading-none transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent ${n <= rating ? "text-highlight" : "text-ink/20"}`} aria-hidden>
                ★
              </span>
              <span className="sr-only">{n} {n === 1 ? "estrela" : "estrelas"}</span>
            </label>
          ))}
        </div>
        {e.rating && <p className="mt-1 text-red-700">{e.rating}</p>}
      </fieldset>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block font-medium">
          Nome
          <input name="name" autoComplete="given-name" maxLength={60} required className={INPUT} aria-invalid={Boolean(e.name)} />
          {e.name && <span className="mt-1 block text-red-700">{e.name}</span>}
        </label>
        <label className="block font-medium">
          Cidade <span className="font-normal text-muted">(opcional)</span>
          <input name="city" autoComplete="address-level2" maxLength={60} className={INPUT} aria-invalid={Boolean(e.city)} />
        </label>
      </div>
      <label className="mt-4 block font-medium">
        Como foi sua experiência?
        <textarea name="comment" rows={4} minLength={10} maxLength={800} required className={`${INPUT} resize-y`} aria-invalid={Boolean(e.comment)} />
        {e.comment && <span className="mt-1 block text-red-700">{e.comment}</span>}
      </label>

      {!local && state.message && !state.ok && (
        <p className="mt-4 text-red-700" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-primary disabled:opacity-60 sm:w-auto">
        {pending ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
