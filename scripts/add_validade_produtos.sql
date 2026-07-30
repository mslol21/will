-- Adiciona a coluna de validade na tabela de produtos
ALTER TABLE public.produtos
ADD COLUMN validade DATE;
