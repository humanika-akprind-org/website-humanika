import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function JoinCTASection() {
  return (
    <section className="mt-20">
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">GABUNG BERSAMA KAMI</span>
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Siap Mengembangkan Potensi Digital Anda?
          </h2>

          <p className="text-xl text-primary-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Bergabunglah dengan komunitas mahasiswa informatika terdepan.
            Dapatkan akses ke pelatihan eksklusif, proyek kolaboratif, dan
            jaringan profesional yang akan mempercepat perjalanan karir Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <span>Daftar Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
            >
              <span>Konsultasi Gratis</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
