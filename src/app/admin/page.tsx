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
  Users, 
  TrendingUp, 
  Save, 
  Sparkles,
  ShieldCheck,
  Lock
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_GIFT_BASKETS, INITIAL_STORE_SETTINGS, CATEGORIES } from "@/lib/mockData";
import { Product, GiftBasket, StoreSettings } from "@/types";
import { formatCurrency, slugify } from "@/lib/utils";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "produtos" | "cestas" | "configuracoes">("dashboard");

  // Admin Dynamic States
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [basketsList, setBasketsList] = useState<GiftBasket[]>(MOCK_GIFT_BASKETS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  // New Product Modal State
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("queijos");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductWeight, setNewProductWeight] = useState("500g");
  const [newProductOrigin, setNewProductOrigin] = useState("Serra da Canastra - MG");
  const [newProductDesc, setNewProductDesc] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin123" || passwordInput === "emporio") {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta. Tente 'admin123'");
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: slugify(newProductName),
      name: newProductName,
      shortDescription: newProductDesc || "Produto artesanal mineiro de altíssima qualidade.",
      fullDescription: newProductDesc || "Descrição completa produzida com carinho e tradição.",
      price: parseFloat(newProductPrice),
      category: newProductCategory as any,
      image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
      gallery: [],
      weight: newProductWeight,
      origin: newProductOrigin,
      sku: `PROD-${Math.floor(Math.random() * 9000 + 1000)}`,
      stock: 20,
      rating: 5.0,
      reviewCount: 1,
      badges: [{ type: "novo", label: "Novo" }],
      isActive: true,
    };

    setProductsList([newProd, ...productsList]);
    setIsNewProductOpen(false);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductDesc("");
  };

  const toggleProductActive = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const deleteProduct = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-emporio-navy-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-emporio-gold/30 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emporio-gold/20 text-emporio-gold flex items-center justify-center mx-auto mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-emporio-navy">
            Painel Administrativo
          </h2>
          <p className="text-xs text-slate-500">
            Acesso restrito do Empório Caminho da Fé. (Senha demo: <strong>admin123</strong>)
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Digite a senha do administrador"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-emporio-navy focus:outline-none focus:border-emporio-gold text-center font-bold"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emporio-gold text-emporio-navy font-bold text-xs uppercase tracking-wider hover:bg-emporio-gold-dark transition-colors shadow-gold"
            >
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-emporio-navy text-white py-4 px-6 border-b border-emporio-gold/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emporio-gold text-emporio-navy flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-playfair font-bold text-lg text-white">Empório Caminho da Fé</h1>
            <span className="text-[10px] text-emporio-gold font-medium">Gestão & Catálogo</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-slate-300 hover:text-emporio-gold transition-colors flex items-center gap-1"
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

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-colors ${
              activeTab === "dashboard"
                ? "bg-emporio-navy text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emporio-gold" />
            <span>Dashboard & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab("produtos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-colors ${
              activeTab === "produtos"
                ? "bg-emporio-navy text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="w-4 h-4 text-emporio-gold" />
            <span>Produtos ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cestas")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-colors ${
              activeTab === "cestas"
                ? "bg-emporio-navy text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Gift className="w-4 h-4 text-emporio-gold" />
            <span>Cestas Presente ({basketsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("configuracoes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-colors ${
              activeTab === "configuracoes"
                ? "bg-emporio-navy text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4 text-emporio-gold" />
            <span>Configurações & SEO</span>
          </button>
        </aside>

        {/* Main Admin Area */}
        <main className="flex-grow p-6 md:p-8">
          
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-emporio-navy">Visão Geral</h2>
                <p className="text-xs text-slate-500">Métricas de catálogo e movimentação do Empório</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Produtos Ativos</span>
                    <span className="font-playfair text-2xl font-bold text-emporio-navy">
                      {productsList.filter((p) => p.isActive).length}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Cestas Cadastradas</span>
                    <span className="font-playfair text-2xl font-bold text-emporio-navy">
                      {basketsList.length}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Conversão WhatsApp</span>
                    <span className="font-playfair text-2xl font-bold text-emporio-navy">94.2%</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Ticket Médio Cestas</span>
                    <span className="font-playfair text-2xl font-bold text-emporio-navy">
                      {formatCurrency(245.00)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Products Summary */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-playfair font-bold text-lg text-emporio-navy">
                  Produtos em Destaque no Catálogo
                </h3>
                <div className="divide-y divide-slate-100">
                  {productsList.slice(0, 5).map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <strong className="block text-emporio-navy">{p.name}</strong>
                          <span className="text-slate-400">{p.origin} • {p.weight}</span>
                        </div>
                      </div>
                      <span className="font-bold text-emporio-navy">{formatCurrency(p.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "produtos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-emporio-navy">Gestão de Produtos</h2>
                  <p className="text-xs text-slate-500">Adicione, edite ou desative itens do catálogo digital</p>
                </div>
                <button
                  onClick={() => setIsNewProductOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-emporio-gold hover:bg-emporio-gold-dark text-emporio-navy font-bold text-xs flex items-center gap-2 shadow-gold transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Cadastrar Novo Produto</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold border-b border-slate-200">
                        <th className="p-4">Produto</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Estoque</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {productsList.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                              </div>
                              <div>
                                <strong className="block text-emporio-navy font-semibold">{p.name}</strong>
                                <span className="text-[10px] text-slate-400">{p.weight}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-slate-600 uppercase text-[10px]">
                            {p.category}
                          </td>
                          <td className="p-4 font-bold text-emporio-navy">
                            {formatCurrency(p.price)}
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-[11px]">
                            {p.sku}
                          </td>
                          <td className="p-4 text-slate-600 font-semibold">
                            {p.stock} un
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleProductActive(p.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.isActive
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {p.isActive ? "Ativo" : "Inativo"}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                              title="Excluir produto"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* TAB 3: BASKETS CRUD */}
          {activeTab === "cestas" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-emporio-navy">Cestas Presente Especiais</h2>
                <p className="text-xs text-slate-500">Gestão de montagens fixas em baús de madeira e caixas kraft</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {basketsList.map((b) => (
                  <div key={b.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-5 space-y-4">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                      <Image src={b.image} alt={b.name} fill className="object-cover" />
                    </div>
                    <h3 className="font-playfair font-bold text-lg text-emporio-navy">{b.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{b.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-playfair text-xl font-bold text-emporio-navy">
                        {formatCurrency(b.price)}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-[10px] font-bold">
                        Disponível
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STORE SETTINGS & SEO */}
          {activeTab === "configuracoes" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-emporio-navy">Configurações Globais & SEO</h2>
                <p className="text-xs text-slate-500">Ajuste dados de contato, redes sociais, WhatsApp e tags de rastreamento</p>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emporio-navy mb-1">Nome da Loja:</label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-emporio-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emporio-navy mb-1">Número do WhatsApp (Com DDD):</label>
                    <input
                      type="text"
                      value={storeSettings.whatsappNumber}
                      onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-emporio-navy font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emporio-navy mb-1">Instagram:</label>
                    <input
                      type="text"
                      value={storeSettings.instagram}
                      onChange={(e) => setStoreSettings({ ...storeSettings, instagram: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-emporio-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emporio-navy mb-1">Google Analytics ID:</label>
                    <input
                      type="text"
                      value={storeSettings.googleAnalyticsId}
                      onChange={(e) => setStoreSettings({ ...storeSettings, googleAnalyticsId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-emporio-navy font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emporio-navy mb-1">Endereço Completo:</label>
                  <input
                    type="text"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-emporio-navy"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => alert("Configurações salvas com sucesso!")}
                    className="px-6 py-3 rounded-2xl bg-emporio-gold hover:bg-emporio-gold-dark text-emporio-navy font-bold text-xs flex items-center gap-2 shadow-gold transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* New Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-playfair text-xl font-bold text-emporio-navy">Cadastrar Novo Produto</h3>
              <button onClick={() => setIsNewProductOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Queijo Serro Maturado 500g"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria:</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800"
                  >
                    {CATEGORIES.map((c) => (
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
                    placeholder="89.90"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peso / Volume:</label>
                  <input
                    type="text"
                    value={newProductWeight}
                    onChange={(e) => setNewProductWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origem:</label>
                  <input
                    type="text"
                    value={newProductOrigin}
                    onChange={(e) => setNewProductOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição Curta:</label>
                <textarea
                  rows={3}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emporio-gold text-emporio-navy font-bold shadow-sm"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
