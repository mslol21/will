"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ChevronRight, Sparkles } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.origin.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-emporio-navy-dark/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-emporio-gold/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Input Header */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-emporio-gold" />
          <input
            type="text"
            autoFocus
            placeholder="Busque por cafés, queijos Canastra, doce de leite, terços..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-emporio-beige/40 rounded-2xl border border-emporio-gold/30 text-sm text-emporio-navy placeholder:text-slate-400 focus:outline-none focus:border-emporio-gold transition-colors font-medium"
          />
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          {query.trim() === "" ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-emporio-gold mx-auto mb-2 opacity-60" />
              <p>Digite o nome do produto ou palavra-chave para buscar no catálogo.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Nenhum produto encontrado para &quot;<strong>{query}</strong>&quot;.
            </div>
          ) : (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/produtos/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-emporio-beige/50 transition-colors border border-transparent hover:border-emporio-gold/20 group"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-playfair font-semibold text-sm text-emporio-navy group-hover:text-emporio-gold transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{product.shortDescription}</p>
                  <span className="text-xs font-bold text-emporio-navy">{formatCurrency(product.price)}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emporio-gold transition-colors" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
