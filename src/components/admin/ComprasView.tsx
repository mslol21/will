"use client";

import { useState, useEffect } from "react";
import { 
  Package, Plus, Search, Building2, Truck, CheckCircle2, XCircle, ChevronDown, Save, X, ShoppingCart, Trash2
} from "lucide-react";
import { getFornecedores, insertFornecedor, getPedidosCompra, insertPedidoCompra, receberPedidoCompra } from "@/lib/supabase";
import { Fornecedor, PedidoCompra, Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function ComprasView({ productsList }: { productsList: Product[] }) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fornecedor Modal
  const [isFornecedorModalOpen, setIsFornecedorModalOpen] = useState(false);
  const [formFornecedor, setFormFornecedor] = useState<Partial<Fornecedor>>({});

  // Pedido Modal
  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);
  const [formPedido, setFormPedido] = useState({ fornecedorId: "", valorTotal: 0 });
  const [itensPedido, setItensPedido] = useState<{produtoId: string; quantidade: number; custoUnitario: number}[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    const [fRes, pRes] = await Promise.all([getFornecedores(), getPedidosCompra()]);
    setFornecedores(fRes as any);
    setPedidos(pRes.data as any);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveFornecedor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFornecedor.nomeFantasia) return;
    await insertFornecedor(formFornecedor);
    setIsFornecedorModalOpen(false);
    setFormFornecedor({});
    loadData();
  };

  const handleAddProductToPedido = () => {
    setItensPedido([...itensPedido, { produtoId: productsList[0]?.id || "", quantidade: 1, custoUnitario: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItens = [...itensPedido];
    (newItens[index] as any)[field] = value;
    setItensPedido(newItens);
    
    // Auto-calculate total
    const total = newItens.reduce((sum, item) => sum + (item.quantidade * item.custoUnitario), 0);
    setFormPedido({ ...formPedido, valorTotal: total });
  };

  const handleSavePedido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPedido.fornecedorId || itensPedido.length === 0) return;
    await insertPedidoCompra(formPedido, itensPedido);
    setIsPedidoModalOpen(false);
    setFormPedido({ fornecedorId: "", valorTotal: 0 });
    setItensPedido([]);
    loadData();
  };

  const handleReceberPedido = async (pedidoId: string) => {
    if (!confirm("Tem certeza que este pedido foi recebido? O estoque será atualizado e um lançamento financeiro (Despesa) será criado automaticamente.")) return;
    await receberPedidoCompra(pedidoId);
    loadData();
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Carregando dados de compras...</div>;

  return (
    <div className="space-y-8">
      {/* HEADER COMPRAS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="text-[#8B5E34]" /> Gestão de Compras e Fornecedores
          </h2>
          <p className="text-sm text-slate-500">Controle o abastecimento e custo médio do seu empório.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LISTA DE FORNECEDORES */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Fornecedores
            </h3>
            <button 
              onClick={() => setIsFornecedorModalOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {fornecedores.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-8 border-2 border-dashed rounded-xl">Nenhum fornecedor cadastrado.</div>
            ) : (
              fornecedores.map(f => (
                <div key={f.id} className="p-3 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors">
                  <h4 className="font-bold text-slate-800">{f.nomeFantasia}</h4>
                  {f.telefone && <p className="text-xs text-slate-500">📞 {f.telefone}</p>}
                  {f.cnpj && <p className="text-xs text-slate-500">CNPJ: {f.cnpj}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* LISTA DE PEDIDOS */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Pedidos de Compra
            </h3>
            <button 
              onClick={() => setIsPedidoModalOpen(true)}
              className="bg-[#8B5E34] hover:bg-[#704A29] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Novo Pedido
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-100 sticky top-0 bg-white">
                <tr>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Fornecedor</th>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium text-right">Valor Total</th>
                  <th className="pb-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 border-2 border-dashed rounded-xl mt-4">
                      Nenhum pedido de compra registrado.
                    </td>
                  </tr>
                ) : (
                  pedidos.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-4">
                        {p.status === "pendente" ? (
                          <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold">Pendente</span>
                        ) : p.status === "recebido" ? (
                          <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">Recebido</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">Cancelado</span>
                        )}
                      </td>
                      <td className="py-4 font-medium text-slate-800">{p.fornecedor?.nomeFantasia || "N/A"}</td>
                      <td className="py-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-right font-bold text-[#8B5E34]">{formatCurrency(p.valorTotal)}</td>
                      <td className="py-4 text-right">
                        {p.status === "pendente" && (
                          <button 
                            onClick={() => handleReceberPedido(p.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg transition-colors"
                            title="Marcar como Recebido (Entrar Estoque)"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL NOVO FORNECEDOR */}
      {isFornecedorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Novo Fornecedor</h3>
              <button onClick={() => setIsFornecedorModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveFornecedor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nome Fantasia *</label>
                <input required type="text" value={formFornecedor.nomeFantasia || ""} onChange={e => setFormFornecedor({...formFornecedor, nomeFantasia: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CNPJ</label>
                  <input type="text" value={formFornecedor.cnpj || ""} onChange={e => setFormFornecedor({...formFornecedor, cnpj: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Telefone</label>
                  <input type="text" value={formFornecedor.telefone || ""} onChange={e => setFormFornecedor({...formFornecedor, telefone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#8B5E34] text-white font-bold py-3 rounded-xl mt-6">Salvar Fornecedor</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO PEDIDO */}
      {isPedidoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Novo Pedido de Compra</h3>
              <button onClick={() => setIsPedidoModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSavePedido} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Selecione o Fornecedor *</label>
                <select required value={formPedido.fornecedorId} onChange={e => setFormPedido({...formPedido, fornecedorId: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50">
                  <option value="">-- Escolha um Fornecedor --</option>
                  {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nomeFantasia}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="block text-xs font-bold text-slate-500">Itens Comprados</label>
                  <button type="button" onClick={handleAddProductToPedido} className="text-[#8B5E34] text-xs font-bold flex items-center gap-1 hover:underline"><Plus className="w-3 h-3"/> Adicionar Produto</button>
                </div>
                
                {itensPedido.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <select value={item.produtoId} onChange={e => updateItem(idx, "produtoId", e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm">
                      {productsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" min="1" placeholder="Qtd" value={item.quantidade} onChange={e => updateItem(idx, "quantidade", parseInt(e.target.value)||1)} className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
                    <input type="number" step="0.01" placeholder="R$ Custo" value={item.custoUnitario} onChange={e => updateItem(idx, "custoUnitario", parseFloat(e.target.value)||0)} className="w-28 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
                    <button type="button" onClick={() => setItensPedido(itensPedido.filter((_, i) => i !== idx))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 p-4 rounded-xl flex justify-between items-center">
                <span className="font-bold text-slate-600 text-sm">Valor Total do Pedido:</span>
                <span className="text-xl font-bold text-[#8B5E34]">{formatCurrency(formPedido.valorTotal)}</span>
              </div>

              <button type="submit" className="w-full bg-[#8B5E34] hover:bg-[#704A29] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Save className="w-5 h-5"/> Salvar Pedido de Compra
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
