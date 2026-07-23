"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  X, 
  Star, 
  Heart, 
  Share2, 
  MessageCircle, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  MapPin,
  Scale,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { Product } from "@/types";
import { formatCurrency, createWhatsAppLink } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "ingred" | "nutrition">("desc");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const favorited = isFavorite(product.id);
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const totalPrice = product.price * quantity;
  const whatsappMessage = `Olá! Gostaria de comprar *${quantity}x ${product.name}* (${product.weight}) - Total: ${formatCurrency(totalPrice)}. Como posso concluir o pedido?`;
  const whatsappUrl = createWhatsAppLink(INITIAL_STORE_SETTINGS.whatsappNumber, whatsappMessage);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/produtos/${product.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emporio-navy-dark/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emporio-gold/30 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-emporio-navy hover:text-white text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-emporio-beige/40 border border-emporio-gold/20">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === idx
                        ? "border-emporio-gold shadow-gold scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & CTAs */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emporio-gold/20 text-emporio-gold-dark uppercase tracking-wider"
                  >
                    {b.label}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-emporio-navy mb-2">
                {product.name}
              </h2>

              {/* Origin & Weight */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emporio-gold" />
                  {product.origin}
                </span>
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-emporio-gold" />
                  {product.weight}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Disponível em Estoque
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-playfair text-3xl font-bold text-emporio-navy">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Tabs: Description, Ingredients, Nutrition */}
              <div className="mb-6 border-b border-slate-200">
                <div className="flex gap-6 text-xs font-semibold text-slate-600">
                  <button
                    onClick={() => setActiveTab("desc")}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === "desc"
                        ? "border-emporio-gold text-emporio-navy"
                        : "border-transparent hover:text-emporio-gold"
                    }`}
                  >
                    História e Detalhes
                  </button>
                  {product.ingredients && (
                    <button
                      onClick={() => setActiveTab("ingred")}
                      className={`pb-2 border-b-2 transition-colors ${
                        activeTab === "ingred"
                          ? "border-emporio-gold text-emporio-navy"
                          : "border-transparent hover:text-emporio-gold"
                      }`}
                    >
                      Ingredientes
                    </button>
                  )}
                  {product.nutrition && (
                    <button
                      onClick={() => setActiveTab("nutrition")}
                      className={`pb-2 border-b-2 transition-colors ${
                        activeTab === "nutrition"
                          ? "border-emporio-gold text-emporio-navy"
                          : "border-transparent hover:text-emporio-gold"
                      }`}
                    >
                      Tabela Nutricional
                    </button>
                  )}
                </div>

                <div className="py-4 text-xs text-slate-700 leading-relaxed min-h-[90px]">
                  {activeTab === "desc" && <p>{product.fullDescription}</p>}
                  {activeTab === "ingred" && (
                    <p className="bg-emporio-beige/50 p-3 rounded-xl border border-emporio-gold/20">
                      {product.ingredients}
                    </p>
                  )}
                  {activeTab === "nutrition" && product.nutrition && (
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border">
                      <div>Porção: <strong>{product.nutrition.servingSize}</strong></div>
                      <div>Calorias: <strong>{product.nutrition.calories}</strong></div>
                      <div>Carboidratos: <strong>{product.nutrition.carbs}</strong></div>
                      <div>Proteínas: <strong>{product.nutrition.protein}</strong></div>
                      <div>Gorduras: <strong>{product.nutrition.fat}</strong></div>
                      <div>Sódio: <strong>{product.nutrition.sodium}</strong></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Quantidade:</span>
                <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-emporio-gold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-emporio-navy">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-emporio-gold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addItem(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-emporio-navy text-white font-semibold text-xs hover:bg-emporio-navy-light transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-emporio-gold" />
                  <span>Adicionar à Cesta</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comprar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
