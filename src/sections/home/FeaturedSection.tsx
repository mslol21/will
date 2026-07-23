"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailModal } from "@/components/product/ProductDetailModal";
import { Product } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.featured);

  return (
    <section className="py-24 bg-emporio-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
              Curadoria de Ouro
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-emporio-navy">
              Produtos em Destaque
            </h2>
          </div>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emporio-gold hover:text-emporio-gold-dark transition-colors group"
          >
            <span>Ver Todos os Destaques</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product, idx) => (
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

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
