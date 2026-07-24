"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#1F2A44]">
      {/* Background Image: /images/fachada-loja.jpg com overlay escuro (brightness-50) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=2000&q=90"
          alt="Fachada do Empório Caminho da Fé"
          fill
          priority
          className="object-cover object-center filter brightness-50 scale-105 transform transition-transform duration-10000"
        />
        {/* Layer adicional de legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2A44]/90 via-transparent to-[#1F2A44]/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Selo de Boas-Vindas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D2B48C]/20 border border-[#D2B48C]/40 text-[#D2B48C] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md font-montserrat"
        >
          <Sparkles className="w-4 h-4 text-[#D2B48C]" />
          <span>Tradição & Acolhimento Mineiro</span>
        </motion.div>

        {/* Título em Destaque */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
        >
          Bem-vindo ao <span className="text-[#D2B48C]">Empório Caminho da Fé</span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-montserrat text-base sm:text-xl text-slate-200 font-normal max-w-3xl mx-auto leading-relaxed mb-10"
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
            className="px-10 py-4 rounded-full bg-[#8B5E34] hover:bg-[#1F2A44] text-white font-montserrat font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 border border-[#D2B48C]/30 hover:scale-105"
          >
            <span>Explorar a Loja</span>
            <ArrowRight className="w-4 h-4 text-[#D2B48C]" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
