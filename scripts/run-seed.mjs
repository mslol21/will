import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://efcrctysxrwnrwlwriiy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY3JjdHlzeHJ3bnJ3bHdyaWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDc5NDksImV4cCI6MjEwMDQyMzk0OX0.zwxyS0EE9rLjFcvaYS9Trvt53QUdC4T5LjVCvI7dV5s";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CATEGORIES = [
  {
    id: "cafes",
    name: "Cafés Especiais",
    description: "Grãos artesanais torrados com notas de caramelo, chocolate e especiarias da Serra da Mantiqueira.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    icon_name: "Coffee",
    item_count: 8,
  },
  {
    id: "queijos",
    name: "Queijos Artesanais",
    description: "Maturados no mofo branco, Canastra premiados, Serro e queijos de mofo azul de produtores mineiros.",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80",
    icon_name: "Disc",
    item_count: 12,
  },
  {
    id: "doces",
    name: "Doces & Geleias",
    description: "Doce de leite cremoso no tacho de cobre, goiabada cascão e geleias de frutas da estação.",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80",
    icon_name: "Utensils",
    item_count: 10,
  },
  {
    id: "mel",
    name: "Méis & Própolis",
    description: "Mel silvestre puro da Mantiqueira, mel de flor de laranjeira e extratos de própolis verde artesanal.",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
    icon_name: "Droplet",
    item_count: 6,
  },
  {
    id: "biscoitos",
    name: "Biscoito de Polvilho & Broas",
    description: "Receitas de família com polvilho caipira, broa de milho na palha e rosquinhas de canela.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    icon_name: "Cookie",
    item_count: 7,
  },
  {
    id: "cachacas",
    name: "Cachaças de Alambique",
    description: "Envelhecidas em tonéis de carvalho, amburana e balsamão por mestres alambiqueiros.",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80",
    icon_name: "Wine",
    item_count: 9,
  },
  {
    id: "vinhos",
    name: "Vinhos da Serra",
    description: "Rótulos artesanais da dupla poda de altitude da Serra da Mantiqueira.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
    icon_name: "GlassWater",
    item_count: 5,
  },
  {
    id: "cestas",
    name: "Cestas Presente",
    description: "Montagens refinadas em baús de madeira e caixas kraft com os melhores sabores mineiros.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    icon_name: "Gift",
    item_count: 6,
  },
  {
    id: "peregrino",
    name: "Linha Peregrino",
    description: "Terços em madeira nobre, velas de cera de abelha, canecas do peregrino e lembranças de bênção.",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
    icon_name: "Sparkles",
    item_count: 11,
  },
];

