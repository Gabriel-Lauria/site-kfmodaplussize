import Image from "next/image";
import { BRAND } from "@/config";
import { BrandMark } from "./BrandMark";

type Props = {
  markClassName?: string;
  textClassName?: string;
  imageClassName?: string;
  // 2ª parte do wordmark em itálico na cor primária
  accent?: boolean;
  // a marca gira no hover do link (o link pai precisa da classe "group")
  spin?: boolean;
};

// Marca + nome em texto, ou /public/brand/logo.svg quando BRAND.logoImage = true.
export function Logo({ markClassName, textClassName, imageClassName = "h-9 w-auto", accent = false, spin = false }: Props) {
  if (BRAND.logoImage) {
    return <Image src="/brand/logo.svg" alt={BRAND.name} width={160} height={40} priority className={imageClassName} />;
  }
  const mark = <BrandMark className={markClassName} />;
  return (
    <>
      {spin ? (
        <span className="block transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[120deg]">{mark}</span>
      ) : (
        mark
      )}
      <span className={textClassName}>
        {accent ? (
          <>
            {BRAND.wordmark[0]} <em className="text-primary">{BRAND.wordmark[1]}</em>
          </>
        ) : (
          BRAND.name
        )}
      </span>
    </>
  );
}
