-- Gerado por scripts/gerar-seed.ts (npm run seed:sql). Rode depois do schema.sql.
-- As fotos apontam para /public/brand/products do próprio site; troque pelo painel quando quiser.
-- Preços ficam em branco (o site mostra "Consulte") e cada variação começa com 2 unidades.

-- Categorias
insert into public.categories (name, slug, image_path, position, show_on_home) values ('Conjuntos', 'conjuntos', '/brand/products/conjunto-colete-bermuda-linho.jpg', 0, true) on conflict (slug) do nothing;
insert into public.categories (name, slug, image_path, position, show_on_home) values ('Vestidos', 'vestidos', '/brand/products/vestido-longo-pink-halter.jpg', 1, true) on conflict (slug) do nothing;
insert into public.categories (name, slug, image_path, position, show_on_home) values ('Macacões', 'macacoes', '/brand/products/macaquinho-talita-branco.jpg', 2, true) on conflict (slug) do nothing;
insert into public.categories (name, slug, image_path, position, show_on_home) values ('Camisas', 'camisas', '/brand/products/camisa-branca-manga-longa.jpg', 3, true) on conflict (slug) do nothing;
insert into public.categories (name, slug, image_path, position, show_on_home) values ('Calças', 'calcas', '/brand/products/calca-pantalona-vinho.jpg', 4, false) on conflict (slug) do nothing;

-- Peças

-- Conjunto Suede Marsala
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'conjunto-suede-marsala', 'Conjunto Suede Marsala', 'Vestido curto e jaqueta em suede com cinto de fivela dourada. Juntos para o evento, separados para o dia a dia.', (select id from public.categories where slug = 'conjuntos'), 'Look da semana', false, 2, now() - interval '0 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/conjunto-suede-marsala.jpg', 0)) as v (path, pos)
where p.slug = 'conjunto-suede-marsala' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Marsala', '#7a1f2e', 101), ('44', 'Marsala', '#7a1f2e', 102), ('46', 'Marsala', '#7a1f2e', 103), ('48', 'Marsala', '#7a1f2e', 104), ('50', 'Marsala', '#7a1f2e', 105), ('52', 'Marsala', '#7a1f2e', 106), ('54', 'Marsala', '#7a1f2e', 107)) as v (size, color, hex, pos)
where p.slug = 'conjunto-suede-marsala'
on conflict (product_id, size, color) do nothing;

-- Conjunto Tricô Chocolate
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'conjunto-trico-chocolate', 'Conjunto Tricô Chocolate', 'Cardigã com vivos off-white, regata e calça pantalona em tricô. Confortável o dia todo e elegante do mesmo jeito.', (select id from public.categories where slug = 'conjuntos'), 'Mais pedido', false, 2, now() - interval '1 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/conjunto-trico-chocolate.jpg', 0)) as v (path, pos)
where p.slug = 'conjunto-trico-chocolate' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Chocolate', '#4a2a22', 101), ('44', 'Chocolate', '#4a2a22', 102), ('46', 'Chocolate', '#4a2a22', 103), ('48', 'Chocolate', '#4a2a22', 104), ('50', 'Chocolate', '#4a2a22', 105), ('52', 'Chocolate', '#4a2a22', 106), ('54', 'Chocolate', '#4a2a22', 107)) as v (size, color, hex, pos)
where p.slug = 'conjunto-trico-chocolate'
on conflict (product_id, size, color) do nothing;

-- Camisa de Cetim
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'camisa-cetim', 'Camisa de Cetim', 'Cetim com brilho suave, botões encapados e manga longa. Por dentro da pantalona ou solta com jeans.', (select id from public.categories where slug = 'camisas'), 'Novidade', false, 2, now() - interval '2 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/camisa-cetim-vinho.jpg', 0), ('/brand/products/calca-pantalona-vinho.jpg', 1)) as v (path, pos)
where p.slug = 'camisa-cetim' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Vinho', '#6e1e2b', 101), ('44', 'Vinho', '#6e1e2b', 102), ('46', 'Vinho', '#6e1e2b', 103), ('48', 'Vinho', '#6e1e2b', 104), ('50', 'Vinho', '#6e1e2b', 105), ('52', 'Vinho', '#6e1e2b', 106), ('54', 'Vinho', '#6e1e2b', 107), ('42', 'Preto', '#161314', 201), ('44', 'Preto', '#161314', 202), ('46', 'Preto', '#161314', 203), ('48', 'Preto', '#161314', 204), ('50', 'Preto', '#161314', 205), ('52', 'Preto', '#161314', 206), ('54', 'Preto', '#161314', 207)) as v (size, color, hex, pos)
where p.slug = 'camisa-cetim'
on conflict (product_id, size, color) do nothing;

