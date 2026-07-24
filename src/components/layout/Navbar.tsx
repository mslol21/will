"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Nossos Produtos", href: "/produtos" },
    { name: "O Caminho", href: "/#caminho" },
    { name: "Nossa História", href: "/#historia" },
    { name: "Contato", href: "/#contato" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#F2ECE2] border-b border-[#D2B48C]/40 ${
          isScrolled ? "py-2.5 shadow-md bg-[#F2ECE2]/95 backdrop-blur-md" : "py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo Oficial (/logo.jpg) no lado esquerdo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D2B48C] shadow-md group-hover:scale-105 transition-transform duration-300 bg-[#1F2A44] shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Logo Empório Caminho da Fé"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-xl sm:text-2xl font-bold tracking-wide text-[#1F2A44] group-hover:text-[#8B5E34] transition-colors leading-tight">
                  Empório Caminho da Fé
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#8B5E34] font-semibold">
                  Gastronomia & Tradição
                </span>
              </div>
            </Link>

            {/* Links de Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors hover:text-[#8B5E34] py-1 font-montserrat ${
                      isActive ? "text-[#8B5E34] border-b-2 border-[#8B5E34]" : "text-[#2E2E2E]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Ícones à Direita: Busca, Minha Conta e Carrinho */}
            <div className="flex items-center gap-4">
              {/* Busca */}
              <button
                onClick={onOpenSearch}
                className="p-2 text-[#2E2E2E] hover:text-[#8B5E34] transition-colors rounded-full hover:bg-black/5"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>



              {/* Carrinho de Compras */}
              <Link
                href="/montar-cesta"
                className="relative p-2 text-[#2E2E2E] hover:text-[#8B5E34] transition-colors rounded-full hover:bg-black/5"
                aria-label="Carrinho de Compras"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#8B5E34] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#1F2A44] hover:text-[#8B5E34]"
                aria-label="Menu Mobile"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[65px] z-40 bg-[#F2ECE2] border-b border-[#D2B48C]/40 p-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-[#2E2E2E] hover:text-[#8B5E34] py-2 border-b border-[#D2B48C]/20 font-montserrat"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
