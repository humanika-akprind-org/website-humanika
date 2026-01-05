import React from "react";

export default function GalleryDetailLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto" />
        <p className="mt-4 text-grey-600">Memuat album galeri...</p>
      </div>
    </div>
  );
}