-- Calça Pantalona com Cinto
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'calca-pantalona-cinto', 'Calça Pantalona com Cinto', 'Cintura alta com faixa e fivela, pernas amplas e caimento que alonga. A alfaiataria que veste do 42 ao 54.', (select id from public.categories where slug = 'calcas'), null, false, 2, now() - interval '3 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/calca-pantalona-vinho.jpg', 0), ('/brand/products/camisa-linho-marinho.jpg', 1)) as v (path, pos)
where p.slug = 'calca-pantalona-cinto' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Vinho', '#5a1622', 101), ('44', 'Vinho', '#5a1622', 102), ('46', 'Vinho', '#5a1622', 103), ('48', 'Vinho', '#5a1622', 104), ('50', 'Vinho', '#5a1622', 105), ('52', 'Vinho', '#5a1622', 106), ('54', 'Vinho', '#5a1622', 107), ('42', 'Chocolate', '#4a2a22', 201), ('44', 'Chocolate', '#4a2a22', 202), ('46', 'Chocolate', '#4a2a22', 203), ('48', 'Chocolate', '#4a2a22', 204), ('50', 'Chocolate', '#4a2a22', 205), ('52', 'Chocolate', '#4a2a22', 206), ('54', 'Chocolate', '#4a2a22', 207)) as v (size, color, hex, pos)
where p.slug = 'calca-pantalona-cinto'
on conflict (product_id, size, color) do nothing;

-- Vestido Midi com Babado
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-midi-babado', 'Vestido Midi com Babado', 'Midi de alfaiataria com babado assimétrico na barra. Marca a cintura e deixa o movimento por conta da saia.', (select id from public.categories where slug = 'vestidos'), 'Festa', false, 2, now() - interval '4 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-midi-babado.jpg', 0)) as v (path, pos)
where p.slug = 'vestido-midi-babado' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Preto', '#141213', 101), ('44', 'Preto', '#141213', 102), ('46', 'Preto', '#141213', 103), ('48', 'Preto', '#141213', 104), ('50', 'Preto', '#141213', 105), ('52', 'Preto', '#141213', 106), ('54', 'Preto', '#141213', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-midi-babado'
on conflict (product_id, size, color) do nothing;

-- Conjunto Poá e Listras
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'conjunto-poa-listras', 'Conjunto Poá e Listras', 'Cropped de poá com decote quadrado e saia midi listrada. Use junto ou misture com básicos.', (select id from public.categories where slug = 'conjuntos'), 'Novidade', false, 2, now() - interval '5 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/conjunto-poa-listras.jpg', 0)) as v (path, pos)
where p.slug = 'conjunto-poa-listras' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Azul serenity', '#a9cbea', 101), ('44', 'Azul serenity', '#a9cbea', 102), ('46', 'Azul serenity', '#a9cbea', 103), ('48', 'Azul serenity', '#a9cbea', 104), ('50', 'Azul serenity', '#a9cbea', 105), ('52', 'Azul serenity', '#a9cbea', 106), ('54', 'Azul serenity', '#a9cbea', 107)) as v (size, color, hex, pos)
where p.slug = 'conjunto-poa-listras'
on conflict (product_id, size, color) do nothing;

-- Macaquinho Romântico Talita
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'macaquinho-romantico-talita', 'Macaquinho Romântico Talita', 'Decote quadrado franzido, alças com babado e cintura em lastex. Parece vestido e tem o conforto do shortinho por baixo.', (select id from public.categories where slug = 'macacoes'), 'Novidade', true, 2, now() - interval '6 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/macaquinho-talita-branco.jpg', 0), ('/brand/products/macaquinho-talita-preto.jpg', 1)) as v (path, pos)
where p.slug = 'macaquinho-romantico-talita' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Branco', '#f4f1ec', 101), ('44', 'Branco', '#f4f1ec', 102), ('46', 'Branco', '#f4f1ec', 103), ('48', 'Branco', '#f4f1ec', 104), ('50', 'Branco', '#f4f1ec', 105), ('52', 'Branco', '#f4f1ec', 106), ('54', 'Branco', '#f4f1ec', 107), ('42', 'Preto', '#161314', 201), ('44', 'Preto', '#161314', 202), ('46', 'Preto', '#161314', 203), ('48', 'Preto', '#161314', 204), ('50', 'Preto', '#161314', 205), ('52', 'Preto', '#161314', 206), ('54', 'Preto', '#161314', 207)) as v (size, color, hex, pos)
where p.slug = 'macaquinho-romantico-talita'
on conflict (product_id, size, color) do nothing;

