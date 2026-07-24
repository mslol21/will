"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  BarChart3,
  Calculator,
  Settings,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  X,
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Percent,
  ArrowUpRight,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  Heart,
  MessageCircle,
} from "lucide-react";
import {
  getProdutos,
  insertProduto,
  updateProduto,
  deleteProduto,
  updateStock,
  getCategorias,
  upsertCategoria,
  getLancamentos,
  insertLancamento,
  deleteLancamento,
  getPrayerRequests,
} from "@/lib/supabase";
import { Product, Category } from "@/types";
import { formatCurrency, slugify } from "@/lib/utils";

const MEI_ANNUAL_LIMIT = 81000.0;

type Tab = "dashboard" | "produtos" | "categorias" | "estoque" | "financeiro" | "oracoes" | "configuracoes";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"" | "saving" | "saved" | "error">("");

  // Data states from Supabase
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [oracoes, setOracoes] = useState<any[]>([]);

  // Financial
  const [monthlyGoal, setMonthlyGoal] = useState(6000);
  const [operationalCosts, setOperationalCosts] = useState(1450);

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("queijos");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodWeight, setProdWeight] = useState("500g");
  const [prodOrigin, setProdOrigin] = useState("Minas Gerais - MG");
  const [prodSku, setProdSku] = useState("");
  const [prodStock, setProdStock] = useState("15");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");

  // Category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");

  // Financial form
  const [lancTipo, setLancTipo] = useState<"receita" | "custo" | "despesa">("receita");
  const [lancDesc, setLancDesc] = useState("");
  const [lancValor, setLancValor] = useState("");
  const [lancData, setLancData] = useState(new Date().toISOString().slice(0, 10));

  // Load data from Supabase
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [produtos, cats, lancs, prayers] = await Promise.all([
      getProdutos(),
      getCategorias(),
      getLancamentos(),
      getPrayerRequests(),
    ]);
    setProductsList(produtos);
    setCategoriesList(cats);
    setLancamentos(lancs.data || []);
    setOracoes(prayers.data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  // ── AUTH ─────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1F2A44] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center border border-[#D2B48C]/30">
          <div className="w-16 h-16 rounded-full bg-[#D2B48C]/20 text-[#8B5E34] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Painel Gerencial</h2>
          <p className="text-xs text-slate-500 font-montserrat">
            Empório Caminho da Fé &mdash; Senha demo: <strong>admin123</strong>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === "admin123") setIsAuthenticated(true);
            }}
            className="space-y-3 font-montserrat"
          >
            <input
              type="password"
              placeholder="Senha de administrador"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-center text-[#1F2A44] focus:outline-none focus:border-[#8B5E34]"
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

  // ── FINANCIAL CALCULATIONS ─────────────────────────────────
  const totalReceitas = lancamentos.filter((l) => l.tipo === "receita").reduce((s, l) => s + parseFloat(l.valor), 0);
  const totalCustos = lancamentos.filter((l) => l.tipo !== "receita").reduce((s, l) => s + parseFloat(l.valor), 0);
  const lucroLiquido = totalReceitas - totalCustos;
  const meiUsed = ((totalReceitas / MEI_ANNUAL_LIMIT) * 100).toFixed(1);
  const meiRemaining = MEI_ANNUAL_LIMIT - totalReceitas;
  const stockValue = productsList.reduce((s, p) => s + p.price * p.stock, 0);

  // ── PRODUCT CRUD ────────────────────────────────────────────
  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdOriginalPrice(product.originalPrice?.toString() || "");
    setProdWeight(product.weight);
    setProdOrigin(product.origin);
    setProdSku(product.sku);
    setProdStock(product.stock.toString());
    setProdDesc(product.shortDescription);
    setProdImage(product.image);
    setIsProductModalOpen(true);
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdName(""); setProdCategory("queijos"); setProdPrice(""); setProdOriginalPrice("");
    setProdWeight("500g"); setProdOrigin("Minas Gerais - MG");
    setProdSku(`SKU-${Math.floor(Math.random() * 9000 + 1000)}`);
    setProdStock("15"); setProdDesc(""); setProdImage("");
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    const payload: Partial<Product> = {
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
      image: prodImage || "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
      badges: [{ type: "novo", label: "Novo" }],
      isActive: true,
    };

    if (editingProduct) {
      const { error } = await updateProduto(editingProduct.id, payload);
      if (error) { setSaveStatus("error"); return; }
    } else {
      const { error } = await insertProduto(payload);
      if (error) { setSaveStatus("error"); return; }
    }

    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(""), 2000);
    setIsProductModalOpen(false);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Confirmar exclusão do produto?")) return;
    await deleteProduto(id);
    loadData();
  };

  const handleStockChange = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    setProductsList((prev) => prev.map((p) => p.id === product.id ? { ...p, stock: newStock } : p));
    await updateStock(product.id, newStock);
  };

  // ── CATEGORY CRUD ────────────────────────────────────────────
  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name); setCatDesc(cat.description); setCatImage(cat.image);
    setIsCategoryModalOpen(true);
  };

  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCatName(""); setCatDesc(""); setCatImage("");
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    const id = editingCategory ? editingCategory.id : slugify(catName);
    const { error } = await upsertCategoria({ id, name: catName, description: catDesc, image: catImage, iconName: "Package" });
    if (error) { setSaveStatus("error"); return; }
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(""), 2000);
    setIsCategoryModalOpen(false);
    loadData();
  };

  // ── LANCAMENTO CRUD ────────────────────────────────────────────
  const handleSaveLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lancDesc || !lancValor) return;
    setSaveStatus("saving");
    const { error } = await insertLancamento({ tipo: lancTipo, descricao: lancDesc, valor: parseFloat(lancValor), data: lancData });
    if (error) { setSaveStatus("error"); return; }
    setSaveStatus("saved");
    setLancDesc(""); setLancValor("");
    setTimeout(() => setSaveStatus(""), 2000);
    loadData();
  };

  const handleDeleteLancamento = async (id: string) => {
    await deleteLancamento(id);
    loadData();
  };

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-montserrat">
      {/* Header */}
      <header className="bg-[#1F2A44] text-white py-4 px-6 flex items-center justify-between border-b border-[#D2B48C]/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8B5E34] text-[#D2B48C] flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-playfair font-bold text-lg text-white">Empório Caminho da Fé</h1>
            <span className="text-[10px] text-[#D2B48C] font-semibold">Painel Gerencial + Supabase</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && <span className="text-xs text-amber-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Salvando...</span>}
          {saveStatus === "saved" && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Salvo!</span>}
          {saveStatus === "error" && <span className="text-xs text-red-400">Erro ao salvar</span>}
          <Link href="/" className="text-xs font-semibold text-slate-200 hover:text-[#D2B48C] bg-white/10 px-3 py-1.5 rounded-full">Ver Loja</Link>
          <button onClick={() => setIsAuthenticated(false)} className="p-2 text-slate-300 hover:text-red-400"><LogOut className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0">
          {([
            ["dashboard", LayoutDashboard, "Dashboard"],
            ["produtos", Package, `Produtos (${productsList.length})`],
            ["categorias", Layers, `Categorias (${categoriesList.length})`],
            ["estoque", BarChart3, "Controle de Estoque"],
            ["financeiro", Calculator, "Financeiro & MEI"],
            ["oracoes", Heart, `Pedidos de Oração (${oracoes.length})`],
          ] as [Tab, any, string][]).map(([tab, Icon, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
                activeTab === tab ? "bg-[#1F2A44] text-[#D2B48C] shadow-md" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 lg:p-8 space-y-8 overflow-y-auto">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Resumo Gerencial</h2>
                <p className="text-xs text-slate-500">Dados em tempo real do Supabase</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Package, label: "Produtos Ativos", value: productsList.filter((p) => p.isActive).length.toString(), color: "bg-blue-50 text-blue-600" },
                  { icon: DollarSign, label: "Valor em Estoque", value: formatCurrency(stockValue), color: "bg-amber-50 text-[#8B5E34]" },
                  { icon: TrendingUp, label: "Receitas Registradas", value: formatCurrency(totalReceitas), color: "bg-emerald-50 text-emerald-700" },
                  { icon: Percent, label: "Teto MEI Atingido", value: `${meiUsed}%`, color: "bg-purple-50 text-purple-700" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold uppercase block">{label}</span>
                      <span className="font-playfair text-2xl font-bold text-[#1F2A44]">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* MEI Progress */}
              <div className="bg-white rounded-3xl p-6 border border-[#D2B48C]/40 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#8B5E34]" />
                  <h3 className="font-playfair font-bold text-lg text-[#1F2A44]">Teto MEI Anual (R$ 81.000,00)</h3>
                  <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold ${parseFloat(meiUsed) < 80 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                    {parseFloat(meiUsed) < 80 ? "Dentro do Limite" : "Atenção: Limite Próximo!"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>Receitas: {formatCurrency(totalReceitas)}</span>
                  <span>Margem Restante: {formatCurrency(meiRemaining)}</span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${parseFloat(meiUsed) < 60 ? "bg-emerald-500" : parseFloat(meiUsed) < 80 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(parseFloat(meiUsed), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRODUTOS */}
          {activeTab === "produtos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Gestão de Produtos</h2>
                  <p className="text-xs text-slate-500">Cadastro e edição com dados no Supabase</p>
                </div>
                <button onClick={handleOpenNewProduct} className="px-5 py-2.5 rounded-2xl bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all">
                  <Plus className="w-4 h-4" /> Novo Produto
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mr-3" /> Carregando do Supabase...
                </div>
              ) : productsList.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 text-sm">
                  Nenhum produto encontrado. Clique em "Novo Produto" para começar.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {productsList.map((p) => (
                    <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        {p.image && (
                          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#1F2A44]/90 text-[#D2B48C] text-[10px] font-bold uppercase">{p.category}</span>
                          </div>
                        )}
                        <h3 className="font-playfair font-bold text-lg text-[#1F2A44] mb-1">{p.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.shortDescription}</p>
                        <div className="flex items-center justify-between text-xs mb-3 pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-600">Estoque: <strong className={p.stock <= 5 ? "text-red-600" : "text-emerald-700"}>{p.stock} un</strong></span>
                          <span className="font-mono text-slate-400 text-[10px]">{p.sku}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="font-playfair text-xl font-bold text-[#1F2A44]">{formatCurrency(p.price)}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenEditProduct(p)} className="p-2 rounded-xl bg-slate-100 hover:bg-[#8B5E34] hover:text-white text-slate-700 transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CATEGORIAS */}
          {activeTab === "categorias" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Gestão de Categorias</h2>
                  <p className="text-xs text-slate-500">Edite nomes, descrições e imagens</p>
                </div>
                <button onClick={handleOpenNewCategory} className="px-5 py-2.5 rounded-2xl bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all">
                  <Plus className="w-4 h-4" /> Nova Categoria
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {categoriesList.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-5 space-y-3">
                    {cat.image && (
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                    )}
                    <h3 className="font-playfair font-bold text-lg text-[#1F2A44]">{cat.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>
                    <div className="flex justify-end">
                      <button onClick={() => handleOpenEditCategory(cat)} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#8B5E34] hover:text-white text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" /> Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ESTOQUE */}
          {activeTab === "estoque" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Controle de Estoque</h2>
                <p className="text-xs text-slate-500">Ajuste rápido de quantidades — salvo no Supabase em tempo real</p>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold border-b border-slate-200">
                        <th className="p-4">Produto</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Estoque</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Ajuste</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {productsList.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-[#1F2A44] max-w-[200px] truncate">{p.name}</td>
                          <td className="p-4 text-slate-500 uppercase text-[10px] font-semibold">{p.category}</td>
                          <td className="p-4 font-bold">{formatCurrency(p.price)}</td>
                          <td className="p-4 font-bold text-lg">{p.stock}</td>
                          <td className="p-4">
                            {p.stock === 0 ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Esgotado</span>
                            ) : p.stock <= 5 ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Baixo</span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">OK</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1">
                              {[-5, -1, +1, +5].map((d) => (
                                <button key={d} onClick={() => handleStockChange(p, d)} className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${d < 0 ? "bg-slate-100 hover:bg-slate-200 text-slate-700" : "bg-[#8B5E34] text-white hover:bg-[#1F2A44]"}`}>{d > 0 ? "+" : ""}{d}</button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FINANCEIRO */}
          {activeTab === "financeiro" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Painel Financeiro & Projeção MEI</h2>
                <p className="text-xs text-slate-500">Receitas, custos, lucro e limite fiscal do MEI (R$ 81.000/ano)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: "Receitas Brutas", value: formatCurrency(totalReceitas), color: "text-emerald-700", icon: ArrowUpRight },
                  { label: "Custos & Despesas", value: formatCurrency(totalCustos), color: "text-red-600", icon: Calculator },
                  { label: "Lucro Líquido", value: formatCurrency(lucroLiquido), color: lucroLiquido >= 0 ? "text-[#8B5E34]" : "text-red-600", icon: TrendingUp },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase block">{label}</span>
                    <span className={`font-playfair text-3xl font-bold block ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Add lancamento form */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-playfair text-xl font-bold text-[#1F2A44]">Lançar Receita ou Despesa</h3>
                <form onSubmit={handleSaveLancamento} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-montserrat items-end">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo:</label>
                    <select value={lancTipo} onChange={(e) => setLancTipo(e.target.value as any)} className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl">
                      <option value="receita">💚 Receita</option>
                      <option value="custo">🔴 Custo (CMV)</option>
                      <option value="despesa">🟠 Despesa</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Descrição:</label>
                    <input type="text" required value={lancDesc} onChange={(e) => setLancDesc(e.target.value)} placeholder="Ex: Venda Cesta Mantiqueira" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Valor (R$):</label>
                    <input type="number" step="0.01" required value={lancValor} onChange={(e) => setLancValor(e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" />
                  </div>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#8B5E34] text-white font-bold hover:bg-[#1F2A44] flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Lançar
                  </button>
                </form>
              </div>

              {/* Lancamentos Table */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
                        <th className="p-4 text-left">Data</th>
                        <th className="p-4 text-left">Descrição</th>
                        <th className="p-4 text-left">Tipo</th>
                        <th className="p-4 text-right">Valor</th>
                        <th className="p-4 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lancamentos.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400">Nenhum lançamento ainda. Use o formulário acima para começar.</td></tr>
                      ) : lancamentos.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="p-4 text-slate-500">{new Date(l.data).toLocaleDateString("pt-BR")}</td>
                          <td className="p-4 font-bold text-slate-800">{l.descricao}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${l.tipo === "receita" ? "bg-emerald-100 text-emerald-800" : l.tipo === "custo" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                              {l.tipo}
                            </span>
                          </td>
                          <td className={`p-4 text-right font-bold ${l.tipo === "receita" ? "text-emerald-700" : "text-red-600"}`}>
                            {l.tipo === "receita" ? "+" : "-"} {formatCurrency(parseFloat(l.valor))}
                          </td>
                          <td className="p-4 text-center">
                            <button onClick={() => handleDeleteLancamento(l.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PEDIDOS DE ORAÇÃO */}
          {activeTab === "oracoes" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1F2A44]">Pedidos de Oração Online</h2>
                <p className="text-xs text-slate-500">Intenções enviadas pelo site — salvas no Supabase</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {oracoes.length === 0 ? (
                  <div className="col-span-2 bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 text-sm">
                    Nenhum pedido de oração ainda.
                  </div>
                ) : oracoes.map((o: any) => (
                  <div key={o.id} className="bg-white rounded-3xl p-5 border border-[#D2B48C]/40 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1F2A44] text-[#D2B48C] flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1F2A44]">{o.nome}</p>
                          <p className="text-[10px] text-slate-400">{new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1F2A44]/10 text-[#1F2A44]">{o.status}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-[#D2B48C] pl-3 italic">"{o.oracao}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-playfair text-xl font-bold text-[#1F2A44]">{editingProduct ? "Editar Produto" : "Novo Produto"}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs font-montserrat">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Produto:*</label>
                <input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria:</label>
                  <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl">
                    {categoriesList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço (R$):*</label>
                  <input type="number" step="0.01" required value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU:</label>
                  <input type="text" value={prodSku} onChange={(e) => setProdSku(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estoque Inicial:</label>
                  <input type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peso/Volume:</label>
                  <input type="text" value={prodWeight} onChange={(e) => setProdWeight(e.target.value)} placeholder="500g" className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origem:</label>
                  <input type="text" value={prodOrigin} onChange={(e) => setProdOrigin(e.target.value)} placeholder="Minas Gerais - MG" className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Imagem:</label>
                <input type="text" value={prodImage} onChange={(e) => setProdImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição:</label>
                <textarea rows={3} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5E34] text-white font-bold shadow-sm hover:bg-[#1F2A44] flex items-center gap-2">
                  <Save className="w-4 h-4" /> Salvar no Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-playfair text-xl font-bold text-[#1F2A44]">{editingCategory ? "Editar Categoria" : "Nova Categoria"}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs font-montserrat">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Categoria:*</label>
                <input type="text" required value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Imagem:</label>
                <input type="text" value={catImage} onChange={(e) => setCatImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição:</label>
                <textarea rows={3} value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5E34] text-white font-bold shadow-sm hover:bg-[#1F2A44] flex items-center gap-2">
                  <Save className="w-4 h-4" /> Salvar no Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
