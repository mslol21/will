"use client";

import { useState, useEffect } from "react";
import { 
  Gift, Plus, Edit3, Trash2, X, Save, CheckCircle2, Package
} from "lucide-react";
import { getCestas, insertCesta, updateCesta, deleteCesta } from "@/lib/supabase";
import { GiftBasket } from "@/types";
import { formatCurrency, slugify } from "@/lib/utils";
import Image from "next/image";

export function CestasView() {
  const [cestas, setCestas] = useState<GiftBasket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCesta, setEditingCesta] = useState<GiftBasket | null>(null);
  
  // Form State
  const [form, setForm] = useState<Partial<GiftBasket>>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    image: "",
    includedItems: [],
    containerType: "caixa-kraft",
    available: true
  });
  const [newItemName, setNewItemName] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    const data = await getCestas();
    setCestas(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingCesta(null);
    setForm({
      name: "",
      description: "",
      price: 0,
      image: "",
      includedItems: [],
      containerType: "caixa-kraft",
      available: true
    });
    setNewItemName("");
    setIsModalOpen(true);
  };

  const openEditModal = (cesta: GiftBasket) => {
    setEditingCesta(cesta);
    setForm({ ...cesta });
    setNewItemName("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta cesta?")) return;
    await deleteCesta(id);
    loadData();
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    setForm(prev => ({
      ...prev,
      includedItems: [...(prev.includedItems || []), newItemName.trim()]
    }));
    setNewItemName("");
  };

  const handleRemoveItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      includedItems: prev.includedItems?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    
    const payload = {
      ...form,
      slug: slugify(form.name)
    };

    if (editingCesta) {
      await updateCesta(editingCesta.id, payload);
    } else {
      await insertCesta(payload);
    }
    
    setIsModalOpen(false);
    loadData();
  };

  // Convert image to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Carregando Kits e Cestas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Gift className="text-[#8B5E34]" /> Gestão de Kits e Cestas
          </h2>
          <p className="text-sm text-slate-500">Crie opções de presentes e kits especiais para a página inicial.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-[#8B5E34] hover:bg-[#704A29] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Cesta
        </button>
      </div>

      {cestas.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 text-sm">
          Nenhuma cesta cadastrada. Clique em "Nova Cesta" para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cestas.map((cesta) => (
            <div key={cesta.id} className={`bg-white rounded-3xl overflow-hidden border ${cesta.available ? 'border-slate-200' : 'border-red-200 opacity-70'} shadow-sm flex flex-col`}>
              <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                {cesta.image ? (
                  <Image src={cesta.image} alt={cesta.name} fill className="object-cover" />
                ) : (
                  <Gift className="w-12 h-12 text-slate-300" />
                )}
                {!cesta.available && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Indisponível</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{cesta.name}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{cesta.description}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {cesta.originalPrice && (
                        <span className="text-xs text-slate-400 line-through block">{formatCurrency(cesta.originalPrice)}</span>
                      )}
                      <span className="font-bold text-[#8B5E34] text-xl">{formatCurrency(cesta.price)}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                      {cesta.containerType}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button onClick={() => openEditModal(cesta)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cesta.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingCesta ? "Editar Cesta" : "Nova Cesta"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500">Nome da Cesta *</label>
                  <input required type="text" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500">Descrição</label>
                  <textarea rows={2} value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">Preço Atual (R$) *</label>
                  <input required type="number" step="0.01" value={form.price || ""} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">Preço Antigo (Opcional)</label>
                  <input type="number" step="0.01" value={form.originalPrice || ""} onChange={e => setForm({...form, originalPrice: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">Tipo de Embalagem</label>
                  <select value={form.containerType} onChange={e => setForm({...form, containerType: e.target.value as any})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                    <option value="caixa-kraft">Caixa Kraft Festiva</option>
                    <option value="cesta-palha">Cesta de Palha Trançada</option>
                    <option value="bau-madeira">Baú Luxo de Madeira</option>
                  </select>
                </div>
                
                <div className="space-y-1 flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-600">
                    <input type="checkbox" checked={form.available} onChange={e => setForm({...form, available: e.target.checked})} className="w-4 h-4 rounded text-[#8B5E34]" />
                    Disponível para venda
                  </label>
                </div>
              </div>

              {/* Itens Inclusos */}
              <div className="mt-6 border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-500 mb-2">Itens Inclusos (Apenas Descritivos)</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="Ex: Queijo Canastra 500g" 
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                  />
                  <button type="button" onClick={handleAddItem} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold text-sm">
                    Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {(form.includedItems || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-sm">
                      <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> {item}</span>
                      <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                  {(form.includedItems || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">Nenhum item adicionado.</p>
                  )}
                </div>
              </div>

              {/* Imagem */}
              <div className="mt-6 border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-500 mb-2">Imagem da Cesta</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100" />
                {form.image && (
                  <div className="mt-4 relative h-32 w-32 rounded-xl overflow-hidden border border-slate-200">
                    <Image src={form.image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-[#8B5E34] hover:bg-[#704A29] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6">
                <Save className="w-5 h-5"/> Salvar Cesta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
