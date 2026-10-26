"use client";

import { startTransition, useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";
import { Notice, input, label } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, { ok: false, message: "" });
  return (
    <form
      // envio pelo onSubmit (e não <form action>) para o React não limpar o e-mail quando a senha está errada
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="mt-8 space-y-4"
    >
      <label className={label}>
        E-mail
        <input name="email" type="email" inputMode="email" autoComplete="username" required className={input} aria-invalid={Boolean(state.errors?.email)} />
      </label>
      <label className={label}>
        Senha
        <input name="password" type="password" autoComplete="current-password" required minLength={6} className={input} aria-invalid={Boolean(state.errors?.password)} />
      </label>
      {state.message && !pending && <Notice tone="error">{state.message}</Notice>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-ink px-5 text-base font-semibold text-white transition hover:bg-primary disabled:opacity-50"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
