import { Category, Product, GiftBasket, Testimonial, TimelineEvent, StoreSettings } from "@/types";

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: "Empório Caminho da Fé",
  subtitle: "Sabores de Minas. Presentes para sua caminhada.",
  whatsappNumber: "5535999887766",
  whatsappFormatted: "(35) 99988-7766",
  instagram: "@emporiocaminhodafe",
  facebook: "emporiocaminhodafe",
  address: "Rua Direita da Serra, 142 - Centro Histórico",
  cityState: "Águas da Prata / Andradas - MG",
  phone: "(35) 3731-1290",
  email: "contato@caminhodafeemporio.com.br",
  businessHours: {
    weekdays: "08:00 - 19:00",
    saturday: "08:00 - 20:00",
    sunday: "07:30 - 18:00",
  },
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3695.123456789!2d-46.6333!3d-22.0167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDAxJzAwLjAiUyA0NsKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr",
  googleMapsDirectUrl: "https://maps.google.com/?q=Emporio+Caminho+da+Fe",
  metaPixelId: "FB-998877665544",
  googleAnalyticsId: "G-EMPFE12345",
};

export const CATEGORIES: Category[] = [
  {
    id: "cafes",
    name: "Cafés Especiais",
    description: "Grãos artesanais torrados com notas de caramelo, chocolate e especiarias da Serra da Mantiqueira.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    iconName: "Coffee",
    itemCount: 8,
  },
  {
    id: "queijos",
    name: "Queijos Artesanais",
    description: "Maturados no mofo branco, Canastra premiados, Serro e queijos de mofo azul de produtores mineiros.",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80",
    iconName: "Disc",
    itemCount: 12,
  },
  {
    id: "doces",
    name: "Doces & Geleias",
    description: "Doce de leite cremoso no tacho de cobre, goiabada cascão e geleias de frutas da estação.",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80",
    iconName: "Utensils",
    itemCount: 10,
  },
  {
    id: "mel",
    name: "Méis & Própolis",
    description: "Mel silvestre puro da Mantiqueira, mel de flor de laranjeira e extratos de própolis verde artesanal.",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
    iconName: "Droplet",
    itemCount: 6,
  },
  {
    id: "biscoitos",
    name: "Biscoito de Polvilho & Broas",
    description: "Receitas de família com polvilho caipira, broa de milho na palha e rosquinhas de canela.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    iconName: "Cookie",
    itemCount: 7,
  },
  {
    id: "cachacas",
    name: "Cachaças de Alambique",
    description: "Envelhecidas em tonéis de carvalho, amburana e balsamão por mestres alambiqueiros.",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80",
    iconName: "Wine",
    itemCount: 9,
  },
  {
    id: "vinhos",
    name: "Vinhos da Serra",
    description: "Rótulos artesanais da dupla poda de altitude da Serra da Mantiqueira.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
    iconName: "GlassWater",
    itemCount: 5,
  },
  {
    id: "cestas",
    name: "Cestas Presente",
    description: "Montagens refinadas em baús de madeira e caixas kraft com os melhores sabores mineiros.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    iconName: "Gift",
    itemCount: 6,
  },
  {
    id: "peregrino",
    name: "Linha Peregrino",
    description: "Terços em madeira nobre, velas de cera de abelha, canecas do peregrino e lembranças de bênção.",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
    iconName: "Sparkles",
    itemCount: 11,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "cafe-graos-reserva-mantiqueira",
    name: "Café Especial Reserva Mantiqueira 500g",
    shortDescription: "100% Arábica, nota 88+ SCAA. Notas sensoriais de melaço de cana, avelã e acidez cítrica suave.",
    fullDescription: "Cultivado a mais de 1.300 metros de altitude na Serra da Mantiqueira. Passa por colheita seletiva manual e secagem em terreiro suspenso. Um café encorpado, de aroma inebriante, perfeito para momentos de contemplação.",
    price: 48.90,
    originalPrice: 56.00,
    category: "cafes",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "500g",
    origin: "Carmo de Minas - MG (Mantiqueira)",
    sku: "CAF-MAN-500",
    stock: 24,
    rating: 4.9,
    reviewCount: 38,
    badges: [
      { type: "mais-vendido", label: "Mais Vendido" },
      { type: "artesanal", label: "Edição Limitada" }
    ],
    ingredients: "Grãos de café 100% Arábica torrados artesanalmente.",
    nutrition: {
      servingSize: "100ml de bebida (sem açúcar)",
      calories: "2 kcal",
      carbs: "0.3g",
      protein: "0.2g",
      fat: "0g",
      sodium: "0mg"
    },
    featured: true,
    isActive: true,
  },
  {
    id: "prod-2",
    slug: "queijo-canastra-real-maturado",
    name: "Queijo Canastra Real Maturado Ouro",
    shortDescription: "Queijo artesanal de leite cru de vaca, maturado por 45 dias no mofo branco natural.",
    fullDescription: "Produzido na microrregião da Serra da Canastra com o autêntico 'pingo' ancestral. Possui casca amarelada levemente florada, massa macia, sabor picante e amanteigado inconfundível.",
    price: 89.00,
    originalPrice: 98.00,
    category: "queijos",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "Peça inteira (~800g)",
    origin: "São Roque de Minas - MG (Canastra)",
    sku: "QJO-CAN-OURO",
    stock: 15,
    rating: 5.0,
    reviewCount: 42,
    badges: [
      { type: "mais-vendido", label: "Medalha de Ouro" },
      { type: "artesanal", label: "Leite Cru" }
    ],
    ingredients: "Leite cru integral de vaca, pingo natural, coalho e sal marítimo.",
    featured: true,
    isActive: true,
  },
  {
    id: "prod-3",
    slug: "doce-de-leite-viçosa-reserva",
    name: "Doce de Leite no Tacho de Cobre 650g",
    shortDescription: "Cremoso, feito lentamente no tacho de cobre caipira sem aditivos químicos.",
    fullDescription: "A receita tradicional da vovó mineira. Cozido por horas em fogo brando de lenha com leite fresco da fazenda e toque sutil de baunilha natural. Derrete na boca.",
    price: 34.50,
    category: "doces",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "650g",
    origin: "Viçosa - MG",
    sku: "DOC-LEI-650",
    stock: 30,
    rating: 4.8,
    reviewCount: 29,
    badges: [
      { type: "novo", label: "Receita Tradicional" }
    ],
    ingredients: "Leite integral, açúcar orgânico, bicarbonato de sódio.",
    featured: true,
    isActive: true,
  },
  {
    id: "prod-4",
    slug: "terco-madeira-imbuia-caminho-da-fe",
    name: "Terço do Peregrino em Madeira Imbuia",
    shortDescription: "Contas esculpidas em imbuia nobre com medalha oficial do Caminho da Fé banhada em bronze antigo.",
    fullDescription: "Criado especialmente para acompanhar o peregrino durante sua jornada de fé e reflexão. Cordão trançado ultra resistente, perfeito para carregar no bolso ou mochila de caminhada.",
    price: 65.00,
    category: "peregrino",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "80g",
    origin: "Artesanato Local - MG",
    sku: "PER-TER-IMB",
    stock: 50,
    rating: 5.0,
    reviewCount: 67,
    badges: [
      { type: "peregrino", label: "Edição Peregrino" },
      { type: "mais-vendido", label: "Abençoado" }
    ],
    featured: true,
    isPeregrino: true,
    isActive: true,
  },
  {
    id: "prod-5",
    slug: "mel-silvestre-puro-mantiqueira-500g",
    name: "Mel Silvestre Puro da Mantiqueira 500g",
    shortDescription: "Extraído de floradas silvestres das montanhas, sem filtração pesada ou pasteurização.",
    fullDescription: "Mel 100% puro com textura aveludada e notas florais ricas em propriedades medicinais e antioxidantes naturais.",
    price: 38.00,
    category: "mel",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "500g",
    origin: "Passa Quatro - MG",
    sku: "MEL-SIL-500",
    stock: 22,
    rating: 4.9,
    reviewCount: 18,
    badges: [
      { type: "artesanal", label: "100% Puro" }
    ],
    featured: false,
    isActive: true,
  },
  {
    id: "prod-6",
    slug: "cachaca-amburana-reserva-ouro",
    name: "Cachaça de Alambique Reserva Amburana 750ml",
    shortDescription: "Envelhecida por 3 anos em barris de Amburana. Toque aveludado com notas de baunilha e canela.",
    fullDescription: "Destilada em alambique de cobre tradicional a partir da garapa de canas selecionadas. Visual dourado intenso e retrogosto macio e persistente.",
    price: 115.00,
    originalPrice: 130.00,
    category: "cachacas",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "1.2kg (com garrafa)",
    origin: "Salinas - MG",
    sku: "CAC-AMB-750",
    stock: 18,
    rating: 4.9,
    reviewCount: 25,
    badges: [
      { type: "promocao", label: "Oferta Especial" },
      { type: "artesanal", label: "Premiação Salinas" }
    ],
    featured: true,
    isActive: true,
  },
  {
    id: "prod-7",
    slug: "caneca-esmaltada-caminho-da-fe",
    name: "Caneca Esmaltada Rustica 'O Caminho Cura'",
    shortDescription: "Caneca de ágata tradicional mineira em tom azul marinho com frases gravadas em dourado.",
    fullDescription: "Ideal para tomar aquele café recém-passado na beira do fogão a lenha ou durante as pausas na trilha do peregrino.",
    price: 42.00,
    category: "peregrino",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "200g",
    origin: "Andradas - MG",
    sku: "PER-CAN-AGATA",
    stock: 40,
    rating: 4.8,
    reviewCount: 31,
    badges: [
      { type: "peregrino", label: "Coleção Caminho" }
    ],
    featured: false,
    isPeregrino: true,
    isActive: true,
  },
  {
    id: "prod-8",
    slug: "vela-aromatica-cera-abelha-mel-canela",
    name: "Vela Aromática de Cera de Abelha & Canela",
    shortDescription: "Produzida com cera pura de abelha e óleos essenciais de canela e baunilha.",
    fullDescription: "Ilumina com chama aquecida e exala um perfume natural acolhedor que acalma a mente e o ambiente.",
    price: 45.00,
    category: "peregrino",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80"
    ],
    weight: "220g",
    origin: "Ateliê Mantiqueira - MG",
    sku: "PER-VEL-MEL",
    stock: 28,
    rating: 5.0,
    reviewCount: 19,
    badges: [
      { type: "artesanal", label: "Feito à Mão" }
    ],
    featured: false,
    isPeregrino: true,
    isActive: true,
  },
];

