import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { adminCategories } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Nova peça" };

export default async function NewProductPage() {
  const { sb } = await requireAdmin();
  const categories = await adminCategories(sb);
  return (
    <div className="max-w-3xl">
      <PageHeader title="Nova peça" back={{ href: "/admin/produtos", label: "Peças" }} />
      <ProductForm categories={categories} />
    </div>
  );
}
