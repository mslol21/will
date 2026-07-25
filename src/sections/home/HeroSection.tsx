"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Award, HeartHandshake } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-[#1F2A44] pt-24 pb-16 overflow-hidden">
      {/* Background Image com Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Empório Caminho da Fé"
          fill
          priority
          className="object-cover object-center filter brightness-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2A44] via-[#1F2A44]/50 to-[#1F2A44]/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        {/* Badge do Empório */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D2B48C]/20 border border-[#D2B48C]/40 text-[#D2B48C] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md font-montserrat"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-[#D2B48C]">
            <Image src="/logo.jpg" alt="Logo Emblem" fill className="object-cover" />
          </div>
          <span>Sabores Tradicionais de Minas Gerais</span>
        </motion.div>

        {/* Título Principal Focado em Vendas */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-playfair text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md"
        >
          O Verdadeiro Sabor Mineiro <br />
          <span className="text-[#D2B48C]">Entregue na Sua Casa</span>
        </motion.h1>

        {/* Subtítulo Sucinto */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-montserrat text-base sm:text-lg text-slate-200 font-normal max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Queijos Canastra maturados, cafés artesanais reserva, doces de tacho e cestas presente montadas com carinho.
        </motion.p>

        {/* Botões Duplos de Ação (CRO) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 font-montserrat"
        >
          <Link
            href="/produtos"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#D2B48C]/40 hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4 text-[#D2B48C]" />
            <span>Ver Produtos em Destaque</span>
          </Link>
          <Link
            href="/montar-cesta"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#D2B48C] font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 border border-[#D2B48C]/40"
          >
            <span>Montar Cesta Personalizada</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Barra de Benefícios & Confiança (CRO Badges) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-left font-montserrat"
        >
          {[
            { icon: Truck, title: "Envio Seguro", desc: "Embalagem térmica protegida" },
            { icon: Award, title: "100% Artesanal", desc: "Produtores da Canastra & Mantiqueira" },
            { icon: ShieldCheck, title: "Compra Garantida", desc: "Pagamento seguro & PIX" },
            { icon: HeartHandshake, title: "Feito com Amor", desc: "Tradição familiar mineira" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#8B5E34]/40 text-[#D2B48C] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-white leading-tight">{title}</p>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
