"use client";

import { useState } from "react";
import type { TabType } from "@/components/public/about/constants";
import HeroSection from "@/components/public/sections/about/HeroSection";
import NavigationTabs from "@/components/public/about/NavigationTabs";
import AboutTab from "@/components/public/about/AboutTab";
import VisionTab from "@/components/public/about/VisionTab";
import OrganizationalStructureSection from "@/components/public/sections/about/OrganizationalStructureSection";
import JoinCTASection from "@/components/public/sections/about/JoinCTASection";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabType>("about");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-grey-50 to-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* About Tab */}
        {activeTab === "about" && <AboutTab />}

        {/* Vision & Mission Tab */}
        {activeTab === "vision" && <VisionTab />}

        {/* Organizational Structure Section */}
        <OrganizationalStructureSection />

        {/* Join CTA */}
        <JoinCTASection />
      </div>
    </div>
  );
}
