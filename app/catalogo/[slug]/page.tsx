import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MirrorFrame } from "@/components/MirrorFrame";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetails } from "@/components/ProductDetails";
import { Reveal } from "@/components/motion-utils";
import { PRODUCTS } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/catalogo/${product.slug}` },
    openGraph: { title: `${product.name} · Espaço Flor`, description: product.description, images: [product.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = [
    ...PRODUCTS.filter((p) => p.slug !== product.slug && p.category === product.category),
    ...PRODUCTS.filter((p) => p.slug !== product.slug && p.category !== product.category),
  ].slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    brand: { "@type": "Brand", name: "Espaço Flor" },
    color: product.colors.map((c) => c.name).join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Caminho" className="mx-auto max-w-[1400px] px-4 pt-8 text-xs uppercase tracking-[0.16em] text-muted sm:px-8">
        <Link href="/" className="hover:text-wine">Início</Link>
        <span className="mx-2">/</span>
        <Link href={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:text-wine">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-20 pt-8 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MirrorFrame className="mx-auto aspect-[4/5] w-full max-w-[600px]">
            <Image src={product.image} alt={product.name} fill priority sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
          </MirrorFrame>
          {product.hoverImage && (
            <div className="mx-auto mt-4 flex max-w-[600px] items-center gap-3 px-[5%]">
              <div className="relative h-24 w-20 overflow-hidden rounded-2xl">
                <Image src={product.hoverImage} alt={`${product.name}, outra foto`} fill sizes="80px" className="object-cover" />
              </div>
              <p className="text-sm text-muted">Mais cores e detalhes: peça fotos pelo WhatsApp.</p>
            </div>
          )}
        </div>
        <div className="lg:self-start lg:py-8">
          <ProductDetails product={product} headingLevel="h1" />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <Reveal>
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Combine <em className="text-wine">com</em>
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
    </>
  );
}
