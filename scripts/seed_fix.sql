-- PASSO 1: Adicionar policies que podem ter faltado no primeiro script
-- Cole este SQL no Supabase Dashboard > SQL Editor > Run

-- Recriar policies de leitura (DROP IF EXISTS para evitar erro se já existirem)
drop policy if exists "anon_select_categorias" on public.categorias;
drop policy if exists "anon_insert_categorias" on public.categorias;
drop policy if exists "anon_update_categorias" on public.categorias;
drop policy if exists "anon_select_produtos" on public.produtos;
drop policy if exists "anon_insert_produtos" on public.produtos;
drop policy if exists "anon_update_produtos" on public.produtos;
drop policy if exists "anon_delete_produtos" on public.produtos;
drop policy if exists "anon_select_cestas" on public.cestas;

create policy "anon_select_categorias" on public.categorias for select using (true);
create policy "anon_insert_categorias" on public.categorias for insert with check (true);
create policy "anon_update_categorias" on public.categorias for update using (true);
create policy "anon_select_produtos" on public.produtos for select using (true);
create policy "anon_insert_produtos" on public.produtos for insert with check (true);
create policy "anon_update_produtos" on public.produtos for update using (true);
create policy "anon_delete_produtos" on public.produtos for delete using (true);
create policy "anon_select_cestas" on public.cestas for select using (true);
create policy "anon_insert_cestas" on public.cestas for insert with check (true);

-- PASSO 2: Inserir categorias (seed real)
insert into public.categorias (id, name, description, image, icon_name, item_count) values
('cafes', 'Cafes Especiais', 'Graos artesanais torrados com notas de caramelo e avela da Serra da Mantiqueira.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', 'Coffee', 8),
('queijos', 'Queijos Artesanais', 'Canastra premiados maturados no mofo branco de leite cru de produtores mineiros.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80', 'Disc', 12),
('doces', 'Doces e Geleias', 'Doce de leite cremoso no tacho de cobre, goiabada cascao e geleias da estacao.', 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80', 'Utensils', 10),
('mel', 'Meis e Propolis', 'Mel silvestre puro da Mantiqueira, mel de flor de laranjeira e extratos de propolis verde.', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80', 'Droplet', 6),
('biscoitos', 'Biscoito de Polvilho', 'Receitas de familia com polvilho caipira, broa de milho na palha e rosquinhas de canela.', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80', 'Cookie', 7),
('cachacas', 'Cachacas de Alambique', 'Envelhecidas em toneis de carvalho, amburana e balsamao por mestres alambiqueiros.', 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80', 'Wine', 9),
('vinhos', 'Vinhos da Serra', 'Rotulos artesanais da dupla poda de altitude da Serra da Mantiqueira.', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80', 'GlassWater', 5),
('cestas', 'Cestas Presente', 'Montagens refinadas em baus de madeira e caixas kraft com os melhores sabores mineiros.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', 'Gift', 6),
('peregrino', 'Linha Peregrino', 'Tercos em madeira nobre, velas de cera de abelha, canecas do peregrino e lembrancas.', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80', 'Sparkles', 11)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  icon_name = excluded.icon_name,
  item_count = excluded.item_count;

-- PASSO 3: Inserir produtos reais
insert into public.produtos (slug, name, short_description, full_description, price, original_price, category, image, weight, origin, sku, stock, rating, review_count, is_active) values
('cafe-reserva-mantiqueira-500g', 'Cafe Especial Reserva Mantiqueira 500g', '100% Arabica, nota 88+ SCAA. Notas de melaco de cana, avela e acidez citrica suave.', 'Cultivado a mais de 1.300 metros de altitude na Serra da Mantiqueira. Colheita seletiva manual e secagem em terreiro suspenso.', 48.90, 56.00, 'cafes', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80', '500g', 'Carmo de Minas - MG', 'CAF-MAN-500', 24, 4.9, 38, true),
('queijo-canastra-maturado-ouro', 'Queijo Canastra Real Maturado Ouro', 'Queijo artesanal de leite cru de vaca, maturado por 45 dias no mofo branco natural.', 'Produzido na microrregiao da Serra da Canastra com o pingo ancestral. Casca amarelada levemente florada, massa macia e sabor picante.', 89.00, 98.00, 'queijos', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80', 'Peca inteira (~800g)', 'Sao Roque de Minas - MG', 'QJO-CAN-OURO', 15, 5.0, 42, true),
('doce-de-leite-tacho-de-cobre-650g', 'Doce de Leite no Tacho de Cobre 650g', 'Cremoso, feito lentamente no tacho de cobre caipira sem aditivos quimicos.', 'Receita tradicional cozida por horas em fogo brando de lenha com leite fresco da fazenda e toque de baunilha natural.', 34.50, null, 'doces', 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=1000&q=80', '650g', 'Vicosa - MG', 'DOC-LEI-650', 30, 4.8, 29, true),
('mel-silvestre-puro-mantiqueira-500g', 'Mel Silvestre Puro da Mantiqueira 500g', 'Extraido de floradas silvestres das montanhas, sem filtracao pesada ou pasteurizacao.', 'Mel 100% puro com textura aveludada e notas florais ricas em propriedades medicinais e antioxidantes naturais.', 38.00, null, 'mel', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80', '500g', 'Passa Quatro - MG', 'MEL-SIL-500', 22, 4.9, 18, true),
('terco-do-peregrino-imbuia', 'Terco do Peregrino em Madeira Imbuia', 'Contas esculpidas em imbuia nobre com medalha oficial do Caminho da Fe banhada em bronze.', 'Criado especialmente para acompanhar o peregrino durante a jornada de fe e reflexao. Cordao trancado ultra resistente.', 65.00, null, 'peregrino', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80', '80g', 'Artesanato Local - MG', 'PER-TER-IMB', 50, 5.0, 67, true),
('cachaca-amburana-reserva-750ml', 'Cachaca de Alambique Reserva Amburana 750ml', 'Envelhecida por 3 anos em barris de Amburana. Toque aveludado com notas de baunilha e canela.', 'Destilada em alambique de cobre tradicional a partir da garapa de canas selecionadas. Visual dourado intenso.', 115.00, 130.00, 'cachacas', 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1000&q=80', '750ml', 'Salinas - MG', 'CAC-AMB-750', 18, 4.9, 25, true),
('caneca-esmaltada-o-caminho-cura', 'Caneca Esmaltada Rustica O Caminho Cura', 'Caneca de agata tradicional mineira em tom azul marinho com frases gravadas em dourado.', 'Ideal para tomar cafe recen-passado na beira do fogao a lenha ou durante as pausas na trilha do peregrino.', 42.00, null, 'peregrino', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80', '200g', 'Andradas - MG', 'PER-CAN-AGATA', 40, 4.8, 31, true),
('vela-aromatica-cera-abelha-canela', 'Vela Aromatica de Cera de Abelha e Canela', 'Produzida com cera pura de abelha e oleos essenciais de canela e baunilha.', 'Ilumina com chama aquecida e exala um perfume natural acolhedor que acalma a mente e o ambiente.', 45.00, null, 'peregrino', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80', '220g', 'Atelie Mantiqueira - MG', 'PER-VEL-MEL', 28, 5.0, 19, true)
on conflict (slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  price = excluded.price,
  stock = excluded.stock,
  is_active = excluded.is_active;
