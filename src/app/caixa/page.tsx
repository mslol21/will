"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Smartphone,
  Banknote,
  X,
  Check,
  ChevronRight,
  RotateCcw,
  Printer,
  Package,
  Lock,
  Calculator,
  Clock,
  Zap,
  AlertTriangle,
  Wallet,
  Coins,
  ChevronDown,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getProdutos, getCategorias, updateStock, insertLancamento, insertPedido, getClientes } from "@/lib/supabase";
import { Product, Category, Cliente } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { buildPlugPagDeeplink, generateThermalReceipt } from "@/lib/pagbank";

// ─── Types ────────────────────────────────────────────────────
interface CartItem {
  product: Product;
  qty: number;
  unitPrice: number;
}

type PaymentMethod = "dinheiro" | "pix" | "credito" | "debito" | "voucher";
type Screen = "caixa" | "pagamento" | "troco" | "sucesso";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  credito: "Crédito",
  debito: "Débito",
  voucher: "Voucher / VR",
};

const PIN = "1234";

// ─── Helpers ──────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function today() {
  return new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

export default function CaixaPage() {

  // ── Data ────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI State ────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("caixa");
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cashReceived, setCashReceived] = useState("");
  const [processing, setProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(now());
  const [linkedClient, setLinkedClient] = useState<Cliente | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientSelector, setShowClientSelector] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Load ────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [prods, cats, clis] = await Promise.all([getProdutos(), getCategorias(), getClientes()]);
    setProducts(prods.filter((p) => p.isActive && p.stock > 0));
    setCategories(cats);
    setClientes(clis.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(now()), 30000);
    return () => clearInterval(t);
  }, []);

  const handleLock = async () => {
    const { logout } = await import("../login/actions");
    await logout();
  };

  // ── Cart ─────────────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1, unitPrice: product.price }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCashReceived("");
    setLinkedClient(null);
    setScreen("caixa");
  };

  // ── Totals ───────────────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const total = Math.max(0, subtotal - discount);
  const cashVal = parseFloat(cashReceived.replace(",", ".")) || 0;
  const troco = cashVal - total;

  // ── Filtered Products ────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchCat = activeCat === "todos" || p.category === activeCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Finalize ─────────────────────────────────────────────────
  const finalize = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      // Update stock for each item
      for (const item of cart) {
        const newStock = item.product.stock - item.qty;
        await updateStock(item.product.id, newStock);
      }
      // Register in financial
      await insertLancamento({
        tipo: "receita",
        descricao: `Venda PDV: ${cart.map((i) => `${i.qty}x ${i.product.name.slice(0, 20)}`).join(", ")}`,
        valor: total,
        data: new Date().toISOString().slice(0, 10),
        categoria: "venda-caixa",
      });
      // Register order
      await insertPedido({
        nome_cliente: linkedClient ? linkedClient.nome : undefined,
        telefone: linkedClient ? (linkedClient.telefone || undefined) : undefined,
        itens: cart.map((i) => ({ id: i.product.id, name: i.product.name, qty: i.qty, price: i.unitPrice })),
        total,
        pontos_ganhos: linkedClient ? Math.floor(total / 10) : 0, // 1 ponto a cada R$ 10
      });
      setScreen("sucesso");
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };


  // ─────────────────────────────────────────────────────────────
  // RENDER: SUCESSO
  // ─────────────────────────────────────────────────────────────
  if (screen === "sucesso") {
    return (
      <div className="min-h-screen bg-[#1F2A44] flex flex-col items-center justify-center p-6 font-montserrat">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <Check className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-playfair text-3xl font-bold text-emerald-700">Venda Aprovada!</h2>
            <p className="text-slate-500 text-sm mt-1">{cart.length} item(s) · {formatCurrency(total)}</p>
          </div>
          {paymentMethod === "dinheiro" && troco > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs text-amber-700 font-bold uppercase">Troco para o cliente</p>
              <p className="font-playfair text-4xl font-bold text-amber-700">{formatCurrency(troco)}</p>
            </div>
          )}
          <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 space-y-1">
            <p>💳 {PAYMENT_LABELS[paymentMethod]}</p>
            <p>🕐 {currentTime} · {today()}</p>
            <p>✅ Estoque atualizado no Supabase</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setScreen("caixa"); }} className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200">
              <Printer className="w-4 h-4 inline mr-1" /> Imprimir
            </button>
            <button onClick={clearCart} className="flex-1 py-3 rounded-2xl bg-[#8B5E34] text-white font-bold text-sm hover:bg-[#1F2A44] flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Nova Venda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: CAIXA PRINCIPAL
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-[#141C2E] font-montserrat overflow-hidden transition-colors">

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="bg-[#1F2A44] dark:bg-slate-950 text-white px-5 py-3 flex items-center justify-between shrink-0 border-b border-[#D2B48C]/20 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8B5E34] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#D2B48C]" />
          </div>
          <div>
            <p className="font-playfair font-bold text-base leading-tight">PDV · Frente de Caixa</p>
            <p className="text-[10px] text-[#D2B48C]">Empório Caminho da Fé</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{currentTime}</span>
          <span className="hidden sm:block text-slate-400">{today()}</span>
          <ThemeToggle />
          <button onClick={handleLock} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400" title="Sair"><Lock className="w-4 h-4" /></button>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Products ────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">

          {/* Search + Categories */}
          <div className="bg-white px-4 py-3 space-y-3 border-b border-slate-200 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produto por nome..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#8B5E34] focus:bg-white transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[{ id: "todos", name: "Todos" }, ...categories].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCat === cat.id
                      ? "bg-[#1F2A44] text-[#D2B48C] shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Carregando produtos do Supabase...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Package className="w-10 h-10 opacity-30" />
              <p className="text-sm">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 content-start">
              {filtered.map((product) => {
                const inCart = cart.find((i) => i.product.id === product.id);
                const isLowStock = product.stock <= 5;
                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`bg-white rounded-2xl p-3 text-left transition-all active:scale-95 hover:shadow-md border-2 relative ${
                      inCart ? "border-[#8B5E34] shadow-md" : "border-transparent"
                    }`}
                  >
                    {/* Stock badge */}
                    {isLowStock && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-3 h-3 text-white" />
                      </span>
                    )}

                    {/* In cart indicator */}
                    {inCart && (
                      <span className="absolute top-2 left-2 w-5 h-5 bg-[#8B5E34] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {inCart.qty}
                      </span>
                    )}

                    {/* Product image */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-bold text-[#1F2A44] line-clamp-2 leading-tight mb-1">{product.name}</p>
                    <p className="text-[11px] text-slate-400 mb-1">{product.weight}</p>
                    <p className="font-playfair font-bold text-[#8B5E34] text-base">{formatCurrency(product.price)}</p>
                    <p className="text-[10px] text-slate-300">{product.stock} em estoque</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT: Cart / Payment ─────────────────────────── */}
        <div className="w-80 lg:w-96 flex flex-col bg-white shrink-0">

          {/* Cart header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#8B5E34]" />
              <span className="font-bold text-[#1F2A44] text-sm">Pedido Atual</span>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#8B5E34] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Limpar
              </button>
            )}
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-300 text-sm gap-2">
                <ShoppingCart className="w-10 h-10 opacity-30" />
                <p>Toque nos produtos para adicionar</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1F2A44] truncate">{item.product.name}</p>
                    <p className="text-[11px] text-slate-400">{formatCurrency(item.unitPrice)} × {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateQty(item.product.id, -1)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 active:scale-90">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[#1F2A44]">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product.id, 1)}
                      disabled={item.qty >= item.product.stock}
                      className="w-6 h-6 rounded-lg bg-[#8B5E34] hover:bg-[#1F2A44] flex items-center justify-center text-white active:scale-90 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right shrink-0 w-16">
                    <p className="text-sm font-bold text-[#1F2A44]">{formatCurrency(item.unitPrice * item.qty)}</p>
                    <button onClick={() => removeItem(item.product.id)} className="text-red-300 hover:text-red-500 mt-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Payment Panel ─────────────────────────────────── */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 shrink-0">

              {screen === "caixa" && (
                <div className="p-4 space-y-3">
                  {/* Subtotal / Discount / Total */}
                  <div className="space-y-1.5 text-sm">
                    {/* Vincular Cliente */}
                    {!linkedClient ? (
                      <div className="relative mb-2">
                        <button onClick={() => setShowClientSelector(!showClientSelector)} className="w-full py-2 bg-slate-50 border border-slate-200 border-dashed rounded-lg text-xs text-slate-500 font-bold hover:bg-slate-100 flex items-center justify-center gap-2">
                          <Users className="w-4 h-4" /> Vincular Cliente
                        </button>
                        {showClientSelector && (
                          <div className="absolute bottom-full mb-1 left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-50">
                            <input 
                              type="text" 
                              placeholder="Buscar cliente..." 
                              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded mb-2 outline-none" 
                              value={clientSearch}
                              onChange={(e) => setClientSearch(e.target.value)}
                            />
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {clientes.filter(c => c.nome.toLowerCase().includes(clientSearch.toLowerCase())).map(c => (
                                <button key={c.id} onClick={() => { setLinkedClient(c); setShowClientSelector(false); }} className="w-full text-left p-2 hover:bg-slate-50 rounded text-xs">
                                  <div className="font-bold">{c.nome}</div>
                                  <div className="text-[10px] text-slate-400">Nível {c.nivel_cliente} • {c.pontos_fidelidade} pts</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1"><Users className="w-3 h-3" /> {linkedClient.nome}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">{linkedClient.pontos_fidelidade} pts disponíveis (Vale R$ {(linkedClient.pontos_fidelidade * 0.1).toFixed(2)})</div>
                        </div>
                        <button onClick={() => setLinkedClient(null)} className="p-1 hover:bg-emerald-100 rounded-lg"><X className="w-4 h-4 text-emerald-600" /></button>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Desconto</span>
                      <div className="flex items-center gap-1">
                        {linkedClient && linkedClient.pontos_fidelidade > 0 && (
                          <button 
                            onClick={() => setDiscount(linkedClient.pontos_fidelidade * 0.1)}
                            className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded mr-1 font-bold"
                          >
                            Usar Pontos
                          </button>
                        )}
                        <span className="text-xs text-slate-300">R$</span>
                        <input
                          type="number"
                          value={discount || ""}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          className="w-16 text-right text-sm border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none focus:border-[#8B5E34]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-[#1F2A44] pt-1 border-t border-slate-100">
                      <span>TOTAL</span>
                      <span className="font-playfair">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="grid grid-cols-5 gap-1">
                    {(["pix", "dinheiro", "credito", "debito", "voucher"] as PaymentMethod[]).map((m) => {
                      const icons: Record<PaymentMethod, React.ReactNode> = {
                        pix: <Smartphone className="w-4 h-4" />,
                        dinheiro: <Banknote className="w-4 h-4" />,
                        credito: <CreditCard className="w-4 h-4" />,
                        debito: <CreditCard className="w-4 h-4" />,
                        voucher: <Zap className="w-4 h-4" />,
                      };
                      return (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[9px] font-bold transition-all ${
                            paymentMethod === m
                              ? "bg-[#1F2A44] text-[#D2B48C]"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {icons[m]}
                          {m === "credito" ? "Crédito" : m === "debito" ? "Débito" : m === "pix" ? "PIX" : m === "voucher" ? "Voucher" : "Dinheiro"}
                        </button>
                      );
                    })}
                  </div>

                  {/* Cash received (only for dinheiro) */}
                  {paymentMethod === "dinheiro" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-600 w-20 shrink-0">Recebido:</label>
                        <div className="relative flex-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">R$</span>
                          <input
                            type="number"
                            value={cashReceived}
                            onChange={(e) => setCashReceived(e.target.value)}
                            placeholder="0,00"
                            className="w-full pl-7 pr-2 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#8B5E34]"
                          />
                        </div>
                      </div>
                      {cashVal > 0 && (
                        <div className={`flex justify-between text-sm font-bold px-2 ${troco >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                          <span>{troco >= 0 ? "Troco:" : "Falta:"}</span>
                          <span>{formatCurrency(Math.abs(troco))}</span>
                        </div>
                      )}
                      {/* Quick cash buttons */}
                      <div className="flex gap-1.5">
                        {[20, 50, 100, 200].map((v) => (
                          <button key={v} onClick={() => setCashReceived(String(v))} className="flex-1 py-1.5 text-[10px] font-bold bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700">
                            R${v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trigger Moderninha Smart or Finalize */}
                  {paymentMethod !== "dinheiro" && (
                    <button
                      type="button"
                      onClick={() => {
                        const typeMap: Record<string, "CREDIT" | "DEBIT" | "PIX" | "VOUCHER"> = {
                          credito: "CREDIT",
                          debito: "DEBIT",
                          pix: "PIX",
                          voucher: "VOUCHER",
                        };
                        const url = buildPlugPagDeeplink({
                          amount: total,
                          paymentType: typeMap[paymentMethod] || "CREDIT",
                        });
                        window.location.href = url;
                      }}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all mb-1"
                    >
                      <Zap className="w-4 h-4" /> Enviar para Moderninha Smart
                    </button>
                  )}

                  {/* Finalize */}
                  <button
                    onClick={finalize}
                    disabled={processing || (paymentMethod === "dinheiro" && cashVal > 0 && troco < 0)}
                    className="w-full py-4 rounded-2xl bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-bold text-base transition-all shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <><RotateCcw className="w-5 h-5 animate-spin" /> Processando...</>
                    ) : (
                      <><Check className="w-5 h-5" /> Finalizar Venda · {formatCurrency(total)}</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty cart footer */}
          {cart.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-300 border-t border-slate-100">
              Selecione os produtos à esquerda
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
