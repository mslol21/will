"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Send,
  Heart,
  ShieldCheck,
  Award
} from "lucide-react";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";
import { createWhatsAppLink } from "@/lib/utils";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const whatsappUrl = createWhatsAppLink(
    INITIAL_STORE_SETTINGS.whatsappNumber,
    "Olá! Gostaria de tirar uma dúvida sobre o Empório Caminho da Fé."
  );

  return (
    <footer className="bg-emporio-navy-dark text-slate-300 pt-16 pb-8 border-t-2 border-emporio-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emporio-gold to-emporio-gold-dark flex items-center justify-center text-emporio-navy shadow-gold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-playfair text-2xl font-bold text-white tracking-wide">
                Caminho da Fé
              </span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sabores autênticos da gastronomia mineira, queijos artesanais de leite cru, cafés especiais de alta altitude e artigos abençoados para a sua caminhada.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emporio-gold/20 text-emporio-gold hover:bg-emporio-gold hover:text-emporio-navy flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-white mb-4 text-emporio-gold">
              Navegação Rápida
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-emporio-gold transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-emporio-gold transition-colors">
                  Catálogo Completo de Produtos
                </Link>
              </li>
              <li>
                <Link href="/montar-cesta" className="hover:text-emporio-gold transition-colors">
                  Montar Cesta Personalizada
                </Link>
              </li>
              <li>
                <Link href="/#historia" className="hover:text-emporio-gold transition-colors">
                  Nossa História & Tradição
                </Link>
              </li>
              <li>
                <Link href="/#peregrino" className="hover:text-emporio-gold transition-colors">
                  Linha Peregrino & Fé
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emporio-gold transition-colors flex items-center gap-1.5">
                  <span>Painel Administrativo</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-emporio-gold/20 text-emporio-gold rounded">
                    Admin
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-white mb-4 text-emporio-gold">
              Atendimento & Visita
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emporio-gold shrink-0 mt-0.5" />
                <span>{INITIAL_STORE_SETTINGS.address} - {INITIAL_STORE_SETTINGS.cityState}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emporio-gold shrink-0" />
                <span>{INITIAL_STORE_SETTINGS.phone} / {INITIAL_STORE_SETTINGS.whatsappFormatted}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emporio-gold shrink-0" />
                <span>{INITIAL_STORE_SETTINGS.email}</span>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-emporio-gold shrink-0 mt-0.5" />
                <div>
                  <p>Seg a Sex: {INITIAL_STORE_SETTINGS.businessHours.weekdays}</p>
                  <p>Sáb: {INITIAL_STORE_SETTINGS.businessHours.saturday}</p>
                  <p>Dom: {INITIAL_STORE_SETTINGS.businessHours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-white mb-4 text-emporio-gold">
              Clube do Empório
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Receba ofertas exclusivas, avisos de novos lotes de queijos maturados e novidades do Caminho da Fé.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Obrigado! Seu e-mail foi cadastrado com sucesso.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emporio-gold transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-emporio-gold hover:bg-emporio-gold-dark text-emporio-navy rounded-lg transition-colors flex items-center justify-center"
                    aria-label="Enviar"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Award className="w-3.5 h-3.5 text-emporio-gold" />
                <span>Artesanal de Minas</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emporio-gold" />
                <span>Garantia de Origem</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Empório Caminho da Fé. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido com carinho e fé em Minas Gerais</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
