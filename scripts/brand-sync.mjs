// Lê public/brand/mark.svg e gera:
//   - config/brand-mark.generated.ts (árvore do SVG que o <BrandMark> anima)
//   - app/icon.svg (favicon)
// Roda sozinho antes de `npm run dev` e `npm run build`. Sem dependências.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "public/brand/mark.svg");
const OUT = join(root, "config/brand-mark.generated.ts");
const ICON = join(root, "app/icon.svg");

const svg = readFileSync(SRC, "utf8")
  .replace(/<\?xml[\s\S]*?\?>/g, "")
  .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<metadata[\s\S]*?<\/metadata>/gi, "");

// --- parser XML mínimo (suficiente para SVGs exportados por Figma/Illustrator) ---
const TOKEN = /<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
const ATTR = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

const stack = [{ tag: "#root", attrs: {}, children: [] }];
for (const m of svg.matchAll(TOKEN)) {
  const [, closing, tag, rawAttrs, selfClosing, text] = m;
  const parent = stack[stack.length - 1];
  if (text !== undefined) {
    if (text.trim() && parent.tag !== "#root") parent.children.push(text.replace(/\s+/g, " "));
    continue;
  }
  if (closing) {
    stack.pop();
    continue;
  }
  const attrs = {};
  for (const a of (rawAttrs ?? "").matchAll(ATTR)) attrs[a[1]] = a[2] ?? a[3];
  const node = { tag, attrs, children: [] };
  parent.children.push(node);
  if (!selfClosing) stack.push(node);
}

const svgNode = stack[0].children.find((n) => typeof n === "object" && n.tag === "svg");
if (!svgNode) throw new Error(`Nenhum <svg> encontrado em ${SRC}`);

// --- atributos SVG -> props React ---
const camel = (name) => name.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());
function toProps(attrs) {
  const props = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "xmlns" || k.startsWith("xmlns:") || k === "xml:space" || k === "version") continue;
    if (k.startsWith("data-") || k.startsWith("aria-")) continue;
    if (k === "class") props.className = v;
    else if (k === "xlink:href") props.href = v;
    else if (k === "style") {
      props.style = Object.fromEntries(
        v
          .split(";")
          .map((d) => d.split(":").map((s) => s.trim()))
          .filter(([p, val]) => p && val)
          .map(([p, val]) => [camel(p), val]),
      );
    } else props[camel(k)] = v;
  }
  return props;
}

function convert(node) {
  if (typeof node === "string") return node;
  const out = { tag: node.tag, props: toProps(node.attrs) };
  if (node.attrs["data-mono"] === "hide") out.monoHide = true;
  if (node.attrs["data-delay"]) out.delay = Number(node.attrs["data-delay"]);
  const children = node.children.map(convert);
  if (children.length) out.children = children;
  return out;
}

const { viewBox, width, height } = svgNode.attrs;
const rootProps = toProps(svgNode.attrs);
for (const k of ["viewBox", "width", "height", "x", "y", "id", "className"]) delete rootProps[k];

const data = {
  viewBox: viewBox ?? `0 0 ${parseFloat(width) || 100} ${parseFloat(height) || 100}`,
  props: rootProps,
  children: svgNode.children.map(convert),
};

writeFileSync(
  OUT,
  `// Gerado por scripts/brand-sync.mjs a partir de public/brand/mark.svg. Não edite à mão.\n` +
    `import type { MarkData } from "@/components/BrandMark";\n\n` +
    `export const MARK: MarkData = ${JSON.stringify(data, null, 2)};\n`,
);
copyFileSync(SRC, ICON);
console.log(`brand-sync: ${data.children.length} elementos da marca -> config/brand-mark.generated.ts e app/icon.svg`);