const PRODUCTS = [
  {
    slug: "cafe-graos-reserva-mantiqueira",
    name: "Café Especial Reserva Mantiqueira 500g",
    short_description: "100% Arábica, nota 88+ SCAA. Notas sensoriais de melaço de cana, avelã e acidez cítrica suave.",
    full_description: "Cultivado a mais de 1.300 metros de altitude na Serra da Mantiqueira. Passa por colheita seletiva manual e secagem em terreiro suspenso.",
    price: 48.90,
    original_price: 56.00,
    category: "cafes",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
    weight: "500g",
    origin: "Carmo de Minas - MG",
    sku: "CAF-MAN-500",
    stock: 24,
    rating: 4.9,
    review_count: 38,
    is_active: true,
  },
  {
    slug: "queijo-canastra-real-maturado",
    name: "Queijo Canastra Real Maturado Ouro",
    short_description: "Queijo artesanal de leite cru de vaca, maturado por 45 dias no mofo branco natural.",
    full_description: "Produzido na microrregião da Serra da Canastra com o autêntico pingo ancestral. Possui casca amarelada levemente florada.",
    price: 89.00,
    original_price: 98.00,
    category: "queijos",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
    weight: "Peça inteira (~800g)",
    origin: "São Roque de Minas - MG",
    sku: "QJO-CAN-OURO",
    stock: 15,
    rating: 5.0,
    review_count: 42,
    is_active: true,
  },
  {
    slug: "doce-de-leite-vicosa-reserva",
    name: "Doce de Leite no Tacho de Cobre 650g",
    short_description: "Cremoso, feito lentamente no tacho de cobre caipira sem aditivos químicos.",
    full_description: "A receita tradicional da vovó mineira. Cozido por horas em fogo brando de lenha com leite fresco da fazenda.",
    price: 34.50,
    category: "doces",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=1000&q=80",
    weight: "650g",
    origin: "Viçosa - MG",
    sku: "DOC-LEI-650",
    stock: 30,
    rating: 4.8,
    review_count: 29,
    is_active: true,
  },
  {
    slug: "terco-madeira-imbuia-caminho-da-fe",
    name: "Terço do Peregrino em Madeira Imbuia",
    short_description: "Contas esculpidas em imbuia nobre com medalha oficial do Caminho da Fé banhada em bronze antigo.",
    full_description: "Criado especialmente para acompanhar o peregrino durante sua jornada de fé e reflexão. Cordão trançado ultra resistente.",
    price: 65.00,
    category: "peregrino",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
    weight: "80g",
    origin: "Artesanato Local - MG",
    sku: "PER-TER-IMB",
    stock: 50,
    rating: 5.0,
    review_count: 67,
    is_active: true,
  },
  {
    slug: "mel-silvestre-puro-mantiqueira-500g",
    name: "Mel Silvestre Puro da Mantiqueira 500g",
    short_description: "Extraído de floradas silvestres das montanhas, sem filtração pesada ou pasteurização.",
    full_description: "Mel 100% puro com textura aveludada e notas florais ricas em propriedades medicinais.",
    price: 38.00,
    category: "mel",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80",
    weight: "500g",
    origin: "Passa Quatro - MG",
    sku: "MEL-SIL-500",
    stock: 22,
    rating: 4.9,
    review_count: 18,
    is_active: true,
  },
  {
    slug: "cachaca-amburana-reserva-ouro",
    name: "Cachaça de Alambique Reserva Amburana 750ml",
    short_description: "Envelhecida por 3 anos em barris de Amburana. Toque aveludado com notas de baunilha e canela.",
    full_description: "Destilada em alambique de cobre tradicional a partir da garapa de canas selecionadas.",
    price: 115.00,
    original_price: 130.00,
    category: "cachacas",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1000&q=80",
    weight: "1.2kg",
    origin: "Salinas - MG",
    sku: "CAC-AMB-750",
    stock: 18,
    rating: 4.9,
    review_count: 25,
    is_active: true,
  },
  {
    slug: "caneca-esmaltada-caminho-da-fe",
    name: "Caneca Esmaltada Rústica 'O Caminho Cura'",
    short_description: "Caneca de ágata tradicional mineira em tom azul marinho com frases gravadas em dourado.",
    full_description: "Ideal para tomar aquele café recém-passado na beira do fogão a lenha.",
    price: 42.00,
    category: "peregrino",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
    weight: "200g",
    origin: "Andradas - MG",
    sku: "PER-CAN-AGATA",
    stock: 40,
    rating: 4.8,
    review_count: 31,
    is_active: true,
  },
  {
    slug: "vela-aromatica-cera-abelha-mel-canela",
    name: "Vela Aromática de Cera de Abelha & Canela",
    short_description: "Produzida com cera pura de abelha e óleos essenciais de canela e baunilha.",
    full_description: "Ilumina com chama aquecida e exala um perfume natural acolhedor.",
    price: 45.00,
    category: "peregrino",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80",
    weight: "220g",
    origin: "Ateliê Mantiqueira - MG",
    sku: "PER-VEL-MEL",
    stock: 28,
    rating: 5.0,
    review_count: 19,
    is_active: true,
  },
];

async function seed() {
  console.log("🌱 Inserindo Categorias no Supabase...");
  const { data: catData, error: catError } = await supabase
    .from("categorias")
    .upsert(CATEGORIES, { onConflict: "id" });
  if (catError) console.error("Erro em categorias:", catError);
  else console.log("✅ Categorias inseridas!");

  console.log("🌱 Inserindo Produtos no Supabase...");
  const { data: prodData, error: prodError } = await supabase
    .from("produtos")
    .upsert(PRODUCTS, { onConflict: "slug" });
  if (prodError) console.error("Erro em produtos:", prodError);
  else console.log("✅ Produtos inseridos!");
}

seed();
