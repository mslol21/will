-- EMPÓRIO CAMINHO DA FÉ V2.0 - SCHEMA UPDATE

-- 1. Perfis de Usuário (RBAC)
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome TEXT,
    role TEXT NOT NULL DEFAULT 'caixa' CHECK (role IN ('admin', 'gerente', 'caixa')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, email, nome, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nome', COALESCE(new.raw_user_meta_data->>'role', 'caixa'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Clientes (CRM)
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cidade TEXT,
    total_comprado NUMERIC(10, 2) DEFAULT 0,
    is_vip BOOLEAN DEFAULT FALSE,
    ultima_compra TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Movimentação de Estoque
CREATE TABLE IF NOT EXISTS public.movimentacao_estoque (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste')),
    quantidade INTEGER NOT NULL,
    motivo TEXT,
    responsavel_id UUID REFERENCES public.perfis(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Alterações em Pedidos para suportar cliente_id e responsavel_id
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id);
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS responsavel_id UUID REFERENCES public.perfis(id);
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT;

-- 5. Row Level Security (RLS)

-- Função utilitária para verificar role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.perfis WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Ativar RLS
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacao_estoque ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.perfis FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins podem ver todos os perfis" ON public.perfis FOR SELECT USING (public.get_user_role() = 'admin');
CREATE POLICY "Admins podem editar todos os perfis" ON public.perfis FOR UPDATE USING (public.get_user_role() = 'admin');

-- Políticas para clientes
CREATE POLICY "Usuários autenticados podem ver clientes" ON public.clientes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Gerentes e Admins podem inserir clientes" ON public.clientes FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'gerente', 'caixa'));
CREATE POLICY "Gerentes e Admins podem editar clientes" ON public.clientes FOR UPDATE USING (public.get_user_role() IN ('admin', 'gerente'));

-- Políticas para movimentação de estoque
CREATE POLICY "Usuários autenticados podem ver movimentações" ON public.movimentacao_estoque FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer autenticado pode inserir movimentação" ON public.movimentacao_estoque FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Atualizando RLS das tabelas antigas (produtos, categorias, pedidos, lancamentos)
-- Como o RLS anterior era para 'anon' (pois não havia autenticação), precisamos ajustá-lo.
-- Permitir leitura pública de produtos e categorias
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.produtos;
CREATE POLICY "Permitir leitura pública de produtos" ON public.produtos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON public.categorias;
CREATE POLICY "Permitir leitura pública de categorias" ON public.categorias FOR SELECT USING (true);

-- Restringir inserção/edição apenas para autenticados (Admin/Gerente)
DROP POLICY IF EXISTS "Permitir inserção anônima" ON public.produtos;
CREATE POLICY "Gerentes e Admins podem alterar produtos" ON public.produtos FOR ALL USING (public.get_user_role() IN ('admin', 'gerente'));

DROP POLICY IF EXISTS "Permitir inserção anônima" ON public.categorias;
CREATE POLICY "Gerentes e Admins podem alterar categorias" ON public.categorias FOR ALL USING (public.get_user_role() IN ('admin', 'gerente'));

-- Pedidos (O PDV pode inserir e ver)
DROP POLICY IF EXISTS "Permitir inserção anônima" ON public.pedidos;
CREATE POLICY "Autenticados podem inserir e ver pedidos" ON public.pedidos FOR ALL USING (auth.role() = 'authenticated');

-- Lancamentos Financeiros (Apenas admin e gerente podem ver todos. Caixa pode inserir.)
DROP POLICY IF EXISTS "Permitir inserção anônima" ON public.lancamentos_financeiros;
CREATE POLICY "Autenticados podem inserir lançamentos" ON public.lancamentos_financeiros FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Apenas Admin e Gerente podem ver lançamentos" ON public.lancamentos_financeiros FOR SELECT USING (public.get_user_role() IN ('admin', 'gerente'));
