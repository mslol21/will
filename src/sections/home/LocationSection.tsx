"use client";

import { MapPin, Clock, Navigation, Phone, Mail, Sparkles } from "lucide-react";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";

export function LocationSection() {
  return (
    <section className="py-24 bg-emporio-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
            Venha nos Visitar
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-emporio-navy mb-4">
            Nossa Loja Física em Minas Gerais
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Um cantinho aconchegante com aroma de café fresco, degustação de queijos Canastra e acolhimento mineiro de portas abertas.
          </p>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Information Card */}
          <div className="lg:col-span-5 bg-emporio-navy text-white rounded-3xl p-8 sm:p-10 border border-emporio-gold/30 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emporio-gold text-emporio-navy flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white">
                  Empório Caminho da Fé
                </h3>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emporio-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm mb-0.5">Endereço:</strong>
                    <span>{INITIAL_STORE_SETTINGS.address}</span>
                    <span className="block text-slate-300">{INITIAL_STORE_SETTINGS.cityState}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emporio-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm mb-0.5">Horário de Funcionamento:</strong>
                    <p>Segunda a Sexta: {INITIAL_STORE_SETTINGS.businessHours.weekdays}</p>
                    <p>Sábado: {INITIAL_STORE_SETTINGS.businessHours.saturday}</p>
                    <p>Domingo: {INITIAL_STORE_SETTINGS.businessHours.sunday}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emporio-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm mb-0.5">Contato Telefônico:</strong>
                    <span>{INITIAL_STORE_SETTINGS.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href={INITIAL_STORE_SETTINGS.googleMapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-emporio-gold to-emporio-gold-dark text-emporio-navy font-bold text-xs uppercase tracking-wider shadow-gold hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir Rota no Google Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-emporio-gold/20 shadow-card min-h-[350px] relative">
            <iframe
              title="Localização do Empório Caminho da Fé"
              src={INITIAL_STORE_SETTINGS.googleMapsEmbedUrl}
              className="w-full h-full min-h-[400px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
