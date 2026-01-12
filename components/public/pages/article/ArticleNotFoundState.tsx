import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArticleNotFoundState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-full opacity-50 blur-xl" />
        </div>

        <h3 className="text-xl font-bold text-grey-900 mb-2">
          Artikel Tidak Ditemukan
        </h3>
        <p className="text-grey-600 mb-8 leading-relaxed">
          Maaf, artikel yang Anda cari tidak ditemukan. Silakan kembali ke
          halaman utama.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/article"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-600/20"
          >
            Kembali ke Artikel
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-grey-700 border border-grey-200 rounded-xl hover:bg-grey-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
