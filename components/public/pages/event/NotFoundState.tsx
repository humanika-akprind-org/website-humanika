import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";

export default function EventNotFoundState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-12 h-12 text-primary-600" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full opacity-50 blur-xl" />
        </div>

        <h3 className="text-2xl font-bold text-grey-900 mb-2">
          Event Tidak Ditemukan
        </h3>
        <p className="text-grey-600 mb-8 leading-relaxed">
          Event yang Anda cari tidak dapat ditemukan atau sudah dihapus.
        </p>

        <Link
          href="/event"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Jelajahi Semua Event
        </Link>
      </div>
    </div>
  );
}
