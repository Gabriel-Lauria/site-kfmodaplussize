# Template de loja de moda — protótipo de cliente em ~30 min

Site em Next.js (App Router) + Tailwind v4 + motion + lenis. Tudo que muda de um cliente para outro fica em **`/config`**, **`/public/brand`** e no **bloco de paleta** do `app/globals.css`. Não é preciso mexer em componentes.

| Etapa | Tempo |
|---|---|
| 1. Copiar o template e rodar `npm run novo-cliente` | 3 min |
| 2. Trocar a marca (SVGs) | 5 min |
| 3. Colocar 6–8 fotos | 5 min |
| 4. Editar produtos e lojas | 8 min |
| 5. Revisar textos, cores e fontes | 5 min |
| 6. `npm run build` + deploy de preview na Vercel | 4 min |

---

## 1. Copiar e configurar

```bash
git clone <repo-do-template> site-<cliente>
cd site-<cliente>
npm install
npm run novo-cliente
```

O script pergunta:

| Pergunta | Exemplo | Onde vai parar |
|---|---|---|
| Nome, slug, wordmark (2 partes), segmento | `KF Moda Plus Size`, `kf`, `Moda` + `Plus Size` | `config/brand.ts` |
| Cor primária e de acento (+ terceira opcional) | `#a8483b`, `#c9705f` | paleta no `app/globals.css` (as outras cores são derivadas) |
| WhatsApp com DDI | `554195385799` | `brand.ts` (link wa.me e rótulo `(41) 9538-5799`) |
| Instagram | `@kfmodaplussize` | `brand.ts` |
| Cidade e UF | `Curitiba`, `PR` | `brand.ts`, `stores.ts` |
| Número de lojas | `1` | `stores.ts` (com 1 loja, pergunta endereço e CEP) |
| ctaMode | `comprar` ou `agendar-prova` | `features.ts` |
| Grade | `P-GG`, `PP-GG`, `G1-G5`, `42-54`, `36-46` | `features.ts` |
| Placeholders? | `s` | copia `template/placeholders/brand` → `public/brand` e escreve um `products.ts` de exemplo |

Para repetir sem digitar, salve as respostas num JSON com as mesmas chaves (`name`, `slug`, `primary`, `accent`, `whatsapp`, `instagram`, `city`, `state`, `stores`, `address`, `postalCode`, `ctaMode`, `grade`, `placeholders`) e rode `npm run novo-cliente -- --from cliente.json`.

> Rode `npm run dev` logo depois: o site já abre com a paleta e os placeholders do cliente.

## 2. Marca

| Arquivo | Uso |
|---|---|
| `public/brand/mark.svg` | **Símbolo** (obrigatório). Aparece no header, intro, cortina entre páginas, selo do hero, rodapé, fundo das seções escuras. Vira o favicon (`app/icon.svg`) automaticamente. |
| `public/brand/logo.svg` | Logo completo. Só é usado se `BRAND.logoImage = true`; por padrão o header mostra o símbolo + o wordmark em texto, na fonte do site. |

Regras para o `mark.svg` funcionar com as animações:

