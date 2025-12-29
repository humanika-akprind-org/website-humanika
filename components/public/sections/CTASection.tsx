"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900 via-primary-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Mengembangkan
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-white">
              Potensi Digital Anda?
            </span>
          </h2>

          <p className="text-xl text-primary-100/90 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas mahasiswa informatika terdepan.
            Dapatkan akses ke pelatihan eksklusif, proyek kolaboratif, dan
            jaringan profesional yang akan mempercepat perjalanan karir Anda.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-bold text-lg shadow-2xl"
              >
                <Sparkles className="w-5 h-5" />
                <span>Gabung bersama kami</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-bold text-lg"
              >
                <span>Hubungi kami</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <p className="text-primary-200/80 text-sm mt-8">
            Bergabung dengan 500+ anggota aktif yang telah mengembangkan proyek
            inovatif
          </p>
        </motion.div>
      </div>
    </section>
  );
}
