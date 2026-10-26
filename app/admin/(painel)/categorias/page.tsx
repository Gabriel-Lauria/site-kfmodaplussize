import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { PageHeader } from "@/components/admin/ui";
import { adminCategories } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { imageUrl } from "@/lib/images";

export const metadata: Metadata = { title: "Categorias" };

export default async function CategoriesPage() {
  const { sb } = await requireAdmin();
  const [categories, products] = await Promise.all([adminCategories(sb), sb.from("products").select("category_id")]);
  const counts = new Map<string, number>();
  for (const p of products.data ?? []) if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);

  return (
    <div className="max-w-3xl">
      <PageHeader title="Categorias" subtitle="A ordem daqui é a ordem no catálogo e na página inicial." />
      <CategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image_path: c.image_path ?? "",
          image_url: imageUrl(c.image_path),
          active: c.active,
          show_on_home: c.show_on_home,
          count: counts.get(c.id) ?? 0,
        }))}
      />
    </div>
  );
}
