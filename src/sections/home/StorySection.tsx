"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

export function StorySection() {
  return (
    <section id="historia" className="py-24 bg-[#F2ECE2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Layout em 2 Colunas no Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Coluna 1: Imagem do selo da marca (/logo.jpg) em formato circular/suave com sombra */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-[#D2B48C] bg-[#1F2A44] flex items-center justify-center p-2"
            >
              <Image
                src="/logo.jpg"
                alt="Selo do Empório Caminho da Fé"
                fill
                className="object-cover rounded-full p-1"
              />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D2B48C]/60 pointer-events-none" />
            </motion.div>
          </div>

          {/* Coluna 2: Título "Da Fé Nasceu um Sonho", texto institucional e frase em destaque */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#8B5E34]/15 text-[#8B5E34] text-xs font-bold uppercase tracking-widest font-montserrat">
              Nossa História & Essência
            </span>

            <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-[#1F2A44]">
              Da Fé Nasceu um Sonho
            </h2>

            <p className="font-montserrat text-sm sm:text-base text-[#2E2E2E] leading-relaxed">
              O **Empório Caminho da Fé** nasceu à beira da rota sagrada de peregrinação, fruto do amor pela terra mineira e pela acolhida fraterna. O que começou com a partilha de um café fresco assado na lenha e de um pedaço de queijo Canastra maturado para os caminhantes, transformou-se em um refúgio de resgate cultural, espiritual e gastronômico.
            </p>

            <p className="font-montserrat text-sm sm:text-base text-[#2E2E2E] leading-relaxed">
              Trabalhamos exclusivamente com mestres queijeiros, cafeicultores de alta altitude da Mantiqueira e artesãos locais que dedicam suas vidas à preservação das receitas ancestrais da família mineira.
            </p>

            {/* Frase em destaque: "Sabores que alimentam o corpo e a alma" */}
            <div className="pt-4">
              <div className="bg-[#1F2A44] text-[#F2ECE2] p-6 rounded-2xl border-l-4 border-[#D2B48C] shadow-lg">
                <p className="font-playfair text-xl sm:text-2xl font-bold italic tracking-wide text-[#D2B48C] mb-1">
                  &quot;Sabores que alimentam o corpo e a alma.&quot;
                </p>
                <span className="text-xs font-montserrat text-slate-300 font-medium">
                  — Empório Caminho da Fé
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
