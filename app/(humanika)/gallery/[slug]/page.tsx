"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGalleryDetail } from "@/hooks/gallery/useGalleryDetail";
import GalleryDetailHeroSection from "@/components/public/sections/gallery/GalleryDetailHeroSection";
import GalleryDetailAlbumThumbnail from "@/components/public/pages/gallery/GalleryDetailAlbumThumbnail";
import GalleryDetailAlbumDescription from "@/components/public/pages/gallery/GalleryDetailAlbumDescription";
import GalleryDetailPhotoGrid from "@/components/public/pages/card/gallery/GalleryDetailPhotoGrid";
import GalleryDetailRelatedAlbumsSection from "@/components/public/sections/gallery/GalleryDetailRelatedAlbumsSection";
import GalleryDetailLoadingState from "@/components/public/pages/gallery/GalleryDetailLoadingState";
import GalleryDetailErrorState from "@/components/public/pages/gallery/GalleryDetailErrorState";
import GalleryDetailNotFoundState from "@/components/public/pages/gallery/GalleryDetailNotFoundState";

export default function GalleryDetail() {
  const params = useParams();
  const router = useRouter();

  // Use the full slug for API calls (API routes query by slug field)
  const slugParam = params.slug as string;

  const {
    event,
    galleries,
    relatedEvents,
    galleryCounts,
    loading,
    error,
    album,
    formattedDate,
  } = useGalleryDetail(slugParam);

  // Share functionality is handled internally by ShareButton component

  if (loading) {
    return <GalleryDetailLoadingState />;
  }

  if (error) {
    return (
      <GalleryDetailErrorState error={error} onRetry={() => router.refresh()} />
    );
  }

  if (!event || !album) {
    return <GalleryDetailNotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      <GalleryDetailHeroSection
        album={album}
        galleries={galleries}
        formattedDate={formattedDate}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <GalleryDetailAlbumThumbnail album={album} />

          {album.description && (
            <GalleryDetailAlbumDescription description={album.description} />
          )}

          <GalleryDetailPhotoGrid galleries={galleries} router={router} />

          <GalleryDetailRelatedAlbumsSection
            relatedEvents={relatedEvents}
            galleryCounts={galleryCounts}
          />
        </div>
      </div>
    </div>
  );
}
