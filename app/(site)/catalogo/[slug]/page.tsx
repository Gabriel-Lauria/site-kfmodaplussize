import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { MirrorFrame } from "@/components/MirrorFrame";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetails } from "@/components/ProductDetails";
import { jsonLdScript } from "@/components/SiteShell";
import { Reveal } from "@/components/motion-utils";
import { BRAND, SITE_URL } from "@/config";
import { currentPrice } from "@/lib/catalog";
import { getSiteData } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { products } = await getSiteData();
  return products.map((p) => ({ slug: p.slug }));
}

async function load(slug: string) {
  const data = await getSiteData();
  return { data, product: data.products.find((p) => p.slug === slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await load((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/catalogo/${product.slug}` },
    openGraph: { title: `${product.name} · ${BRAND.name}`, description: product.description, images: product.image ? [product.image] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { data, product } = await load((await params).slug);
  if (!product) notFound();

  const others = data.products.filter((p) => p.slug !== product.slug && p.stock > 0);
  const related = [...others.filter((p) => p.categorySlug === product.categorySlug), ...others.filter((p) => p.categorySlug !== product.categorySlug)].slice(0, 4);

  const price = currentPrice(product);
  const abs = (src: string) => (src.startsWith("/") ? `${SITE_URL}${src}` : src);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map(abs),
    category: product.category,
    brand: { "@type": "Brand", name: BRAND.name },
    color: product.colors.map((c) => c.name).join(", "),
    size: product.sizes.join(", "),
    ...(price != null && {
      offers: {
        "@type": "Offer",
        price: price.toFixed(2),
        priceCurrency: "BRL",
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${SITE_URL}/catalogo/${product.slug}`,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <nav aria-label="Caminho" className="mx-auto max-w-[1400px] px-4 pt-6 text-xs uppercase tracking-[0.16em] text-muted sm:px-8 sm:pt-8">
        <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary">Início</Link>
        <span className="mx-2">/</span>
        <Link href={`/catalogo?categoria=${product.categorySlug}`} className="inline-flex min-h-11 items-center hover:text-primary">{product.category || "Catálogo"}</Link>
        <span className="mx-2 hidden sm:inline">/</span>
        <span className="hidden text-ink sm:inline">{product.name}</span>
      </nav>

      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 pb-16 pt-4 sm:px-8 sm:pt-8 lg:grid-cols-2 lg:gap-16 lg:pb-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MirrorFrame className="mx-auto aspect-[4/5] w-full max-w-[600px]">
            <Gallery images={product.images} alt={product.name} priority sizes="(min-width:1024px) 600px, 100vw" className="absolute inset-0" />
          </MirrorFrame>
        </div>
        <div className="lg:self-start lg:py-8">
          <ProductDetails product={product} headingLevel="h1" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="cv-auto mx-auto max-w-[1400px] px-4 sm:px-8">
          <Reveal>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              Combine <em className="text-primary">com</em>
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
