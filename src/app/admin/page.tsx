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
  Database,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardView } from "@/components/admin/DashboardView";
import { StockView } from "@/components/admin/StockView";
import { FinanceView } from "@/components/admin/FinanceView";
import { VirtualAssistant } from "@/components/admin/VirtualAssistant";
import { CrmView } from "@/components/admin/CrmView";
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
  seedAllMockDataToSupabase,
} from "@/lib/supabase";
import { Product, Category } from "@/types";
import { formatCurrency, slugify } from "@/lib/utils";
import { Zap, Keyboard, ExternalLink, RefreshCw, Upload } from "lucide-react";

const MEI_ANNUAL_LIMIT = 81000.0;

type Tab = "dashboard" | "produtos" | "categorias" | "estoque" | "financeiro" | "crm" | "oracoes" | "configuracoes";

export default function AdminPage() {
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

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    loadData();
  }, [loadData]);



  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    if (!confirm("Deseja implantar todos os produtos e categorias seeds no banco de dados Supabase?")) return;
    setIsSeeding(true);
    setSaveStatus("saving");
    try {
      await seedAllMockDataToSupabase();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
      await loadData();
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setIsSeeding(false);
    }
  };

  // Teclas de atalho (Alt + 1..5, Alt+N, Alt+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === "1") { setActiveTab("dashboard"); e.preventDefault(); }
        if (e.key === "2") { setActiveTab("produtos"); e.preventDefault(); }
        if (e.key === "3") { setActiveTab("categorias"); e.preventDefault(); }
        if (e.key === "4") { setActiveTab("estoque"); e.preventDefault(); }
        if (e.key === "5") { setActiveTab("financeiro"); e.preventDefault(); }
        if (e.key === "6") { setActiveTab("crm"); e.preventDefault(); }
        if (e.key === "p" || e.key === "P") { window.location.href = "/caixa"; e.preventDefault(); }
        if (e.key === "n" || e.key === "N") { handleOpenNewProduct(); e.preventDefault(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    const { logout } = await import("../login/actions");
    await logout();
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#141C2E] flex flex-col font-montserrat transition-colors">
      {/* Header */}
      <header className="bg-[#1F2A44] dark:bg-slate-950 text-white py-4 px-6 flex items-center justify-between border-b border-[#D2B48C]/30 dark:border-slate-800">
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
          <ThemeToggle />
          <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-400" title="Sair"><LogOut className="w-5 h-5" /></button>
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
            ["crm", Users, "CRM & Clientes"],
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
        <main className="flex-grow p-6 lg:p-8 space-y-6 overflow-y-auto">

          {/* ⚡ BARRA DE ATALHOS RÁPIDOS */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Zap className="w-3.5 h-3.5 text-[#8B5E34]" /> Atalhos Rápidos:
              </span>
              
              <Link
                href="/caixa"
                className="px-3.5 py-2 rounded-xl bg-[#1F2A44] hover:bg-[#8B5E34] text-[#D2B48C] hover:text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                title="Abrir Frente de Caixa (Alt + P)"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Frente de Caixa (PDV)</span>
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Alt+P</span>
              </Link>

              <button
                onClick={handleOpenNewProduct}
                className="px-3.5 py-2 rounded-xl bg-[#8B5E34] hover:bg-[#1F2A44] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                title="Cadastrar Novo Produto (Alt + N)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Produto</span>
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Alt+N</span>
              </button>

              <button
                onClick={handleOpenNewCategory}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Nova Categoria</span>
              </button>

              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                title="Implantar todos os produtos e categorias seeds no Supabase"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isSeeding ? "Implantando..." : "Implantar Seeds no Banco"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <Keyboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Navegação: <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">Alt + 1..5</kbd></span>
            </div>
          </div>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <DashboardView
              productsList={productsList}
              stockValue={stockValue}
              totalReceitas={totalReceitas}
              meiUsed={meiUsed}
              meiRemaining={meiRemaining}
            />
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
            <StockView 
              productsList={productsList} 
              onStockUpdate={loadData} 
            />
          )}

          {/* FINANCEIRO */}
          {activeTab === "financeiro" && (
            <FinanceView
              lancamentos={lancamentos}
              onAddLancamento={async (e, tipo, descricao, valor, data) => {
                e.preventDefault();
                if (!descricao || !valor) return;
                setSaveStatus("saving");
                const { error } = await insertLancamento({ tipo, descricao, valor: parseFloat(valor), data });
                if (error) { setSaveStatus("error"); return; }
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus(""), 2000);
                loadData();
              }}
              onDeleteLancamento={async (id) => {
                await deleteLancamento(id);
                loadData();
              }}
            />
          )}

          {/* CRM */}
          {activeTab === "crm" && <CrmView />}

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
                <label className="block font-bold text-slate-700 mb-1">Foto do Produto:</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-slate-700 text-xs font-bold transition-all">
                      <Upload className="w-4 h-4 text-[#8B5E34]" />
                      <span>Carregar Foto do Dispositivo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFileUpload(e, setProdImage)} />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Ou URL:</span>
                    <input type="text" value={prodImage} onChange={(e) => setProdImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs" />
                  </div>
                  {prodImage && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={prodImage} alt="Pré-visualização" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setProdImage("")} className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors" title="Remover Foto">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
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
                <label className="block font-bold text-slate-700 mb-1">Foto da Categoria:</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-slate-700 text-xs font-bold transition-all">
                      <Upload className="w-4 h-4 text-[#8B5E34]" />
                      <span>Carregar Foto do Dispositivo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFileUpload(e, setCatImage)} />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Ou URL:</span>
                    <input type="text" value={catImage} onChange={(e) => setCatImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs" />
                  </div>
                  {catImage && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={catImage} alt="Pré-visualização" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setCatImage("")} className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors" title="Remover Foto">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
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

      {/* 🤖 ASSISTENTE VIRTUAL IA */}
      <VirtualAssistant />
    </div>
  );
}
