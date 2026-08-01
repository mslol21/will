"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";
import { getCestas } from "@/lib/supabase";
import { GiftBasket } from "@/types";
import { formatCurrency, createWhatsAppLink } from "@/lib/utils";
import { Gift, CheckCircle2, MessageCircle, Sparkles, Wand2 } from "lucide-react";

export function SpecialBaskets() {
  const [baskets, setBaskets] = useState<GiftBasket[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCestas();
      // Only show available featured baskets (limit to 3 for design)
      setBaskets(data.filter(c => c.available).slice(0, 3));
    }
    load();
  }, []);

  return (
    <section className="py-24 bg-emporio-navy text-white relative overflow-hidden">
      {/* Background Subtle Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emporio-gold/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-900/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold text-xs font-bold uppercase tracking-widest mb-3">
            Presentes Memoráveis
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white mb-4">
            Cestas Especiais de Presente
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Surpreenda com caixas nobres de madeira e cestas artesanais recheadas com os melhores quitutes e bênçãos de Minas Gerais.
          </p>
        </div>

        {/* Baskets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {baskets.length === 0 ? (
            <div className="col-span-3 py-10 text-center text-slate-400">
              Carregando cestas exclusivas...
            </div>
          ) : baskets.map((basket, index) => {
            const whatsappMsg = `Olá! Tenho interesse na *${basket.name}* (${formatCurrency(basket.price)}). Como funciona para colocar um cartão de mensagem personalizado?`;
            const whatsappUrl = createWhatsAppLink(INITIAL_STORE_SETTINGS.whatsappNumber, whatsappMsg);

            return (
              <motion.div
                key={basket.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-emporio-navy-dark rounded-3xl overflow-hidden border border-emporio-gold/30 shadow-2xl flex flex-col justify-between group hover:border-emporio-gold transition-colors duration-300"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={basket.image}
                      alt={basket.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emporio-navy-dark via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-emporio-gold text-emporio-navy text-xs font-bold uppercase shadow-sm">
                        Edição Especial
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-playfair text-2xl font-bold text-white mb-2 group-hover:text-emporio-gold transition-colors">
                      {basket.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
                      {basket.description}
                    </p>

                    {/* Included items checklist */}
                    <div className="space-y-2 mb-6 pt-4 border-t border-white/10">
                      <p className="text-xs font-semibold text-emporio-gold uppercase tracking-wider mb-2">
                        Itens Inclusos na Cesta:
                      </p>
                      {basket.includedItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emporio-gold shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTAs */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="flex items-baseline justify-between pt-4 border-t border-white/10">
                    <div>
                      {basket.originalPrice && (
                        <span className="text-xs text-slate-400 line-through mr-2">
                          {formatCurrency(basket.originalPrice)}
                        </span>
                      )}
                      <span className="font-playfair text-2xl font-bold text-white">
                        {formatCurrency(basket.price)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/montar-cesta"
                      className="py-3 px-3 rounded-xl border border-emporio-gold/40 text-emporio-gold hover:bg-emporio-gold/10 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Personalizar</span>
                    </Link>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Encomendar</span>
                    </a>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Call to Custom Creator */}
        <div className="bg-gradient-to-r from-emporio-gold/20 via-emporio-navy-light to-emporio-gold/20 rounded-3xl p-8 sm:p-10 border border-emporio-gold/40 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emporio-gold">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-wider">Crie do Seu Jeito</span>
            </div>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
              Quer montar uma cesta 100% personalizada?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
              Escolha a embalagem (baú de madeira, cesta de palha ou caixa kraft), selecione cada produto artesanal e escreva uma mensagem especial no cartão presente.
            </p>
          </div>

          <Link
            href="/montar-cesta"
            className="px-8 py-4 rounded-full bg-emporio-gold hover:bg-emporio-gold-dark text-emporio-navy font-bold text-sm shadow-gold hover:scale-105 transition-all duration-300 shrink-0"
          >
            Montar Cesta Agora
          </Link>
        </div>

      </div>
    </section>
  );
}
