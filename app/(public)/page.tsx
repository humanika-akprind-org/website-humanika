"use client";

import HeroSection from "@/components/public/sections/HeroSection";
import FeaturesSection from "@/components/public/sections/FeaturesSection";
import ArticleSection from "@/components/public/sections/ArticleSection";
import AboutSection from "@/components/public/sections/AboutSection";
import EventsSection from "@/components/public/sections/EventsSection";
import GallerySection from "@/components/public/sections/GallerySection";
import CTASection from "@/components/public/sections/CTASection";
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
