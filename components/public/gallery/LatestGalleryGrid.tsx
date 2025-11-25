"use client";

import GalleryCard from "./GalleryCard";
import { useGalleries } from "@/hooks/gallery/useGalleries";
import type { Gallery } from "@/types/gallery";

interface LatestGalleryGridProps {
  galleries?: Gallery[];
}

export default function LatestGalleryGrid({
  galleries: propGalleries,
}: LatestGalleryGridProps) {
  const { galleries: hookGalleries, isLoading, error } = useGalleries();

  const galleries = propGalleries || hookGalleries;

  if (isLoading && !propGalleries) {
    return <div>Loading galleries...</div>;
  }

  if (error && !propGalleries) {
    return <div>Error: {error}</div>;
  }

  if (!galleries || galleries.length === 0) {
    return <div>No galleries available</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {galleries.map((gallery: Gallery) => (
        <GalleryCard key={gallery.id} gallery={gallery} />
      ))}
    </div>
  );
}
