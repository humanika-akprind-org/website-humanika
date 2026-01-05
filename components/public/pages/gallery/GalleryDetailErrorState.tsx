import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface GalleryDetailErrorStateProps {
  error: string;
}

export default function GalleryDetailErrorState({
  error,
}: GalleryDetailErrorStateProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-grey-900 mb-2">
          Error memuat galeri
        </h1>
        <p className="text-grey-600 mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      </div>
    </div>
  );
}
