create table if not exists public.pedidos_oracao (
  id uuid default gen_random_uuid() primary key,
  nome text default 'Anonimo',
  oracao text not null,
  status text default 'recebido',
  created_at timestamp with time zone default now()
);

create table if not exists public.categorias (
  id text primary key,
  name text not null,
  description text,
  image text,
  icon_name text,
  item_count int default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.produtos (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  short_description text,
  full_description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  category text references public.categorias(id) on delete set null,
  image text,
  gallery jsonb default '[]'::jsonb,
  weight text,
  origin text,
  sku text unique,
  stock int default 0,
  rating numeric(3,2) default 5.0,
  review_count int default 1,
  badges jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.cestas (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  image text,
  included_items jsonb default '[]'::jsonb,
  container_type text,
  available boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.lancamentos_financeiros (
  id uuid default gen_random_uuid() primary key,
  tipo text not null check (tipo in ('receita','custo','despesa')),
  descricao text not null,
  valor numeric(10,2) not null,
  data date default current_date,
  categoria text,
  created_at timestamp with time zone default now()
);

create table if not exists public.pedidos (
  id uuid default gen_random_uuid() primary key,
  nome_cliente text,
  telefone text,
  itens jsonb default '[]'::jsonb,
  total numeric(10,2),
  status text default 'pendente',
  mensagem text,
  created_at timestamp with time zone default now()
);

alter table public.pedidos_oracao enable row level security;
alter table public.categorias enable row level security;
alter table public.produtos enable row level security;
alter table public.cestas enable row level security;
alter table public.lancamentos_financeiros enable row level security;
alter table public.pedidos enable row level security;

create policy "anon_select_oracao" on public.pedidos_oracao for select using (true);
create policy "anon_insert_oracao" on public.pedidos_oracao for insert with check (true);
create policy "anon_select_categorias" on public.categorias for select using (true);
create policy "anon_insert_categorias" on public.categorias for insert with check (true);
create policy "anon_update_categorias" on public.categorias for update using (true);
create policy "anon_select_produtos" on public.produtos for select using (true);
create policy "anon_insert_produtos" on public.produtos for insert with check (true);
create policy "anon_update_produtos" on public.produtos for update using (true);
create policy "anon_delete_produtos" on public.produtos for delete using (true);
create policy "anon_select_cestas" on public.cestas for select using (true);
create policy "anon_insert_cestas" on public.cestas for insert with check (true);
create policy "anon_select_pedidos" on public.pedidos for select using (true);
create policy "anon_insert_pedidos" on public.pedidos for insert with check (true);
create policy "anon_select_financeiro" on public.lancamentos_financeiros for select using (true);
create policy "anon_insert_financeiro" on public.lancamentos_financeiros for insert with check (true);

insert into public.categorias (id, name, description, image, icon_name, item_count) values
('cafes', 'Cafes Especiais', 'Graos artesanais torrados com notas de caramelo e avela.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', 'Coffee', 8),
('queijos', 'Queijos Artesanais', 'Canastra maturados no mofo branco de leite cru.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80', 'Disc', 12),
('doces', 'Doces e Geleias', 'Doce de leite no tacho de cobre e goiabada cascao.', 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80', 'Utensils', 10),
('mel', 'Meis e Propolis', 'Mel silvestre puro da Mantiqueira e extratos de propolis.', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80', 'Droplet', 6),
('biscoitos', 'Biscoito de Polvilho', 'Receitas de familia com polvilho caipira e rosquinhas.', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80', 'Cookie', 7),
('cachacas', 'Cachacas de Alambique', 'Envelhecidas em toneis de carvalho e amburana.', 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80', 'Wine', 9),
('vinhos', 'Vinhos da Serra', 'Rotulos artesanais de altitude da Serra da Mantiqueira.', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80', 'GlassWater', 5),
('cestas', 'Cestas Presente', 'Montagens refinadas em baus de madeira e caixas kraft.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', 'Gift', 6),
('peregrino', 'Linha Peregrino', 'Tercos em imbuia, velas de cera de abelha e canecas.', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80', 'Sparkles', 11)
on conflict (id) do nothing;

insert into public.produtos (slug, name, short_description, price, category, image, weight, origin, sku, stock, rating, review_count, is_active) values
('cafe-reserva-mantiqueira', 'Cafe Especial Reserva Mantiqueira 500g', '100% Arabica, nota 88+ SCAA. Notas de melaco de cana e avela.', 48.90, 'cafes', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80', '500g', 'Carmo de Minas - MG', 'CAF-MAN-500', 24, 4.9, 38, true),
('queijo-canastra-maturado', 'Queijo Canastra Real Maturado Ouro', 'Queijo artesanal de leite cru maturado por 45 dias.', 89.00, 'queijos', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80', 'Peca inteira (~800g)', 'Sao Roque de Minas - MG', 'QJO-CAN-OURO', 15, 5.0, 42, true),
('doce-de-leite-tacho-cobre', 'Doce de Leite no Tacho de Cobre 650g', 'Cremoso, feito lentamente no tacho de cobre caipira.', 34.50, 'doces', 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=1000&q=80', '650g', 'Vicosa - MG', 'DOC-LEI-650', 30, 4.8, 29, true),
('mel-silvestre-puro', 'Mel Silvestre Puro da Mantiqueira 500g', 'Extraido de floradas silvestres das montanhas.', 38.00, 'mel', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80', '500g', 'Passa Quatro - MG', 'MEL-SIL-500', 22, 4.9, 18, true),
('terco-madeira-imbuia', 'Terco do Peregrino em Madeira Imbuia', 'Contas esculpidas em imbuia nobre com medalha do Caminho da Fe.', 65.00, 'peregrino', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80', '80g', 'Artesanato Local - MG', 'PER-TER-IMB', 50, 5.0, 67, true),
('cachaca-amburana-reserva', 'Cachaca de Alambique Reserva Amburana 750ml', 'Envelhecida por 3 anos em barris de Amburana.', 115.00, 'cachacas', 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1000&q=80', '1.2kg', 'Salinas - MG', 'CAC-AMB-750', 18, 4.9, 25, true)
on conflict (slug) do nothing;