-- Vestido Longo Pink Halter
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-longo-pink-halter', 'Vestido Longo Pink Halter', 'Gola halter, caimento soltinho e saia com babado na barra. Leve e fluido para os dias quentes.', (select id from public.categories where slug = 'vestidos'), 'Novidade', true, 2, now() - interval '7 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-longo-pink-halter.jpg', 0), ('/brand/products/vestido-longo-pink-decote-v.jpg', 1)) as v (path, pos)
where p.slug = 'vestido-longo-pink-halter' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Pink', '#d81b72', 101), ('44', 'Pink', '#d81b72', 102), ('46', 'Pink', '#d81b72', 103), ('48', 'Pink', '#d81b72', 104), ('50', 'Pink', '#d81b72', 105), ('52', 'Pink', '#d81b72', 106), ('54', 'Pink', '#d81b72', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-longo-pink-halter'
on conflict (product_id, size, color) do nothing;

-- Camisa de Linho Azul-Marinho
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'camisa-linho-marinho', 'Camisa de Linho Azul-Marinho', 'Modelagem clássica, manga longa e botões frontais. Por dentro da pantalona, fica pronta para o trabalho.', (select id from public.categories where slug = 'camisas'), null, false, 2, now() - interval '8 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/camisa-linho-marinho.jpg', 0)) as v (path, pos)
where p.slug = 'camisa-linho-marinho' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Azul-marinho', '#1f2a4d', 101), ('44', 'Azul-marinho', '#1f2a4d', 102), ('46', 'Azul-marinho', '#1f2a4d', 103), ('48', 'Azul-marinho', '#1f2a4d', 104), ('50', 'Azul-marinho', '#1f2a4d', 105), ('52', 'Azul-marinho', '#1f2a4d', 106), ('54', 'Azul-marinho', '#1f2a4d', 107)) as v (size, color, hex, pos)
where p.slug = 'camisa-linho-marinho'
on conflict (product_id, size, color) do nothing;

-- Camisa Branca Manga Longa
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'camisa-branca-manga-longa', 'Camisa Branca Manga Longa', 'A camisa branca que combina com tudo. Com a pantalona vinho vira uma produção clássica e elegante.', (select id from public.categories where slug = 'camisas'), null, false, 2, now() - interval '9 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/camisa-branca-manga-longa.jpg', 0)) as v (path, pos)
where p.slug = 'camisa-branca-manga-longa' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Branco', '#f4f1ec', 101), ('44', 'Branco', '#f4f1ec', 102), ('46', 'Branco', '#f4f1ec', 103), ('48', 'Branco', '#f4f1ec', 104), ('50', 'Branco', '#f4f1ec', 105), ('52', 'Branco', '#f4f1ec', 106), ('54', 'Branco', '#f4f1ec', 107)) as v (size, color, hex, pos)
where p.slug = 'camisa-branca-manga-longa'
on conflict (product_id, size, color) do nothing;

-- Calça Pantalona Onça
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'calca-pantalona-onca', 'Calça Pantalona Onça', 'Pantalona de cintura alta com estampa de onça e bolsos laterais. Com um body liso, vira o look da noite.', (select id from public.categories where slug = 'calcas'), null, true, 2, now() - interval '10 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/calca-pantalona-onca.jpg', 0)) as v (path, pos)
where p.slug = 'calca-pantalona-onca' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Onça', '#a8743a', 101), ('44', 'Onça', '#a8743a', 102), ('46', 'Onça', '#a8743a', 103), ('48', 'Onça', '#a8743a', 104), ('50', 'Onça', '#a8743a', 105), ('52', 'Onça', '#a8743a', 106), ('54', 'Onça', '#a8743a', 107)) as v (size, color, hex, pos)
where p.slug = 'calca-pantalona-onca'
on conflict (product_id, size, color) do nothing;

