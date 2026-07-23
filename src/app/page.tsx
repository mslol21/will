"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchModal } from "@/components/product/SearchModal";
import { HeroSection } from "@/sections/home/HeroSection";
import { StorySection } from "@/sections/home/StorySection";
import { CategoriesSection } from "@/sections/home/CategoriesSection";
import { FeaturedSection } from "@/sections/home/FeaturedSection";
import { SpecialBaskets } from "@/sections/home/SpecialBaskets";
import { PeregrinoSection } from "@/sections/home/PeregrinoSection";
import { GallerySection } from "@/sections/home/GallerySection";
import { TestimonialsSection } from "@/sections/home/TestimonialsSection";
import { InstagramFeed } from "@/sections/home/InstagramFeed";
import { LocationSection } from "@/sections/home/LocationSection";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emporio-beige flex flex-col selection:bg-emporio-gold selection:text-emporio-navy">
      {/* Navigation */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Home Content */}
      <main className="flex-grow">
        <HeroSection />
        <StorySection />
        <CategoriesSection />
        <FeaturedSection />
        <SpecialBaskets />
        <PeregrinoSection />
        <GallerySection />
        <TestimonialsSection />
        <InstagramFeed />
        <LocationSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Instant Search Popover */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
