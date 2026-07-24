"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Coffee, 
  Gift, 
  Sparkles, 
  HeartHandshake, 
  Compass, 
  Send, 
  CheckCircle2 
} from "lucide-react";
import { submitPrayerRequest } from "@/lib/supabase";

export function ExperienceSection() {
  const [oracaoText, setOracaoText] = useState("");
  const [nomeText, setNomeText] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pilares = [
    {
      icon: Coffee,
      title: "Degustação",
      description: "Experiência sensorial com cafés especiais de altitude e queijos Canastra maturados.",
    },
    {
      icon: Gift,
      title: "Kits Presentes",
      description: "Montagens exclusivas em caixas kraft timbradas e baús de madeira trabalhada.",
    },
    {
      icon: Sparkles,
      title: "Pedidos de Oração",
      description: "Espaço sagrado de intenções que acompanham as bênçãos diárias do Empório.",
    },
    {
      icon: HeartHandshake,
      title: "Atendimento Acolhedor",
      description: "Hospitalidade genuína mineira que trata cada visitante como membro da família.",
    },
    {
      icon: Compass,
      title: "Histórias do Caminho",
      description: "Relatos de fé, superação e transformação vividos pelos peregrinos da rota.",
    },
  ];

  const handleEnviarOracao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oracaoText.trim()) {
      setIsSubmitting(true);
      await submitPrayerRequest(nomeText, oracaoText);
      setIsSubmitting(false);
      setEnviado(true);
      setOracaoText("");
      setNomeText("");
      setTimeout(() => setEnviado(false), 5000);
    }
  };

  return (
    <section id="experiencia" className="py-24 bg-[#F2ECE2] relative border-b border-[#D2B48C]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho dos Pilares */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#8B5E34]/15 text-[#8B5E34] text-xs font-bold uppercase tracking-widest font-montserrat mb-3">
            Nossos Valores & Propósito
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-[#1F2A44] mb-4">
            Nossa Experiência
          </h2>
          <p className="font-montserrat text-sm sm:text-base text-[#2E2E2E] leading-relaxed font-normal">
            Conheça os 5 pilares que fundamentam o acolhimento do Empório Caminho da Fé.
          </p>
        </div>

        {/* Grid dos 5 Pilares */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {pilares.map((pilar, index) => {
            const Icon = pilar.icon;
            return (
              <motion.div
                key={pilar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-[#D2B48C]/50 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#8B5E34]"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#1F2A44] text-[#D2B48C] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-playfair font-bold text-lg text-[#1F2A44] mb-2 group-hover:text-[#8B5E34] transition-colors">
                    {pilar.title}
                  </h3>
                  <p className="font-montserrat text-xs text-[#2E2E2E] leading-relaxed font-normal">
                    {pilar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Formulário Elegante para "Pedidos de Oração Online" integrado ao Supabase */}
        <div id="oracao" className="max-w-3xl mx-auto bg-[#1F2A44] text-white rounded-3xl p-8 sm:p-12 border border-[#D2B48C]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D2B48C]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 text-[#D2B48C] text-xs font-bold uppercase tracking-widest font-montserrat">
              <Sparkles className="w-4 h-4" />
              <span>Espaço Sagrado & Supabase</span>
            </div>
            <h3 className="font-playfair text-2xl sm:text-4xl font-bold text-white">
              Pedidos de Oração Online
            </h3>
            <p className="font-montserrat text-xs sm:text-sm text-slate-300 font-light max-w-xl mx-auto">
              Deixe aqui sua intenção de oração. Nossos joelhos se dobram e suas palavras são salvas com carinho.
            </p>
          </div>

          {enviado ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-900/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-2 text-emerald-200"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-playfair text-xl font-bold text-white">Pedido Salvo e Abençoado!</h4>
              <p className="text-xs font-montserrat">Sua intenção de oração foi registrada no banco de dados com carinho.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleEnviarOracao} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#D2B48C] font-montserrat mb-1 uppercase tracking-wider">
                  Seu Nome (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Maria de Fátima"
                  value={nomeText}
                  onChange={(e) => setNomeText(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D2B48C] font-montserrat"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D2B48C] font-montserrat mb-1 uppercase tracking-wider">
                  Sua Intenção / Pedido de Oração:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva aqui suas palavras, intenções de saúde, família ou caminhada..."
                  value={oracaoText}
                  onChange={(e) => setOracaoText(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D2B48C] font-montserrat"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#8B5E34] hover:bg-[#D2B48C] hover:text-[#1F2A44] text-white font-montserrat font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Gravando no Supabase..." : "Enviar Pedido de Oração"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
