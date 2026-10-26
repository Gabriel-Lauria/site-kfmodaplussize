import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_CONTENT } from "@/lib/content";
import type { ContentKey, SiteContent } from "@/lib/types";

export const metadata: Metadata = { title: "Conteúdo do site" };

export default async function ContentPage() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("site_content").select("key, value");
  const saved = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  // valores crus (caminhos do Storage, não URLs), completados com o padrão
  const content = Object.fromEntries(
    (Object.keys(DEFAULT_CONTENT) as ContentKey[]).map((k) => [k, { ...DEFAULT_CONTENT[k], ...(saved[k] ?? {}) }]),
  ) as unknown as SiteContent;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Conteúdo do site" subtitle="O que você salvar aqui aparece no site na hora." />
      <ContentEditor content={content} />
    </div>
  );
}
