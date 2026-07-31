-- EMPÓRIO CAMINHO DA FÉ V2.0 - FASE 6: COMPRAS E FORNECEDORES

-- 1. Fornecedores
CREATE TABLE IF NOT EXISTS public.fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT,
    cnpj TEXT UNIQUE,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Pedidos de Compra
CREATE TABLE IF NOT EXISTS public.pedidos_compra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE CASCADE,
    responsavel_id UUID REFERENCES public.perfis(id),
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'recebido', 'cancelado')),
    valor_total NUMERIC(10,2) DEFAULT 0,
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    data_recebimento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Itens do Pedido de Compra
CREATE TABLE IF NOT EXISTS public.itens_pedido_compra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_compra_id UUID REFERENCES public.pedidos_compra(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    custo_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Alteração na tabela de Produtos para controlar Custo Médio
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS custo_medio NUMERIC(10,2) DEFAULT 0;

-- 5. Row Level Security (RLS)
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pedido_compra ENABLE ROW LEVEL SECURITY;

-- Políticas para Fornecedores
CREATE POLICY "Admins e Gerentes gerenciam fornecedores" ON public.fornecedores 
FOR ALL USING (public.get_user_role() IN ('admin', 'gerente'));

-- Políticas para Pedidos de Compra
CREATE POLICY "Admins e Gerentes gerenciam compras" ON public.pedidos_compra 
FOR ALL USING (public.get_user_role() IN ('admin', 'gerente'));

-- Políticas para Itens de Pedido de Compra
CREATE POLICY "Admins e Gerentes gerenciam itens de compras" ON public.itens_pedido_compra 
FOR ALL USING (public.get_user_role() IN ('admin', 'gerente'));

-- 6. Trigger para atualizar `updated_at` automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_fornecedores_updated_at ON public.fornecedores;
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pedidos_compra_updated_at ON public.pedidos_compra;
CREATE TRIGGER update_pedidos_compra_updated_at BEFORE UPDATE ON public.pedidos_compra FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
