-- EMPÓRIO CAMINHO DA FÉ V2.0 - FIX CESTAS RLS

-- Remover as políticas antigas
DROP POLICY IF EXISTS "anon_select_cestas" ON public.cestas;
DROP POLICY IF EXISTS "anon_insert_cestas" ON public.cestas;
DROP POLICY IF EXISTS "Admins e Gerentes gerenciam cestas" ON public.cestas;

-- Garantir que o RLS está ativado
ALTER TABLE public.cestas ENABLE ROW LEVEL SECURITY;

-- Política 1: Todos (anônimos e autenticados) podem LER as cestas
CREATE POLICY "Leitura publica de cestas" ON public.cestas 
FOR SELECT USING (true);

-- Política 2: Apenas admin e gerente podem criar/editar/deletar cestas
CREATE POLICY "Admins e Gerentes gerenciam cestas" ON public.cestas 
FOR ALL USING (public.get_user_role() IN ('admin', 'gerente'));
