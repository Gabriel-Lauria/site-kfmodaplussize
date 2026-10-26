"use client";

import { useActionState } from "react";
import { cleanOrphanImages, type ActionState } from "@/app/admin/actions";
import { SubmitButton } from "./client";
import { Card, CardTitle, Notice, btn } from "./ui";

export function MaintenanceCard() {
  const [state, action] = useActionState<ActionState, FormData>(() => cleanOrphanImages(), { ok: false, message: "" });
  return (
    <Card>
      <CardTitle>Manutenção</CardTitle>
      <p className="text-muted">Apaga do armazenamento fotos que não estão em nenhuma peça, categoria ou página (por exemplo, de um cadastro abandonado no meio).</p>
      <form action={action} className="mt-4 space-y-3">
        <SubmitButton pending="Conferindo..." className={btn.ghost}>
          Limpar fotos sem uso
        </SubmitButton>
        {state.message && <Notice tone={state.ok ? "ok" : "error"}>{state.message}</Notice>}
      </form>
    </Card>
  );
}
