"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Heart, Compass, Shield, Award } from "lucide-react";
import { TIMELINE_EVENTS } from "@/lib/mockData";

export function StorySection() {
  return (
    <section id="historia" className="py-24 bg-emporio-beige relative overflow-hidden">
      {/* Background Subtle Kraft Texture */}
      <div className="absolute inset-0 opacity-40 bg-kraft-texture pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
            Tradição & Acolhimento
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-emporio-navy mb-4">
            Onde Minas Gerais Encontra a Fé
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Mais que um empório de sabores, um refúgio de descanso, memórias afetivas e hospitalidade genuína nas montanhas da Mantiqueira.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Image Showcase */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=1200&q=80"
                alt="Empório Caminho da Fé Loja Física"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating Quote Card */}
            <div className="absolute -bottom-6 -right-2 sm:bottom-6 sm:right-6 bg-emporio-navy text-white p-6 rounded-2xl max-w-xs shadow-xl border border-emporio-gold/30 hidden sm:block">
              <Sparkles className="w-6 h-6 text-emporio-gold mb-2" />
              <p className="font-playfair text-sm italic leading-relaxed text-slate-200">
                &quot;Cada cafezinho passado no coador de pano é um abraço e uma oração para quem caminha.&quot;
              </p>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="space-y-6">
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-emporio-navy">
              Uma Jornada Nascida do Amor e da Devoção
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              O **Empório Caminho da Fé** nasceu à beira da rota sagrada de peregrinação. Nossos fundadores, nascidos em famílias de mestres queijeiros e cafeicultores de altitude, começaram abrindo a porta de casa para oferecer água fresca, café quente e broa de milho aos caminhantes.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Hoje, preservamos o mesmo espírito: curadoria rigorosa de pequenos produtores artesanais mineiros, respeitando o tempo de maturação dos queijos, a torra artesanal do café e a sacralidade dos símbolos de devoção.
            </p>

            {/* Mission & Values Pills */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/80 border border-emporio-gold/20 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emporio-gold/20 text-emporio-gold-dark flex items-center justify-center mb-2">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-playfair font-semibold text-sm text-emporio-navy mb-1">Acolhimento</h4>
                <p className="text-[11px] text-slate-600">Tratamos cada cliente como um visitante de nossa casa.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-emporio-gold/20 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emporio-gold/20 text-emporio-gold-dark flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-playfair font-semibold text-sm text-emporio-navy mb-1">Autenticidade</h4>
                <p className="text-[11px] text-slate-600">Alimentos puros, sem aditivos e com indicação de origem.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emporio-gold/20 shadow-card">
          <h3 className="font-playfair text-2xl font-bold text-center text-emporio-navy mb-10">
            Nossa Linha do Tempo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {TIMELINE_EVENTS.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative p-6 rounded-2xl bg-emporio-beige/40 border border-emporio-gold/20 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold text-emporio-navy font-extrabold text-xs mb-3 shadow-sm">
                    {event.year}
                  </span>
                  <h4 className="font-playfair font-bold text-base text-emporio-navy mb-2">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
