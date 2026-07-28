import * as React from "react";
import { Package, DollarSign, TrendingUp, Percent, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Product } from "@/types";

interface DashboardViewProps {
  productsList: Product[];
  stockValue: number;
  totalReceitas: number;
  meiUsed: string;
  meiRemaining: number;
}

export function DashboardView({
  productsList,
  stockValue,
  totalReceitas,
  meiUsed,
  meiRemaining,
}: DashboardViewProps) {
  const activeProducts = productsList.filter((p) => p.isActive).length;
  const meiPercentage = parseFloat(meiUsed);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-[#1F2A44] dark:text-slate-100">
          Visão Panorâmica
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Métricas em tempo real do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Produtos Ativos
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2A44] dark:text-slate-100 font-playfair">
              {activeProducts}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#8B5E34]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Valor em Estoque
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-[#8B5E34] dark:text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2A44] dark:text-slate-100 font-playfair">
              {formatCurrency(stockValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Receitas (Geral)
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2A44] dark:text-slate-100 font-playfair">
              {formatCurrency(totalReceitas)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Teto MEI
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Percent className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2A44] dark:text-slate-100 font-playfair">
              {meiUsed}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#8B5E34] dark:text-amber-400" />
            <CardTitle>Monitoramento do Teto MEI (R$ 81.000,00)</CardTitle>
            <span
              className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold ${
                meiPercentage < 80
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400"
              }`}
            >
              {meiPercentage < 80 ? "Dentro do Limite" : "Atenção: Limite Próximo!"}
            </span>
          </div>
          <CardDescription>
            Receitas: {formatCurrency(totalReceitas)} | Margem Restante:{" "}
            {formatCurrency(meiRemaining)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                meiPercentage < 60
                  ? "bg-emerald-500"
                  : meiPercentage < 80
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(meiPercentage, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
