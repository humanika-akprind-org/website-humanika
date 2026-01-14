import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";

export default function MapSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="mt-16"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-grey-200">
        <div className="p-8 border-b border-grey-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-grey-900">
                  Kunjungi Kami
                </h2>
              </div>
              <p className="text-grey-600">
                Jl. Kalisahak No.28, Klitren, Kec. Gondokusuman, Kota Yogyakarta
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Universitas+AKPRIND+Indonesia"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              <span>Buka di Google Maps</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="h-[400px] bg-grey-100 relative overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1976.5241078195088!2d110.38342661744383!3d-7.784712999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59ce29bc3887%3A0x2cad870b4a56cf1!2sUniversitas%20AKPRIND%20Indonesia!5e0!3m2!1sen!2sid!4v1763734370697!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />

          {/* Overlay Info */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
            <h3 className="font-bold text-grey-900 mb-2">
              Universitas AKPRIND Indonesia
            </h3>
            <p className="text-sm text-grey-600">
              Kampus 1, Jl. Kalisahak No.28, Klitren, Kec. Gondokusuman, Kota
            </p>
            <p className="text-sm text-grey-600 mt-1">🕒 09:00 - 17:00 WIB</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
