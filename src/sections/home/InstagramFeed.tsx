"use client";

import Image from "next/image";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";

const INSTAGRAM_POSTS = [
  {
    id: "p1",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    likes: 342,
    comments: 28,
  },
  {
    id: "p2",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80",
    likes: 512,
    comments: 45,
  },
  {
    id: "p3",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=600&q=80",
    likes: 289,
    comments: 19,
  },
  {
    id: "p4",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    likes: 620,
    comments: 54,
  },
  {
    id: "p5",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    likes: 418,
    comments: 32,
  },
  {
    id: "p6",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
    likes: 375,
    comments: 22,
  },
];

export function InstagramFeed() {
  return (
    <section className="py-20 bg-white border-t border-emporio-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Instagram className="w-6 h-6 text-emporio-navy" />
              </div>
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-emporio-navy">
                {INITIAL_STORE_SETTINGS.instagram}
              </h3>
              <p className="text-xs text-slate-500">Siga no Instagram para ver o dia a dia do empório</p>
            </div>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-emporio-navy hover:bg-emporio-navy-light text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Instagram className="w-4 h-4 text-emporio-gold" />
            <span>Seguir Perfil</span>
          </a>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-slate-100"
            >
              <Image src={post.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-emporio-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  {post.comments}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
