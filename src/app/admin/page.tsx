"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Gift, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Save, 
  Sparkles,
  ShieldCheck,
  Lock,
  AlertTriangle,
  PieChart,
  BarChart3,
  Layers,
  Percent,
  Calculator,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_GIFT_BASKETS, INITIAL_STORE_SETTINGS, CATEGORIES as INITIAL_CATEGORIES } from "@/lib/mockData";
import { Product, GiftBasket, StoreSettings, Category } from "@/types";
import { formatCurrency, slugify } from "@/lib/utils";

// MEI Limit Constants (Brazil MEI Fiscal Limit R$ 81.000,00/year)
const MEI_ANNUAL_LIMIT = 81000.00;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "produtos" | "categorias" | "estoque" | "financeiro" | "configuracoes">("dashboard");

  // Dynamic States
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<Category[]>(INITIAL_CATEGORIES);
  const [basketsList, setBasketsList] = useState<GiftBasket[]>(MOCK_GIFT_BASKETS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  // Financial & MEI State
  const [monthlyGoal, setMonthlyGoal] = useState<number>(6000.00);
  const [operationalCosts, setOperationalCosts] = useState<number>(1450.00);

  // Modals States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form States for Product
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("queijos");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodWeight, setProdWeight] = useState("500g");
  const [prodOrigin, setProdOrigin] = useState("Serra da Canastra - MG");
  const [prodSku, setProdSku] = useState("");
  const [prodStock, setProdStock] = useState("20");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");

  // Form States for Category
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");

  // Open Edit Product
  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdOriginalPrice(product.originalPrice ? product.originalPrice.toString() : "");
    setProdWeight(product.weight);
    setProdOrigin(product.origin);
    setProdSku(product.sku);
    setProdStock(product.stock.toString());
    setProdDesc(product.shortDescription);
    setProdImage(product.image);
    setIsProductModalOpen(true);
  };

  // Open New Product
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdName("");
    setProdCategory("queijos");
    setProdPrice("");
    setProdOriginalPrice("");
    setProdWeight("500g");
    setProdOrigin("Serra da Canastra - MG");
    setProdSku(`SKU-${Math.floor(Math.random() * 9000 + 1000)}`);
    setProdStock("15");
    setProdDesc("");
    setProdImage("https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80");
    setIsProductModalOpen(true);
  };

  // Save Product (Create / Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    if (editingProduct) {
      // Edit
      setProductsList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: prodName,
                slug: slugify(prodName),
                category: prodCategory as any,
                price: parseFloat(prodPrice),
                originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
                weight: prodWeight,
                origin: prodOrigin,
                sku: prodSku,
                stock: parseInt(prodStock) || 0,
                shortDescription: prodDesc,
                fullDescription: prodDesc,
                image: prodImage || p.image,
              }
            : p
        )
      );
    } else {
      // Create
      const newP: Product = {
        id: `prod-${Date.now()}`,
        slug: slugify(prodName),
        name: prodName,
        shortDescription: prodDesc || "Produto artesanal de Minas.",
        fullDescription: prodDesc || "Descrição completa de alta gastronomia.",
        price: parseFloat(prodPrice),
        originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
        category: prodCategory as any,
        image: prodImage || "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
        gallery: [],
        weight: prodWeight,
        origin: prodOrigin,
        sku: prodSku,
        stock: parseInt(prodStock) || 0,
        rating: 5.0,
        reviewCount: 1,
        badges: [{ type: "novo", label: "Novo" }],
        isActive: true,
      };
      setProductsList([newP, ...productsList]);
    }

    setIsProductModalOpen(false);
  };

  // Stock Adjustment (+ / -)
  const handleStockChange = (productId: string, delta: number) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  // Open Edit Category
  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setCatImage(cat.image);
    setIsCategoryModalOpen(true);
  };

  // Open New Category
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCatName("");
    setCatDesc("");
    setCatImage("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80");
    setIsCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    if (editingCategory) {
      setCategoriesList((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: catName, description: catDesc, image: catImage }
            : c
        )
      );
    } else {
      const newC: Category = {
        id: slugify(catName) as any,
        name: catName,
        description: catDesc,
        image: catImage,
        iconName: "Package",
        itemCount: 0,
      };
      setCategoriesList([...categoriesList, newC]);
    }
    setIsCategoryModalOpen(false);
  };

  // Financial Calculations
  const totalCatalogInventoryValue = productsList.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  // Simulated YTD Sales for MEI (Year to Date Accumulated Revenues)
  const ytdAccumulatedRevenue = 42850.00; // Simulated Accumulated Revenue this year
  const meiUsagePercentage = ((ytdAccumulatedRevenue / MEI_ANNUAL_LIMIT) * 100).toFixed(1);
  const meiRemainingCapacity = MEI_ANNUAL_LIMIT - ytdAccumulatedRevenue;
  const estimatedCostOfGoods = totalCatalogInventoryValue * 0.45; // ~45% Cost of Goods Sold
  const estimatedNetProfit = ytdAccumulatedRevenue - estimatedCostOfGoods - (operationalCosts * 7);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1F2A44] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#D2B48C]/40 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D2B48C]/20 text-[#8B5E34] flex items-center justify-center mx-auto mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">
            Painel Administrativo
          </h2>
          <p className="text-xs text-slate-500 font-montserrat">
            Empório Caminho da Fé (Senha demo: <strong>admin123</strong>)
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-4 font-montserrat">
            <input
              type="password"
              placeholder="Digite a senha de administrador"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-[#1F2A44] focus:outline-none focus:border-[#8B5E34] text-center font-bold"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#8B5E34] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1F2A44] transition-colors shadow-md"
            >
              Acessar Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-montserrat">
      
      {/* Top Admin Header */}
      <header className="bg-[#1F2A44] text-white py-4 px-6 border-b border-[#D2B48C]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8B5E34] text-[#D2B48C] flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-playfair font-bold text-lg text-white">Empório Caminho da Fé</h1>
            <span className="text-[10px] text-[#D2B48C] font-semibold">Painel Gerencial, Estoque & Financeiro MEI</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-200 hover:text-[#D2B48C] transition-colors flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"
          >
            <span>Ver Loja</span>
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-slate-300 hover:text-red-400 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-6 space-y-2 shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
              activeTab === "dashboard"
                ? "bg-[#1F2A44] text-[#D2B48C] shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Principal</span>
          </button>

          <button
            onClick={() => setActiveTab("produtos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
              activeTab === "produtos"
                ? "bg-[#1F2A44] text-[#D2B48C] shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produtos Editáveis ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categorias")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
              activeTab === "categorias"
                ? "bg-[#1F2A44] text-[#D2B48C] shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorias Editáveis ({categoriesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("estoque")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
              activeTab === "estoque"
                ? "bg-[#1F2A44] text-[#D2B48C] shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Controle de Estoque</span>
          </button>

          <button
            onClick={() => setActiveTab("financeiro")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
              activeTab === "financeiro"
                ? "bg-[#1F2A44] text-[#D2B48C] shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Financeiro & Teto MEI</span>
          </button>

          <button
            onClick={() => setActiveTab("configuracoes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
              activeTab === "configuracoes"
                ? "bg-[#1F2A44] text-[#D2B48C] shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações Globais</span>
          </button>
        </aside>

        {/* Main Content View */}
        <main className="flex-grow p-6 lg:p-8 space-y-8 max-w-7xl">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Resumo Gerencial</h2>
                <p className="text-xs text-slate-500">Acompanhamento consolidado do Empório Caminho da Fé</p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Produtos Ativos</span>
                    <span className="font-playfair text-2xl font-bold text-[#1F2A44]">
                      {productsList.filter((p) => p.isActive).length}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#8B5E34] flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Valor em Estoque</span>
                    <span className="font-playfair text-2xl font-bold text-[#1F2A44]">
                      {formatCurrency(totalCatalogInventoryValue)}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Faturamento MEI YTD</span>
                    <span className="font-playfair text-2xl font-bold text-[#1F2A44]">
                      {formatCurrency(ytdAccumulatedRevenue)}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Teto MEI Atingido</span>
                    <span className="font-playfair text-2xl font-bold text-[#1F2A44]">
                      {meiUsagePercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Teto MEI */}
              <div className="bg-white rounded-3xl p-6 border border-[#D2B48C]/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#8B5E34]" />
                    <h3 className="font-playfair font-bold text-lg text-[#1F2A44]">Acompanhamento de Teto MEI (R$ 81.000/ano)</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Dentro do Limite
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>Acumulado: {formatCurrency(ytdAccumulatedRevenue)}</span>
                    <span>Restante Seguro: {formatCurrency(meiRemainingCapacity)}</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-[#8B5E34] transition-all duration-500"
                      style={{ width: `${meiUsagePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUTOS EDITÁVEIS (FULL CRUD) */}
          {activeTab === "produtos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Gestão de Produtos Editáveis</h2>
                  <p className="text-xs text-slate-500">Cadastre, edite informações ou altere valores e fotos</p>
                </div>
                <button
                  onClick={handleOpenNewProduct}
                  className="px-5 py-2.5 rounded-2xl bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Produto</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsList.map((p) => (
                  <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-[#1F2A44] text-[#D2B48C] text-[10px] font-bold uppercase">
                          {p.category}
                        </span>
                      </div>
                      <h3 className="font-playfair font-bold text-lg text-[#1F2A44] mb-1">{p.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.shortDescription}</p>
                      
                      <div className="flex items-center justify-between text-xs mb-4 pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-600">Estoque: <strong>{p.stock} un</strong></span>
                        <span className="font-mono text-slate-400">SKU: {p.sku}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="font-playfair text-xl font-bold text-[#1F2A44]">
                        {formatCurrency(p.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#8B5E34] hover:text-white text-slate-700 transition-colors"
                          title="Editar Produto"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductsList(productsList.filter((x) => x.id !== p.id))}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIAS EDITÁVEIS (FULL CRUD) */}
          {activeTab === "categorias" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Gestão de Categorias Editáveis</h2>
                  <p className="text-xs text-slate-500">Crie ou edite nomes, descrições e fotos de categorias</p>
                </div>
                <button
                  onClick={handleOpenNewCategory}
                  className="px-5 py-2.5 rounded-2xl bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Categoria</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categoriesList.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-3">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <h3 className="font-playfair font-bold text-lg text-[#1F2A44] mb-1">{cat.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-400">ID: {cat.id}</span>
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#8B5E34] hover:text-white text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTROLE DE ESTOQUE */}
          {activeTab === "estoque" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Controle de Estoque em Tempo Real</h2>
                <p className="text-xs text-slate-500">Ajuste rápido de quantidade e monitoramento de itens baixos/esgotados</p>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold border-b border-slate-200">
                        <th className="p-4">Produto</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Preço Unitário</th>
                        <th className="p-4">Quantidade Atual</th>
                        <th className="p-4">Status de Estoque</th>
                        <th className="p-4 text-center">Ajuste Rápido</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {productsList.map((p) => {
                        let statusBadge = (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Em Estoque
                          </span>
                        );
                        if (p.stock === 0) {
                          statusBadge = (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" /> Esgotado
                            </span>
                          );
                        } else if (p.stock <= 5) {
                          statusBadge = (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" /> Estoque Baixo
                            </span>
                          );
                        }

                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold text-[#1F2A44]">{p.name}</td>
                            <td className="p-4 text-slate-500 uppercase text-[10px] font-semibold">{p.category}</td>
                            <td className="p-4 font-bold text-[#1F2A44]">{formatCurrency(p.price)}</td>
                            <td className="p-4 font-bold text-base">{p.stock} un</td>
                            <td className="p-4">{statusBadge}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleStockChange(p.id, -5)}
                                  className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold hover:bg-slate-200"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={() => handleStockChange(p.id, -1)}
                                  className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold hover:bg-slate-200"
                                >
                                  -1
                                </button>
                                <button
                                  onClick={() => handleStockChange(p.id, +1)}
                                  className="px-2 py-1 bg-[#8B5E34] text-white rounded-lg text-[10px] font-bold hover:bg-[#1F2A44]"
                                >
                                  +1
                                </button>
                                <button
                                  onClick={() => handleStockChange(p.id, +5)}
                                  className="px-2 py-1 bg-[#8B5E34] text-white rounded-lg text-[10px] font-bold hover:bg-[#1F2A44]"
                                >
                                  +5
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FINANCEIRO & TETO MEI */}
          {activeTab === "financeiro" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Painel Financeiro & Projeção MEI</h2>
                <p className="text-xs text-slate-500">Gestão de custos, lucros e acompanhamento do limite fiscal do MEI</p>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Faturamento Bruto Acumulado</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="font-playfair text-3xl font-bold text-[#1F2A44]">
                    {formatCurrency(ytdAccumulatedRevenue)}
                  </span>
                  <p className="text-[11px] text-slate-500">Acumulado no ano fiscal corrente</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Estimativa de Lucro Líquido</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="font-playfair text-3xl font-bold text-emerald-700">
                    {formatCurrency(estimatedNetProfit)}
                  </span>
                  <p className="text-[11px] text-slate-500">Descontando custos de produtos e operacionais</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Margem Restante Limite MEI</span>
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="font-playfair text-3xl font-bold text-[#8B5E34]">
                    {formatCurrency(meiRemainingCapacity)}
                  </span>
                  <p className="text-[11px] text-slate-500">Teto Máximo Anual: R$ 81.000,00</p>
                </div>
              </div>

              {/* Detailed MEI Analysis */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#D2B48C]/40 shadow-sm space-y-6">
                <h3 className="font-playfair font-bold text-xl text-[#1F2A44] flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#8B5E34]" />
                  <span>Status do Enquadramento MEI</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-slate-600 block">Teto Anual Autorizado:</span>
                      <strong className="text-xl font-playfair text-[#1F2A44] block">R$ 81.000,00</strong>
                      <span className="text-[11px] text-slate-500 block">Média mensal recomendada: R$ 6.750,00</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-slate-600 block">Faturamento Médio Mensal Atual:</span>
                      <strong className="text-xl font-playfair text-emerald-700 block">
                        {formatCurrency(ytdAccumulatedRevenue / 7)} / mês
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-[#1F2A44]">
                      Ajustar Custos Operacionais Mensais (R$):
                    </label>
                    <input
                      type="number"
                      value={operationalCosts}
                      onChange={(e) => setOperationalCosts(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-[#1F2A44]"
                    />

                    <label className="block text-xs font-bold text-[#1F2A44]">
                      Meta Mensal de Vendas (R$):
                    </label>
                    <input
                      type="number"
                      value={monthlyGoal}
                      onChange={(e) => setMonthlyGoal(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-[#1F2A44]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONFIGURAÇÕES GLOBAIS */}
          {activeTab === "configuracoes" && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Configurações da Loja & SEO</h2>
              <p className="text-xs text-slate-500">Dados do WhatsApp, Instagram e chaves do Google</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1F2A44] mb-1">Nome do Empório:</label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1F2A44] mb-1">WhatsApp Oficial:</label>
                  <input
                    type="text"
                    value={storeSettings.whatsappNumber}
                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => alert("Configurações salvas com sucesso!")}
                  className="px-6 py-3 rounded-2xl bg-[#8B5E34] text-white font-bold text-xs uppercase shadow-md hover:bg-[#1F2A44]"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-playfair text-xl font-bold text-[#1F2A44]">
                {editingProduct ? "Editar Produto" : "Cadastrar Novo Produto"}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-montserrat">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria:</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU:</label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estoque Inicial:</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Imagem:</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição Curta:</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5E34] text-white font-bold shadow-sm hover:bg-[#1F2A44]"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-playfair text-xl font-bold text-[#1F2A44]">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-montserrat">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Categoria:</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Imagem:</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição da Categoria:</label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5E34] text-white font-bold shadow-sm hover:bg-[#1F2A44]"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
