// Lê uma cor da paleta (app/globals.css) para usos em JS: canvas e animações de cor.
// Só funciona no navegador; chame dentro de useEffect.
export function themeColor(name: string, alpha = 1) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
  if (alpha === 1) return value;
  // rgba() em vez de color-mix() para o motion conseguir interpolar a cor
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (!hex) return `color-mix(in srgb, ${value} ${alpha * 100}%, transparent)`;
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${alpha})`;
}
