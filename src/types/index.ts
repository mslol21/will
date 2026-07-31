export type CategoryId =
  | "cafes"
  | "queijos"
  | "doces"
  | "geleias"
  | "mel"
  | "biscoitos"
  | "cachacas"
  | "vinhos"
  | "cestas"
  | "peregrino"
  | "presentes"
  | "artesanais";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  iconName: string;
  itemCount: number;
}

export interface ProductBadge {
  type: "novo" | "promocao" | "mais-vendido" | "artesanal" | "peregrino";
  label: string;
}

export interface NutritionTable {
  servingSize: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  sodium: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  category: CategoryId;
  image: string;
  gallery: string[];
  weight: string;
  origin: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  ingredients?: string;
  nutrition?: NutritionTable;
  featured?: boolean;
  isPeregrino?: boolean;
  isActive: boolean;
  validade?: string;
  custoMedio?: number;
}

export interface BasketItemChoice {
  product: Product;
  quantity: number;
}

export interface GiftBasket {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  includedItems: string[];
  containerType: "bau-madeira" | "cesta-palha" | "caixa-kraft";
  isCustomizable: boolean;
  featured?: boolean;
  available: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  role?: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface StoreSettings {
  storeName: string;
  subtitle: string;
  whatsappNumber: string;
  whatsappFormatted: string;
  instagram: string;
  facebook: string;
  address: string;
  cityState: string;
  phone: string;
  email: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  googleMapsEmbedUrl: string;
  googleMapsDirectUrl: string;
  metaPixelId?: string;
  googleAnalyticsId?: string;
}

export interface ContatoMensagem {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  dataEnvio: string;
}

// Fase 6: Compras e Fornecedores
export interface Fornecedor {
  id: string;
  nomeFantasia: string;
  razaoSocial?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  createdAt: string;
}

export interface ItemPedidoCompra {
  id: string;
  pedidoCompraId: string;
  produtoId: string;
  quantidade: number;
  custoUnitario: number;
}

export interface PedidoCompra {
  id: string;
  fornecedorId: string;
  responsavelId?: string;
  status: "pendente" | "recebido" | "cancelado";
  valorTotal: number;
  dataPedido: string;
  dataRecebimento?: string;
  createdAt: string;
  fornecedor?: Fornecedor;
  itens?: ItemPedidoCompra[];
}

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  total_comprado: number;
  is_vip: boolean;
  ultima_compra?: string;
  data_nascimento?: string;
  pontos_fidelidade: number;
  nivel_cliente: "Bronze" | "Prata" | "Ouro" | "Diamante";
  preferencias_json?: any;
  created_at: string;
}
