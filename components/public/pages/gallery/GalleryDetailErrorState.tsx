import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

interface GalleryDetailErrorStateProps {
  error: string;
}

export default function GalleryDetailErrorState({
  error,
}: GalleryDetailErrorStateProps) {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full opacity-50 blur-xl" />
        </div>

        <h1 className="text-2xl font-bold text-grey-900 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-grey-600 mb-8 leading-relaxed">
          {error || "Gagal memuat data galeri. Silakan coba lagi."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-grey-700 border border-grey-200 rounded-xl hover:bg-grey-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
