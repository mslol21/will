"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import { MOCK_TESTIMONIALS } from "@/lib/mockData";

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-emporio-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
            Carinho & Depoimentos
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-emporio-navy mb-4">
            Palavras de Quem Já Viveu Essa Experiência
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Depoimentos de peregrinos, turistas e apaixonados por gastronomia artesanal que levam nossos produtos para suas casas.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-3xl p-8 border border-emporio-gold/20 shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-emporio-gold/20 pointer-events-none" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 font-light italic">
                  &quot;{test.comment}&quot;
                </p>
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-emporio-gold/30">
                  <Image src={test.avatar} alt={test.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-sm text-emporio-navy">{test.name}</h4>
                  <p className="text-[11px] text-slate-500">{test.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
