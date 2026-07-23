"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailModal } from "@/components/product/ProductDetailModal";
import { Product } from "@/types";
import { Sparkles, Heart, Cross, Shield } from "lucide-react";

export function PeregrinoSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const peregrinoProducts = MOCK_PRODUCTS.filter((p) => p.isPeregrino || p.category === "peregrino");

  return (
    <section id="peregrino" className="py-24 bg-emporio-beige relative overflow-hidden">
      {/* Background Kraft accent */}
      <div className="absolute inset-0 opacity-30 bg-kraft-texture pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-900/10 text-blue-900 border border-blue-900/20 text-xs font-bold uppercase tracking-widest mb-3">
            Espiritualidade & Devoção
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-emporio-navy mb-4">
            Linha Peregrino & Fé
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Símbolos de fé, oração e bênção criados para guardar com carinho e acompanhar a sua caminhada espiritual e de vida.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white/90 border border-emporio-gold/20 shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-base text-emporio-navy mb-1">
                Terços em Madeira Nobre
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Esculpidos artesanalmente com cordão trançado de alta resistência para viagens e oração diária.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/90 border border-emporio-gold/20 shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-base text-emporio-navy mb-1">
                Velas de Cera de Abelha
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Produzidas com cera pura sem parafinas petrolíferas, iluminando o ambiente com aroma natural de mel.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/90 border border-emporio-gold/20 shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-base text-emporio-navy mb-1">
                Lembranças Abençoadas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Canecas esmaltadas, livros de meditação e kits presenteáveis com a marca registrada do Caminho.
              </p>
            </div>
          </div>
        </div>

        {/* Peregrino Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {peregrinoProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <ProductCard
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            </motion.div>
          ))}
        </div>

      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
