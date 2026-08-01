"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { getProdutos } from "@/lib/supabase";
import { Product } from "@/types";

export function FeaturedSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const data = await getProdutos();
      setFeaturedProducts(data.filter(p => p.featured && p.isActive).slice(0, 4));
      setIsLoading(false);
    }
    load();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#8B5E34]/15 text-[#8B5E34] text-xs font-bold uppercase tracking-widest font-montserrat mb-3">
            Nossos Destaques
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-[#1F2A44] mb-4">
            Produtos em Destaque
          </h2>
          <p className="font-montserrat text-sm sm:text-base text-[#2E2E2E] leading-relaxed font-normal">
            Os itens mais queridos e procurados do nosso empório.
          </p>
        </div>

        {/* Grid de Produtos */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Carregando destaques...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <p>Nenhum produto em destaque no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col group border border-[#D2B48C]/20"
              >
                <Link href={`/produtos/${product.slug}`} className="relative aspect-[4/3] overflow-hidden block bg-[#F2ECE2]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Conteúdo do Card */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-2">
                  <div>
                    <Link href={`/produtos/${product.slug}`}>
                      <h3 className="font-playfair font-bold text-lg text-[#1F2A44] group-hover:text-[#8B5E34] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-montserrat text-xs text-[#2E2E2E] line-clamp-2 leading-relaxed font-normal mt-2">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Preço e Botão Adicionar ao Carrinho */}
                <div className="p-5 pt-0 space-y-4">
                  <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-montserrat">Valor:</span>
                    <span className="font-playfair text-2xl font-bold text-[#1F2A44]">
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-3 px-4 rounded-2xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                      addedItems[product.id]
                        ? "bg-emerald-600 text-white"
                        : "bg-[#8B5E34] hover:bg-[#1F2A44] text-white"
                    }`}
                  >
                    {addedItems[product.id] ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#D2B48C]" />
                        <span>Adicionar</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
