"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  MessageCircle, 
  Search, 
  Sparkles, 
  Store,
  Compass,
  Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { createWhatsAppLink } from "@/lib/utils";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { totalItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Nossa História", href: "/#historia" },
    { name: "Categorias", href: "/#categorias" },
    { name: "Catálogo", href: "/produtos" },
    { name: "Montar Cesta", href: "/montar-cesta", badge: "Personalizado" },
    { name: "Linha Peregrino", href: "/#peregrino" },
    { name: "Painel Admin", href: "/admin" },
  ];

  const whatsappUrl = createWhatsAppLink(
    INITIAL_STORE_SETTINGS.whatsappNumber,
    "Olá! Vim pelo site do Empório Caminho da Fé e gostaria de mais informações sobre os produtos."
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || pathname !== "/"
            ? "glass-nav py-3 shadow-luxury border-b border-emporio-gold/20"
            : "bg-gradient-to-b from-emporio-navy-dark/95 via-emporio-navy/80 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emporio-gold to-emporio-gold-dark flex items-center justify-center text-emporio-navy shadow-gold group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-xl sm:text-2xl font-bold tracking-wide text-white group-hover:text-emporio-caramel transition-colors">
                  Caminho da Fé
                </span>
                <span className="text-[10px] tracking-widest uppercase text-emporio-gold font-medium -mt-1">
                  Empório & Artesanal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors hover:text-emporio-gold py-1 ${
                      isActive ? "text-emporio-gold font-semibold" : "text-slate-200"
                    }`}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emporio-gold text-emporio-navy uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              {onOpenSearch && (
                <button
                  onClick={onOpenSearch}
                  className="p-2 text-slate-200 hover:text-emporio-gold transition-colors rounded-full hover:bg-white/10"
                  aria-label="Buscar produtos"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Favorites Link */}
              <Link
                href="/produtos?favoritos=true"
                className="relative p-2 text-slate-200 hover:text-emporio-gold transition-colors rounded-full hover:bg-white/10"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Basket / Cart Link */}
              <Link
                href="/montar-cesta"
                className="relative p-2 text-slate-200 hover:text-emporio-gold transition-colors rounded-full hover:bg-white/10 flex items-center gap-1"
                aria-label="Cesta de compras"
              >
                <Gift className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emporio-gold text-emporio-navy text-[10px] font-bold flex items-center justify-center shadow-gold">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* WhatsApp Quick Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-200 hover:text-emporio-gold focus:outline-none"
                aria-label="Menu Principal"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-40 bg-emporio-navy-dark/98 backdrop-blur-lg border-b border-emporio-gold/20 p-6 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-medium text-slate-100 hover:text-emporio-gold py-2 border-b border-white/10"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emporio-gold text-emporio-navy uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Falar no WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
