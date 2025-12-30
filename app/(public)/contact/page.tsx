"use client";

import ContactHero from "@/components/public/contact/ContactHero";
import ContactInfoSection from "@/components/public/contact/ContactInfoSection";
import ContactFormSection from "@/components/public/contact/ContactFormSection";
import MapSection from "@/components/public/contact/MapSection";
import FAQCTASection from "@/components/public/contact/FAQCTASection";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      <ContactHero />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <ContactInfoSection />
          <div className="lg:col-span-2">
            <ContactFormSection />
          </div>
        </div>

        <MapSection />
        <FAQCTASection />
      </div>
    </div>
  );
}
