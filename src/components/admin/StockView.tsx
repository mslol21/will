import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { adjustStock, getMovimentacoes } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface StockViewProps {
  productsList: Product[];
  onStockUpdate: () => void;
}

export function StockView({ productsList, onStockUpdate }: StockViewProps) {
  const [movimentacoes, setMovimentacoes] = React.useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = React.useState(false);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const { data } = await getMovimentacoes();
    setMovimentacoes(data);
    setLoadingHistory(false);
  };

  React.useEffect(() => {
    loadHistory();
  }, []);

  const handleAdjustStock = async (product: Product, newStock: number) => {
    if (newStock < 0) return;
    const { error } = await adjustStock(product.id, product.stock, newStock, "Ajuste pelo Painel");
    if (error) {
      toast.error("Erro ao atualizar o estoque!");
      return;
    }
    toast.success(`Estoque de ${product.name} atualizado!`);
    onStockUpdate();
    loadHistory();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-[#1F2A44] dark:text-slate-100">
          Controle de Estoque e Lotes
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ajuste rápido de quantidades — histórico salvo no Supabase
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-[11px] uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">Produto</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4">Estoque</th>
                    <th className="p-4 text-center">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#1F2A44] dark:text-slate-200">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.sku} | {p.category}
                        </div>
                      </td>
                      <td className="p-4">{formatCurrency(p.price)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full font-bold ${
                            p.stock <= 5
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                          }`}
                        >
                          {p.stock} un
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handleAdjustStock(p, p.stock - 1)}
                          >
                            -
                          </Button>
                          <input
                            type="number"
                            className="w-14 text-center bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs focus:outline-none"
                            value={p.stock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) handleAdjustStock(p, val);
                            }}
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handleAdjustStock(p, p.stock + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Histórico Recente</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="text-center py-4 text-xs text-slate-500">Carregando histórico...</div>
              ) : movimentacoes.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">Nenhuma movimentação registrada.</div>
              ) : (
                <div className="space-y-4">
                  {movimentacoes.map((mov) => (
                    <div
                      key={mov.id}
                      className="text-xs border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-[#1F2A44] dark:text-slate-200">
                          {mov.produto?.name || "Produto excluído"}
                        </span>
                        <span
                          className={`font-bold ${
                            mov.tipo === "entrada"
                              ? "text-emerald-500"
                              : mov.tipo === "saida"
                              ? "text-red-500"
                              : "text-amber-500"
                          }`}
                        >
                          {mov.tipo === "entrada" ? "+" : mov.tipo === "saida" ? "-" : ""}
                          {mov.quantidade}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>{new Date(mov.created_at).toLocaleString("pt-BR")}</span>
                        <span>{mov.motivo}</span>
                      </div>
                      {mov.responsavel?.nome && (
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          Usuário: {mov.responsavel.nome}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
