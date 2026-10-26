# Site KF Moda Plus Size

Landing page de moda plus size com catálogo, avaliações e painel administrativo (`/admin`) para a loja se gerenciar sozinha.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind v4 · Supabase (banco, login e fotos) · Vercel. Tudo cabe nos planos gratuitos.

- Este repositório também é o template de outros clientes: veja [TEMPLATE.md](TEMPLATE.md) (`npm run novo-cliente`).
- **Sem Supabase configurado**, o site funciona com as peças de `config/products.ts` e o painel mostra como configurar. Dá para desenvolver o visual sem banco.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | site em http://localhost:3000 |
| `npm run build` e `npm start` | build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run seed:sql` | gera `supabase/seed.sql` a partir de `config/products.ts` |
| `npm run test:sql` | testa `schema.sql` + `seed.sql` num Postgres em memória (RLS, estoque, fotos) |

---

## Publicar (passo a passo)

### 1. Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto (região **South America (São Paulo)**). Guarde a senha do banco.
2. Abra **SQL Editor → New query**, cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria tabelas, funções, políticas de segurança (RLS) e o bucket de fotos `imagens`.
3. Numa nova query, cole [`supabase/seed.sql`](supabase/seed.sql) e rode. Entram 5 categorias, 22 peças de exemplo (com 2 unidades por cor e tamanho, sem preço), os textos do site e uma avaliação pendente de teste. Os dois arquivos podem rodar de novo sem duplicar nada.
4. **Desligue o cadastro público:** Authentication → Sign In / Providers → *Allow new users to sign up* = **desligado**. (Mesmo que alguém crie conta, não teria acesso ao painel sem estar em `admins`; desligar evita contas soltas.)
5. **Crie a conta da dona:** Authentication → Users → **Add user → Create new user**, com e-mail e senha e **Auto Confirm User** marcado.
6. **Dê acesso ao painel** a essa conta (SQL Editor):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-da-dona@exemplo.com';
   ```

   Para tirar o acesso: `delete from public.admins where user_id = (select id from auth.users where email = '...');`
7. Em **Project Settings → API Keys**, copie a URL do projeto, a chave pública (*publishable*, ou *anon* nos projetos antigos) e a chave secreta (*secret*, ou *service_role*).

### 2. Variáveis de ambiente

Copie [`.env.example`](.env.example) para `.env.local` e preencha:

| Variável | Onde achar | Observação |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | o domínio do site | usado no sitemap, Open Graph e dados estruturados |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → API Keys | também aceita `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_SECRET_KEY` | Supabase → API Keys | **secreta**: só o servidor usa (formulário de avaliação). Também aceita `SUPABASE_SERVICE_ROLE_KEY` |
| `CRON_SECRET` | invente um texto aleatório longo | protege o cron diário que mantém o Supabase ativo |
| `REVIEW_IP_SALT` | opcional | embaralha o IP no limite de avaliações |

Rode `npm run dev`, abra http://localhost:3000/admin e entre com a conta do passo 5.

### 3. Vercel

