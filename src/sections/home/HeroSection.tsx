"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Gift, ArrowDown, ShieldCheck, Heart } from "lucide-react";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";
import { createWhatsAppLink } from "@/lib/utils";

export function HeroSection() {
  const whatsappUrl = createWhatsAppLink(
    INITIAL_STORE_SETTINGS.whatsappNumber,
    "Olá! Gostaria de conhecer os produtos do Empório Caminho da Fé."
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-emporio-navy-dark">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=2000&q=90"
          alt="Empório Caminho da Fé Hero"
          fill
          priority
          className="object-cover object-center opacity-35 scale-105 transform transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emporio-navy-dark via-emporio-navy/80 to-emporio-navy-dark/95" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emporio-gold/15 border border-emporio-gold/40 text-emporio-gold text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tradição & Gastronomia de Minas Gerais</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
        >
          Empório <span className="text-gold-gradient">Caminho da Fé</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-2xl text-slate-200 font-light max-w-3xl mx-auto leading-relaxed mb-10"
        >
          Sabores de Minas. Presentes para a sua caminhada. Um refúgio de aconchego, queijos artesanais, cafés especiais e artigos abençoados.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-14"
        >
          <Link
            href="/produtos"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emporio-gold to-emporio-gold-dark text-emporio-navy font-bold text-sm shadow-gold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Ver Catálogo Completo</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </Link>

          <Link
            href="/montar-cesta"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-emporio-gold" />
            <span>Montar uma Cesta</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-white/10 text-xs text-slate-300"
        >
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emporio-gold" />
            <span>Queijos de Leite Cru Maturados</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-emporio-gold" />
            <span>Produção Artesanal Familiar</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emporio-gold" />
            <span>Entrega Segura no Brasil</span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-12 inline-block text-slate-400 hover:text-emporio-gold cursor-pointer"
        >
          <a href="#historia" aria-label="Rolar para baixo">
            <ArrowDown className="w-6 h-6 mx-auto" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
