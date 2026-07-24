"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#1F2A44]">
      {/* Background Image: /hero.png com overlay escuro (brightness-50) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Banner Principal do Empório Caminho da Fé"
          fill
          priority
          className="object-cover object-center filter brightness-50 scale-105 transform transition-transform duration-10000"
        />
        {/* Layer adicional de legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2A44]/90 via-[#1F2A44]/40 to-[#1F2A44]/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Selo de Boas-Vindas com a Logo Oficial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#D2B48C]/25 border border-[#D2B48C]/50 text-[#D2B48C] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md font-montserrat"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-[#D2B48C]">
            <Image src="/logo.jpg" alt="Logo Emblem" fill className="object-cover" />
          </div>
          <span>Tradição & Acolhimento Mineiro</span>
        </motion.div>

        {/* Título em Destaque */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-md"
        >
          Bem-vindo ao <span className="text-[#D2B48C]">Empório Caminho da Fé</span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-montserrat text-base sm:text-xl text-slate-200 font-normal max-w-3xl mx-auto leading-relaxed mb-10 drop-shadow-sm"
        >
          Sabores de Minas, presentes na sua caminhada. Descubra produtos artesanais repletos de história e tradição.
        </motion.p>

        {/* Botão Call-to-Action: #8B5E34 com hover #1F2A44 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <Link
            href="/produtos"
            className="px-10 py-4 rounded-full bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-montserrat font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 border border-[#D2B48C]/40 hover:scale-105"
          >
            <span>Explorar a Loja</span>
            <ArrowRight className="w-4 h-4 text-[#D2B48C]" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
