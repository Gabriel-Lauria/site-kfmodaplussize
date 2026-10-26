"use client";

import { useActionState, useState } from "react";
import { adjustStock, type ActionState } from "@/app/admin/actions";
import type { Variant } from "@/lib/types";
import { SubmitButton } from "./client";
import { Notice, btn, input } from "./ui";

// Entrada e saída rápidas por variação. Cada ajuste vai para o histórico.
export function StockPanel({ variants }: { variants: Variant[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const colors = [...new Set(variants.map((v) => v.color))];

  return (
    <div className="space-y-5">
      {colors.map((color) => (
        <div key={color}>
          <p className="mb-2 flex items-center gap-2 font-medium">
            <span className="h-4 w-4 rounded-full border border-ink/15" style={{ backgroundColor: variants.find((v) => v.color === color)?.hex }} />
            {color}
          </p>
          <ul className="space-y-2">
            {variants
              .filter((v) => v.color === color)
              .map((v) => (
                <li key={v.id} className="rounded-xl border border-ink/10">
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === v.id ? null : v.id)}
                    aria-expanded={openId === v.id}
                    className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left"
                  >
                    <span className="font-medium">Tamanho {v.size}</span>
                    <span className="flex items-center gap-3">
                      <span className={`tabular-nums ${v.stock <= 0 ? "text-red-700" : ""}`}>
                        <span className="text-xl font-semibold">{v.stock}</span> un.
                      </span>
                      <span className="text-base text-primary">{openId === v.id ? "Fechar" : "Ajustar"}</span>
                    </span>
                  </button>
                  {openId === v.id && <AdjustForm variant={v} onDone={() => setOpenId(null)} />}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AdjustForm({ variant, onDone }: { variant: Variant; onDone: () => void }) {
  const [state, action] = useActionState<ActionState, FormData>(async (prev, form) => {
    const res = await adjustStock(prev, form);
    if (res.ok) setTimeout(onDone, 900);
    return res;
  }, { ok: false, message: "" });
  const [direction, setDirection] = useState<"in" | "out">("out");

  return (
    <form action={action} className="space-y-3 border-t border-ink/10 p-4">
      <input type="hidden" name="variantId" value={variant.id} />
      <input type="hidden" name="direction" value={direction} />
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de ajuste">
        {(["out", "in"] as const).map((d) => (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={direction === d}
            onClick={() => setDirection(d)}
            className={`min-h-12 rounded-xl border text-base font-semibold ${direction === d ? (d === "out" ? "border-red-300 bg-red-50 text-red-800" : "border-emerald-300 bg-emerald-50 text-emerald-800") : "border-ink/10 bg-white text-ink/60"}`}
          >
            {d === "out" ? "− Saída" : "+ Entrada"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1.4fr] gap-2">
        <label className="text-base font-medium">
          Quantidade
          <input name="qty" defaultValue="1" inputMode="numeric" pattern="[0-9]*" required className={input} />
        </label>
        <label className="text-base font-medium">
          Motivo
          <select name="reason" key={direction} defaultValue={direction === "out" ? "venda" : "entrada"} className={input}>
            {direction === "out" ? (
              <>
                <option value="venda">Venda</option>
                <option value="troca">Troca</option>
                <option value="ajuste">Ajuste / perda</option>
              </>
            ) : (
              <>
                <option value="entrada">Chegou mercadoria</option>
                <option value="troca">Troca (voltou)</option>
                <option value="ajuste">Ajuste / contagem</option>
              </>
            )}
          </select>
        </label>
      </div>
      <label className="block text-base font-medium">
        Observação <span className="font-normal text-muted">(opcional)</span>
        <input name="note" maxLength={200} placeholder="Ex.: venda pelo WhatsApp, Maria" className={input} />
      </label>
      {state.message && <Notice tone={state.ok ? "ok" : "error"}>{state.message}</Notice>}
      <SubmitButton className={`${btn.dark} w-full`}>Confirmar ajuste</SubmitButton>
    </form>
  );
}
