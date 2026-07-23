"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Sparkles } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  heightClass: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80",
    title: "Maturação de Queijos Canastra",
    subtitle: "Prateleiras de madeira nobre de peroba rosa.",
    heightClass: "h-72",
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    title: "Colheita Seletiva de Café",
    subtitle: "Grãos maduros colhidos nas montanhas da Mantiqueira.",
    heightClass: "h-96",
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80",
    title: "Doce de Leite no Tacho",
    subtitle: "Cozimento lento em fogo de lenha caipira.",
    heightClass: "h-80",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    title: "Montagem de Cesta de Madeira",
    subtitle: "Acabamento manual com fita kraft e ramos aromáticos.",
    heightClass: "h-96",
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    title: "Terços em Madeira Imbuia",
    subtitle: "Escultura artesanal para reflexão e oração.",
    heightClass: "h-72",
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    title: "Cachaça Envelhecida em Amburana",
    subtitle: "Alambique de cobre em Salinas - MG.",
    heightClass: "h-80",
  },
];

export function GallerySection() {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emporio-gold/20 text-emporio-gold-dark text-xs font-bold uppercase tracking-widest mb-3">
            Atmosfera & Bastidores
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-emporio-navy mb-4">
            Galeria de Tradição e Arte
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Um olhar atento aos detalhes, da colheita manual nas fazendas até o carinho da embalagem pronta para presentear.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setActiveImage(img)}
              className={`relative ${img.heightClass} rounded-3xl overflow-hidden cursor-pointer group border border-emporio-gold/20 shadow-card hover:shadow-2xl transition-all duration-500`}
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emporio-navy-dark/90 via-emporio-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="self-end w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  <ZoomIn className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-white mb-1">{img.title}</h3>
                  <p className="text-xs text-slate-300">{img.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emporio-navy-dark/90 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-emporio-navy rounded-3xl overflow-hidden border border-emporio-gold/30 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-emporio-gold text-white hover:text-emporio-navy flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
                <Image
                  src={activeImage.url}
                  alt={activeImage.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="font-playfair text-2xl font-bold text-white mb-1">
                  {activeImage.title}
                </h3>
                <p className="text-xs text-slate-300">{activeImage.subtitle}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
