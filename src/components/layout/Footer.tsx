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
  ShieldCheck
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
    "Olá! Gostaria de tirar uma dúvida com o Empório Caminho da Fé."
  );

  return (
    <footer id="contato" className="bg-[#1F2A44] text-slate-300 pt-16 pb-8 border-t-4 border-[#8B5E34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner com o Slogan Exato: "Mais que uma loja, um lugar de encontro, fé e boas histórias." */}
        <div className="bg-[#141C2E] rounded-3xl p-8 mb-14 border border-[#D2B48C]/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-xl">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#D2B48C] mb-1">
              <Sparkles className="w-4 h-4 text-[#D2B48C]" />
              <span className="font-bold text-xs uppercase tracking-widest font-montserrat">Essência do Empório</span>
            </div>
            <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
              &quot;Mais que uma loja, um lugar de encontro, fé e boas histórias.&quot;
            </h3>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-[#8B5E34] hover:bg-[#D2B48C] hover:text-[#1F2A44] text-white font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all shrink-0"
          >
            Falar no WhatsApp
          </a>
        </div>

        {/* Grade do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Coluna 1: Informações da Marca */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B5E34] text-[#F2ECE2] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-[#D2B48C]" />
              </div>
              <span className="font-playfair text-2xl font-bold text-white tracking-wide">
                Caminho da Fé
              </span>
            </Link>
            <p className="font-montserrat text-xs text-slate-300 leading-relaxed font-light">
              Gastronomia artesanal mineira, queijos de leite cru maturados, cafés especiais de altitude e presentes repleto de devoção.
            </p>

            {/* Redes Sociais */}
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
                className="w-9 h-9 rounded-full bg-[#D2B48C]/20 text-[#D2B48C] hover:bg-[#D2B48C] hover:text-[#1F2A44] flex items-center justify-center transition-colors"
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

          {/* Coluna 2: Links Rápido */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-[#D2B48C] mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2.5 font-montserrat text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#D2B48C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-[#D2B48C] transition-colors">
                  Nossos Produtos
                </Link>
              </li>
              <li>
                <Link href="/#caminho" className="hover:text-[#D2B48C] transition-colors">
                  O Caminho
                </Link>
              </li>
              <li>
                <Link href="/#historia" className="hover:text-[#D2B48C] transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/#oracao" className="hover:text-[#D2B48C] transition-colors">
                  Pedidos de Oração Online
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#D2B48C] transition-colors flex items-center gap-1.5">
                  <span>Minha Conta / Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Informações de Contato */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-[#D2B48C] mb-4">
              Contato & Visita
            </h4>
            <ul className="space-y-3 font-montserrat text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D2B48C] shrink-0 mt-0.5" />
                <span>{INITIAL_STORE_SETTINGS.address} - {INITIAL_STORE_SETTINGS.cityState}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D2B48C] shrink-0" />
                <span>{INITIAL_STORE_SETTINGS.phone} / {INITIAL_STORE_SETTINGS.whatsappFormatted}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D2B48C] shrink-0" />
                <span>{INITIAL_STORE_SETTINGS.email}</span>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#D2B48C] shrink-0 mt-0.5" />
                <div>
                  <p>Seg a Sex: {INITIAL_STORE_SETTINGS.businessHours.weekdays}</p>
                  <p>Sáb: {INITIAL_STORE_SETTINGS.businessHours.saturday}</p>
                  <p>Dom: {INITIAL_STORE_SETTINGS.businessHours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-[#D2B48C] mb-4">
              Clube do Empório
            </h4>
            <p className="font-montserrat text-xs text-slate-300 mb-4 leading-relaxed font-light">
              Receba novidades dos lotes de queijos maturados e bênçãos do Caminho da Fé.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-montserrat flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>E-mail cadastrado com sucesso!</span>
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
                    className="w-full pl-3 pr-10 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D2B48C] font-montserrat"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#8B5E34] hover:bg-[#D2B48C] hover:text-[#1F2A44] text-white rounded-lg transition-colors flex items-center justify-center"
                    aria-label="Enviar"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Selo de Direitos Autorais */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-montserrat text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Empório Caminho da Fé. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Feito com carinho e fé em Minas Gerais</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>

      </div>
    </footer>
  );
}
