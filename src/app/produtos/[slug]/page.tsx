"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ChevronRight, 
  Star, 
  MapPin, 
  Scale, 
  ShieldCheck, 
  Heart, 
  Share2, 
  MessageCircle, 
  Sparkles, 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailModal } from "@/components/product/ProductDetailModal";
import { MOCK_PRODUCTS, INITIAL_STORE_SETTINGS } from "@/lib/mockData";
import { formatCurrency, createWhatsAppLink } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";

export default function SingleProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "ingred" | "nutrition">("desc");
  const [copied, setCopied] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-emporio-beige flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="pt-32 text-center">
          <h2 className="font-playfair text-3xl font-bold text-emporio-navy mb-2">Produto não encontrado</h2>
          <p className="text-xs text-slate-600 mb-6">O produto que você procura não está disponível no momento.</p>
          <Link href="/produtos" className="px-6 py-3 rounded-full bg-emporio-gold text-emporio-navy font-bold text-xs">
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(product.id);
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const totalPrice = product.price * quantity;
  const whatsappMessage = `Olá! Gostaria de encomendar *${quantity}x ${product.name}* (${product.weight}) - Total: ${formatCurrency(totalPrice)}. Poderia me ajudar?`;
  const whatsappUrl = createWhatsAppLink(INITIAL_STORE_SETTINGS.whatsappNumber, whatsappMessage);

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-emporio-beige flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
            <Link href="/" className="hover:text-emporio-gold transition-colors">Início</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/produtos" className="hover:text-emporio-gold transition-colors">Catálogo</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emporio-navy font-semibold truncate">{product.name}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emporio-gold/20 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-emporio-beige/40 border border-emporio-gold/20">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />

                {/* Favorite & Share Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
                      favorited ? "bg-red-500 text-white" : "bg-white/90 text-slate-700 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorited ? "fill-white" : ""}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/90 text-slate-700 hover:text-emporio-navy flex items-center justify-center backdrop-blur-md shadow-md transition-all"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
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

            {/* Product Details Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {product.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-[10px] font-bold rounded-full bg-emporio-gold/20 text-emporio-gold-dark uppercase tracking-wider"
                    >
                      {b.label}
                    </span>
                  ))}
                </div>

                <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-emporio-navy mb-3">
                  {product.name}
                </h1>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-6">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-4 h-4 text-emporio-gold" />
                    {product.origin}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Scale className="w-4 h-4 text-emporio-gold" />
                    {product.weight}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-playfair text-4xl font-bold text-emporio-navy">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-slate-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Description Tabs */}
                <div className="border-b border-slate-200 mb-8">
                  <div className="flex gap-6 text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setActiveTab("desc")}
                      className={`pb-3 border-b-2 transition-colors ${
                        activeTab === "desc"
                          ? "border-emporio-gold text-emporio-navy font-bold"
                          : "border-transparent text-slate-500 hover:text-emporio-gold"
                      }`}
                    >
                      Descrição Completa
                    </button>
                    {product.ingredients && (
                      <button
                        onClick={() => setActiveTab("ingred")}
                        className={`pb-3 border-b-2 transition-colors ${
                          activeTab === "ingred"
                            ? "border-emporio-gold text-emporio-navy font-bold"
                            : "border-transparent text-slate-500 hover:text-emporio-gold"
                        }`}
                      >
                        Ingredientes
                      </button>
                    )}
                    {product.nutrition && (
                      <button
                        onClick={() => setActiveTab("nutrition")}
                        className={`pb-3 border-b-2 transition-colors ${
                          activeTab === "nutrition"
                            ? "border-emporio-gold text-emporio-navy font-bold"
                            : "border-transparent text-slate-500 hover:text-emporio-gold"
                        }`}
                      >
                        Tabela Nutricional
                      </button>
                    )}
                  </div>

                  <div className="py-4 text-xs sm:text-sm text-slate-700 leading-relaxed min-h-[100px]">
                    {activeTab === "desc" && <p>{product.fullDescription}</p>}
                    {activeTab === "ingred" && (
                      <div className="bg-emporio-beige/50 p-4 rounded-2xl border border-emporio-gold/20">
                        <p>{product.ingredients}</p>
                      </div>
                    )}
                    {activeTab === "nutrition" && product.nutrition && (
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
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

              {/* CTAs & Quantity Selector */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emporio-navy uppercase tracking-wider">Quantidade:</span>
                  <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-emporio-gold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-emporio-navy">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-emporio-gold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => addItem(product, quantity)}
                    className="py-4 px-6 rounded-2xl bg-emporio-navy hover:bg-emporio-navy-light text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-emporio-gold" />
                    <span>Adicionar à Cesta</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comprar no WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-8">
              <h3 className="font-playfair text-2xl font-bold text-emporio-navy">
                Produtos Relacionados
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard
                    key={rel.id}
                    product={rel}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </div>
  );
}