-- Macacão Pantalona Verde
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'macacao-pantalona-verde', 'Macacão Pantalona Verde', 'Decote em V com franzido no busto, cintura marcada e pernas amplas. Uma peça só e o look está pronto.', (select id from public.categories where slug = 'macacoes'), null, true, 2, now() - interval '11 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/macacao-pantalona-verde.jpg', 0)) as v (path, pos)
where p.slug = 'macacao-pantalona-verde' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Verde', '#2f6b45', 101), ('44', 'Verde', '#2f6b45', 102), ('46', 'Verde', '#2f6b45', 103), ('48', 'Verde', '#2f6b45', 104), ('50', 'Verde', '#2f6b45', 105), ('52', 'Verde', '#2f6b45', 106), ('54', 'Verde', '#2f6b45', 107)) as v (size, color, hex, pos)
where p.slug = 'macacao-pantalona-verde'
on conflict (product_id, size, color) do nothing;

-- Vestido Longo Poá Verde
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-longo-poa-verde', 'Vestido Longo Poá Verde', 'Ombro a ombro com babados, lastex no busto e saia em camadas. Romântico do jeito certo.', (select id from public.categories where slug = 'vestidos'), null, true, 2, now() - interval '12 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-longo-poa-verde.jpg', 0)) as v (path, pos)
where p.slug = 'vestido-longo-poa-verde' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Verde', '#2f5a3a', 101), ('44', 'Verde', '#2f5a3a', 102), ('46', 'Verde', '#2f5a3a', 103), ('48', 'Verde', '#2f5a3a', 104), ('50', 'Verde', '#2f5a3a', 105), ('52', 'Verde', '#2f5a3a', 106), ('54', 'Verde', '#2f5a3a', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-longo-poa-verde'
on conflict (product_id, size, color) do nothing;

-- Vestido Longo Floral com Amarração
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-longo-floral-amarracao', 'Vestido Longo Floral com Amarração', 'Estampa floral com amarração no busto e alças finas. Fresquinho para o calor.', (select id from public.categories where slug = 'vestidos'), null, false, 2, now() - interval '13 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-longo-floral-amarracao.jpg', 0)) as v (path, pos)
where p.slug = 'vestido-longo-floral-amarracao' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Floral', '#e9a35a', 101), ('44', 'Floral', '#e9a35a', 102), ('46', 'Floral', '#e9a35a', 103), ('48', 'Floral', '#e9a35a', 104), ('50', 'Floral', '#e9a35a', 105), ('52', 'Floral', '#e9a35a', 106), ('54', 'Floral', '#e9a35a', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-longo-floral-amarracao'
on conflict (product_id, size, color) do nothing;

-- Vestido Midi Floral
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-midi-floral', 'Vestido Midi Floral', 'Decote em V com franzido, alças largas e barra com babado. Vai do almoço ao evento.', (select id from public.categories where slug = 'vestidos'), null, false, 2, now() - interval '14 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-midi-floral.jpg', 0)) as v (path, pos)
where p.slug = 'vestido-midi-floral' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Floral', '#f0c48a', 101), ('44', 'Floral', '#f0c48a', 102), ('46', 'Floral', '#f0c48a', 103), ('48', 'Floral', '#f0c48a', 104), ('50', 'Floral', '#f0c48a', 105), ('52', 'Floral', '#f0c48a', 106), ('54', 'Floral', '#f0c48a', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-midi-floral'
on conflict (product_id, size, color) do nothing;

-- Vestido Curto Pink com Lastex
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-curto-pink-lastex', 'Vestido Curto Pink com Lastex', 'Lastex no busto e na cintura, mangas bufantes e detalhes em poá. Delicado e confortável.', (select id from public.categories where slug = 'vestidos'), null, false, 2, now() - interval '15 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-curto-pink-lastex.jpg', 0)) as v (path, pos)
where p.slug = 'vestido-curto-pink-lastex' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Pink', '#d81b72', 101), ('44', 'Pink', '#d81b72', 102), ('46', 'Pink', '#d81b72', 103), ('48', 'Pink', '#d81b72', 104), ('50', 'Pink', '#d81b72', 105), ('52', 'Pink', '#d81b72', 106), ('54', 'Pink', '#d81b72', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-curto-pink-lastex'
on conflict (product_id, size, color) do nothing;

