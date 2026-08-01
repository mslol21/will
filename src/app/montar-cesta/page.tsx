"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  MessageCircle, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Wand2,
  Package,
  Heart,
  Scale
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart, ContainerType } from "@/hooks/useCart";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";
import { getProdutos, getCategorias } from "@/lib/supabase";
import { Product } from "@/types";
import { formatCurrency, createWhatsAppLink } from "@/lib/utils";

const CONTAINERS: { id: ContainerType; name: string; price: number; description: string; image: string }[] = [
  {
    id: "bau-madeira",
    name: "Baú Luxo de Madeira Trabalhada",
    price: 65.0,
    description: "Baú de peroba/pinho envernizado artesanalmente com palha natural e fecho de metal rústico.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cesta-palha",
    name: "Cesta de Palha Trançada com Forro",
    price: 45.0,
    description: "Cesta clássica mineira trançada à mão com forro de tecido chita tradicional e laço kraft.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "caixa-kraft",
    name: "Caixa Kraft Festiva com Fita Elegante",
    price: 25.0,
    description: "Caixa reforçada de papel kraft rígido, papel de seda timbrado e ramos secos de alecrim.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
  },
];

export default function MontarCestaPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("todos");
  
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [prods, cats] = await Promise.all([getProdutos(), getCategorias()]);
      setProductsList(prods.filter(p => p.isActive));
      setCategoriesList(cats);
      setIsLoading(false);
    }
    load();
  }, []);
  
  const {
    basket,
    addItem,
    removeItem,
    updateQuantity,
    setContainer,
    setGiftDetails,
    containerPrice,
    containerName,
    itemsPrice,
    totalPrice,
    totalItemsCount,
    generateWhatsAppMessage,
  } = useCart();

  const handleFinish = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    const message = generateWhatsAppMessage();
    const link = createWhatsAppLink(INITIAL_STORE_SETTINGS.whatsappNumber, message);
    window.open(link, "_blank");
  };

  const filteredProducts = categoryFilter === "todos"
    ? productsList
    : productsList.filter((p) => p.category === categoryFilter);

  return (
    <div className="min-h-screen bg-emporio-beige flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Experiência Interativa</span>
            </span>
            <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-emporio-navy mb-3">
              Montar Cesta Personalizada
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Monte um presente memorável com os sabores autênticos de Minas Gerais e uma mensagem especial.
            </p>
          </div>

          {/* Stepper Navigation Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
              
              {/* Step 1 Indicator */}
              <button
                onClick={() => setStep(1)}
                className={`relative z-10 w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  step >= 1
                    ? "bg-emporio-gold text-emporio-navy shadow-gold scale-110"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                1
              </button>

              {/* Step 2 Indicator */}
              <button
                onClick={() => setStep(2)}
                className={`relative z-10 w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  step >= 2
                    ? "bg-emporio-gold text-emporio-navy shadow-gold scale-110"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </button>

              {/* Step 3 Indicator */}
              <button
                onClick={() => setStep(3)}
                className={`relative z-10 w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  step >= 3
                    ? "bg-emporio-gold text-emporio-navy shadow-gold scale-110"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                3
              </button>
            </div>

            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mt-2">
              <span>1. Escolher Embalagem</span>
              <span>2. Selecionar Produtos</span>
              <span>3. Cartão & Finalizar</span>
            </div>
          </div>

          {/* Grid Layout: Builder Left & Summary Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* STEP 1: Select Packaging Container */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-playfair text-2xl font-bold text-emporio-navy">
                    Passo 1: Escolha a Embalagem da Cesta
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CONTAINERS.map((cont) => {
                      const isSelected = basket.container === cont.id;
                      return (
                        <div
                          key={cont.id}
                          onClick={() => setContainer(cont.id)}
                          className={`cursor-pointer rounded-2xl overflow-hidden bg-white border-2 transition-all p-4 flex flex-col justify-between shadow-card hover:shadow-luxury ${
                            isSelected
                              ? "border-emporio-gold ring-2 ring-emporio-gold/40 scale-102"
                              : "border-slate-200 opacity-90 hover:opacity-100"
                          }`}
                        >
                          <div>
                            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3">
                              <Image src={cont.image} alt={cont.name} fill className="object-cover" />
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emporio-gold text-emporio-navy flex items-center justify-center shadow-md">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-playfair font-bold text-base text-emporio-navy mb-1">
                              {cont.name}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                              {cont.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="font-playfair text-lg font-bold text-emporio-navy">
                              {formatCurrency(cont.price)}
                            </span>
                            <span className="text-xs font-semibold text-emporio-gold">
                              {isSelected ? "Selecionada" : "Escolher"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-3.5 rounded-full bg-emporio-navy text-white font-bold text-xs hover:bg-emporio-navy-light transition-all flex items-center gap-2 shadow-md"
                    >
                      <span>Avançar para Produtos</span>
                      <ChevronRight className="w-4 h-4 text-emporio-gold" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Choose Products */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-playfair text-2xl font-bold text-emporio-navy">
                      Passo 2: Adicione os Produtos Desejados
                    </h2>

                    {/* Category filter pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                      <button
                        onClick={() => setCategoryFilter("todos")}
                        className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                          categoryFilter === "todos"
                            ? "bg-emporio-gold text-emporio-navy font-bold"
                            : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        Todos
                      </button>
                      {categoriesList.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                            categoryFilter === cat.id
                              ? "bg-emporio-gold text-emporio-navy font-bold"
                              : "bg-white text-slate-600 border border-slate-200"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => {
                      const inCartItem = basket.items.find((i) => i.product.id === product.id);
                      const quantityInBasket = inCartItem ? inCartItem.quantity : 0;

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-2xl p-4 border border-emporio-gold/20 shadow-sm flex gap-4 items-center"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>

                          <div className="flex-grow">
                            <h4 className="font-playfair font-bold text-sm text-emporio-navy line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mb-1">{product.weight}</p>
                            <span className="font-playfair text-sm font-bold text-emporio-navy">
                              {formatCurrency(product.price)}
                            </span>
                          </div>

                          <div className="shrink-0">
                            {quantityInBasket === 0 ? (
                              <button
                                onClick={() => addItem(product)}
                                className="w-9 h-9 rounded-full bg-emporio-gold hover:bg-emporio-gold-dark text-emporio-navy flex items-center justify-center transition-colors shadow-sm"
                                aria-label="Adicionar à cesta"
                              >
                                <Plus className="w-4 h-4 stroke-[3]" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
                                <button
                                  onClick={() => updateQuantity(product.id, quantityInBasket - 1)}
                                  className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-center font-bold text-xs text-emporio-navy">
                                  {quantityInBasket}
                                </span>
                                <button
                                  onClick={() => updateQuantity(product.id, quantityInBasket + 1)}
                                  className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      disabled={totalItemsCount === 0}
                      className={`px-8 py-3.5 rounded-full font-bold text-xs transition-all flex items-center gap-2 shadow-md ${
                        totalItemsCount > 0
                          ? "bg-emporio-navy text-white hover:bg-emporio-navy-light"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <span>Avançar para Mensagem</span>
                      <ChevronRight className="w-4 h-4 text-emporio-gold" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Gift Card Note */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-playfair text-2xl font-bold text-emporio-navy">
                    Passo 3: Escreva uma Mensagem Especial no Cartão
                  </h2>

                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emporio-gold/30 shadow-card space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-emporio-navy mb-1">
                          Nome de Quem Recebe (Para):
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Maria Aparecida"
                          value={basket.recipientName}
                          onChange={(e) => setGiftDetails(e.target.value, basket.senderName, basket.giftNote)}
                          className="w-full px-4 py-2.5 bg-emporio-beige/40 rounded-xl border border-slate-200 text-xs text-emporio-navy focus:outline-none focus:border-emporio-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emporio-navy mb-1">
                          Seu Nome (De):
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Roberto Mendes"
                          value={basket.senderName}
                          onChange={(e) => setGiftDetails(basket.recipientName, e.target.value, basket.giftNote)}
                          className="w-full px-4 py-2.5 bg-emporio-beige/40 rounded-xl border border-slate-200 text-xs text-emporio-navy focus:outline-none focus:border-emporio-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emporio-navy mb-1">
                        Sua Mensagem Personalizada:
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Escreva aqui os seus votos, carinho e bênçãos..."
                        value={basket.giftNote}
                        onChange={(e) => setGiftDetails(basket.recipientName, basket.senderName, e.target.value)}
                        className="w-full px-4 py-3 bg-emporio-beige/40 rounded-xl border border-slate-200 text-xs text-emporio-navy focus:outline-none focus:border-emporio-gold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar aos Produtos</span>
                    </button>

                    <button
                      onClick={handleFinish}
                      className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Enviar Pedido pelo WhatsApp</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 sticky top-28 bg-white rounded-3xl p-6 border-2 border-emporio-gold/30 shadow-luxury space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-playfair text-xl font-bold text-emporio-navy flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emporio-gold" />
                  <span>Resumo da Cesta</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-[10px] font-bold uppercase">
                  {totalItemsCount} itens
                </span>
              </div>

              {/* Selected Container */}
              <div className="p-3 rounded-xl bg-emporio-beige/50 border border-emporio-gold/20 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Embalagem:</span>
                <div className="flex justify-between font-bold text-emporio-navy mt-0.5">
                  <span>{containerName}</span>
                  <span>{formatCurrency(containerPrice)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {basket.items.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    Nenhum produto adicionado ainda.
                  </p>
                ) : (
                  basket.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-bold text-emporio-gold">x{item.quantity}</span>
                        <span className="truncate text-slate-800">{item.product.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-emporio-navy">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Embalagem:</span>
                  <span>{formatCurrency(containerPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Produtos:</span>
                  <span>{formatCurrency(itemsPrice)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-emporio-navy pt-2 border-t border-slate-200">
                  <span>Total da Cesta:</span>
                  <span className="font-playfair text-xl text-emporio-gold">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Quick WhatsApp Action */}
              <button
                onClick={handleFinish}
                disabled={totalItemsCount === 0}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                  totalItemsCount > 0
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir no WhatsApp</span>
              </button>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
