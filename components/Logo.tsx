"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BRAND } from "@/config";
import { BrandMark } from "./BrandMark";

type Props = {
  markClassName?: string;
  textClassName?: string;
  imageClassName?: string;
  // 2ª parte do wordmark em itálico na cor primária
  accent?: boolean;
  // a marca gira no hover
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
        <motion.span whileHover={{ rotate: 120 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="block">
          {mark}
        </motion.span>
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
