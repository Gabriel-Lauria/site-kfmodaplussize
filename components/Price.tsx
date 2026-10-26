import { formatPrice } from "@/lib/catalog";
import type { Product } from "@/lib/types";

// Preço da peça: promocional com o antigo riscado, ou "Consulte" quando não há preço cadastrado.
export function Price({ product, className = "" }: { product: Pick<Product, "price" | "salePrice">; className?: string }) {
  const { price, salePrice } = product;
  if (price == null && salePrice == null) return <p className={`text-muted ${className}`}>Consulte o valor</p>;
  if (salePrice != null && price != null) {
    return (
      <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
        <span className="font-semibold text-primary">{formatPrice(salePrice)}</span>
        <s className="text-[0.85em] text-muted">{formatPrice(price)}</s>
      </p>
    );
  }
  return <p className={`font-semibold ${className}`}>{formatPrice(salePrice ?? price)}</p>;
}
