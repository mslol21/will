-- EMPÓRIO CAMINHO DA FÉ V3.0 - SCHEMA UPDATE (Fase 5: CRM & Fidelização)

-- 1. Expansão da tabela de Clientes (CRM)
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS data_nascimento DATE;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS pontos_fidelidade INTEGER DEFAULT 0;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS nivel_cliente TEXT DEFAULT 'Bronze' CHECK (nivel_cliente IN ('Bronze', 'Prata', 'Ouro', 'Diamante'));
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS preferencias_json JSONB DEFAULT '{}'::jsonb;

-- 2. Tabela de Cupons
CREATE TABLE IF NOT EXISTS public.cupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT NOT NULL UNIQUE,
    descricao TEXT,
    tipo_desconto TEXT NOT NULL CHECK (tipo_desconto IN ('percentual', 'fixo')),
    valor_desconto NUMERIC(10, 2) NOT NULL,
    valor_minimo_compra NUMERIC(10, 2) DEFAULT 0,
    limite_uso INTEGER,
    usos_totais INTEGER DEFAULT 0,
    data_validade TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Histórico de Pontos (Fidelização e Cashback)
CREATE TABLE IF NOT EXISTS public.historico_pontos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    pedido_id UUID REFERENCES public.pedidos(id) ON DELETE SET NULL, -- Se vinculado a uma compra específica
    tipo TEXT NOT NULL CHECK (tipo IN ('ganho', 'resgate', 'ajuste', 'expiracao')),
    pontos INTEGER NOT NULL, -- Valores positivos ou negativos
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Alteração no Pedido para registrar Pontos e Cupons utilizados
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS cupom_id UUID REFERENCES public.cupons(id);
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS pontos_ganhos INTEGER DEFAULT 0;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS pontos_resgatados INTEGER DEFAULT 0;

-- 5. Row Level Security (RLS) para novas tabelas

-- Habilitar RLS
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_pontos ENABLE ROW LEVEL SECURITY;

-- Políticas Cupons
CREATE POLICY "Leitura pública de cupons ativos" ON public.cupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins e Gerentes gerenciam cupons" ON public.cupons FOR ALL USING (public.get_user_role() IN ('admin', 'gerente'));

-- Políticas Histórico de Pontos
CREATE POLICY "Leitura autenticada do historico" ON public.historico_pontos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins e Caixas podem inserir pontos" ON public.historico_pontos FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. Trigger para Atualizar Saldo de Pontos do Cliente e Nível
CREATE OR REPLACE FUNCTION public.atualizar_saldo_pontos() 
RETURNS TRIGGER AS $$
DECLARE
    v_total_comprado NUMERIC;
    v_novo_nivel TEXT;
BEGIN
    -- Atualiza saldo de pontos
    UPDATE public.clientes 
    SET pontos_fidelidade = (SELECT COALESCE(SUM(pontos), 0) FROM public.historico_pontos WHERE cliente_id = NEW.cliente_id)
    WHERE id = NEW.cliente_id;
    
    -- Atualiza Nível do Cliente baseado no total comprado (Regra de Negócio: a cada R$ 500 sobe de nível)
    SELECT total_comprado INTO v_total_comprado FROM public.clientes WHERE id = NEW.cliente_id;
    
    IF v_total_comprado >= 5000 THEN
        v_novo_nivel := 'Diamante';
    ELSIF v_total_comprado >= 2000 THEN
        v_novo_nivel := 'Ouro';
    ELSIF v_total_comprado >= 500 THEN
        v_novo_nivel := 'Prata';
    ELSE
        v_novo_nivel := 'Bronze';
    END IF;

    UPDATE public.clientes SET nivel_cliente = v_novo_nivel WHERE id = NEW.cliente_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_atualiza_pontos ON public.historico_pontos;
CREATE TRIGGER trigger_atualiza_pontos
AFTER INSERT OR UPDATE OR DELETE ON public.historico_pontos
FOR EACH ROW EXECUTE PROCEDURE public.atualizar_saldo_pontos();