export const MOCK_GIFT_BASKETS: GiftBasket[] = [
  {
    id: "bask-1",
    slug: "cesta-sabores-da-mantiqueira",
    name: "Cesta Premium Sabores da Mantiqueira",
    description: "Uma seleção impecável para quem ama o conforto de um café da manhã nas montanhas de Minas.",
    price: 249.00,
    originalPrice: 280.00,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
    includedItems: [
      "Café Especial Reserva Mantiqueira 500g",
      "Queijo Canastra Real Maturado (Meia Peça)",
      "Doce de Leite no Tacho de Cobre 650g",
      "Mel Silvestre Puro 500g",
      "Biscoito Caseiro de Polvilho Caipira 200g",
      "Baú Luxo de Madeira Trabalhada & Cartão Personalizado"
    ],
    containerType: "bau-madeira",
    isCustomizable: true,
    featured: true,
    available: true,
  },
  {
    id: "bask-2",
    slug: "cesta-bencao-do-peregrino",
    name: "Cesta Especial Benção do Peregrino",
    description: "União harmônica entre a espiritualidade e o aconchego gastronômico mineiro.",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
    includedItems: [
      "Terço em Madeira Imbuia com Medalha",
      "Caneca Esmaltada 'O Caminho Cura'",
      "Café Especial Gourmet 250g",
      "Broa de Milho Tradicional na Palha",
      "Vela Aromática de Cera de Abelha",
      "Caixa Kraft Festiva com Fita de Cetim e Ramos de Alecrim"
    ],
    containerType: "caixa-kraft",
    isCustomizable: true,
    featured: true,
    available: true,
  },
  {
    id: "bask-3",
    slug: "cesta-noite-mineira-queijos-vinhos",
    name: "Cesta Noite Mineira: Queijos & Vinho da Serra",
    description: "Ideal para celebrações especiais a dois com aperitivos finos artesanais.",
    price: 298.00,
    originalPrice: 325.00,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80",
    includedItems: [
      "Vinho Syrah de Altitude da Serra 750ml",
      "Queijo Canastra Maturado Peça Inteira",
      "Geleia Artesanal de Pimenta com Goiaba 240g",
      "Cachaça Envelhecida em Amburana 250ml",
      "Cesta de Palha Trançada Artesanalmente com Forro de Chita"
    ],
    containerType: "cesta-palha",
    isCustomizable: true,
    featured: true,
    available: true,
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Dra. Maria Aparecida Ribeiro",
    city: "São Paulo / SP",
    role: "Peregrina e Apaixonada por Minas",
    rating: 5,
    comment: "Conheci a loja física durante a minha caminhada até Aparecida. A recepção do Empório foi um verdadeiro alento para a alma! Comprei a Cesta Sabores da Mantiqueira e até hoje peço pelo WhatsApp. Chega impecável em SP!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    date: "Junho de 2026",
  },
  {
    id: "test-2",
    name: "Carlos Eduardo Silveira",
    city: "Campinas / SP",
    role: "Apreciador de Cafés Especiais",
    rating: 5,
    comment: "O Café Reserva Mantiqueira é de outro mundo! Notas sensoriais incríveis e torra recente. E a embalagem artesanal do presente fez o maior sucesso com minha família.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    date: "Maio de 2026",
  },
  {
    id: "test-3",
    name: "Luciana & Roberto Mendes",
    city: "Belo Horizonte / MG",
    role: "Turistas",
    rating: 5,
    comment: "Atendimento caloroso, queijos premiados de verdade e aquele cheiro gostoso de café fresco. O montador de cestas no site facilitou demais escolher o presente de aniversário da minha mãe!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    date: "Julho de 2026",
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "1998",
    title: "A Semente no Caminho",
    description: "Início do acolhimento aos peregrinos que passavam pela nossa fazenda com um café fresco e broa de milho assada na hora.",
  },
  {
    year: "2010",
    title: "Abertura da Loja Física",
    description: "Inauguração do Empório no centro histórico, reunindo os melhores pequenos produtores de queijos, cafés e doces da região.",
  },
  {
    year: "2018",
    title: "A Linha Peregrino",
    description: "Criação de artigos religiosos exclusivos para abençoar a jornada dos milhares de caminhantes do Caminho da Fé.",
  },
  {
    year: "2026",
    title: "O Catálogo Digital Premium",
    description: "Expandimos nosso acolhimento para todo o Brasil através da experiência digital personalizada e montagem de cestas vivas.",
  },
];
