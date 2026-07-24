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

alter table public.lancamentos_financeiros enable row level security;
alter table public.pedidos enable row level security;

create policy "anon_select_financeiro" on public.lancamentos_financeiros for select using (true);
create policy "anon_insert_financeiro" on public.lancamentos_financeiros for insert with check (true);
create policy "anon_select_pedidos" on public.pedidos for select using (true);
create policy "anon_insert_pedidos" on public.pedidos for insert with check (true);