-- Vestido Longo Pink Decote V
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-longo-pink-decote-v', 'Vestido Longo Pink Decote V', 'Decote em V, mangas amplas e cintura marcada com lastex, valorizando a silhueta.', (select id from public.categories where slug = 'vestidos'), null, false, 2, now() - interval '16 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-longo-pink-decote-v.jpg', 0)) as v (path, pos)
where p.slug = 'vestido-longo-pink-decote-v' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Pink', '#d81b72', 101), ('44', 'Pink', '#d81b72', 102), ('46', 'Pink', '#d81b72', 103), ('48', 'Pink', '#d81b72', 104), ('50', 'Pink', '#d81b72', 105), ('52', 'Pink', '#d81b72', 106), ('54', 'Pink', '#d81b72', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-longo-pink-decote-v'
on conflict (product_id, size, color) do nothing;

-- Macaquinho Transpassado Preto
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'macaquinho-transpassado-preto', 'Macaquinho Transpassado Preto', 'Decote drapeado, cintura marcada por faixa com laço e frente transpassada. Elegante e atemporal.', (select id from public.categories where slug = 'macacoes'), null, true, 2, now() - interval '17 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/macaquinho-transpassado-preto.jpg', 0)) as v (path, pos)
where p.slug = 'macaquinho-transpassado-preto' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Preto', '#161314', 101), ('44', 'Preto', '#161314', 102), ('46', 'Preto', '#161314', 103), ('48', 'Preto', '#161314', 104), ('50', 'Preto', '#161314', 105), ('52', 'Preto', '#161314', 106), ('54', 'Preto', '#161314', 107)) as v (size, color, hex, pos)
where p.slug = 'macaquinho-transpassado-preto'
on conflict (product_id, size, color) do nothing;

-- Macaquinho Azul Manga Bufante
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'macaquinho-azul-bufante', 'Macaquinho Azul Manga Bufante', 'Mangas bufantes, busto franzido, cintura marcada e shorts soltinho com bolsos.', (select id from public.categories where slug = 'macacoes'), null, false, 2, now() - interval '18 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/macaquinho-azul-bufante.jpg', 0)) as v (path, pos)
where p.slug = 'macaquinho-azul-bufante' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Azul claro', '#a9c4e6', 101), ('44', 'Azul claro', '#a9c4e6', 102), ('46', 'Azul claro', '#a9c4e6', 103), ('48', 'Azul claro', '#a9c4e6', 104), ('50', 'Azul claro', '#a9c4e6', 105), ('52', 'Azul claro', '#a9c4e6', 106), ('54', 'Azul claro', '#a9c4e6', 107)) as v (size, color, hex, pos)
where p.slug = 'macaquinho-azul-bufante'
on conflict (product_id, size, color) do nothing;

-- Vestido Longo Caveira
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'vestido-longo-caveira-marinho', 'Vestido Longo Caveira', 'Malha azul-marinho com caveira em brilho colorido e fenda lateral. Para quem ama looks com atitude.', (select id from public.categories where slug = 'vestidos'), null, false, 2, now() - interval '19 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/vestido-longo-caveira-marinho.jpg', 0)) as v (path, pos)
where p.slug = 'vestido-longo-caveira-marinho' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Azul-marinho', '#1c2442', 101), ('44', 'Azul-marinho', '#1c2442', 102), ('46', 'Azul-marinho', '#1c2442', 103), ('48', 'Azul-marinho', '#1c2442', 104), ('50', 'Azul-marinho', '#1c2442', 105), ('52', 'Azul-marinho', '#1c2442', 106), ('54', 'Azul-marinho', '#1c2442', 107)) as v (size, color, hex, pos)
where p.slug = 'vestido-longo-caveira-marinho'
on conflict (product_id, size, color) do nothing;

-- Conjunto Blusa Caveira e Calça Cargo
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'conjunto-caveira-cargo', 'Conjunto Blusa Caveira e Calça Cargo', 'Blusa preta com caveira em brilho e calça cargo com zíper e bolsos laterais.', (select id from public.categories where slug = 'conjuntos'), null, false, 2, now() - interval '20 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/conjunto-caveira-cargo.jpg', 0)) as v (path, pos)
where p.slug = 'conjunto-caveira-cargo' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Preto', '#161314', 101), ('44', 'Preto', '#161314', 102), ('46', 'Preto', '#161314', 103), ('48', 'Preto', '#161314', 104), ('50', 'Preto', '#161314', 105), ('52', 'Preto', '#161314', 106), ('54', 'Preto', '#161314', 107)) as v (size, color, hex, pos)
where p.slug = 'conjunto-caveira-cargo'
on conflict (product_id, size, color) do nothing;

