"use client";

import HeroSection from "@/components/public/sections/home/HeroSection";
import FeaturesSection from "@/components/public/sections/home/FeaturesSection";
import ArticleSection from "@/components/public/sections/home/ArticleSection";
import AboutSection from "@/components/public/sections/home/AboutSection";
import EventsSection from "@/components/public/sections/home/EventsSection";
import GallerySection from "@/components/public/sections/home/GallerySection";
import CTASection from "@/components/public/sections/home/CTASection";
import Divider from "@/components/public/ui/Divider";

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
      <div className="bg-gradient-to-b from-white to-grey-50">
        <ArticleSection />
      </div>

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
