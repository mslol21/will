import * as React from "react";
import { Users, Star, Gift, Search, Plus, Calendar, Edit3, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Cliente } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getClientes, insertCliente } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

export function CrmView() {
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Form states
  const [nome, setNome] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [dataNasc, setDataNasc] = React.useState("");

  const loadData = async () => {
    const { data } = await getClientes();
    setClientes(data);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    
    const { error } = await insertCliente({
      nome,
      telefone,
      data_nascimento: dataNasc || undefined,
    });

    if (error) {
      toast.error("Erro ao salvar cliente.");
    } else {
      toast.success("Cliente cadastrado com sucesso!");
      setIsModalOpen(false);
      setNome("");
      setTelefone("");
      setDataNasc("");
      loadData();
    }
  };

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.telefone?.includes(searchTerm)
  );

  const getNivelColor = (nivel: string) => {
    switch(nivel) {
      case "Diamante": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200";
      case "Ouro": return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200";
      case "Prata": return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300";
      case "Bronze": default: return "bg-orange-50 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-[#1F2A44] dark:text-slate-100">
            CRM & Fidelização
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestão de clientes, níveis de cashback e histórico
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#8B5E34] hover:bg-[#1F2A44] flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle>Base de Clientes</CardTitle>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Buscar por nome ou telefone..." 
                className="pl-9 h-9 text-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold">
                    <th className="py-3 px-2">Cliente</th>
                    <th className="py-3 px-2">Nível</th>
                    <th className="py-3 px-2 text-right">LTV (Gasto Total)</th>
                    <th className="py-3 px-2 text-center">Pontos</th>
                    <th className="py-3 px-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredClientes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">Nenhum cliente encontrado.</td>
                    </tr>
                  ) : filteredClientes.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                      <td className="py-3 px-2">
                        <div className="font-bold text-[#1F2A44] dark:text-slate-200">{c.nome}</div>
                        <div className="text-[10px] text-slate-400">{c.telefone || "Sem telefone"}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getNivelColor(c.nivel_cliente)}`}>
                          {c.nivel_cliente}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-medium">
                        {formatCurrency(c.total_comprado)}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {c.pontos_fidelidade}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button className="p-1.5 text-slate-400 hover:text-[#8B5E34] transition-colors"><Edit3 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <Gift className="w-4 h-4" /> Aniversariantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-500 mb-4">
                Envie cupons de desconto para clientes que fazem aniversário este mês.
              </div>
              <div className="space-y-3">
                {clientes.filter(c => {
                  if(!c.data_nascimento) return false;
                  const month = new Date(c.data_nascimento).getMonth();
                  return month === new Date().getMonth();
                }).length === 0 ? (
                  <div className="text-[10px] text-center text-slate-400 border border-dashed rounded-lg p-3">
                    Nenhum aniversariante este mês.
                  </div>
                ) : clientes.filter(c => c.data_nascimento && new Date(c.data_nascimento).getMonth() === new Date().getMonth()).map(c => (
                  <div key={c.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                    <div>
                      <div className="font-bold text-[#1F2A44] dark:text-slate-200 text-xs">{c.nome}</div>
                      <div className="text-[10px] text-slate-400">{new Date(c.data_nascimento!).toLocaleDateString('pt-BR').slice(0, 5)}</div>
                    </div>
                    <Button variant="secondary" size="icon" className="w-7 h-7 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                      <Gift className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nome Completo *</label>
              <Input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Maria Silva" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Telefone (WhatsApp)</label>
                <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 90000-0000" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Data de Nascimento</label>
                <Input type="date" value={dataNasc} onChange={e => setDataNasc(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#8B5E34] hover:bg-[#1F2A44]">Salvar Cliente</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
