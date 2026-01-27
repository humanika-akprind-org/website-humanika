import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageOff } from "lucide-react";

export default function GalleryDetailNotFoundState() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
      <div className="text-center">
        <ImageOff className="text-grey-400 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-grey-900 mb-2">
          Album Tidak Ditemukan
        </h1>
        <p className="text-grey-600 mb-6">
          Album yang diminta tidak dapat ditemukan.
        </p>
        <button
          onClick={() => router.push("/gallery")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Lihat Semua Album
        </button>
      </div>
    </div>
  );
}