- **viewBox quadrado**, fundo transparente, símbolo centralizado.
- Cores como **atributos** (`fill="#..."`, `stroke="#..."`), não em `<style>` com classes. No Figma: *Export → SVG*, com "Outline text" ligado. No Illustrator: *Styling: Presentation Attributes*.
- Texto convertido em curvas (o favicon não carrega fontes).
- Cada elemento de **primeiro nível** "desabrocha" em sequência na intro (0,08 s entre eles). Agrupe com `<g>` o que deve surgir junto.
- `data-delay="0.5"` muda o atraso de um elemento; `data-mono="hide"` esconde o elemento na versão de uma cor (marca d'água, rodapé, faixa de avisos).
- Na versão de uma cor, formas preenchidas viram a cor única e formas só de contorno (`fill="none"`) mantêm o traço nessa cor.

O `npm run dev` e o `npm run build` rodam `scripts/brand-sync.mjs`, que converte o SVG em `config/brand-mark.generated.ts` e copia o favicon. Depois de trocar o SVG com o dev rodando, rode `node scripts/brand-sync.mjs` de novo.

## 3. Fotos

Coloque em `public/brand/`:

| Pasta | O quê | Formato |
|---|---|---|
| `products/` | 6–8 fotos de peças (uma por produto; uma 2ª foto opcional para o hover) | retrato **3:4**, mín. 900×1200, `.jpg`/`.webp`/`.png` |
| `hero/hero.*` | Foto principal do topo da home (também é a imagem de compartilhamento) | retrato, mín. 1200×1500 |
| `hero/loja.*` | Fachada ou interior da loja (página `/lojas` e bloco "Visite a loja") | retrato, mín. 900×1200 |

Dicas: deixe o rosto no terço de cima (os cards cortam o topo e a base). Prints de Reels servem para o protótipo; corte as bordas com os ícones antes. Apague de `public/brand` as fotos que não forem usadas.

## 4. Produtos e lojas

**`config/products.ts`**
- `CATEGORIES`: as abas do catálogo.
- `PRODUCTS`: `slug` (vira a URL), `name`, `category`, `image`, `hoverImage?`, `colors` (nome + hex da bolinha), `sizes` (use `GRADE` ou uma lista própria, como `["Único"]`), `tag?` (etiqueta no card), `description`.
- `HOME_CATEGORIES`: os 4 cards "Escolha por onde começar" (foto + foto do hover).
- `LOOKS`: slugs da seção de rolagem horizontal "provador", na ordem.
- Em `brand.ts`, `hero.featuredSlug` escolhe a peça do cartão "Look da semana" e `hero.avatars` as 3 fotinhas redondas.

**`config/stores.ts`**
- `STORES`: `name`, `area` (rua e número), `city`, `state`, `postalCode`, `mapsQuery` (o que o botão "Como chegar" pesquisa no Google Maps), `region`.
- **1 loja**: o site troca a vitrine com mapa pelo bloco **"Visite a loja"**; o menu passa a dizer "A loja" (`features.showStores` é automático).
- **Várias lojas**: `REGIONS` vira o filtro, `pin` posiciona cada loja no mapa ilustrativo (x 0–100, y 0–80), `STORE_MAP` desenha os contornos e rótulos (pode ficar vazio), `STORE_STATS` define os números de destaque de `/lojas`.

## 5. Textos, cores e fontes

- **Textos**: `config/brand.ts` tem tudo (hero, perks, manifesto, FAQ, mensagens do WhatsApp, 404…). Procure por `TODO`. Os textos que dependem do número de lojas já se ajustam sozinhos (`LOJAS`, `countWords`).
- **Números do Instagram**: `SOCIAL` no topo do `brand.ts` (seguidores em milhares e posts).
- **Cores**: bloco `palette:start … palette:end` no topo do `app/globals.css`. Cada token está comentado. Confira o contraste: `primary` e `accent` aparecem como texto sobre o fundo claro; `accent-soft` aparece como texto sobre `primary-deep`.
- **Fontes**: bloco `FONTES` em `app/layout.tsx`. Troque as duas chamadas do `next/font/google` mantendo as variáveis `--font-brand-display` e `--font-brand-sans`. A fonte de títulos precisa ter itálico.
- **Recursos** (`config/features.ts`): `ctaMode`, `grade`, `showIntro` (abertura animada), `showCursor` (bolha do mouse), `showPetalTrail` (partículas no hero; as cores são `particle-1..4` da paleta).

## 6. Conferir e publicar

```bash
npm run dev     # http://localhost:3000
```

Checklist rápido:
- [ ] Intro, header, rodapé e favicon com a marca do cliente
- [ ] Botões de WhatsApp abrem o número certo com a mensagem pronta (peça, cor, tamanho)
- [ ] Catálogo: filtros, janela rápida, coração → "Minha seleção" → enviar no WhatsApp
- [ ] `/lojas`: endereço e "Como chegar" corretos
- [ ] Celular (390 px) e desktop

```bash
npm run lint
npm run build
npx vercel          # deploy de preview (pede login na primeira vez)
```

Na Vercel, defina `NEXT_PUBLIC_SITE_URL` (ex.: `https://cliente.com.br`) quando houver domínio. Ele é usado em sitemap, robots, Open Graph e JSON-LD. Sem ele, o padrão é `brand.siteUrl`.

---

### Mapa dos arquivos

```
config/
  brand.ts       identidade, contatos, SEO, textos e mensagens
  products.ts    categorias, grades, produtos, capas da home, looks
  stores.ts      lojas, regiões, mapa ilustrativo
  features.ts    showStores, ctaMode, grade, showIntro, showCursor, showPetalTrail
  index.ts       o que os componentes importam (+ waLink, mapsLink, CTA...)
  brand-mark.generated.ts   gerado a partir do mark.svg (não editar)
public/brand/    mark.svg, logo.svg, products/, hero/
app/globals.css  paleta (topo do arquivo)
app/layout.tsx   fontes (bloco FONTES)
scripts/         novo-cliente.mjs, brand-sync.mjs
template/
  placeholders/  marca, logo e fotos neutras
  exemplos/      config completa de clientes reais (Espaço Flor: 10 lojas, mapa, regiões)
```
