"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Sparkles, 
  Heart, 
  X,
  ChevronDown
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailModal } from "@/components/product/ProductDetailModal";
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mockData";
import { Product, CategoryId } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") as CategoryId | null;
  const initialFavoritesOnly = searchParams.get("favoritos") === "true";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "todas">(
    initialCategory || "todas"
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(initialFavoritesOnly);
  const [selectedBadge, setSelectedBadge] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<"destaque" | "preco-asc" | "preco-desc" | "nome">("destaque");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { favorites } = useFavorites();

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category Filter
      if (selectedCategory !== "todas" && product.category !== selectedCategory) {
        return false;
      }
      // Favorites Filter
      if (showFavoritesOnly && !favorites.includes(product.id)) {
        return false;
      }
      // Badge Filter
      if (selectedBadge !== "todos") {
        if (!product.badges.some((b) => b.type === selectedBadge)) return false;
      }
      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesOrigin = product.origin.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesOrigin) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "preco-asc") return a.price - b.price;
      if (sortBy === "preco-desc") return b.price - a.price;
      if (sortBy === "nome") return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, showFavoritesOnly, selectedBadge, searchQuery, sortBy, favorites]);

  return (
    <main className="flex-grow pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
            Qualidade & Autenticidade
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-emporio-navy mb-3">
            Catálogo de Sabores Mineiros
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            Selecione queijos maturados, cafés arábica de altitude, doces no tacho, méis puros e artigos da fé.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-6 border border-emporio-gold/20 shadow-card mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-emporio-gold" />
              <input
                type="text"
                placeholder="Buscar por nome, origem ou ingrediente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-emporio-beige/40 rounded-2xl border border-slate-200 text-xs text-emporio-navy placeholder:text-slate-400 focus:outline-none focus:border-emporio-gold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Buttons & Sort */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              
              {/* Favorites toggle */}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-4 py-2.5 rounded-2xl border transition-colors flex items-center gap-1.5 ${
                  showFavoritesOnly
                    ? "bg-red-500 text-white border-red-500 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emporio-gold"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-white" : ""}`} />
                <span>Favoritos ({favorites.length})</span>
              </button>

              {/* Badges Filter */}
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-emporio-gold cursor-pointer"
              >
                <option value="todos">Todos os Selos</option>
                <option value="mais-vendido">Mais Vendidos</option>
                <option value="promocao">Promoções</option>
                <option value="artesanal">Artesanal</option>
                <option value="peregrino">Linha Peregrino</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-emporio-gold cursor-pointer"
              >
                <option value="destaque">Ordenar por Destaque</option>
                <option value="preco-asc">Menor Preço</option>
                <option value="preco-desc">Maior Preço</option>
                <option value="nome">Nome A-Z</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
            <button
              onClick={() => setSelectedCategory("todas")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                selectedCategory === "todas"
                  ? "bg-emporio-gold text-emporio-navy shadow-gold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todas as Categorias ({MOCK_PRODUCTS.length})
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-emporio-gold text-emporio-navy shadow-gold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
          <span>Exibindo <strong>{filteredProducts.length}</strong> produtos</span>
          {(selectedCategory !== "todas" || searchQuery || showFavoritesOnly || selectedBadge !== "todos") && (
            <button
              onClick={() => {
                setSelectedCategory("todas");
                setSearchQuery("");
                setShowFavoritesOnly(false);
                setSelectedBadge("todos");
              }}
              className="text-emporio-gold hover:underline font-semibold"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-emporio-gold/20 shadow-card">
            <Sparkles className="w-10 h-10 text-emporio-gold mx-auto mb-3 opacity-70" />
            <h3 className="font-playfair text-xl font-bold text-emporio-navy mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tente alterar os termos da busca ou selecione outra categoria de produtos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-emporio-beige flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-slate-500">Carregando catálogo...</div>}>
        <CatalogContent />
      </Suspense>
      <Footer />
    </div>
  );
}
