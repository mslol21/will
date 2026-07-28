"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchModal } from "@/components/product/SearchModal";
import { HeroSection } from "@/sections/home/HeroSection";
import { CategoriesSection } from "@/sections/home/CategoriesSection";
import { FeaturedSection } from "@/sections/home/FeaturedSection";
import { SpecialBaskets } from "@/sections/home/SpecialBaskets";
import { LocationSection } from "@/sections/home/LocationSection";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emporio-beige flex flex-col selection:bg-emporio-gold selection:text-emporio-navy font-montserrat">
      {/* Navbar Limpa e Objetiva */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Fluxo Principal Otimizado para Vendas (CRO) */}
      <main className="flex-grow">
        {/* 1. Banner Principal com CTA Duplo + Benefícios de Compra */}
        <HeroSection />

        {/* 2. Navegação Rápida por Categorias */}
        <CategoriesSection />

        {/* 3. Kits & Cestas Mais Vendidas com Adicionar Rápido ao Carrinho */}
        <FeaturedSection />

        {/* 4. Chamada Direta: Monte Sua Cesta Personalizada */}
        <SpecialBaskets />

        {/* 8. Nossa Loja Física & Contato */}
        <LocationSection />
      </main>

      {/* Rodapé Institucional Escuro */}
      <Footer />

      {/* Modal de Busca Instantânea */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