-- Conjunto Colete e Bermuda de Linho
insert into public.products (slug, name, description, category_id, tag, featured, min_stock, created_at)
select 'conjunto-colete-bermuda-linho', 'Conjunto Colete e Bermuda de Linho', 'Colete transpassado e bermuda de alfaiataria em linho. Chique para os convites dos dias quentes.', (select id from public.categories where slug = 'conjuntos'), null, false, 2, now() - interval '21 minutes'
on conflict (slug) do nothing;
insert into public.product_images (product_id, path, position)
select p.id, v.path, v.pos from public.products p, (values ('/brand/products/conjunto-colete-bermuda-linho.jpg', 0)) as v (path, pos)
where p.slug = 'conjunto-colete-bermuda-linho' and not exists (select 1 from public.product_images i where i.product_id = p.id);
insert into public.product_variants (product_id, size, color, color_hex, stock, position)
select p.id, v.size, v.color, v.hex, 2, v.pos from public.products p, (values ('42', 'Areia', '#e4d8c6', 101), ('44', 'Areia', '#e4d8c6', 102), ('46', 'Areia', '#e4d8c6', 103), ('48', 'Areia', '#e4d8c6', 104), ('50', 'Areia', '#e4d8c6', 105), ('52', 'Areia', '#e4d8c6', 106), ('54', 'Areia', '#e4d8c6', 107)) as v (size, color, hex, pos)
where p.slug = 'conjunto-colete-bermuda-linho'
on conflict (product_id, size, color) do nothing;

-- Conteúdo do site
insert into public.site_content (key, value) values ('hero', '{"eyebrow":"Nova coleção · Curvy e plus size","title":["Elegância que veste","do 42 ao 54."],"text":"Alfaiataria, vestidos e conjuntos com modelagem pensada para o corpo real. Loja em Curitiba e envio para todo o Brasil.","image":"/brand/products/vestido-longo-pink-halter.jpg","imageSecondary":"/brand/products/camisa-linho-marinho.jpg","imageAlt":"Vestido longo pink com gola halter da KF Moda Plus Size","whatsappButton":"Comprar pelo WhatsApp","whatsappMessage":"Olá! Vim pelo site da KF Moda Plus Size e quero ajuda."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('about', '{"eyebrow":"Sobre a marca","title":"Nossa história","text":"Moda plus size feita em Curitiba para mulheres que não querem se esconder. Modelagem que valoriza o corpo real, tecido que cai bem e o cuidado de quem prova cada peça antes de mostrar para você.","image":"/brand/products/conjunto-trico-chocolate.jpg","values":[{"title":"Corpo real","text":"Modelagem do 42 ao 54 pensada para vestir bem, não para esconder."},{"title":"Conforto","text":"Tecidos que caem bem e acompanham o seu dia inteiro."},{"title":"Atendimento","text":"A gente prova cada peça antes de mostrar e ajuda você a escolher o tamanho certo."}]}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('promo', '{"eyebrow":"Grade completa","title":["Do 42","ao 54"],"text":"Modelagem que valoriza o corpo real em todas as peças. Na dúvida do tamanho, a gente ajuda pelo WhatsApp.","button":"Falar com uma consultora","message":"Olá! Vim pelo site da KF Moda Plus Size e quero ajuda com o tamanho.","image":"/brand/products/vestido-longo-pink-decote-v.jpg"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('contact', '{"whatsapp":"554195385799","instagram":"https://www.instagram.com/kfmodaplussize/","street":"Rua Mauá, 905","district":"","city":"Curitiba","state":"PR","postalCode":"80030-200","hours":[]}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, value) values ('size_guide', '{"note":"Medidas de referência do corpo, em centímetros. Na dúvida entre dois tamanhos, chame a gente no WhatsApp.","rows":[{"size":"42","bust":"96","waist":"80","hip":"104"},{"size":"44","bust":"100","waist":"84","hip":"108"},{"size":"46","bust":"104","waist":"88","hip":"112"},{"size":"48","bust":"110","waist":"94","hip":"118"},{"size":"50","bust":"116","waist":"100","hip":"124"},{"size":"52","bust":"122","waist":"106","hip":"130"},{"size":"54","bust":"128","waist":"112","hip":"136"}]}'::jsonb) on conflict (key) do nothing;

-- Uma avaliação pendente de exemplo, só para testar a moderação (pode excluir no painel)
insert into public.reviews (name, city, rating, comment, status)
select 'Exemplo', 'Curitiba', 5, 'Avaliação de teste: aprove, recuse ou exclua no painel para ver como funciona.', 'pending'
where not exists (select 1 from public.reviews);
