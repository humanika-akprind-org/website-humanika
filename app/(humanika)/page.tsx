"use client";

import HeroSection from "@/presentation/components/public/sections/home/HeroSection";
import FeaturesSection from "@/presentation/components/public/sections/home/FeaturesSection";
import ArticleSection from "@/presentation/components/public/sections/home/ArticleSection";
import AboutSection from "@/presentation/components/public/sections/home/AboutSection";
import EventsSection from "@/presentation/components/public/sections/home/EventsSection";
import GallerySection from "@/presentation/components/public/sections/home/GallerySection";
import CTASection from "@/presentation/components/public/sections/home/CTASection";
import Divider from "@/presentation/components/public/ui/Divider";

/**
 * Home page component for HUMANIKA website
 * Displays the main landing page with all sections
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-grey-50 to-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Divider */}
      <Divider />

      {/* Artikel Terbaru */}
      <ArticleSection />

      {/* About Section */}
      <AboutSection />

      {/* Divider */}
      <Divider />

      {/* Event Terdekat */}
      <EventsSection />

      {/* Divider */}
      <Divider />

      {/* Galeri */}
      <GallerySection />

      {/* Call to Action */}
      <CTASection />
    </div>
  );
}
