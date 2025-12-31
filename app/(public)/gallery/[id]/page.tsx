"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGalleryDetail } from "@/hooks/gallery/useGalleryDetail";
import GalleryDetailHeroSection from "@/components/public/gallery/GalleryDetailHeroSection";
import GalleryDetailAlbumThumbnail from "@/components/public/gallery/GalleryDetailAlbumThumbnail";
import GalleryDetailAlbumDescription from "@/components/public/gallery/GalleryDetailAlbumDescription";
import GalleryDetailPhotoGrid from "@/components/public/card/gallery/GalleryDetailPhotoGrid";
import GalleryDetailRelatedAlbumsSection from "@/components/public/sections/gallery/GalleryDetailRelatedAlbumsSection";
import GalleryDetailLoadingState from "@/components/public/gallery/GalleryDetailLoadingState";
import GalleryDetailErrorState from "@/components/public/gallery/GalleryDetailErrorState";
import GalleryDetailNotFoundState from "@/components/public/gallery/GalleryDetailNotFoundState";

export default function GalleryDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    event,
    galleries,
    relatedEvents,
    galleryCounts,
    loading,
    error,
    album,
    formattedDate,
  } = useGalleryDetail(id);

  const handleDownloadAll = () => {
    alert("Fitur download semua foto akan segera tersedia!");
  };

  const handleShare = () => {
    navigator
      .share?.({
        title: album?.title || "",
        text: `Lihat album foto ${album?.title || ""} dari HUMANIKA`,
        url: window.location.href,
      })
      .catch(() => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link berhasil disalin!");
      });
  };

  if (loading) {
    return <GalleryDetailLoadingState />;
  }

  if (error) {
    return <GalleryDetailErrorState error={error} />;
  }

  if (!event || !album) {
    return <GalleryDetailNotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      <GalleryDetailHeroSection
        event={event}
        album={album}
        formattedDate={formattedDate}
        onDownloadAll={handleDownloadAll}
        onShare={handleShare}
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
