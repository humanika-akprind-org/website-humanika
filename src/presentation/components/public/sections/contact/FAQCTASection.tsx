import { motion } from "framer-motion";
import { MessageSquare, ChevronRight } from "lucide-react";

export default function FAQCTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mt-16"
    >
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">PERTANYAAN UMUM</span>
          </div>

          <h2 className="text-3xl font-bold mb-6">Masih Punya Pertanyaan?</h2>

          <p className="text-xl text-primary-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Jelajahi FAQ kami untuk jawaban cepat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/faq"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <span>Lihat FAQ</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
