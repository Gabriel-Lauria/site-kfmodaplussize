"use client";

// Reduz a foto e converte para WebP no navegador, antes do upload.
// Chrome/Android/Firefox fazem isso nativo pelo canvas; o Safari (iPhone) não gera WebP,
// então cai no codificador em WebAssembly, carregado só quando precisa.

export const MAX_SIDE = 1600;
const QUALITY = 0.82;

async function draw(file: File, max: number) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não deu para ler a imagem neste navegador.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return { canvas, ctx, width, height };
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

export async function toWebp(file: File, max = MAX_SIDE): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem (JPG, PNG, WebP ou HEIC).");
  const { canvas, ctx, width, height } = await draw(file, max);

  const native = await toBlob(canvas, "image/webp", QUALITY);
  if (native && native.type === "image/webp") return native;

  const { default: encode } = await import("@jsquash/webp/encode");
  const buffer = await encode(ctx.getImageData(0, 0, width, height), { quality: QUALITY * 100 });
  return new Blob([buffer], { type: "image/webp" });
}
