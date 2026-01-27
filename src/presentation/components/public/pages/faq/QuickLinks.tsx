import { motion } from "framer-motion";
import Link from "next/link";

export default function QuickLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-grey-200"
    >
      <h3 className="text-2xl font-bold text-grey-900 mb-8 text-center">
        Informasi Lainnya
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/about"
          className="group p-6 bg-grey-50 rounded-xl hover:bg-primary-50 transition-colors"
        >
          <h4 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-primary-700">
            Tentang Kami
          </h4>
          <p className="text-grey-600 text-sm">
            Pelajari lebih lanjut tentang visi, misi, dan struktur organisasi
            HUMANIKA
          </p>
        </Link>
        <Link
          href="/activities"
          className="group p-6 bg-grey-50 rounded-xl hover:bg-primary-50 transition-colors"
        >
          <h4 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-primary-700">
            Kegiatan
          </h4>
          <p className="text-grey-600 text-sm">
            Jelajahi berbagai kegiatan dan program yang kami selenggarakan
          </p>
        </Link>
        <Link
          href="/membership"
          className="group p-6 bg-grey-50 rounded-xl hover:bg-primary-50 transition-colors"
        >
          <h4 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-primary-700">
            Keanggotaan
          </h4>
          <p className="text-grey-600 text-sm">
            Informasi lengkap tentang manfaat dan proses keanggotaan
          </p>
        </Link>
      </div>
    </motion.div>
  );
}
