"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface KitItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

const KITS: KitItem[] = [
  {
    id: "kit-1",
    slug: "cesta-cafe-mineiro",
    title: "Cesta Café Mineiro",
    description: "Café especial moído 500g, broa de milho artesanal e biscoito de polvilho caipira.",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kit-2",
    slug: "cesta-sabores-de-minas",
    title: "Cesta Sabores de Minas",
    description: "Queijo Canastra artesanal peça inteira, doce de leite no tacho de cobre e mel silvestre.",
    price: 180.0,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kit-3",
    slug: "cesta-peregrino",
    title: "Cesta Peregrino",
    description: "Terço em madeira imbuia, caneca esmaltada ágata, café gourmet e vela de cera de abelha.",
    price: 150.0,
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kit-4",
    slug: "cesta-premium-mantiqueira",
    title: "Cesta Premium Mantiqueira",
    description: "Vinho Syrah de altitude 750ml, queijo maturado 45 dias, geleia de pimenta e baú de madeira.",
    price: 250.0,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
  },
];

export function FeaturedSection() {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCart = (kit: KitItem) => {
    addItem({
      id: kit.id,
      slug: kit.slug,
      name: kit.title,
      shortDescription: kit.description,
      fullDescription: kit.description,
      price: kit.price,
      category: "cestas",
      image: kit.image,
      gallery: [kit.image],
      weight: "1.2kg",
      origin: "Minas Gerais",
      sku: `KIT-${kit.id}`,
      stock: 10,
      rating: 5,
      reviewCount: 12,
      badges: [{ type: "mais-vendido", label: "Kit Especial" }],
      isActive: true,
    });

    setAddedItems((prev) => ({ ...prev, [kit.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [kit.id]: false }));
    }, 2000);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#8B5E34]/15 text-[#8B5E34] text-xs font-bold uppercase tracking-widest font-montserrat mb-3">
            Presentes Afetuosos
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-[#1F2A44] mb-4">
            Kits e Cestas Especiais
          </h2>
          <p className="font-montserrat text-sm sm:text-base text-[#2E2E2E] leading-relaxed font-normal">
            Seleções cuidadosamente montadas em caixas kraft e baús artesanais para surpreender quem você ama.
          </p>
        </div>

        {/* Grid Responsivo de 4 Colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {KITS.map((kit, index) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-[#D2B48C] shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Imagem do Card */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2ECE2]">
                  <Image
                    src={kit.image}
                    alt={kit.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#1F2A44]/90 backdrop-blur-md text-[#D2B48C] text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-[#D2B48C]/30 font-montserrat">
                    Edição Especial
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 space-y-2">
                  <h3 className="font-playfair font-bold text-lg text-[#1F2A44] group-hover:text-[#8B5E34] transition-colors">
                    {kit.title}
                  </h3>
                  <p className="font-montserrat text-xs text-[#2E2E2E] line-clamp-2 leading-relaxed font-normal">
                    {kit.description}
                  </p>
                </div>
              </div>

              {/* Preço e Botão Adicionar ao Carrinho */}
              <div className="p-5 pt-0 space-y-4">
                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-montserrat">Valor:</span>
                  <span className="font-playfair text-2xl font-bold text-[#1F2A44]">
                    {formatCurrency(kit.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(kit)}
                  className={`w-full py-3 px-4 rounded-2xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                    addedItems[kit.id]
                      ? "bg-emerald-600 text-white"
                      : "bg-[#8B5E34] hover:bg-[#1F2A44] text-white"
                  }`}
                >
                  {addedItems[kit.id] ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#D2B48C]" />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
