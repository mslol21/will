import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface Lancamento {
  id: string;
  tipo: "receita" | "custo" | "despesa";
  descricao: string;
  valor: string | number;
  data: string;
  categoria?: string;
}

interface FinanceViewProps {
  lancamentos: Lancamento[];
  onAddLancamento: (e: React.FormEvent, tipo: any, desc: string, valor: string, data: string) => Promise<void>;
  onDeleteLancamento: (id: string) => Promise<void>;
}

export function FinanceView({ lancamentos, onAddLancamento, onDeleteLancamento }: FinanceViewProps) {
  const [lancTipo, setLancTipo] = React.useState<"receita" | "custo" | "despesa">("receita");
  const [lancDesc, setLancDesc] = React.useState("");
  const [lancValor, setLancValor] = React.useState("");
  const [lancData, setLancData] = React.useState(new Date().toISOString().slice(0, 10));

  const handleAdd = async (e: React.FormEvent) => {
    await onAddLancamento(e, lancTipo, lancDesc, lancValor, lancData);
    setLancDesc("");
    setLancValor("");
  };

  // Process data for charts
  const processChartData = () => {
    // Group by date
    const grouped: Record<string, { date: string; receitas: number; despesas: number }> = {};
    
    // Sort ascending for chart
    const sorted = [...lancamentos].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    
    sorted.forEach((l) => {
      const dateStr = new Date(l.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      if (!grouped[dateStr]) grouped[dateStr] = { date: dateStr, receitas: 0, despesas: 0 };
      
      const val = typeof l.valor === "string" ? parseFloat(l.valor) : l.valor;
      if (l.tipo === "receita") grouped[dateStr].receitas += val;
      else grouped[dateStr].despesas += val;
    });

    return Object.values(grouped).slice(-30); // Last 30 days
  };

  const chartData = React.useMemo(() => processChartData(), [lancamentos]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-[#1F2A44] dark:text-slate-100">
          Painel Financeiro & Relatórios
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Acompanhamento de caixa, DRE gerencial e métricas
        </p>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Fluxo de Caixa (Últimos dias)
          </CardTitle>
          <CardDescription>Receitas vs. Custos/Despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `R$ ${val}`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
                <Area type="monotone" dataKey="despesas" name="Saídas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDespesa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adicionar Lançamento */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Novo Lançamento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLancTipo("receita")}
                    className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                      lancTipo === "receita"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ArrowUpRight className="w-3 h-3" /> Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => setLancTipo("custo")}
                    className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                      lancTipo === "custo"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    Custo (CMV)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLancTipo("despesa")}
                    className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                      lancTipo === "despesa"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ArrowDownRight className="w-3 h-3" /> Despesa
                  </button>
                </div>
                <Input
                  type="text"
                  placeholder="Descrição da movimentação"
                  value={lancDesc}
                  onChange={(e) => setLancDesc(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Valor (R$)"
                    value={lancValor}
                    onChange={(e) => setLancValor(e.target.value)}
                    required
                  />
                  <Input
                    type="date"
                    value={lancData}
                    onChange={(e) => setLancData(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Registrar</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Lançamentos */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>Visualizando todos os lançamentos manuais e automáticos (PDV)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto pr-2">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white dark:bg-[#1F2A44] z-10">
                    <tr className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">Data</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3 text-right">Valor</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {lancamentos.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                        <td className="p-3">{new Date(l.data).toLocaleDateString("pt-BR")}</td>
                        <td className="p-3 font-medium">{l.descricao}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              l.tipo === "receita"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                                : l.tipo === "despesa"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                            }`}
                          >
                            {l.tipo}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold font-mono">
                          {formatCurrency(typeof l.valor === "string" ? parseFloat(l.valor) : l.valor)}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteLancamento(l.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
