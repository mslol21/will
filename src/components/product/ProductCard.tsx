"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Eye, MessageCircle, Star, Sparkles, Check } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency, createWhatsAppLink } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);
  const favorited = isFavorite(product.id);

  const whatsappMessage = `Olá! Gostaria de comprar o produto: *${product.name}* (${product.weight}) - ${formatCurrency(product.price)}. Pode me informar o valor do frete?`;
  const whatsappUrl = createWhatsAppLink(INITIAL_STORE_SETTINGS.whatsappNumber, whatsappMessage);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.origin + `/produtos/${product.slug}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/produtos/${product.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-emporio-gold/20 shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-emporio-beige/50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badges.map((badge, idx) => {
            let bgClass = "bg-emporio-navy text-white";
            if (badge.type === "promocao") bgClass = "bg-red-700 text-white";
            if (badge.type === "mais-vendido") bgClass = "bg-emporio-gold text-emporio-navy font-bold";
            if (badge.type === "peregrino") bgClass = "bg-blue-900 text-amber-200 border border-amber-200/30";
            if (badge.type === "artesanal") bgClass = "bg-amber-900/90 text-amber-100";

            return (
              <span
                key={idx}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm ${bgClass}`}
              >
                {badge.label}
              </span>
            );
          })}
        </div>

        {/* Action Icons Floating */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              favorited
                ? "bg-red-500 text-white shadow-md"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-red-500"
            }`}
            aria-label="Favoritar produto"
          >
            <Heart className={`w-4 h-4 ${favorited ? "fill-white" : ""}`} />
          </button>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-emporio-gold flex items-center justify-center backdrop-blur-md transition-all"
              aria-label="Espiar detalhes"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-emporio-navy flex items-center justify-center backdrop-blur-md transition-all relative"
            aria-label="Compartilhar"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Origin tag */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[11px] font-medium text-slate-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <span className="truncate">{product.origin}</span>
          <span className="font-semibold text-emporio-gold shrink-0">{product.weight}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium ml-1">
            ({product.reviewCount})
          </span>
        </div>

        {/* Title */}
        <Link href={`/produtos/${product.slug}`} className="group-hover:text-emporio-gold transition-colors">
          <h3 className="font-playfair font-semibold text-lg text-emporio-navy line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 flex-grow leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Pricing */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between mb-4">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through mr-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="font-playfair text-xl font-bold text-emporio-navy">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => addItem(product)}
            className="py-2.5 px-3 rounded-xl border border-emporio-gold/40 text-emporio-navy hover:bg-emporio-gold/10 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emporio-gold" />
            <span>Na Cesta</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </a>
        </div>
      </div>
    </div>
  );
}
