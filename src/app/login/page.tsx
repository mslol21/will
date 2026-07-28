import { redirect } from "next/navigation";
import { login } from "./actions";
import { Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emporio-beige font-montserrat p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-emporio-navy text-emporio-gold flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h1 className="font-playfair text-2xl font-bold text-emporio-navy">Acesso Restrito</h1>
            <p className="text-xs text-slate-500">Empório Caminho da Fé</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emporio-gold bg-slate-50 focus:bg-white transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600" htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emporio-gold bg-slate-50 focus:bg-white transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            formAction={login}
            className="w-full py-3 rounded-xl bg-emporio-navy text-white font-bold hover:bg-[#151c2f] transition-colors shadow-lg active:scale-95"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
