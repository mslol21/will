"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/mockData";
import { Sparkles, ArrowRight } from "lucide-react";

export function CategoriesSection() {
  return (
    <section id="categorias" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
              Seleções Especiais
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-emporio-navy">
              Explore Nossas Categorias
            </h2>
          </div>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emporio-gold hover:text-emporio-gold-dark transition-colors group"
          >
            <span>Ver Todo o Catálogo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={`/produtos?categoria=${category.id}`}
                className="group relative block aspect-[16/10] rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 border border-emporio-gold/20"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emporio-navy-dark/90 via-emporio-navy/40 to-transparent group-hover:via-emporio-navy/60 transition-colors" />

                {/* Badge Item Count */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-slate-200 text-xs font-medium border border-white/10">
                    {category.itemCount} itens
                  </span>
                </div>

                {/* Category Content */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end">
                  <h3 className="font-playfair text-xl font-bold text-white group-hover:text-emporio-gold transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
