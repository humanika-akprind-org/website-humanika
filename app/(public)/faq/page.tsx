"use client";

import HeroSection from "../../../components/public/sections/faq/HeroSection";
import SearchSection from "../../../components/public/sections/faq/SearchSection";
import FAQGrid from "../../../components/public/faq/FAQGrid";
import ContactCTA from "../../../components/public/faq/ContactCTA";
import QuickLinks from "../../../components/public/faq/QuickLinks";
import { useFAQ } from "../../../hooks/faq/useFAQ";

export default function FAQPage() {
  const {
    searchTerm,
    setSearchTerm,
    expandedIndex,
    filteredFaqs,
    toggleExpansion,
  } = useFAQ();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <SearchSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredFaqsCount={filteredFaqs.length}
        />

        <FAQGrid
          filteredFaqs={filteredFaqs}
          expandedIndex={expandedIndex}
          onToggleExpansion={toggleExpansion}
        />

        <ContactCTA />

        <QuickLinks />
      </div>
    </div>
  );
}