1. Em [vercel.com](https://vercel.com), **Add New → Project** e importe este repositório (Framework: Next.js, sem mudar nada).
2. Em **Environment Variables**, cadastre as mesmas variáveis do `.env.local` (Production e Preview).
3. **Deploy.** Depois, em Settings → Domains, aponte o domínio da loja e atualize `NEXT_PUBLIC_SITE_URL`.
4. O [`vercel.json`](vercel.json) agenda um cron diário em `/api/keepalive`. O Supabase gratuito **pausa o projeto após 7 dias sem uso**; esse acesso diário evita a pausa. Confira em Settings → Cron Jobs.

---

## Painel (`/admin`)

Feito para usar no celular: menu fixo embaixo, botões grandes e o "Salvar" sempre ao alcance do polegar.

- **Início:** peças no site, estoque baixo, esgotadas e avaliações esperando aprovação, com a lista de alertas.
- **Peças:** cadastrar, editar, ocultar e excluir. Fotos em ordem (a primeira é a capa), preço e preço promocional, cores e tamanhos com estoque inicial, destaque e estoque mínimo. Busca e filtros por categoria, status e estoque.
- **Estoque:** dentro da peça, "Ajustar" em cada cor/tamanho, com entrada ou saída e motivo (venda, troca, chegou mercadoria, ajuste). Tudo vai para o histórico.
- **Categorias:** criar, renomear, trocar a foto, reordenar, esconder e escolher o que aparece na página inicial.
- **Site:** textos e fotos do topo, "Sobre a marca", banner, WhatsApp, endereço, horário, Instagram e guia de medidas.
- **Avaliações:** pendentes, aprovadas e recusadas. Aprovar, recusar, destacar na página inicial e excluir.
- **Manutenção** (no Início): apaga do armazenamento as fotos que nenhum cadastro usa.

## Como funciona

### Dados
- O site lê tudo do Supabase com a chave pública, em cache (`unstable_cache`, tag `site`, 10 min). Cada alteração no painel limpa o cache na hora.
- Sem as variáveis do Supabase, `lib/data.ts` usa `config/products.ts` e os textos de `lib/content.ts`.
- `products`, `product_images`, `product_variants` (cor × tamanho com estoque), `stock_movements` (histórico), `categories`, `reviews`, `site_content` (textos em JSON) e `admins`. Esquema completo em [`supabase/schema.sql`](supabase/schema.sql).
- Salvar uma peça (`save_product`), ajustar estoque (`adjust_stock`) e excluir (`delete_product`) são funções no banco, cada uma numa transação. O estoque nunca fica negativo (restrição no banco).

### Segurança
- **RLS:** o público só lê peças e categorias ativas, avaliações aprovadas e os textos. Escrever qualquer coisa exige estar em `admins` (função `is_admin()`). `npm run test:sql` confere isso.
- **Login:** Supabase Auth (senha com hash do próprio Supabase). Os cookies de sessão são `httpOnly`, `secure` em produção e `sameSite=lax`. O painel não tem cliente Supabase no navegador. O `middleware.ts` renova a sessão, e toda página e Server Action do painel confere se a pessoa está em `admins`.
- **CSRF:** as Server Actions do Next comparam a origem da requisição com o host. Todas as entradas passam por Zod (`lib/validation.ts`) no servidor.
- **XSS:** o React escapa todo texto; o JSON-LD escapa `<`. Não há HTML vindo do painel.
- **Spam nas avaliações:** campo-isca escondido, tempo mínimo de preenchimento e no máximo 3 por IP a cada 24 h (o IP é guardado só como hash). Entram como "pendente".

### Fotos
- No painel, cada foto é reduzida para no máximo 1600 px e convertida para **WebP no navegador** antes de subir (o Safari do iPhone usa um codificador WebAssembly, carregado só quando precisa). Depois vai para o bucket `imagens` (`produtos/`, `categorias/`, `site/`).
- O site serve as fotos pelo `next/image` (AVIF/WebP no tamanho de cada tela, com lazy loading).
- Fotos removidas de uma peça, de uma categoria ou do conteúdo, e as de peças excluídas, são apagadas do Storage na hora. As fotos de exemplo do seed ficam em `/public/brand/products` e nunca são apagadas.

### Desempenho no celular
- Home, catálogo e página da peça chegam prontas em HTML. A home é feita de Server Components; só as partes interativas (coração, formulário, galeria) carregam JavaScript.
- As animações de entrada são CSS. A biblioteca `motion` só carrega ao abrir a janela rápida, a gaveta "Minha seleção" ou no layout "classic".
- Seções fora da tela usam `content-visibility: auto`.

## Limites do plano gratuito

| Serviço | Limite que importa | Uso esperado |
|---|---|---|
| Supabase Free | 500 MB de banco, 1 GB de arquivos, pausa após 7 dias parado | as fotos em WebP têm de 100 a 300 KB; 1 GB passa de 3 mil fotos |
| Vercel Hobby | uso pessoal/não comercial, 100 GB de banda, 1 cron por dia | para loja com faturamento, o termo da Vercel pede o plano Pro |
